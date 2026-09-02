import { env } from "cloudflare:workers";
import { eq, asc, desc, inArray } from "drizzle-orm";
import { getDb } from "@/db";
import { products, product_variations, product_images, promotions } from "@/db/schema";
import { applyPromo } from "@/lib/promotions";
import { slugify, isUuid } from "@/lib/utils";

// Public read-only catalog API for consumption by other websites.
//
//   GET /api/v1/products            -> every published product, each with its
//                                      `variations` and `images` arrays
//   GET /api/v1/products/{idOrSlug} -> one published product (UUID or title slug)
//
// Auth: send the key as `x-api-key: <key>` or `Authorization: Bearer <key>`.
// The key is the `PUBLIC_API_KEY` Worker secret; without it set, the API is
// disabled (503) rather than open. CORS defaults to `*` so a browser on any
// site can call it; set `PUBLIC_API_ALLOWED_ORIGINS` (comma-separated) to lock
// it to specific sites. Prices already reflect any live promotion discount,
// matching what the storefront shows.

type ProductRow = typeof products.$inferSelect;
type VariationRow = typeof product_variations.$inferSelect;

function allowedOrigin(request: Request): string {
  const configured = (env as { PUBLIC_API_ALLOWED_ORIGINS?: string }).PUBLIC_API_ALLOWED_ORIGINS;
  if (!configured) return "*";
  const list = configured
    .split(",")
    .map((o) => o.trim())
    .filter(Boolean);
  const origin = request.headers.get("origin");
  if (origin && list.includes(origin)) return origin;
  return list[0] ?? "*";
}

function corsHeaders(request: Request): Record<string, string> {
  return {
    "Access-Control-Allow-Origin": allowedOrigin(request),
    "Access-Control-Allow-Methods": "GET, OPTIONS",
    "Access-Control-Allow-Headers": "Authorization, Content-Type, x-api-key",
    "Access-Control-Max-Age": "86400",
    Vary: "Origin",
  };
}

function json(
  request: Request,
  body: unknown,
  status = 200,
  extra: Record<string, string> = {},
): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      "content-type": "application/json; charset=utf-8",
      ...corsHeaders(request),
      ...extra,
    },
  });
}

function isAuthorized(request: Request): boolean {
  const key = (env as { PUBLIC_API_KEY?: string }).PUBLIC_API_KEY;
  if (!key) return false;
  const header = request.headers.get("x-api-key");
  if (header && header === key) return true;
  const auth = request.headers.get("authorization");
  return auth === `Bearer ${key}`;
}

// Lower each product's sale_price to reflect any live promotion discount, so
// the API matches every storefront surface. Mirrors applyProductPromos in
// src/data/products.ts (kept separate to avoid importing a server fn here).
async function withPromoPrices(rows: ProductRow[]): Promise<ProductRow[]> {
  const ids = [...new Set(rows.map((r) => r.promotion_id).filter((id): id is string => !!id))];
  if (ids.length === 0) return rows;
  const promos = await getDb().select().from(promotions).where(inArray(promotions.id, ids));
  const map = new Map(promos.map((p) => [p.id, p]));
  const now = Date.now();
  return rows.map((r) => {
    const promo = r.promotion_id ? map.get(r.promotion_id) : undefined;
    if (!promo) return r;
    const base = r.sale_price ?? r.price;
    const discounted = applyPromo(base, promo, now);
    return discounted < base ? { ...r, sale_price: discounted } : r;
  });
}

async function variationsWithPromoPrices(
  rows: VariationRow[],
  parents: ProductRow[],
): Promise<VariationRow[]> {
  const promoIdByProduct = new Map(parents.map((p) => [p.id, p.promotion_id]));
  const promoIds = [
    ...new Set(parents.map((p) => p.promotion_id).filter((id): id is string => !!id)),
  ];
  if (promoIds.length === 0) return rows;
  const promos = await getDb().select().from(promotions).where(inArray(promotions.id, promoIds));
  const map = new Map(promos.map((p) => [p.id, p]));
  const now = Date.now();
  return rows.map((v) => {
    const pid = promoIdByProduct.get(v.product_id);
    const promo = pid ? map.get(pid) : undefined;
    if (!promo) return v;
    const base = v.sale_price ?? v.price;
    const discounted = applyPromo(base, promo, now);
    return discounted < base ? { ...v, sale_price: discounted } : v;
  });
}

