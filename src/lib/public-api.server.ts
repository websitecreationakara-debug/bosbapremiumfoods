import { env } from "cloudflare:workers";
import { eq, asc, desc, inArray } from "drizzle-orm";
import { getDb } from "@/db";
import { products, product_variations, product_images, promotions } from "@/db/schema";
import { applyPromo } from "@/lib/promotions";
import { slugify, isUuid } from "@/lib/utils";
import { notifyPosOfNewProduct, notifyPosOfStockEdit } from "@/lib/pos-sync";

// Public catalog API for consumption by other websites — same D1 database,
// reached over HTTP.
//
//   GET    /api/v1/products                -> list (published only by default;
//                                             `?status=all|draft|<status>` needs
//                                             a write key). Supports `?limit` &
//                                             `?offset`.
//   GET    /api/v1/products/{idOrSlug}      -> one product (UUID or title slug)
//   POST   /api/v1/products                 -> create; body = product fields,
//                                             optional `images[]` / `variations[]`
//   PATCH  /api/v1/products/{id}            -> partial update (same body shape)
//   DELETE /api/v1/products/{id}            -> delete (cascades variations+images)
//
// Every product payload carries its `variations[]` and `images[]`. GET prices
// reflect any live promotion discount, matching the storefront.
//
// Auth: send the key as `x-api-key: <key>` or `Authorization: Bearer <key>`.
//   PUBLIC_API_KEY        — read access (GET). If PUBLIC_API_WRITE_KEY is unset,
//                           this key also grants writes.
//   PUBLIC_API_WRITE_KEY  — write access (POST/PATCH/DELETE). Optional; set it
//                           to keep the read key read-only.
// With neither secret set the API is disabled (503) rather than open.
//
// CORS defaults to `*`; set PUBLIC_API_ALLOWED_ORIGINS (comma-separated) to lock
// it to specific sites.

type ProductRow = typeof products.$inferSelect;
type VariationRow = typeof product_variations.$inferSelect;

type ApiEnv = {
  PUBLIC_API_KEY?: string;
  PUBLIC_API_WRITE_KEY?: string;
  PUBLIC_API_ALLOWED_ORIGINS?: string;
};

const apiEnv = () => env as ApiEnv;

// ---------- CORS + response helpers ----------

function allowedOrigin(request: Request): string {
  const configured = apiEnv().PUBLIC_API_ALLOWED_ORIGINS;
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
    "Access-Control-Allow-Methods": "GET, POST, PATCH, DELETE, OPTIONS",
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
      "Cache-Control": "no-store",
      ...corsHeaders(request),
      ...extra,
    },
  });
}

// ---------- auth ----------

type AuthLevel = "none" | "read" | "write";

function presentedKey(request: Request): string | null {
  const header = request.headers.get("x-api-key");
  if (header) return header;
  const auth = request.headers.get("authorization");
  if (auth?.startsWith("Bearer ")) return auth.slice(7).trim();
  return null;
}

function authLevel(request: Request): AuthLevel {
  const { PUBLIC_API_KEY: readKey, PUBLIC_API_WRITE_KEY: writeKey } = apiEnv();
  const key = presentedKey(request);
  if (!key) return "none";
  if (writeKey && key === writeKey) return "write";
  if (readKey && key === readKey) return writeKey ? "read" : "write";
  return "none";
}

// ---------- promotion pricing (mirrors src/data/products.ts) ----------

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

