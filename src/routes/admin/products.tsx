import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useProducts, useCategories } from "@/hooks/use-products";
import { supabase } from "@/integrations/supabase/client";
import { useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { toast } from "sonner";
import type { Product } from "@/lib/types";

export const Route = createFileRoute("/admin/products")({
  component: ProductsAdmin,
});

const empty = { id: "", title: "", description: "", price: "0", sale_price: "", category_id: "", stock: "0", status: "published", image_url: "", badge: "" };

function ProductsAdmin() {
  const { data: products = [] } = useProducts({ all: true });
  const { data: categories = [] } = useCategories();
  const qc = useQueryClient();
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState(empty);
  const editing = !!form.id;

  const openNew = () => { setForm(empty); setOpen(true); };
  const openEdit = (p: Product) => {
    setForm({
      id: p.id, title: p.title, description: p.description ?? "", price: String(p.price),
      sale_price: p.sale_price != null ? String(p.sale_price) : "", category_id: p.category_id ?? "",
      stock: String(p.stock), status: p.status, image_url: p.image_url ?? "", badge: p.badge ?? "",
    });
    setOpen(true);
  };

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      title: form.title, description: form.description || null,
      price: Number(form.price), sale_price: form.sale_price ? Number(form.sale_price) : null,
      category_id: form.category_id || null, stock: Number(form.stock), status: form.status,
      image_url: form.image_url || null, badge: form.badge || null,
    };
    const { error } = editing
      ? await supabase.from("products").update(payload).eq("id", form.id)
      : await supabase.from("products").insert(payload);
    if (error) { toast.error(error.message); return; }
    toast.success(editing ? "Product updated" : "Product created");
    qc.invalidateQueries({ queryKey: ["products"] });
    setOpen(false);
  };

  const del = async (id: string) => {
    if (!confirm("Delete this product?")) return;
    const { error } = await supabase.from("products").delete().eq("id", id);
    if (error) { toast.error(error.message); return; }
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
        <Button onClick={openNew} className="rounded-full"><Plus className="size-4 mr-1.5" /> New Product</Button>
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
                      {p.image_url && <img src={p.image_url} alt="" className="w-full h-full object-cover" />}
                    </div>
                    <span className="font-medium">{p.title}</span>
                  </div>
                </td>
                <td className="px-6 py-3 font-bold">${(p.sale_price ?? p.price).toFixed(2)}</td>
                <td className="px-6 py-3">{p.stock}</td>
                <td className="px-6 py-3"><span className="px-2 py-0.5 bg-muted rounded text-xs font-bold uppercase">{p.status}</span></td>
                <td className="px-6 py-3 text-right">
                  <div className="flex justify-end gap-1">
                    <Button variant="ghost" size="icon" onClick={() => openEdit(p)}><Pencil className="size-4" /></Button>
                    <Button variant="ghost" size="icon" onClick={() => del(p.id)}><Trash2 className="size-4 text-destructive" /></Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader><DialogTitle>{editing ? "Edit Product" : "New Product"}</DialogTitle></DialogHeader>
          <form onSubmit={save} className="space-y-4">
            <div><Label>Title</Label><Input required value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} /></div>
            <div><Label>Description</Label><Textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} /></div>
            <div className="grid grid-cols-2 gap-4">
              <div><Label>Price</Label><Input required type="number" step="0.01" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} /></div>
              <div><Label>Sale Price</Label><Input type="number" step="0.01" value={form.sale_price} onChange={(e) => setForm({ ...form, sale_price: e.target.value })} /></div>
              <div><Label>Stock</Label><Input required type="number" value={form.stock} onChange={(e) => setForm({ ...form, stock: e.target.value })} /></div>
              <div>
                <Label>Category</Label>
                <Select value={form.category_id} onValueChange={(v) => setForm({ ...form, category_id: v })}>
                  <SelectTrigger><SelectValue placeholder="Select category" /></SelectTrigger>
                  <SelectContent>{categories.map((c) => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div>
                <Label>Status</Label>
                <Select value={form.status} onValueChange={(v) => setForm({ ...form, status: v })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="published">Published</SelectItem>
                    <SelectItem value="draft">Draft</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Badge</Label>
                <Select value={form.badge || "none"} onValueChange={(v) => setForm({ ...form, badge: v === "none" ? "" : v })}>
                  <SelectTrigger><SelectValue placeholder="None" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">None</SelectItem>
                    <SelectItem value="NEW">NEW</SelectItem>
                    <SelectItem value="HOT">HOT</SelectItem>
                    <SelectItem value="SALE">SALE</SelectItem>
                    <SelectItem value="ORGANIC">ORGANIC</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div><Label>Image URL</Label><Input value={form.image_url} onChange={(e) => setForm({ ...form, image_url: e.target.value })} placeholder="https://..." /></div>
            <Button type="submit" className="w-full">{editing ? "Save changes" : "Create product"}</Button>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
