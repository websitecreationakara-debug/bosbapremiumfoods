import type { Product } from "./types";

export const effectivePrice = (p: Product) => p.sale_price ?? p.price;

// Top-level products only — variant children are folded into their parent.
export const topLevel = (products: Product[]) => products.filter((p) => !p.parent_id);

export const childrenOf = (products: Product[], parentId: string) =>
  products.filter((p) => p.parent_id === parentId);

// Lowest effective price across a product's family (itself + its children).
// Used to show "from $X" on a parent card.
export const familyFromPrice = (products: Product[], parent: Product) => {
  const prices = [parent, ...childrenOf(products, parent.id)].map(effectivePrice);
  return Math.min(...prices);
};