// `promoPrices` is off for write responses (POST/PATCH echo back the stored
// values, not offer-adjusted ones — same reason the admin editor reads raw).
async function assemble(rows: ProductRow[], promoPrices = true): Promise<ProductPayload[]> {
  if (rows.length === 0) return [];
  const priced = promoPrices ? await withPromoPrices(rows) : rows;
  const ids = priced.map((p) => p.id);
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

  const vars = promoPrices ? await variationsWithPromoPrices(allVariations, priced) : allVariations;

  const varsByProduct = new Map<string, VariationRow[]>();
  for (const v of vars) {
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

  return priced.map((p) => ({
    ...p,
    variations: varsByProduct.get(p.id) ?? [],
    images: imgsByProduct.get(p.id) ?? [],
  }));
}

async function fetchProduct(id: string): Promise<ProductRow | undefined> {
  const [row] = await getDb().select().from(products).where(eq(products.id, id));
  return row;
}

// ---------- input parsing ----------

// Columns a client may set. Everything else on `products` is server-managed
// (id, created_at, updated_at).
const WRITABLE = [
  "title",
  "description",
  "price",
  "sale_price",
  "category_id",
  "stock",
  "status",
  "image_url",
  "badge",
  "rating",
  "weight",
  "pcs",
  "type",
  "sort_order",
  "featured",
  "pre_order",
  "promotion_id",
  "video_url",
] as const;

const NUMERIC = new Set(["price", "sale_price", "stock", "rating", "pcs", "sort_order"]);
const NULLABLE_NUMERIC = new Set(["sale_price", "stock", "rating", "pcs"]);
const INTEGER = new Set(["stock", "pcs", "sort_order"]);
const BOOL = new Set(["featured", "pre_order"]);

function toNum(v: unknown): number | undefined {
  if (typeof v === "number" && Number.isFinite(v)) return v;
  if (typeof v === "string" && v.trim() !== "" && Number.isFinite(Number(v))) return Number(v);
  return undefined;
}

type FieldResult = { fields: Record<string, unknown> } | { error: string };

function buildProductFields(body: Record<string, unknown>, partial: boolean): FieldResult {
  const fields: Record<string, unknown> = {};
  for (const key of WRITABLE) {
    if (!(key in body)) continue;
    const v = body[key];

    if (key === "title") {
      if (typeof v !== "string" || v.trim() === "")
        return { error: "title must be a non-empty string" };
      fields.title = v.trim();
    } else if (key === "status" || key === "type") {
      if (typeof v !== "string" || v.trim() === "")
        return { error: `${key} must be a non-empty string` };
      fields[key] = v.trim();
    } else if (BOOL.has(key)) {
      if (typeof v === "boolean") fields[key] = v;
      else if (v === 0 || v === 1) fields[key] = v === 1;
      else return { error: `${key} must be a boolean` };
    } else if (NUMERIC.has(key)) {
      if (v === null) {
        if (!NULLABLE_NUMERIC.has(key)) return { error: `${key} cannot be null` };
        fields[key] = null;
      } else {
        const n = toNum(v);
        if (n === undefined) return { error: `${key} must be a number` };
        fields[key] = INTEGER.has(key) ? Math.trunc(n) : n;
      }
    } else {
      // nullable text columns
      if (v === null) fields[key] = null;
      else if (typeof v === "string") fields[key] = v;
      else return { error: `${key} must be a string or null` };
    }
  }

  if (!partial && typeof fields.title !== "string") {
    return { error: "title is required" };
  }
  return { fields };
}

async function replaceImages(productId: string, raw: unknown): Promise<string | null> {
  if (!Array.isArray(raw)) return "images must be an array of URL strings";
  const urls: string[] = [];
  for (const u of raw) {
    if (typeof u !== "string") return "images must be an array of URL strings";
    if (u.trim() !== "") urls.push(u.trim());
  }
  const db = getDb();
  await db.delete(product_images).where(eq(product_images.product_id, productId));
  if (urls.length) {
    await db
      .insert(product_images)
      .values(urls.map((url, i) => ({ product_id: productId, url, sort_order: i })));
  }
  return null;
}

// Mirrors saveVariations in src/data/products.ts: update rows carrying an `id`,
// insert new ones, delete any the client dropped. Preserving ids keeps existing
// POS links intact.
async function replaceVariations(productId: string, raw: unknown): Promise<string | null> {
  if (!Array.isArray(raw)) return "variations must be an array";

  type V = {
    id?: string;
    weight: string;
    price: number;
    sale_price: number | null;
    stock: number | null;
    pcs: number | null;
    sort_order: number;
    image_url: string | null;
  };
  const list: V[] = [];

  for (const item of raw) {
    if (!item || typeof item !== "object") return "each variation must be an object";
    const v = item as Record<string, unknown>;
    if (typeof v.weight !== "string" || v.weight.trim() === "")
      return "each variation needs a non-empty weight";

    const price = v.price === undefined ? 0 : toNum(v.price);
    if (price === undefined) return "variation price must be a number";

    const nullableNum = (val: unknown, name: string): number | null | undefined => {
      if (val === undefined || val === null) return null;
      const n = toNum(val);
      if (n === undefined) return undefined;
      return name === "sale_price" ? n : Math.trunc(n);
    };
    const sale_price = nullableNum(v.sale_price, "sale_price");
    if (sale_price === undefined) return "variation sale_price must be a number or null";
    const stock = nullableNum(v.stock, "stock");
    if (stock === undefined) return "variation stock must be a number or null";
    const pcs = nullableNum(v.pcs, "pcs");
    if (pcs === undefined) return "variation pcs must be a number or null";

    if (v.id !== undefined && typeof v.id !== "string")
      return "variation id must be a string when provided";
    if (v.image_url !== undefined && v.image_url !== null && typeof v.image_url !== "string")
      return "variation image_url must be a string or null";

    list.push({
      id: typeof v.id === "string" ? v.id : undefined,
      weight: v.weight.trim(),
      price,
      sale_price,
      stock,
      pcs,
      sort_order: v.sort_order === undefined ? 0 : Math.trunc(toNum(v.sort_order) ?? 0),
      image_url: typeof v.image_url === "string" ? v.image_url : null,
    });
  }

  const db = getDb();
  const existing = await db
    .select({ id: product_variations.id })
    .from(product_variations)
    .where(eq(product_variations.product_id, productId));

  const keepIds = list.map((v) => v.id).filter((id): id is string => !!id);
  const toDelete = existing.filter((e) => !keepIds.includes(e.id)).map((e) => e.id);
  if (toDelete.length)
    await db.delete(product_variations).where(inArray(product_variations.id, toDelete));

  for (const v of list) {
    const row = {
      weight: v.weight,
      price: v.price,
      sale_price: v.sale_price,
      stock: v.stock,
      pcs: v.pcs,
      sort_order: v.sort_order,
      image_url: v.image_url,
    };
    if (v.id) {
      await db.update(product_variations).set(row).where(eq(product_variations.id, v.id));
      if (v.stock != null) await notifyPosOfStockEdit(v.id, v.stock);
    } else {
      await db.insert(product_variations).values({ product_id: productId, ...row });
    }
  }
  return null;
}

// ---------- route handlers ----------

async function handleList(request: Request, url: URL, level: AuthLevel): Promise<Response> {
  const statusParam = url.searchParams.get("status");
  const wantsNonPublished = statusParam && statusParam !== "published";
  if (wantsNonPublished && level !== "write") {
    return json(request, { error: "Write access required to list non-published products" }, 403);
  }

  const limit = Math.min(Math.max(toNum(url.searchParams.get("limit")) ?? 200, 1), 500);
  const offset = Math.max(Math.trunc(toNum(url.searchParams.get("offset")) ?? 0), 0);

  const q = getDb()
    .select()
    .from(products)
    .$dynamic()
    .orderBy(asc(products.sort_order), desc(products.created_at))
    .limit(limit)
    .offset(offset);

  if (!statusParam || statusParam === "published") q.where(eq(products.status, "published"));
  else if (statusParam !== "all") q.where(eq(products.status, statusParam));

  const rows = await q;
  const data = await assemble(rows);
  return json(request, { data, count: data.length, limit, offset });
}

async function handleGetOne(
  request: Request,
  idOrSlug: string,
  level: AuthLevel,
): Promise<Response> {
  const db = getDb();
  let row: ProductRow | undefined;
  if (isUuid(idOrSlug)) {
    [row] = await db.select().from(products).where(eq(products.id, idOrSlug));
  } else {
    const all = await db.select().from(products);
    row = all.find((p) => slugify(p.title) === idOrSlug);
  }
  if (!row) return json(request, { error: "Not found" }, 404);
  if (row.status !== "published" && level !== "write") {
    return json(request, { error: "Not found" }, 404);
  }
  const [data] = await assemble([row]);
  return json(request, { data });
}

async function readJsonBody(request: Request): Promise<Record<string, unknown> | null> {
  try {
    const parsed = await request.json();
    if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) return null;
    return parsed as Record<string, unknown>;
  } catch {
    return null;
  }
}

