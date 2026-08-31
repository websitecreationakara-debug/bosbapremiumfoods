// Client-side product export to .xlsx for the admin products table. xlsx is
// heavy and only needed on click, so it's imported dynamically — same pattern
// as the invoice PDF generator (see ./invoice.ts) — to keep it out of the
// storefront bundle entirely.
import type { Product, Category, Promotion, ProductVariation } from "./types";

function priceRange(vs: ProductVariation[]): string {
  if (!vs.length) return "";
  const prices = vs.map((v) => v.sale_price ?? v.price);
  const min = Math.min(...prices);
  const max = Math.max(...prices);
  return min === max ? min.toFixed(2) : `${min.toFixed(2)}–${max.toFixed(2)}`;
}

function stockTotal(vs: ProductVariation[]): number | string {
  if (!vs.length) return "";
  const tracked = vs.filter((v) => v.stock != null);
  return tracked.length === 0 ? "∞" : tracked.reduce((a, v) => a + (v.stock ?? 0), 0);
}

export async function downloadProductsXlsx(
  products: Product[],
  categories: Category[],
  promotions: Promotion[],
  variationsByProduct: Map<string, ProductVariation[]>,
) {
  const XLSX = await import("xlsx");

  const categoryName = new Map(categories.map((c) => [c.id, c.name]));
  const promotionName = new Map(promotions.map((p) => [p.id, p.name]));

  const productRows = products.map((p) => {
    const variable = p.type === "variable";
    const vs = variationsByProduct.get(p.id) ?? [];
    return {
      name: p.title,
      description: p.description ?? "",
      price: variable ? priceRange(vs) : p.price.toFixed(2),
      discount_price: variable ? "" : (p.sale_price?.toFixed(2) ?? ""),
      stock: variable ? stockTotal(vs) : (p.stock ?? "∞"),
      status: p.status,
      tags: "",
      unit: variable ? "" : (p.weight ?? ""),
      category_name: p.category_id ? (categoryName.get(p.category_id) ?? p.category_id) : "",
      options: variable ? vs.map((v) => `${v.weight}: ${v.stock ?? "∞"}`).join("\n") : "",
      id: p.id,
      type: p.type,
      featured: p.featured ? "Yes" : "No",
      pre_order: p.pre_order ? "Yes" : "No",
      badge: p.badge ?? "",
      rating: p.rating ?? "",
      pcs: variable ? "" : (p.pcs ?? ""),
      variations: variable ? vs.length : "",
      promotion: p.promotion_id ? (promotionName.get(p.promotion_id) ?? p.promotion_id) : "",
      sort_order: p.sort_order,
      image_url: p.image_url ?? "",
      created_at: p.created_at,
      updated_at: p.updated_at,
    };
  });

  const variationRows = products.flatMap((p) => {
    if (p.type !== "variable") return [];
    return (variationsByProduct.get(p.id) ?? []).map((v) => ({
      product_id: p.id,
      product_name: p.title,
      unit: v.weight,
      price: v.price.toFixed(2),
      discount_price: v.sale_price?.toFixed(2) ?? "",
      stock: v.stock ?? "∞",
      pcs: v.pcs ?? "",
    }));
  });

  const wb = XLSX.utils.book_new();
  const productsSheet = XLSX.utils.json_to_sheet(productRows);
  XLSX.utils.book_append_sheet(wb, productsSheet, "Products");
  if (variationRows.length) {
    const variationsSheet = XLSX.utils.json_to_sheet(variationRows);
    XLSX.utils.book_append_sheet(wb, variationsSheet, "Variations");
  }

  const date = new Date().toISOString().slice(0, 10);
  XLSX.writeFile(wb, `BOSBA-products-${date}.xlsx`);
}
