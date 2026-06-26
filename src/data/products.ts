import { createServerFn } from "@tanstack/react-start";
import { eq, asc, desc, inArray } from "drizzle-orm";
import { getDb } from "@/db";
import { products, product_variations } from "@/db/schema";
import { slugify, isUuid } from "@/lib/utils";
import { requireAdmin } from "./_auth";

type ProductInput = {
  title: string;
  description: string | null;
  price: number;
  sale_price: number | null;
  category_id: string | null;
  stock: number;
  status: string;
  image_url: string | null;
  badge: string | null;
  rating: number | null;
  weight: string | null;
  pcs: number | null;
  type: string;
};

type VariationInput = {
  id?: string;
  weight: string;
  price: number;
  sale_price: number | null;
  stock: number;
  pcs: number | null;
  sort_order: number;
};

export const listProducts = createServerFn({ method: "GET" })
  .inputValidator((d: { all?: boolean } | undefined) => d ?? {})
  .handler(async ({ data }) => {
    const db = getDb();
    const rows = data.all
      ? await db
          .select()
          .from(products)
          .orderBy(asc(products.sort_order), desc(products.created_at))
      : await db
          .select()
          .from(products)
          .where(eq(products.status, "published"))
          .orderBy(asc(products.sort_order), desc(products.created_at));
    return rows;
  });

// `id` may be a real UUID (old links, admin) or a title-derived slug (pretty
// URLs). UUIDs resolve directly; slugs fall back to a scan since there's no
// slug column on products.
export const getProduct = createServerFn({ method: "GET" })
  .inputValidator((d: { id: string }) => d)
  .handler(async ({ data }) => {
    const db = getDb();
    if (isUuid(data.id)) {
      const [row] = await db.select().from(products).where(eq(products.id, data.id));
      if (row) return row;
    }
    const all = await db.select().from(products);
    return all.find((p) => slugify(p.title) === data.id) ?? null;
  });

// Every variation row across the catalog — small table, fetched once so the
// shop grid can show "from $X" per variable product without N queries.
export const listVariations = createServerFn({ method: "GET" }).handler(async () => {
  return getDb()
    .select()
    .from(product_variations)
    .orderBy(asc(product_variations.sort_order), asc(product_variations.price));
});

// Variations for a single product, cheapest-first within sort order.
export const getVariations = createServerFn({ method: "GET" })
  .inputValidator((d: { productId: string }) => d)
  .handler(async ({ data }) => {
    return getDb()
      .select()
      .from(product_variations)
      .where(eq(product_variations.product_id, data.productId))
      .orderBy(asc(product_variations.sort_order), asc(product_variations.price));
  });

// Replace a product's variations with the supplied set: update existing rows,
// insert new ones, delete any that were removed in the editor.
export const saveVariations = createServerFn({ method: "POST" })
  .inputValidator((d: { productId: string; variations: VariationInput[] }) => d)
  .handler(async ({ data }) => {
    await requireAdmin();
    const db = getDb();
    const existing = await db
      .select({ id: product_variations.id })
      .from(product_variations)
      .where(eq(product_variations.product_id, data.productId));

    const keepIds = data.variations.map((v) => v.id).filter((id): id is string => !!id);
    const toDelete = existing.filter((e) => !keepIds.includes(e.id)).map((e) => e.id);
    if (toDelete.length)
      await db.delete(product_variations).where(inArray(product_variations.id, toDelete));

    for (const v of data.variations) {
      const fields = {
        weight: v.weight,
        price: v.price,
        sale_price: v.sale_price,
        stock: v.stock,
        pcs: v.pcs,
        sort_order: v.sort_order,
      };
      if (v.id)
        await db.update(product_variations).set(fields).where(eq(product_variations.id, v.id));
      else await db.insert(product_variations).values({ product_id: data.productId, ...fields });
    }
    return { ok: true };
  });

export const createProduct = createServerFn({ method: "POST" })
  .inputValidator((d: ProductInput) => d)
  .handler(async ({ data }) => {
    await requireAdmin();
    const [row] = await getDb().insert(products).values(data).returning({ id: products.id });
    return { id: row.id };
  });

export const updateProduct = createServerFn({ method: "POST" })
  .inputValidator((d: ProductInput & { id: string }) => d)
  .handler(async ({ data }) => {
    await requireAdmin();
    const { id, ...rest } = data;
    await getDb()
      .update(products)
      .set({ ...rest, updated_at: new Date().toISOString() })
      .where(eq(products.id, id));
    return { ok: true };
  });

// Persist a new global product order from admin drag-and-drop: sort_order
// becomes each id's position in the array. Ids not passed keep their old value.
export const reorderProducts = createServerFn({ method: "POST" })
  .inputValidator((d: { ids: string[] }) => d)
  .handler(async ({ data }) => {
    await requireAdmin();
    const db = getDb();
    await Promise.all(
      data.ids.map((id, i) =>
        db.update(products).set({ sort_order: i }).where(eq(products.id, id)),
      ),
    );
    return { ok: true };
  });

export const deleteProduct = createServerFn({ method: "POST" })
  .inputValidator((d: { id: string }) => d)
  .handler(async ({ data }) => {
    await requireAdmin();
    const db = getDb();
    await db.delete(product_variations).where(eq(product_variations.product_id, data.id));
    await db.delete(products).where(eq(products.id, data.id));
    return { ok: true };
  });
