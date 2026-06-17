import { Link } from "@tanstack/react-router";
import { Plus } from "lucide-react";
import { useCart } from "@/hooks/use-cart";
import type { Product } from "@/lib/types";

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
      className="group flex flex-col rounded-[16px] border border-[rgba(201,168,76,0.25)] bg-card p-2 transition-colors hover:border-[rgba(201,168,76,0.55)]"
    >
      {/* Image — 8px inset, concentric radius, dramatic dark crop */}
      <div className="relative aspect-square overflow-hidden rounded-[10px] bg-muted">
        {product.image_url ? (
          <img
            src={product.image_url}
            alt={product.title}
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
        ) : (
          <div className="grid h-full w-full place-items-center text-xs text-muted-foreground">
            No image
          </div>
        )}
        {/* Subtle dark vignette so light-studio photos sit better on the dark card */}
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_50%,rgba(0,0,0,0.45))]" />
        {hasSale && (
          <span className="absolute left-2.5 top-2.5 rounded-md border border-[rgba(201,168,76,0.4)] bg-black/70 px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-brand backdrop-blur">
            -{discount}%
          </span>
        )}
      </div>

      {/* Body */}
      <div className="flex flex-1 flex-col gap-3 px-2 pb-1 pt-4">
        <h3 className="line-clamp-1 text-[17px] font-medium leading-tight text-foreground">
          {product.title}
        </h3>

        <div className="mt-auto flex items-end justify-between gap-2">
          <div className="flex items-baseline gap-1.5">
            <span className="text-[15px] font-medium text-brand">
              ${(product.sale_price ?? product.price).toFixed(2)}
            </span>
            {product.weight && (
              <span className="text-xs text-muted-foreground">/ {product.weight}</span>
            )}
            {hasSale && (
              <span className="text-xs text-muted-foreground line-through">
                ${product.price.toFixed(2)}
              </span>
            )}
          </div>

          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              add(product);
            }}
            aria-label="Add to cart"
            className="grid size-9 shrink-0 place-items-center rounded-full border border-brand bg-background text-brand transition-colors hover:bg-brand hover:text-brand-foreground"
          >
            <Plus className="size-4" />
          </button>
        </div>
      </div>
    </Link>
  );
}
