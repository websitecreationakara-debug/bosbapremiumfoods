import { createFileRoute, Link, Navigate } from "@tanstack/react-router";
import { useState } from "react";
import {
  useCollections,
  useProductCollections,
  useProducts,
  useAllVariations,
} from "@/hooks/use-products";
import { ProductCard } from "@/components/product-card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ChevronRight } from "lucide-react";
import { groupVariations, productFromPrice } from "@/lib/variants";
import type { Product } from "@/lib/types";

type Sort = "featured" | "price-asc" | "price-desc" | "rating";

export const Route = createFileRoute("/_store/collections/$slug")({
  head: ({ params }) => ({
    meta: [{ title: `${params.slug.replace(/-/g, " ")} — BOSBA Premium Foods` }],
  }),
  component: CollectionPage,
});

function CollectionPage() {
  const { slug } = Route.useParams();
  const { data: collections = [], isLoading: collectionsLoading } = useCollections();
  const { data: memberships = [] } = useProductCollections();
  const { data: products = [], isLoading: productsLoading } = useProducts();
  const { data: variations = [] } = useAllVariations();
  const [sort, setSort] = useState<Sort>("featured");

  const variationsByProduct = groupVariations(variations);
  const displayPrice = (p: Product) => productFromPrice(p, variationsByProduct.get(p.id) ?? []);

  const isLoading = collectionsLoading || productsLoading;
  const collection = collections.find((c) => c.slug === slug);

  if (!isLoading && (!collection || !collection.active)) {
    return <Navigate to="/shop" />;
  }

  const memberProductIds = new Set(
    memberships.filter((m) => m.collection_id === collection?.id).map((m) => m.product_id),
  );
  const items = products.filter((p) => memberProductIds.has(p.id));

  const sorted = [...items].sort((a, b) => {
    switch (sort) {
      case "price-asc":
        return displayPrice(a) - displayPrice(b);
      case "price-desc":
        return displayPrice(b) - displayPrice(a);
      case "rating":
        return (b.rating ?? 0) - (a.rating ?? 0);
      default:
        return 0;
    }
  });

  return (
    <div className="mx-auto max-w-7xl px-4 md:px-6 py-8 md:py-10">
      <div className="mb-6 md:mb-10">
        <div className="flex items-center gap-1.5 text-xs text-muted-foreground mb-3">
          <Link to="/shop" className="hover:text-foreground">
            Shop
          </Link>
          <ChevronRight className="size-3.5" />
          <span className="text-foreground">{collection?.title ?? "…"}</span>
        </div>
        <h1 className="font-display font-semibold tracking-tight text-3xl md:text-5xl">
          {collection?.title ?? "…"}
        </h1>
        {collection?.sub_label && (
          <p className="text-brand font-medium mt-1.5">{collection.sub_label}</p>
        )}
        {collection?.description && (
          <p className="text-muted-foreground mt-2 max-w-2xl">{collection.description}</p>
        )}
      </div>

      <div className="flex items-center justify-between gap-2 mb-6">
        <p className="text-muted-foreground text-sm">
          {sorted.length} {sorted.length === 1 ? "product" : "products"}
        </p>
        <div className="flex items-center gap-2">
          <span className="text-xs uppercase tracking-widest text-muted-foreground hidden sm:inline">
            Sort
          </span>
          <Select value={sort} onValueChange={(v) => setSort(v as Sort)}>
            <SelectTrigger className="w-40 sm:w-48 rounded-full">
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
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="aspect-[4/5] rounded-2xl" />
          ))}
        </div>
      ) : sorted.length === 0 ? (
        <div className="text-center py-20 rounded-3xl bg-muted">
          <p className="font-display font-semibold text-xl">No products yet</p>
          <p className="text-muted-foreground text-sm mt-1">
            Check back soon — we're adding new items to this collection.
          </p>
          <Link
            to="/shop"
            className="inline-block mt-4 text-sm font-medium text-brand hover:text-brand/80"
          >
            Browse all products
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {sorted.map((p) => (
            <ProductCard key={p.id} product={p} fromPrice={displayPrice(p)} />
          ))}
        </div>
      )}
    </div>
  );
}
