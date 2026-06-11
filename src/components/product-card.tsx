import { Link } from "@tanstack/react-router";
import { Star, ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCart } from "@/hooks/use-cart";
import type { Product } from "@/lib/types";
import { cn } from "@/lib/utils";

export function ProductCard({ product }: { product: Product }) {
  const { add } = useCart();
  const hasSale = product.sale_price != null && product.sale_price < product.price;
  const discount = hasSale
    ? Math.round(((product.price - product.sale_price!) / product.price) * 100)
    : 0;

  return (
    <Link
      to="/product/$id"
      params={{ id: product.id }}
      className="group relative block bg-card rounded-3xl border overflow-hidden hover:shadow-2xl hover:shadow-brand/10 hover:-translate-y-1 transition-all duration-500"
    >
      <div className="relative aspect-square overflow-hidden bg-muted">
        {product.image_url ? (
          <img
            src={product.image_url}
            alt={product.title}
            loading="lazy"
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
          />
        ) : (
          <div className="w-full h-full grid place-items-center text-muted-foreground text-xs">
            No image
          </div>
        )}

        <div className="absolute top-3 left-3 flex flex-col gap-1.5">
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

        <div className="absolute inset-x-3 bottom-3 translate-y-[120%] group-hover:translate-y-0 transition-transform duration-300">
          <Button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              add(product);
            }}
            size="sm"
            className="w-full rounded-full shadow-lg"
          >
            <ShoppingBag className="size-4 mr-1.5" /> Add to Cart
          </Button>
        </div>
      </div>

      <div className="p-4 space-y-1.5">
        <h3 className="font-display font-bold text-sm leading-tight line-clamp-1">
          {product.title}
        </h3>
        <div className="flex items-center gap-1 text-xs text-muted-foreground">
          <Star className="size-3 fill-warning text-warning" />
          <span>{product.rating ?? 4.5}</span>
          <span className="opacity-50">·</span>
          <span>In stock</span>
        </div>
        <div className="flex items-baseline gap-2 pt-1">
          <span className="font-display font-bold text-lg text-brand">
            ${(product.sale_price ?? product.price).toFixed(2)}
          </span>
          {hasSale && (
            <span className="text-xs text-muted-foreground line-through">
              ${product.price.toFixed(2)}
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}
