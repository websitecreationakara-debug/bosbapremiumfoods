import { Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
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
      className="group flex flex-col rounded-[16px] border border-[rgba(201,168,76,0.25)] bg-[#111111] p-2 transition-colors hover:border-[rgba(201,168,76,0.55)]"
    >
      {/* Image — 8px inset, concentric radius, dramatic dark crop */}
      <div className="relative aspect-square overflow-hidden rounded-[10px] bg-black">
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
        {hasSale && (
          <span className="absolute left-2.5 top-2.5 rounded-md border border-[rgba(201,168,76,0.4)] bg-black/70 px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-brand backdrop-blur">
            -{discount}%
          </span>
        )}
      </div>

      {/* Body */}
      <div className="flex flex-1 flex-col gap-4 px-2 pb-1 pt-4">
        <div className="space-y-1.5">
          <h3 className="line-clamp-1 text-[17px] font-medium leading-tight text-foreground">
            {product.title}
          </h3>
          <div className="flex items-baseline gap-2">
            <span className="text-[15px] font-medium text-brand">
              ${(product.sale_price ?? product.price).toFixed(2)}
            </span>
            {hasSale && (
              <span className="text-xs text-muted-foreground line-through">
                ${product.price.toFixed(2)}
              </span>
            )}
          </div>
        </div>

        <button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            add(product);
          }}
          className="mt-auto inline-flex w-full items-center justify-center gap-2 rounded-full border border-brand bg-transparent px-4 py-2.5 text-sm font-medium text-brand transition-colors hover:bg-brand hover:text-brand-foreground"
        >
          Add to Cart <ArrowRight className="size-4" />
        </button>
      </div>
    </Link>
  );
}
