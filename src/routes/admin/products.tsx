import { createFileRoute } from "@tanstack/react-router";
import { Fragment, useRef, useState } from "react";
import { useProducts, useCategories } from "@/hooks/use-products";
import { createProduct, updateProduct, deleteProduct } from "@/data/products";
import { listMedia, uploadMedia } from "@/data/media";
import { compressImage } from "@/lib/image";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Plus,
  Pencil,
  Trash2,
  Upload,
  ImageIcon,
  Loader2,
  X,
  Copy,
  Layers,
  CornerDownRight,
} from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import type { Product, Media } from "@/lib/types";

export const Route = createFileRoute("/admin/products")({
  component: ProductsAdmin,
});

const empty = {
  id: "",
  title: "",
  description: "",
  price: "0",
  sale_price: "",
  category_id: "",
  stock: "",
  status: "published",
  image_url: "",
  badge: "",
  rating: "4.5",
  weight: "",
  parent_id: "",
};

function ProductsAdmin() {
  const { data: products = [] } = useProducts({ all: true });
  const { data: categories = [] } = useCategories();
  const { data: mediaItems = [] } = useQuery({
    queryKey: ["media"],
    queryFn: () => listMedia() as Promise<Media[]>,
  });
  const qc = useQueryClient();
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState(empty);
  const editing = !!form.id;
  const fileRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [picker, setPicker] = useState(false);

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

  const openNew = () => {
    setForm(empty);
    setPicker(false);
    setOpen(true);
  };
  const openEdit = (p: Product) => {
    setPicker(false);
    setForm({
      id: p.id,
      title: p.title,
      description: p.description ?? "",
      price: String(p.price),
      sale_price: p.sale_price != null ? String(p.sale_price) : "",
      category_id: p.category_id ?? "",
      stock: p.stock > 0 ? String(p.stock) : "",
      status: p.status,
      image_url: p.image_url ?? "",
      badge: p.badge ?? "",
      rating: p.rating != null ? String(p.rating) : "",
      weight: p.weight ?? "",
      parent_id: p.parent_id ?? "",
    });
    setOpen(true);
  };

  // Open the dialog pre-filled to add a weight variant under `parent`: shared
  // fields are copied, only weight/price/stock are left for the user to set.
  const openVariant = (parent: Product) => {
    setPicker(false);
    setForm({
      ...empty,
      title: parent.title,
      description: parent.description ?? "",
      category_id: parent.category_id ?? "",
      status: parent.status,
      image_url: parent.image_url ?? "",
      badge: parent.badge ?? "",
      rating: parent.rating != null ? String(parent.rating) : "",
      parent_id: parent.id,
    });
    setOpen(true);
  };

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      title: form.title,
      description: form.description || null,
      price: Number(form.price),
      sale_price: form.sale_price ? Number(form.sale_price) : null,
      category_id: form.category_id || null,
      stock: form.stock.trim() === "" ? 0 : Number(form.stock),
      status: form.status,
      image_url: form.image_url || null,
      badge: form.badge || null,
      rating: form.rating.trim() === "" ? null : Number(form.rating),
      weight: form.weight.trim() === "" ? null : form.weight.trim(),
      parent_id: form.parent_id || null,
    };
    try {
      if (editing) await updateProduct({ data: { id: form.id, ...payload } });
      else await createProduct({ data: payload });
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to save product");
      return;
    }
    toast.success(editing ? "Product updated" : "Product created");
    qc.invalidateQueries({ queryKey: ["products"] });
    setOpen(false);
  };

  const del = async (id: string) => {
    const kids = products.filter((p) => p.parent_id === id);
    const msg = kids.length
      ? `Delete this product and its ${kids.length} variant${kids.length > 1 ? "s" : ""}?`
      : "Delete this product?";
    if (!confirm(msg)) return;
    try {
      await Promise.all(
        [id, ...kids.map((k) => k.id)].map((pid) => deleteProduct({ data: { id: pid } })),
      );
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to delete");
      return;
    }
    toast.success("Deleted");
    qc.invalidateQueries({ queryKey: ["products"] });
  };

  const duplicate = async (p: Product) => {
    try {
      await createProduct({
        data: {
          title: `${p.title} (Copy)`,
          description: p.description,
          price: p.price,
          sale_price: p.sale_price,
          category_id: p.category_id,
          stock: p.stock,
          status: "draft",
          image_url: p.image_url,
          badge: p.badge,
          rating: p.rating,
          weight: p.weight,
          parent_id: p.parent_id,
        },
      });
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to duplicate");
      return;
    }
    toast.success("Product duplicated as draft");
    qc.invalidateQueries({ queryKey: ["products"] });
  };

  // Top-level rows, plus any orphaned variants (parent removed) so nothing
  // silently disappears from the table.
  const ids = new Set(products.map((p) => p.id));
  const parents = products.filter((p) => !p.parent_id || !ids.has(p.parent_id));
  const childrenByParent = (parentId: string) => products.filter((p) => p.parent_id === parentId);
  const parentOptions = products.filter((p) => !p.parent_id && p.id !== form.id);

  const row = (p: Product, isChild: boolean, childCount: number) => (
    <tr key={p.id} className={cn("border-t", isChild && "bg-muted/30")}>
      <td className="px-6 py-3">
        <div className={cn("flex items-center gap-3", isChild && "pl-8")}>
          {isChild && <CornerDownRight className="size-4 text-muted-foreground shrink-0" />}
          <div className="size-10 rounded-lg bg-muted overflow-hidden shrink-0">
            {p.image_url && <img src={p.image_url} alt="" className="w-full h-full object-cover" />}
          </div>
          <span className="font-medium">{p.title}</span>
          {childCount > 0 && (
            <span className="text-xs text-muted-foreground">
              {childCount} variant{childCount > 1 ? "s" : ""}
            </span>
          )}
        </div>
      </td>
      <td className="px-6 py-3 font-bold">${(p.sale_price ?? p.price).toFixed(2)}</td>
      <td className="px-6 py-3 text-muted-foreground">{p.weight || "—"}</td>
      <td className="px-6 py-3">{p.stock > 0 ? p.stock : "∞"}</td>
      <td className="px-6 py-3">
        <span className="px-2 py-0.5 bg-muted rounded text-xs font-bold uppercase">{p.status}</span>
      </td>
      <td className="px-6 py-3 text-right">
        <div className="flex justify-end gap-1">
          {!isChild && (
            <Button
              variant="ghost"
              size="icon"
              onClick={() => openVariant(p)}
              aria-label="Add weight variant"
            >
              <Layers className="size-4" />
            </Button>
          )}
          <Button variant="ghost" size="icon" onClick={() => openEdit(p)} aria-label="Edit">
            <Pencil className="size-4" />
          </Button>
          <Button variant="ghost" size="icon" onClick={() => duplicate(p)} aria-label="Duplicate">
            <Copy className="size-4" />
          </Button>
          <Button variant="ghost" size="icon" onClick={() => del(p.id)} aria-label="Delete">
            <Trash2 className="size-4 text-destructive" />
          </Button>
        </div>
      </td>
    </tr>
  );

  return (
    <div className="space-y-6 max-w-7xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display font-bold text-3xl">Products</h1>
          <p className="text-muted-foreground mt-1">{products.length} total</p>
        </div>
        <Button onClick={openNew} className="rounded-full">
          <Plus className="size-4 mr-1.5" /> New Product
        </Button>
      </div>

      <div className="bg-card border rounded-2xl overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-muted text-xs uppercase tracking-widest text-muted-foreground">
            <tr>
              <th className="text-left px-6 py-3">Product</th>
              <th className="text-left px-6 py-3">Price</th>
              <th className="text-left px-6 py-3">Weight</th>
              <th className="text-left px-6 py-3">Stock</th>
              <th className="text-left px-6 py-3">Status</th>
              <th className="px-6 py-3"></th>
            </tr>
          </thead>
          <tbody>
            {parents.map((parent) => {
              const kids = childrenByParent(parent.id);
              return (
                <Fragment key={parent.id}>
                  {row(parent, false, kids.length)}
                  {kids.map((kid) => row(kid, true, 0))}
                </Fragment>
              );
            })}
          </tbody>
        </table>
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{editing ? "Edit Product" : "New Product"}</DialogTitle>
          </DialogHeader>
          <form onSubmit={save} className="space-y-4">
            <div>
              <Label>Title</Label>
              <Input
                required
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
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
                <Label>Sale Price</Label>
                <Input
                  type="number"
                  step="0.01"
                  value={form.sale_price}
                  onChange={(e) => setForm({ ...form, sale_price: e.target.value })}
                />
              </div>
              <div>
                <Label>Stock (blank = in stock, no limit)</Label>
                <Input
                  type="number"
                  min="0"
                  placeholder="Unlimited"
                  value={form.stock}
                  onChange={(e) => setForm({ ...form, stock: e.target.value })}
                />
              </div>
              <div>
                <Label>Category</Label>
                <Select
                  value={form.category_id}
                  onValueChange={(v) => setForm({ ...form, category_id: v })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((c) => (
                      <SelectItem key={c.id} value={c.id}>
                        {c.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Parent product (for weight variants)</Label>
                <Select
                  value={form.parent_id || "none"}
                  onValueChange={(v) => setForm({ ...form, parent_id: v === "none" ? "" : v })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="None (top-level)" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">None (top-level)</SelectItem>
                    {parentOptions.map((p) => (
                      <SelectItem key={p.id} value={p.id}>
                        {p.title}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
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
              <div>
                <Label>Badge</Label>
                <Select
                  value={form.badge || "none"}
                  onValueChange={(v) => setForm({ ...form, badge: v === "none" ? "" : v })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="None" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">None</SelectItem>
                    <SelectItem value="NEW">NEW</SelectItem>
                    <SelectItem value="HOT">HOT</SelectItem>
                    <SelectItem value="SALE">SALE</SelectItem>
                    <SelectItem value="ORGANIC">ORGANIC</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Rating (0–5)</Label>
                <Input
                  type="number"
                  step="0.1"
                  min="0"
                  max="5"
                  placeholder="4.5"
                  value={form.rating}
                  onChange={(e) => setForm({ ...form, rating: e.target.value })}
                />
              </div>
              <div>
                <Label>Weight</Label>
                <Input
                  placeholder="e.g. 250g, 1kg"
                  value={form.weight}
                  onChange={(e) => setForm({ ...form, weight: e.target.value })}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Product image</Label>
              <div className="flex items-start gap-3">
                <div className="size-20 rounded-lg border bg-muted overflow-hidden shrink-0 relative">
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
                      <ImageIcon className="size-6" />
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
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => setPicker((v) => !v)}
                    >
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
                          <img
                            src={m.url}
                            alt={m.filename}
                            className="w-full h-full object-cover"
                          />
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
            <Button type="submit" className="w-full">
              {editing ? "Save changes" : "Create product"}
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