type ProductPayload = ProductRow & {
  variations: VariationRow[];
  images: { url: string; sort_order: number }[];
};

async function assemble(rows: ProductRow[]): Promise<ProductPayload[]> {
  if (rows.length === 0) return [];
  const withPrices = await withPromoPrices(rows);
  const ids = withPrices.map((p) => p.id);
  const db = getDb();

  const [allVariations, allImages] = await Promise.all([
    db
      .select()
      .from(product_variations)
      .where(inArray(product_variations.product_id, ids))
      .orderBy(asc(product_variations.sort_order), asc(product_variations.price)),
    db
      .select()
      .from(product_images)
      .where(inArray(product_images.product_id, ids))
      .orderBy(asc(product_images.sort_order), asc(product_images.created_at)),
  ]);

  const pricedVariations = await variationsWithPromoPrices(allVariations, withPrices);

  const varsByProduct = new Map<string, VariationRow[]>();
  for (const v of pricedVariations) {
    const list = varsByProduct.get(v.product_id) ?? [];
    list.push(v);
    varsByProduct.set(v.product_id, list);
  }
  const imgsByProduct = new Map<string, { url: string; sort_order: number }[]>();
  for (const img of allImages) {
    const list = imgsByProduct.get(img.product_id) ?? [];
    list.push({ url: img.url, sort_order: img.sort_order });
    imgsByProduct.set(img.product_id, list);
  }

  return withPrices.map((p) => ({
    ...p,
    variations: varsByProduct.get(p.id) ?? [],
    images: imgsByProduct.get(p.id) ?? [],
  }));
}

// Returns null when the path isn't a public-API route (so the caller can fall
// through to normal app routing).
export async function handlePublicApi(request: Request): Promise<Response | null> {
  const url = new URL(request.url);
  if (!url.pathname.startsWith("/api/v1/")) return null;

  if (request.method === "OPTIONS") {
    return new Response(null, { status: 204, headers: corsHeaders(request) });
  }

  if (request.method !== "GET") {
    return json(request, { error: "Method not allowed" }, 405);
  }

  const key = (env as { PUBLIC_API_KEY?: string }).PUBLIC_API_KEY;
  if (!key) {
    return json(request, { error: "API not configured" }, 503);
  }
  if (!isAuthorized(request)) {
    return json(request, { error: "Unauthorized" }, 401);
  }

  const db = getDb();

  // GET /api/v1/products
  if (url.pathname === "/api/v1/products") {
    const rows = await db
      .select()
      .from(products)
      .where(eq(products.status, "published"))
      .orderBy(asc(products.sort_order), desc(products.created_at));
    const data = await assemble(rows);
    return json(request, { data, count: data.length }, 200, {
      "Cache-Control": "public, max-age=60",
    });
  }

  // GET /api/v1/products/{idOrSlug}
  const match = url.pathname.match(/^\/api\/v1\/products\/([^/]+)$/);
  if (match) {
    const idOrSlug = decodeURIComponent(match[1]);
    let row: ProductRow | undefined;
    if (isUuid(idOrSlug)) {
      [row] = await db.select().from(products).where(eq(products.id, idOrSlug));
    } else {
      const all = await db.select().from(products).where(eq(products.status, "published"));
      row = all.find((p) => slugify(p.title) === idOrSlug);
    }
    if (!row || row.status !== "published") {
      return json(request, { error: "Not found" }, 404);
    }
    const [data] = await assemble([row]);
    return json(request, { data }, 200, { "Cache-Control": "public, max-age=60" });
  }

  return json(request, { error: "Not found" }, 404);
}
