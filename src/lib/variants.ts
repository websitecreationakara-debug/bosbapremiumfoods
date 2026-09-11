import type { Product, ProductVariation } from "./types";

export const variationPrice = (v: ProductVariation) => v.sale_price ?? v.price;

// A variation only has a real price once an admin fills in "Sale Price" — the
// admin form never writes the legacy `price` column, so 0 there just means
// unset. Treat that as "no price yet", not a genuine free/zero price.
export const hasValidPrice = (v: ProductVariation) => variationPrice(v) > 0;

export const simplePrice = (p: Product) => p.sale_price ?? p.price;

// Lowest effective price a product sells at: cheapest *priced* variation for
// a variable product, otherwise its own price. Unpriced variations (added but
// never given a Sale Price) are excluded so the card doesn't show "from $0".
export const productFromPrice = (p: Product, variations: ProductVariation[]) => {
  const priced = variations.filter(hasValidPrice);
  if (p.type === "variable" && priced.length) return Math.min(...priced.map(variationPrice));
  return simplePrice(p);
};

// Group all variations by product_id for O(1) lookup in lists.
export const groupVariations = (variations: ProductVariation[]) => {
  const map = new Map<string, ProductVariation[]>();
  for (const v of variations) {
    const list = map.get(v.product_id);
    if (list) list.push(v);
    else map.set(v.product_id, [v]);
  }
  return map;
};

export const formatMoney = (n: number) => `$${n.toFixed(2)}`;

// Full price text for a product: a min–max range across priced variations for
// a variable product (e.g. "$49.00–$140.00"), or the simple price with a
// struck-through original if on sale. Never reads a variable product's own
// `price`/`sale_price` columns — those are unused placeholders on that type
// (see the schema comment on `products.type`).
export const priceRangeText = (p: Product, variations: ProductVariation[]): string => {
  if (p.type === "variable") {
    const priced = variations.filter(hasValidPrice).map(variationPrice);
    if (priced.length === 0) return "Contact us for pricing";
    const min = Math.min(...priced);
    const max = Math.max(...priced);
    return min === max ? formatMoney(min) : `${formatMoney(min)}–${formatMoney(max)}`;
  }
  return p.sale_price != null && p.sale_price < p.price
    ? `${formatMoney(p.sale_price)} (was ${formatMoney(p.price)})`
    : formatMoney(p.price);
};