async function handleCreate(request: Request): Promise<Response> {
  const body = await readJsonBody(request);
  if (!body) return json(request, { error: "Body must be a JSON object" }, 400);

  const built = buildProductFields(body, false);
  if ("error" in built) return json(request, { error: built.error }, 400);

  const db = getDb();
  const [created] = await db
    .insert(products)
    .values(built.fields as typeof products.$inferInsert)
    .returning({ id: products.id });

  if ("images" in body) {
    const err = await replaceImages(created.id, body.images);
    if (err) return json(request, { error: err }, 400);
  }
  if ("variations" in body) {
    const err = await replaceVariations(created.id, body.variations);
    if (err) return json(request, { error: err }, 400);
  }

  const row = await fetchProduct(created.id);
  if (row && row.type !== "variable") {
    await notifyPosOfNewProduct(row.id, row.title, row.price, row.stock);
  }

  const [data] = await assemble(row ? [row] : [], false);
  return json(request, { data }, 201);
}

async function handlePatch(request: Request, id: string): Promise<Response> {
  if (!isUuid(id)) return json(request, { error: "PATCH requires a product id (UUID)" }, 400);
  const existing = await fetchProduct(id);
  if (!existing) return json(request, { error: "Not found" }, 404);

  const body = await readJsonBody(request);
  if (!body) return json(request, { error: "Body must be a JSON object" }, 400);

  const built = buildProductFields(body, true);
  if ("error" in built) return json(request, { error: built.error }, 400);

  const db = getDb();
  if (Object.keys(built.fields).length > 0) {
    await db
      .update(products)
      .set({ ...built.fields, updated_at: new Date().toISOString() })
      .where(eq(products.id, id));
  }

  if ("images" in body) {
    const err = await replaceImages(id, body.images);
    if (err) return json(request, { error: err }, 400);
  }
  if ("variations" in body) {
    const err = await replaceVariations(id, body.variations);
    if (err) return json(request, { error: err }, 400);
  }

  const row = await fetchProduct(id);
  if (row && row.type !== "variable" && "stock" in built.fields && row.stock != null) {
    await notifyPosOfStockEdit(row.id, row.stock);
  }

  const [data] = await assemble(row ? [row] : [], false);
  return json(request, { data });
}

