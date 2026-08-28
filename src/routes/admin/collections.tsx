import { createFileRoute } from "@tanstack/react-router";
import { useCollections } from "@/hooks/use-products";
import {
  createCollection,
  updateCollection,
  deleteCollection,
} from "@/data/collections";
import { listMedia, uploadMedia } from "@/data/media";
import { compressImage } from "@/lib/image";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useRef, useState } from "react";
import { Trash2, Upload, ImageIcon, Loader2, X, Pencil, Plus } from "lucide-react";
import { toast } from "sonner";
import type { Collection, Media } from "@/lib/types";

const slugify = (s: string) =>
  s
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

export const Route = createFileRoute("/admin/collections")({ component: CollectionsAdmin });

const emptyForm = {
  title: "",
  slug: "",
  sub_label: "",
  description: "",
  image_url: "",
  active: true,
};

function CollectionsAdmin() {
  const { data: collections = [] } = useCollections();
  const { data: mediaItems = [] } = useQuery({
    queryKey: ["media"],
    queryFn: () => listMedia() as Promise<Media[]>,
  });
  const qc = useQueryClient();

  const [editing, setEditing] = useState<Collection | null>(null);
  const [creating, setCreating] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const fileRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [picker, setPicker] = useState(false);

  const open = creating || !!editing;

  const startCreate = () => {
    setForm(emptyForm);
    setCreating(true);
  };

  const startEdit = (c: Collection) => {
    setForm({
      title: c.title,
      slug: c.slug,
      sub_label: c.sub_label ?? "",
      description: c.description ?? "",
      image_url: c.image_url ?? "",
      active: c.active,
    });
    setEditing(c);
  };

  const close = () => {
    setCreating(false);
    setEditing(null);
    setPicker(false);
  };

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    const data = {
      title: form.title,
      slug: form.slug || slugify(form.title),
      sub_label: form.sub_label || null,
      description: form.description || null,
      image_url: form.image_url || null,
      active: form.active,
    };
    try {
      if (editing) {
        await updateCollection({ data: { id: editing.id, ...data } });
      } else {
        await createCollection({ data });
      }
    } catch (err) {
      return toast.error(err instanceof Error ? err.message : "Failed to save collection");
    }
    toast.success(editing ? "Collection updated" : "Collection created");
    qc.invalidateQueries({ queryKey: ["collections"] });
    close();
  };

  const del = async (id: string) => {
    try {
      await deleteCollection({ data: { id } });
    } catch (err) {
      return toast.error(err instanceof Error ? err.message : "Failed to delete");
    }
    qc.invalidateQueries({ queryKey: ["collections"] });
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

  const sorted = [...collections].sort((a, b) => a.title.localeCompare(b.title));

  return (
    <div className="max-w-4xl space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="font-display font-bold text-3xl">Collections</h1>
        <Button onClick={startCreate}>
          <Plus className="size-4 mr-1.5" /> Add collection
        </Button>
      </div>
      <p className="text-sm text-muted-foreground -mt-4">
        The storefront product taxonomy — separate from Categories, which stays internal. A
        product can belong to several collections at once (set from the product's edit form). To
        put a collection into the header menu, add it as a link in{" "}
        <span className="font-medium text-foreground">Main Navigator</span>.
      </p>

      {sorted.length === 0 ? (
        <p className="text-sm text-muted-foreground px-1">No collections yet.</p>
      ) : (
        <div className="bg-card border rounded-2xl divide-y">
          {sorted.map((c) => (
            <div key={c.id} className="flex items-center justify-between gap-3 px-5 py-3">
              <div className="flex items-center gap-3 min-w-0">
                <div className="size-12 rounded-lg border bg-muted overflow-hidden shrink-0 grid place-items-center text-muted-foreground">
                  {c.image_url ? (
                    <img src={c.image_url} alt="" className="w-full h-full object-cover" />
                  ) : (
                    <ImageIcon className="size-5" />
                  )}
                </div>
                <div className="min-w-0">
                  <p className="font-medium truncate flex items-center gap-2">
                    {c.title}
                    {!c.active && (
                      <span className="text-xs rounded-full bg-muted px-2 py-0.5 text-muted-foreground">
                        inactive
                      </span>
                    )}
                  </p>
                  <p className="text-xs text-muted-foreground truncate">{c.slug}</p>
                </div>
              </div>
              <div className="flex items-center gap-1 shrink-0">
                <Button variant="ghost" size="icon" onClick={() => startEdit(c)} aria-label="Edit">
                  <Pencil className="size-4" />
                </Button>
                <Button variant="ghost" size="icon" onClick={() => del(c.id)}>
                  <Trash2 className="size-4 text-destructive" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      <Dialog open={open} onOpenChange={(o) => !o && close()}>
        <DialogContent className="max-w-lg max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editing ? "Edit collection" : "New collection"}</DialogTitle>
          </DialogHeader>
          <form onSubmit={save} className="space-y-4">
            <div>
              <Label>Title</Label>
              <Input
                required
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                placeholder="e.g. Japanese A4 Wagyu"
              />
            </div>
            <div>
              <Label>Slug</Label>
              <Input
                value={form.slug}
                onChange={(e) => setForm({ ...form, slug: slugify(e.target.value) })}
                placeholder={slugify(form.title) || "auto-generated from title"}
              />
            </div>
            <div>
              <Label>Sub-label</Label>
              <Input
                value={form.sub_label}
                onChange={(e) => setForm({ ...form, sub_label: e.target.value })}
                placeholder="e.g. Approachable Luxury / Marbling Score 5–7"
              />
            </div>
            <div>
              <Label>Description</Label>
              <Textarea
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                placeholder="Shown on the collection page"
              />
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

            <label className="flex items-center gap-2.5 cursor-pointer">
              <Checkbox
                checked={form.active}
                onCheckedChange={(v) => setForm({ ...form, active: v === true })}
              />
              <span className="text-sm">Active (reachable at /collections/… and available to add to the menu)</span>
            </label>

            <Button type="submit" className="w-full">
              {editing ? "Save changes" : "Create collection"}
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
