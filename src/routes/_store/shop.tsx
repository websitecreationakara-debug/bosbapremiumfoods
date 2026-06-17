import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useCategories, useProducts } from "@/hooks/use-products";
import { ProductCard } from "@/components/product-card";
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search } from "lucide-react";
import type { Product } from "@/lib/types";

type Search = { category?: string; q?: string };

type Sort = "featured" | "price-asc" | "price-desc" | "rating";

const effectivePrice = (p: Product) => p.sale_price ?? p.price;
const isOnSale = (p: Product) => p.sale_price != null && p.sale_price < p.price;

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
  const [sort, setSort] = useState<Sort>("featured");
  const [priceMin, setPriceMin] = useState("");
  const [priceMax, setPriceMax] = useState("");
  const [onSale, setOnSale] = useState(false);

  const catId = activeCat ? categories.find((c) => c.slug === activeCat)?.id : undefined;
  const min = priceMin.trim() === "" ? -Infinity : Number(priceMin);
  const max = priceMax.trim() === "" ? Infinity : Number(priceMax);

  const filtersActive =
    !!activeCat || query.trim() !== "" || priceMin !== "" || priceMax !== "" || onSale;

  const resetFilters = () => {
    setActiveCat(undefined);
    setQuery("");
    setPriceMin("");
    setPriceMax("");
    setOnSale(false);
    setSort("featured");
  };

  const filtered = products.filter((p) => {
    if (catId && p.category_id !== catId) return false;
    if (query && !p.title.toLowerCase().includes(query.toLowerCase())) return false;
    if (onSale && !isOnSale(p)) return false;
    const price = effectivePrice(p);
    if (price < min || price > max) return false;
    return true;
  });

  const sorted = [...filtered].sort((a, b) => {
    switch (sort) {
      case "price-asc":
        return effectivePrice(a) - effectivePrice(b);
      case "price-desc":
        return effectivePrice(b) - effectivePrice(a);
      case "rating":
        return (b.rating ?? 0) - (a.rating ?? 0);
      default:
        return 0; // "featured" — keep server order (newest first)
    }
  });

  return (
    <div className="mx-auto max-w-7xl px-6 py-10">
      <div className="mb-10">
        <h1 className="font-display font-bold text-4xl md:text-5xl">Shop the Marketplace</h1>
        <p className="text-muted-foreground mt-2">{sorted.length} fresh products</p>
      </div>

      <div className="grid lg:grid-cols-[240px_1fr] gap-8">
        <aside className="space-y-6">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
              Filters
            </span>
            {filtersActive && (
              <Button
                variant="ghost"
                size="sm"
                onClick={resetFilters}
                className="h-auto px-2 py-1 text-xs text-brand hover:text-secondary-accent"
              >
                Clear all
              </Button>
            )}
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-widest text-muted-foreground mb-2">
              Search
            </label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
              <Input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Tuna, salmon, uni..."
                className="pl-9 rounded-full"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-widest text-muted-foreground mb-2">
              Categories
            </label>
            <div className="space-y-1">
              <button
                onClick={() => setActiveCat(undefined)}
                className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${!activeCat ? "bg-brand text-brand-foreground font-bold" : "hover:bg-muted"}`}
              >
                All Products
              </button>
              {categories.map((c) => (
                <button
                  key={c.id}
                  onClick={() => setActiveCat(c.slug)}
                  className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${activeCat === c.slug ? "bg-brand text-brand-foreground font-bold" : "hover:bg-muted"}`}
                >
                  {c.name}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-widest text-muted-foreground mb-2">
              Price ($)
            </label>
            <div className="flex items-center gap-2">
              <Input
                type="number"
                min="0"
                placeholder="Min"
                value={priceMin}
                onChange={(e) => setPriceMin(e.target.value)}
                className="rounded-full"
              />
              <span className="text-muted-foreground">–</span>
              <Input
                type="number"
                min="0"
                placeholder="Max"
                value={priceMax}
                onChange={(e) => setPriceMax(e.target.value)}
                className="rounded-full"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-widest text-muted-foreground mb-2">
              Offers
            </label>
            <label className="flex items-center gap-2.5 px-3 py-2 rounded-lg hover:bg-muted cursor-pointer text-sm">
              <Checkbox checked={onSale} onCheckedChange={(v) => setOnSale(v === true)} />
              On sale only
            </label>
          </div>
        </aside>

        <div>
          <div className="flex items-center justify-end mb-6">
            <div className="flex items-center gap-2">
              <span className="text-xs uppercase tracking-widest text-muted-foreground hidden sm:inline">
                Sort
              </span>
              <Select value={sort} onValueChange={(v) => setSort(v as Sort)}>
                <SelectTrigger className="w-48 rounded-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="featured">Featured</SelectItem>
                  <SelectItem value="price-asc">Price: Low to High</SelectItem>
                  <SelectItem value="price-desc">Price: High to Low</SelectItem>
                  <SelectItem value="rating">Top Rated</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array.from({ length: 6 }).map((_, i) => (
                <Skeleton key={i} className="aspect-[4/5] rounded-[16px]" />
              ))}
            </div>
          ) : sorted.length === 0 ? (
            <div className="text-center py-20 border rounded-3xl bg-card">
              <p className="font-display font-bold text-xl">No products found</p>
              <p className="text-muted-foreground text-sm mt-1">
                Try adjusting your filters or search term.
              </p>
              {filtersActive && (
                <Button variant="outline" size="sm" onClick={resetFilters} className="mt-4">
                  Clear filters
                </Button>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {sorted.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
