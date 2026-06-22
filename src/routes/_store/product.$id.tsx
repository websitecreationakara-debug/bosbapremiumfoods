import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { useProduct, useStoreSettings, useProductVariations } from "@/hooks/use-products";
import { useCart } from "@/hooks/use-cart";
import { useWishlist } from "@/hooks/use-wishlist";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Star, ShoppingBag, Minus, Plus, ArrowLeft, Truck, Heart } from "lucide-react";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/_store/product/$id")({
  component: ProductDetail,
});

function ProductDetail() {
  const { id } = Route.useParams();
  const { data: product, isLoading } = useProduct(id);
  const { data: variations = [] } = useProductVariations(id);
  const { data: settings } = useStoreSettings();
  const { add } = useCart();
  const { has: inWishlist, toggle: toggleWishlist } = useWishlist();
  const [qty, setQty] = useState(1);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const shipThreshold = Number(settings?.free_shipping_threshold ?? 50);

  const variable = product?.type === "variable";
  // Default to the first (cheapest) variation until the customer picks one.
  const selected = variations.find((v) => v.id === selectedId) ?? variations[0] ?? null;

  if (isLoading) {
    return (
      <div className="mx-auto max-w-6xl px-6 py-10 grid md:grid-cols-2 gap-10">
        <Skeleton className="aspect-square rounded-3xl" />
        <div className="space-y-4">
          <Skeleton className="h-10 w-3/4" />
          <Skeleton className="h-6 w-1/3" />
          <Skeleton className="h-24 w-full" />
          <Skeleton className="h-12 w-1/2" />
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="mx-auto max-w-3xl px-6 py-24 text-center">
        <h1 className="font-display font-bold text-2xl">Product not found</h1>
        <p className="text-muted-foreground mt-2">It may have been removed or is unavailable.</p>
        <Link
          to="/shop"
          className="inline-flex mt-6 items-center gap-2 rounded-full bg-brand text-brand-foreground px-6 py-3 text-sm font-bold"
        >
          <ArrowLeft className="size-4" /> Back to shop
        </Link>
      </div>
    );
  }

  // Price/stock/weight come from the chosen variation for variable products,
  // otherwise from the product itself.
  const basePrice = variable ? (selected?.price ?? 0) : product.price;
  const salePrice = variable ? (selected?.sale_price ?? null) : product.sale_price;
  const activeStock = variable ? (selected?.stock ?? 0) : product.stock;
  const weightLabel = variable ? selected?.weight : product.weight;
  const pcs = variable ? (selected?.pcs ?? null) : product.pcs;
  const hasSale = salePrice != null && salePrice < basePrice;
  const price = salePrice ?? basePrice;
  const discount = hasSale ? Math.round(((basePrice - salePrice!) / basePrice) * 100) : 0;
  const addDisabled = variable && !selected;

  return (
    <div className="mx-auto max-w-6xl px-4 md:px-6 py-8 md:py-10">
      <Link
        to="/shop"
        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground mb-6"
      >
        <ArrowLeft className="size-4" /> Back to shop
      </Link>

      <div className="grid md:grid-cols-2 gap-6 md:gap-10">
        <div className="relative aspect-square rounded-3xl overflow-hidden bg-muted">
          {product.image_url ? (
            <img
              src={product.image_url}
              alt={product.title}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full grid place-items-center text-muted-foreground text-sm">
              No image
            </div>
          )}
          <div className="absolute top-4 left-4 flex flex-col gap-1.5">
            {hasSale && (
              <span className="px-2.5 py-1 bg-destructive text-destructive-foreground text-[10px] font-bold uppercase tracking-wider rounded-md">
                -{discount}%
              </span>
            )}
            {product.badge && (
              <span
                className={cn(
                  "px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider rounded-md",
                  product.badge === "HOT" && "bg-warning text-foreground",
                  product.badge === "NEW" && "bg-accent text-accent-foreground",
                  product.badge === "ORGANIC" && "bg-brand text-brand-foreground",
                  product.badge === "SALE" && "bg-destructive text-destructive-foreground",
                )}
              >
                {product.badge}
              </span>
            )}
          </div>
        </div>

        <div className="flex flex-col">
          <h1 className="font-display font-semibold tracking-tight text-3xl md:text-4xl leading-tight">
            {product.title}
          </h1>

          <div className="flex items-center gap-2 mt-3 text-sm text-muted-foreground">
            <span className="inline-flex items-center gap-1">
              <Star className="size-4 fill-warning text-warning" />
              {product.rating ?? 4.5}
            </span>
            <span className="opacity-50">·</span>
            <span className="text-success font-medium">
              {activeStock > 0 ? `In stock (${activeStock})` : "In stock"}
            </span>
            {weightLabel && (
              <>
                <span className="opacity-50">·</span>
                <span>{weightLabel}</span>
              </>
            )}
            {pcs != null && (
              <>
                <span className="opacity-50">·</span>
                <span>{pcs} pcs/box</span>
              </>
            )}
          </div>

          <div className="flex items-baseline gap-3 mt-5">
            <span className="font-display font-bold text-3xl text-brand">${price.toFixed(2)}</span>
            {hasSale && (
              <span className="text-lg text-muted-foreground line-through">
                ${basePrice.toFixed(2)}
              </span>
            )}
          </div>

          {variable && variations.length > 0 && (
            <div className="mt-6">
              <span className="block text-xs font-bold uppercase tracking-widest text-muted-foreground mb-2">
                Weight
              </span>
              <div className="flex flex-wrap gap-2">
                {variations.map((v) => (
                  <button
                    key={v.id}
                    type="button"
                    onClick={() => {
                      setSelectedId(v.id);
                      setQty(1);
                    }}
                    className={cn(
                      "rounded-full border px-4 py-2 text-sm font-medium transition-colors",
                      v.id === selected?.id
                        ? "border-brand bg-brand text-brand-foreground"
                        : "hover:border-brand",
                    )}
                  >
                    {v.weight}
                  </button>
                ))}
              </div>
            </div>
          )}

          {product.description && (
            <p className="text-muted-foreground mt-5 leading-relaxed">{product.description}</p>
          )}

          <div className="flex items-center gap-3 mt-8">
            <div className="flex items-center border rounded-full">
              <button
                type="button"
                onClick={() => setQty((q) => Math.max(1, q - 1))}
                className="size-10 grid place-items-center text-muted-foreground hover:text-foreground disabled:opacity-40"
                disabled={qty <= 1}
                aria-label="Decrease quantity"
              >
                <Minus className="size-4" />
              </button>
              <span className="w-10 text-center font-bold">{qty}</span>
              <button
                type="button"
                onClick={() => setQty((q) => Math.min(activeStock || 99, q + 1))}
                className="size-10 grid place-items-center text-muted-foreground hover:text-foreground"
                aria-label="Increase quantity"
              >
                <Plus className="size-4" />
              </button>
            </div>
            <Button
              size="lg"
              disabled={addDisabled}
              onClick={() => add(product, variable ? selected : null, qty)}
              className="flex-1 rounded-full font-bold"
            >
              <ShoppingBag className="size-4 mr-2" />
              Add to Cart
            </Button>
            <button
              type="button"
              onClick={() => toggleWishlist(product.id)}
              aria-pressed={inWishlist(product.id)}
              aria-label={inWishlist(product.id) ? "Remove from wishlist" : "Save to wishlist"}
              className="grid size-12 shrink-0 place-items-center rounded-full border transition-colors hover:bg-muted"
            >
              <Heart
                className={cn(
                  "size-5 transition-colors",
                  inWishlist(product.id) && "fill-brand text-brand",
                )}
              />
            </button>
          </div>

          <div className="flex items-center gap-2 text-sm text-muted-foreground mt-6 border-t pt-6">
            <Truck className="size-4 text-brand" />
            {`Free chilled delivery on orders over $${shipThreshold}.`}
          </div>
        </div>
      </div>
    </div>
  );
}
