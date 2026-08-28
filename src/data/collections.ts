import { createServerFn } from "@tanstack/react-start";
import { asc, eq } from "drizzle-orm";
import { getDb } from "@/db";
import { collections, product_collections } from "@/db/schema";
import { requireManager } from "./_auth";

export const listCollections = createServerFn({ method: "GET" }).handler(async () => {
  return getDb().select().from(collections).orderBy(asc(collections.sort_order));
});

export const listProductCollections = createServerFn({ method: "GET" }).handler(async () => {
  return getDb().select().from(product_collections);
});

export const createCollection = createServerFn({ method: "POST" })
  .inputValidator(
    (d: {
      title: string;
      slug: string;
      sub_label?: string | null;
      description?: string | null;
      image_url?: string | null;
      nav_group?: string | null;
      nav_column?: string | null;
      sort_order?: number;
    }) => d,
  )
  .handler(async ({ data }) => {
    await requireManager();
    await getDb().insert(collections).values(data);
    return { ok: true };
  });

export const updateCollection = createServerFn({ method: "POST" })
  .inputValidator(
    (d: {
      id: string;
      title?: string;
      slug?: string;
      sub_label?: string | null;
      description?: string | null;
      image_url?: string | null;
      nav_group?: string | null;
      nav_column?: string | null;
      sort_order?: number;
      active?: boolean;
    }) => d,
  )
  .handler(async ({ data }) => {
    await requireManager();
    const { id, ...fields } = data;
    const set = Object.fromEntries(Object.entries(fields).filter(([, v]) => v !== undefined));
    if (Object.keys(set).length === 0) return { ok: true };
    await getDb().update(collections).set(set).where(eq(collections.id, id));
    return { ok: true };
  });

export const deleteCollection = createServerFn({ method: "POST" })
  .inputValidator((d: { id: string }) => d)
  .handler(async ({ data }) => {
    await requireManager();
    await getDb().delete(collections).where(eq(collections.id, data.id));
    return { ok: true };
  });

// Replaces a product's full set of collection memberships in one call — the
// admin product form always saves the complete checked list, not a diff.
export const setProductCollections = createServerFn({ method: "POST" })
  .inputValidator((d: { productId: string; collectionIds: string[] }) => d)
  .handler(async ({ data }) => {
    await requireManager();
    const db = getDb();
    await db.delete(product_collections).where(eq(product_collections.product_id, data.productId));
    if (data.collectionIds.length > 0) {
      await db
        .insert(product_collections)
        .values(data.collectionIds.map((collection_id) => ({ product_id: data.productId, collection_id })));
    }
    return { ok: true };
  });
