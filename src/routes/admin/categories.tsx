import { createFileRoute } from "@tanstack/react-router";
import { useCategories } from "@/hooks/use-products";
import { supabase } from "@/integrations/supabase/client";
import { useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { Trash2 } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/admin/categories")({ component: CategoriesAdmin });

function CategoriesAdmin() {
  const { data: categories = [] } = useCategories();
  const qc = useQueryClient();
  const [name, setName] = useState("");

  const add = async (e: React.FormEvent) => {
    e.preventDefault();
    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
    const { error } = await supabase.from("categories").insert({ name, slug });
    if (error) return toast.error(error.message);
    setName("");
    qc.invalidateQueries({ queryKey: ["categories"] });
  };

  const del = async (id: string) => {
    const { error } = await supabase.from("categories").delete().eq("id", id);
    if (error) return toast.error(error.message);
    qc.invalidateQueries({ queryKey: ["categories"] });
  };

  return (
    <div className="max-w-2xl space-y-6">
      <h1 className="font-display font-bold text-3xl">Categories</h1>
      <form onSubmit={add} className="flex gap-2">
        <Input required value={name} onChange={(e) => setName(e.target.value)} placeholder="New category name" />
        <Button>Add</Button>
      </form>
      <div className="bg-card border rounded-2xl divide-y">
        {categories.map((c) => (
          <div key={c.id} className="flex items-center justify-between px-5 py-3">
            <div><p className="font-medium">{c.name}</p><p className="text-xs text-muted-foreground">{c.slug}</p></div>
            <Button variant="ghost" size="icon" onClick={() => del(c.id)}><Trash2 className="size-4 text-destructive" /></Button>
          </div>
        ))}
      </div>
    </div>
  );
}
