import { createFileRoute } from "@tanstack/react-router";
import { useRef, useState } from "react";
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
import { Plus, Pencil, Trash2, Upload, ImageIcon, Loader2, X } from "lucide-react";
import { toast } from "sonner";
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
    if (!confirm("Delete this product?")) return;
    try {
      await deleteProduct({ data: { id } });
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to delete");
      return;
    }
    toast.success("Deleted");
    qc.invalidateQueries({ queryKey: ["products"] });
  };

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
              <th className="text-left px-6 py-3">Stock</th>
              <th className="text-left px-6 py-3">Status</th>
              <th className="px-6 py-3"></th>
            </tr>
          </thead>
          <tbody>
            {products.map((p) => (
              <tr key={p.id} className="border-t">
                <td className="px-6 py-3">
                  <div className="flex items-center gap-3">
                    <div className="size-10 rounded-lg bg-muted overflow-hidden shrink-0">
                      {p.image_url && (
                        <img src={p.image_url} alt="" className="w-full h-full object-cover" />
                      )}
                    </div>
                    <span className="font-medium">{p.title}</span>
                  </div>
                </td>
                <td className="px-6 py-3 font-bold">${(p.sale_price ?? p.price).toFixed(2)}</td>
                <td className="px-6 py-3">{p.stock > 0 ? p.stock : "∞"}</td>
                <td className="px-6 py-3">
                  <span className="px-2 py-0.5 bg-muted rounded text-xs font-bold uppercase">
                    {p.status}
                  </span>
                </td>
                <td className="px-6 py-3 text-right">
                  <div className="flex justify-end gap-1">
                    <Button variant="ghost" size="icon" onClick={() => openEdit(p)}>
                      <Pencil className="size-4" />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => del(p.id)}>
                      <Trash2 className="size-4 text-destructive" />
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
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
            </div>
            <div className="space-y-2">
              <Label>Product image</Label>
              <div className="flex items-start gap-3">
                <div className="size-20 rounded-lg border bg-muted overflow-hidden shrink-0 relative">
                  {form.image_url ? (
                    <>
                      <img
                        src={form.image_url}
                        alt=""
                        className="w-full h-full object-cover"
                      />
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
                          <img src={m.url} alt={m.filename} className="w-full h-full object-cover" />
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
