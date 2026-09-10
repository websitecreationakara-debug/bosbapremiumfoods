import { createFileRoute } from "@tanstack/react-router";
import { useRef, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useAddons, useAddonCollections, useAddonCollectionItems } from "@/hooks/use-products";
import {
  createAddon,
  updateAddon,
  deleteAddon,
  createAddonCollection,
  updateAddonCollection,
  deleteAddonCollection,
  setAddonCollectionItems,
} from "@/data/addons";
import { listMedia, uploadMedia } from "@/data/media";
import { compressImage } from "@/lib/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Trash2, Upload, ImageIcon, Loader2, X, Pencil, Plus, Search } from "lucide-react";
import { toast } from "sonner";
import type { Addon, AddonCollection, Media } from "@/lib/types";

export const Route = createFileRoute("/admin/addons")({ component: AddonsAdmin });

const emptyAddon = {
  title: "",
  description: "",
  price: "0",
  image_url: "",
  stock: "",
  status: "published",
};

function AddonsAdmin() {
  const { data: addonsList = [] } = useAddons();
  const { data: addonCollections = [] } = useAddonCollections();
  const { data: collectionItems = [] } = useAddonCollectionItems();
  const { data: mediaItems = [] } = useQuery({
    queryKey: ["media"],
    queryFn: () => listMedia() as Promise<Media[]>,
  });
  const qc = useQueryClient();

  // ---- Addon create/edit dialog ----
  const [editingAddon, setEditingAddon] = useState<Addon | null>(null);
  const [creatingAddon, setCreatingAddon] = useState(false);
  const [form, setForm] = useState(emptyAddon);
  const fileRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [picker, setPicker] = useState(false);

  const addonDialogOpen = creatingAddon || !!editingAddon;

  const startCreateAddon = () => {
    setForm(emptyAddon);
    setCreatingAddon(true);
  };
  const startEditAddon = (a: Addon) => {
    setForm({
      title: a.title,
      description: a.description ?? "",
      price: String(a.price),
      image_url: a.image_url ?? "",
      stock: a.stock != null ? String(a.stock) : "",
      status: a.status,
    });
    setEditingAddon(a);
  };
  const closeAddonDialog = () => {
    setCreatingAddon(false);
    setEditingAddon(null);
    setPicker(false);
  };

  const saveAddon = async (e: React.FormEvent) => {
    e.preventDefault();
    const data = {
      title: form.title,
      description: form.description || null,
      price: Number(form.price),
      image_url: form.image_url || null,
      stock: form.stock.trim() === "" ? null : Number(form.stock),
      status: form.status,
    };
    try {
      if (editingAddon) await updateAddon({ data: { id: editingAddon.id, ...data } });
      else await createAddon({ data });
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to save addon");
      return;
    }
    toast.success(editingAddon ? "Addon updated" : "Addon created");
    qc.invalidateQueries({ queryKey: ["addons"] });
    closeAddonDialog();
  };

  const delAddon = async (id: string) => {
    if (!confirm("Delete this addon? It will be removed from every collection and product page."))
      return;
    try {
      await deleteAddon({ data: { id } });
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to delete");
      return;
    }
    toast.success("Addon deleted");
    qc.invalidateQueries({ queryKey: ["addons"] });
    qc.invalidateQueries({ queryKey: ["addon_collection_items"] });
  };

  const onUpload = async (file: File | undefined) => {
    if (!file) return;
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append("file", await compressImage(file));
      const { url } = await uploadMedia({ data: fd });
      setForm((f) => ({ ...f, image_url: url }));
      qc.invalidateQueries({ queryKey: ["media"] });
      toast.success("Image uploaded");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setUploading(false);
      if (fileRef.current) fileRef.current.value = "";
    }
  };

  // ---- Addon collections ----
  const [editingCol, setEditingCol] = useState<AddonCollection | null>(null);
  const [creatingCol, setCreatingCol] = useState(false);
  const [colForm, setColForm] = useState({ title: "", active: true });
  const colDialogOpen = creatingCol || !!editingCol;

  const startCreateCol = () => {
    setColForm({ title: "", active: true });
    setCreatingCol(true);
  };
  const startEditCol = (c: AddonCollection) => {
    setColForm({ title: c.title, active: c.active });
    setEditingCol(c);
  };
  const closeColDialog = () => {
    setCreatingCol(false);
    setEditingCol(null);
  };

  const saveCol = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingCol) await updateAddonCollection({ data: { id: editingCol.id, ...colForm } });
      else await createAddonCollection({ data: colForm });
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to save collection");
      return;
    }
    toast.success(editingCol ? "Collection updated" : "Collection created");
    qc.invalidateQueries({ queryKey: ["addon_collections"] });
    closeColDialog();
  };

  const delCol = async (id: string) => {
    if (!confirm("Delete this addon collection? Products using it will no longer offer these addons."))
      return;
    try {
      await deleteAddonCollection({ data: { id } });
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to delete");
      return;
    }
    toast.success("Collection deleted");
    qc.invalidateQueries({ queryKey: ["addon_collections"] });
    qc.invalidateQueries({ queryKey: ["addon_collection_items"] });
  };

  // ---- Assign addons to a collection ----
  const [pickerFor, setPickerFor] = useState<AddonCollection | null>(null);
  const [pickerSel, setPickerSel] = useState<Set<string>>(new Set());
  const [pickerQuery, setPickerQuery] = useState("");

  const openAddonPicker = (c: AddonCollection) => {
    setPickerFor(c);
    setPickerSel(
      new Set(
        collectionItems.filter((ci) => ci.addon_collection_id === c.id).map((ci) => ci.addon_id),
      ),
    );
    setPickerQuery("");
  };
  const confirmAddonPicker = async () => {
    if (!pickerFor) return;
    try {
      await setAddonCollectionItems({
        data: { addonCollectionId: pickerFor.id, addonIds: [...pickerSel] },
      });
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to save");
      return;
    }
    toast.success("Collection updated");
    qc.invalidateQueries({ queryKey: ["addon_collection_items"] });
    setPickerFor(null);
  };
  const removeAddonFromCollection = async (collectionId: string, addonId: string) => {
    const current = collectionItems
      .filter((ci) => ci.addon_collection_id === collectionId)
      .map((ci) => ci.addon_id);
    try {
      await setAddonCollectionItems({
        data: { addonCollectionId: collectionId, addonIds: current.filter((id) => id !== addonId) },
      });
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to remove");
      return;
    }
    qc.invalidateQueries({ queryKey: ["addon_collection_items"] });
  };

  const pickerList = addonsList.filter((a) =>
    a.title.toLowerCase().includes(pickerQuery.toLowerCase()),
  );
  const addonById = (id: string) => addonsList.find((a) => a.id === id);

  return (
    <div className="max-w-4xl space-y-10">
      <div>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="font-display font-bold text-3xl">Addons</h1>
            <p className="text-muted-foreground mt-1">
              A separate catalog (rice, sauce, ikura, ...) — never shown in the shop grid and
              never purchasable on its own. Group them into a Collection below, then attach that
              collection to a product from its edit form.
            </p>
          </div>
          <Button onClick={startCreateAddon} className="rounded-full">
            <Plus className="size-4 mr-1.5" /> New Addon
          </Button>
        </div>

        {addonsList.length === 0 ? (
          <p className="bg-card border rounded-2xl px-5 py-10 text-center text-muted-foreground text-sm mt-4">
            No addons yet.
          </p>
        ) : (
          <div className="bg-card border rounded-2xl divide-y mt-4">
            {addonsList.map((a) => (
              <div key={a.id} className="flex items-center justify-between gap-3 px-5 py-3">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="size-12 rounded-lg border bg-muted overflow-hidden shrink-0 grid place-items-center text-muted-foreground">
                    {a.image_url ? (
                      <img src={a.image_url} alt="" className="w-full h-full object-cover" />
                    ) : (
                      <ImageIcon className="size-5" />
                    )}
                  </div>
                  <div className="min-w-0">
                    <p className="font-medium truncate flex items-center gap-2">
                      {a.title}
                      {a.status !== "published" && (
                        <span className="text-xs rounded-full bg-muted px-2 py-0.5 text-muted-foreground">
                          draft
                        </span>
                      )}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      ${a.price.toFixed(2)} · {a.stock == null ? "Unlimited stock" : `${a.stock} in stock`}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-1 shrink-0">
                  <Button variant="ghost" size="icon" onClick={() => startEditAddon(a)} aria-label="Edit">
                    <Pencil className="size-4" />
                  </Button>
                  <Button variant="ghost" size="icon" onClick={() => delAddon(a.id)} aria-label="Delete">
                    <Trash2 className="size-4 text-destructive" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div>
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-display font-bold text-xl">Addon Collections</h2>
            <p className="text-muted-foreground text-sm mt-0.5">
              Group addons together so a product can offer a whole set at once.
            </p>
          </div>
          <Button onClick={startCreateCol} variant="outline" className="rounded-full">
            <Plus className="size-4 mr-1.5" /> New Collection
          </Button>
        </div>

        {addonCollections.length === 0 ? (
          <p className="bg-card border rounded-2xl px-5 py-10 text-center text-muted-foreground text-sm mt-4">
            No addon collections yet.
          </p>
        ) : (
          <div className="space-y-4 mt-4">
            {addonCollections.map((c) => {
              const memberIds = collectionItems
                .filter((ci) => ci.addon_collection_id === c.id)
                .map((ci) => ci.addon_id);
              return (
                <div key={c.id} className="bg-card border rounded-2xl p-5 space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-display font-bold text-lg">{c.title}</span>
                        {!c.active && (
                          <span className="text-xs rounded-full bg-muted px-2 py-0.5 text-muted-foreground">
                            inactive
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="flex gap-1 shrink-0">
                      <Button variant="ghost" size="icon" onClick={() => startEditCol(c)} aria-label="Edit">
                        <Pencil className="size-4" />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => delCol(c.id)} aria-label="Delete">
                        <Trash2 className="size-4 text-destructive" />
                      </Button>
                    </div>
                  </div>

                  <div className="border-t pt-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
                        {memberIds.length} addon(s)
                      </span>
                      <Button variant="outline" size="sm" onClick={() => openAddonPicker(c)}>
                        <Plus className="size-4 mr-1.5" /> Add addons
                      </Button>
                    </div>
                    {memberIds.length === 0 ? (
                      <p className="text-sm text-muted-foreground">No addons in this collection yet.</p>
                    ) : (
                      <div className="flex flex-wrap gap-2">
                        {memberIds.map((id) => {
                          const a = addonById(id);
                          if (!a) return null;
                          return (
                            <span
                              key={id}
                              className="inline-flex items-center gap-2 bg-muted rounded-full pl-1 pr-2 py-1 text-sm"
                            >
                              <span className="size-6 rounded-full bg-background overflow-hidden shrink-0">
                                {a.image_url && (
                                  <img src={a.image_url} alt="" className="w-full h-full object-cover" />
                                )}
                              </span>
                              <span className="max-w-[160px] truncate">{a.title}</span>
                              <button
                                type="button"
                                onClick={() => removeAddonFromCollection(c.id, id)}
                                aria-label={`Remove ${a.title}`}
                                className="text-muted-foreground hover:text-destructive"
                              >
                                <X className="size-3.5" />
                              </button>
                            </span>
                          );
                        })}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Addon create/edit dialog */}
      <Dialog open={addonDialogOpen} onOpenChange={(o) => !o && closeAddonDialog()}>
        <DialogContent className="max-w-lg max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingAddon ? "Edit addon" : "New addon"}</DialogTitle>
          </DialogHeader>
          <form onSubmit={saveAddon} className="space-y-4">
            <div>
              <Label>Title</Label>
              <Input
                required
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                placeholder="e.g. Steamed Rice"
              />
            </div>
            <div>
              <Label>Description</Label>
              <Textarea
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Price</Label>
                <Input
                  required
                  type="number"
                  step="0.01"
                  value={form.price}
                  onChange={(e) => setForm({ ...form, price: e.target.value })}
                />
              </div>
              <div>
                <Label>Stock (blank = unlimited · 0 = out of stock)</Label>
                <Input
                  type="number"
                  min="0"
                  placeholder="Unlimited"
                  value={form.stock}
                  onChange={(e) => setForm({ ...form, stock: e.target.value })}
                />
              </div>
            </div>
            <div>
              <Label>Status</Label>
              <Select value={form.status} onValueChange={(v) => setForm({ ...form, status: v })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="published">Published</SelectItem>
                  <SelectItem value="draft">Draft</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-start gap-3">
              <div className="size-16 rounded-lg border bg-muted overflow-hidden shrink-0 relative">
                {form.image_url ? (
                  <>
                    <img src={form.image_url} alt="" className="w-full h-full object-cover" />
                    <button
                      type="button"
                      onClick={() => setForm({ ...form, image_url: "" })}
                      className="absolute top-0.5 right-0.5 bg-background/80 rounded-full p-0.5"
                      aria-label="Remove image"
                    >
                      <X className="size-3.5" />
                    </button>
                  </>
                ) : (
                  <div className="w-full h-full grid place-items-center text-muted-foreground">
                    <ImageIcon className="size-5" />
                  </div>
                )}
              </div>
              <div className="flex-1 space-y-2">
                <div className="flex gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    disabled={uploading}
                    onClick={() => fileRef.current?.click()}
                  >
                    {uploading ? (
                      <Loader2 className="size-4 mr-1.5 animate-spin" />
                    ) : (
                      <Upload className="size-4 mr-1.5" />
                    )}
                    Upload
                  </Button>
                  <Button type="button" variant="outline" size="sm" onClick={() => setPicker((v) => !v)}>
                    <ImageIcon className="size-4 mr-1.5" /> Media library
                  </Button>
                </div>
                <Input
                  value={form.image_url}
                  onChange={(e) => setForm({ ...form, image_url: e.target.value })}
                  placeholder="or paste a URL https://..."
                />
              </div>
            </div>
            <input
              ref={fileRef}
              type="file"
              accept="image/*"
              hidden
              onChange={(e) => onUpload(e.target.files?.[0])}
            />
            {picker && (
              <div className="border rounded-lg p-2 max-h-44 overflow-y-auto">
                {mediaItems.length === 0 ? (
                  <p className="text-xs text-muted-foreground p-2">
                    No media yet — upload an image first.
                  </p>
                ) : (
                  <div className="grid grid-cols-5 gap-2">
                    {mediaItems.map((m) => (
                      <button
                        key={m.id}
                        type="button"
                        onClick={() => {
                          setForm((f) => ({ ...f, image_url: m.url }));
                          setPicker(false);
                        }}
                        className="aspect-square rounded-md overflow-hidden border hover:ring-2 ring-brand"
                      >
                        <img src={m.url} alt={m.filename} className="w-full h-full object-cover" />
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}

            <Button type="submit" className="w-full">
              {editingAddon ? "Save changes" : "Create addon"}
            </Button>
          </form>
        </DialogContent>
      </Dialog>

      {/* Addon collection create/edit dialog */}
      <Dialog open={colDialogOpen} onOpenChange={(o) => !o && closeColDialog()}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>{editingCol ? "Edit collection" : "New addon collection"}</DialogTitle>
          </DialogHeader>
          <form onSubmit={saveCol} className="space-y-4">
            <div>
              <Label>Title</Label>
              <Input
                required
                value={colForm.title}
                onChange={(e) => setColForm({ ...colForm, title: e.target.value })}
                placeholder="e.g. Rice & Sauce"
              />
            </div>
            <label className="flex items-center gap-2.5 cursor-pointer">
              <Checkbox
                checked={colForm.active}
                onCheckedChange={(v) => setColForm({ ...colForm, active: v === true })}
              />
              <span className="text-sm">Active (offered on any product it's attached to)</span>
            </label>
            <Button type="submit" className="w-full">
              {editingCol ? "Save changes" : "Create collection"}
            </Button>
          </form>
        </DialogContent>
      </Dialog>

      {/* Add addons to a collection */}
      <Dialog open={!!pickerFor} onOpenChange={(o) => !o && setPickerFor(null)}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-hidden flex flex-col">
          <DialogHeader>
            <DialogTitle>Add addons to {pickerFor?.title}</DialogTitle>
          </DialogHeader>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
            <Input
              value={pickerQuery}
              onChange={(e) => setPickerQuery(e.target.value)}
              placeholder="Search addons..."
              className="pl-9"
            />
          </div>
          <div className="flex-1 overflow-y-auto -mx-1 px-1 space-y-1">
            {pickerList.length === 0 ? (
              <p className="text-sm text-muted-foreground py-8 text-center">No addons to add.</p>
            ) : (
              pickerList.map((a) => {
                const checked = pickerSel.has(a.id);
                return (
                  <label
                    key={a.id}
                    className="flex items-center gap-3 px-2 py-2 rounded-lg hover:bg-muted cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      checked={checked}
                      onChange={() =>
                        setPickerSel((s) => {
                          const next = new Set(s);
                          if (checked) next.delete(a.id);
                          else next.add(a.id);
                          return next;
                        })
                      }
                    />
                    <span className="size-8 rounded-lg bg-muted overflow-hidden shrink-0">
                      {a.image_url && (
                        <img src={a.image_url} alt="" className="w-full h-full object-cover" />
                      )}
                    </span>
                    <span className="flex-1 min-w-0 truncate text-sm">{a.title}</span>
                    <span className="text-xs text-muted-foreground">${a.price.toFixed(2)}</span>
                  </label>
                );
              })
            )}
          </div>
          <Button onClick={confirmAddonPicker} className="w-full">
            Save selection ({pickerSel.size})
          </Button>
        </DialogContent>
      </Dialog>
    </div>
  );
}
