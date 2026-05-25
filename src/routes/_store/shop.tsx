import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useCategories, useProducts } from "@/hooks/use-products";
import { ProductCard } from "@/components/product-card";
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

type Search = { category?: string; q?: string };

export const Route = createFileRoute("/_store/shop")({
  validateSearch: (s: Record<string, unknown>): Search => ({
    category: typeof s.category === "string" ? s.category : undefined,
    q: typeof s.q === "string" ? s.q : undefined,
  }),
  component: Shop,
});

function Shop() {
  const search = Route.useSearch();
  const { data: products = [], isLoading } = useProducts();
  const { data: categories = [] } = useCategories();
  const [query, setQuery] = useState(search.q ?? "");
  const [activeCat, setActiveCat] = useState<string | undefined>(search.category);

  const catId = activeCat ? categories.find((c) => c.slug === activeCat)?.id : undefined;

  const filtered = products.filter((p) => {
    if (catId && p.category_id !== catId) return false;
    if (query && !p.title.toLowerCase().includes(query.toLowerCase())) return false;
    return true;
  });

  return (
    <div className="mx-auto max-w-7xl px-6 py-10">
      <div className="mb-10">
        <h1 className="font-display font-bold text-4xl md:text-5xl">Shop the Marketplace</h1>
        <p className="text-muted-foreground mt-2">{filtered.length} fresh products</p>
      </div>

      <div className="grid lg:grid-cols-[240px_1fr] gap-8">
        <aside className="space-y-6">
          <div>
            <label className="block text-xs font-bold uppercase tracking-widest text-muted-foreground mb-2">Search</label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
              <Input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Apples, bread..." className="pl-9 rounded-full" />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-widest text-muted-foreground mb-2">Categories</label>
            <div className="space-y-1">
              <button
                onClick={() => setActiveCat(undefined)}
                className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${!activeCat ? "bg-brand text-brand-foreground font-bold" : "hover:bg-muted"}`}
              >All Products</button>
              {categories.map((c) => (
                <button
                  key={c.id}
                  onClick={() => setActiveCat(c.slug)}
                  className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${activeCat === c.slug ? "bg-brand text-brand-foreground font-bold" : "hover:bg-muted"}`}
                >{c.name}</button>
              ))}
            </div>
          </div>
        </aside>

        <div>
          {isLoading ? (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-5">
              {Array.from({ length: 6 }).map((_, i) => <Skeleton key={i} className="aspect-[3/4] rounded-3xl" />)}
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-20 border rounded-3xl bg-card">
              <p className="font-display font-bold text-xl">No products found</p>
              <p className="text-muted-foreground text-sm mt-1">Try a different category or search term.</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-5">
              {filtered.map((p) => <ProductCard key={p.id} product={p} />)}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