async function handleDelete(request: Request, id: string): Promise<Response> {
  if (!isUuid(id)) return json(request, { error: "DELETE requires a product id (UUID)" }, 400);
  const db = getDb();
  await db.delete(product_variations).where(eq(product_variations.product_id, id));
  await db.delete(product_images).where(eq(product_images.product_id, id));
  const deleted = await db
    .delete(products)
    .where(eq(products.id, id))
    .returning({ id: products.id });
  if (deleted.length === 0) return json(request, { error: "Not found" }, 404);
  return json(request, { data: { id, deleted: true } });
}

// Returns null when the path isn't a public-API route (so the caller can fall
// through to normal app routing).
export async function handlePublicApi(request: Request): Promise<Response | null> {
  const url = new URL(request.url);
  if (!url.pathname.startsWith("/api/v1/")) return null;

  if (request.method === "OPTIONS") {
    return new Response(null, { status: 204, headers: corsHeaders(request) });
  }

  const { PUBLIC_API_KEY: readKey, PUBLIC_API_WRITE_KEY: writeKey } = apiEnv();
  if (!readKey && !writeKey) {
    return json(request, { error: "API not configured" }, 503);
  }

  const level = authLevel(request);
  if (level === "none") return json(request, { error: "Unauthorized" }, 401);

  const isCollection = url.pathname === "/api/v1/products";
  const idMatch = url.pathname.match(/^\/api\/v1\/products\/([^/]+)$/);
  if (!isCollection && !idMatch) return json(request, { error: "Not found" }, 404);

  const isWrite = ["POST", "PATCH", "DELETE"].includes(request.method);
  if (isWrite && level !== "write") {
    return json(request, { error: "Write access required" }, 403);
  }

  try {
    if (isCollection && request.method === "GET") return await handleList(request, url, level);
    if (isCollection && request.method === "POST") return await handleCreate(request);
    if (idMatch && request.method === "GET")
      return await handleGetOne(request, decodeURIComponent(idMatch[1]), level);
    if (idMatch && request.method === "PATCH")
      return await handlePatch(request, decodeURIComponent(idMatch[1]));
    if (idMatch && request.method === "DELETE")
      return await handleDelete(request, decodeURIComponent(idMatch[1]));
    return json(request, { error: "Method not allowed" }, 405);
  } catch (error) {
    console.error("public-api error", error);
    return json(request, { error: "Internal error" }, 500);
  }
}
