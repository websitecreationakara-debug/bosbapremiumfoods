import { useState } from "react";
import { useProductAddons } from "@/hooks/use-products";
import { useCart } from "@/hooks/use-cart";
import { Button } from "@/components/ui/button";
import { Minus, Plus, ImageIcon } from "lucide-react";
import { toast } from "sonner";
import type { Addon, Product } from "@/lib/types";

// Addons live in their own table/catalog (never the shop grid, never buyable
// on their own), but the cart only knows how to hold `{ product, variation,
// qty }` lines. Rather than widen the cart's type everywhere it's read
// (drawer, checkout, header count), an addon is added as a synthetic
// Product-shaped cart line — its own id/title/price/image carry straight
// through to checkout's order-item mapping unchanged, and `type: "addon"`
// keeps it self-describing for anyone reading cart state.
function addonToProduct(a: Addon): Product {
  return {
    id: a.id,
    title: a.title,
    description: a.description,
    price: a.price,
    sale_price: null,
    category_id: null,
    stock: a.stock,
    status: a.status,
    image_url: a.image_url,
    badge: null,
    rating: null,
    weight: null,
    pcs: null,
    type: "addon",
    sort_order: a.sort_order,
    featured: false,
    pre_order: false,
    promotion_id: null,
    video_url: null,
    created_at: a.created_at,
    updated_at: a.created_at,
  };
}

function AddonRow({ addon }: { addon: Addon }) {
  const { add } = useCart();
  const [qty, setQty] = useState(1);
  const soldOut = addon.stock === 0;

  return (
    <div className="flex items-center gap-3 py-3">
      <div className="size-14 rounded-lg bg-muted overflow-hidden shrink-0 grid place-items-center text-muted-foreground">
        {addon.image_url ? (
          <img src={addon.image_url} alt="" className="w-full h-full object-cover" />
        ) : (
          <ImageIcon className="size-5" />
        )}
      </div>
      <div className="flex-1 min-w-0">
        <p className="font-medium text-sm leading-tight truncate">{addon.title}</p>
        <p className="text-xs text-muted-foreground mt-0.5">
          {soldOut ? "Out of stock" : `$${addon.price.toFixed(2)}`}
        </p>
      </div>
      {!soldOut && (
        <>
          <div className="flex items-center gap-1 border rounded-full shrink-0">
            <button
              type="button"
              onClick={() => setQty((q) => Math.max(1, q - 1))}
              className="size-7 grid place-items-center hover:bg-muted rounded-full"
              aria-label={`Decrease ${addon.title} quantity`}
            >
              <Minus className="size-3" />
            </button>
            <span className="text-xs font-semibold w-5 text-center">{qty}</span>
            <button
              type="button"
              onClick={() => setQty((q) => (addon.stock == null ? q + 1 : Math.min(addon.stock, q + 1)))}
              className="size-7 grid place-items-center hover:bg-muted rounded-full"
              aria-label={`Increase ${addon.title} quantity`}
            >
              <Plus className="size-3" />
            </button>
          </div>
          <Button
            type="button"
            size="sm"
            variant="outline"
            className="rounded-full shrink-0"
            onClick={() => {
              add(addonToProduct(addon), null, qty);
              toast.success(`${addon.title} added`);
              setQty(1);
            }}
          >
            Add
          </Button>
        </>
      )}
    </div>
  );
}

export function ProductAddonPicker({ productId }: { productId: string }) {
  const { data: addonsList = [] } = useProductAddons(productId);
  if (addonsList.length === 0) return null;

  return (
    <div className="mt-6 border rounded-2xl px-4">
      <p className="text-sm font-semibold pt-4 pb-1">Complete your order</p>
      <p className="text-xs text-muted-foreground pb-1">Add extras to go with this product.</p>
      <div className="divide-y">
        {addonsList.map((a) => (
          <AddonRow key={a.id} addon={a} />
        ))}
      </div>
    </div>
  );
}
