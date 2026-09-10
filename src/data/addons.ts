import { createServerFn } from "@tanstack/react-start";
import { asc, eq } from "drizzle-orm";
import { getDb } from "@/db";
import { addons, addon_collections, addon_collection_items, product_addon_collections } from "@/db/schema";
import { requireManager } from "./_auth";

// ============================================================
// Addons — a small separate catalog (rice, sauce, ikura, ...). Never shown in
// the shop grid/search/sitemap; only ever attached to a product's own page.
// ============================================================

export const listAddons = createServerFn({ method: "GET" }).handler(async () => {
  return getDb().select().from(addons).orderBy(asc(addons.sort_order));
});

export const createAddon = createServerFn({ method: "POST" })
  .inputValidator(
    (d: {
      title: string;
      description?: string | null;
      price: number;
      image_url?: string | null;
      stock?: number | null;
      status?: string;
      sort_order?: number;
    }) => d,
  )
  .handler(async ({ data }) => {
    await requireManager();
    const [row] = await getDb().insert(addons).values(data).returning({ id: addons.id });
    return { id: row.id };
  });

export const updateAddon = createServerFn({ method: "POST" })
  .inputValidator(
    (d: {
      id: string;
      title?: string;
      description?: string | null;
      price?: number;
      image_url?: string | null;
      stock?: number | null;
      status?: string;
      sort_order?: number;
    }) => d,
  )
  .handler(async ({ data }) => {
    await requireManager();
    const { id, ...fields } = data;
    const set = Object.fromEntries(Object.entries(fields).filter(([, v]) => v !== undefined));
    if (Object.keys(set).length === 0) return { ok: true };
    await getDb().update(addons).set(set).where(eq(addons.id, id));
    return { ok: true };
  });

export const deleteAddon = createServerFn({ method: "POST" })
  .inputValidator((d: { id: string }) => d)
  .handler(async ({ data }) => {
    await requireManager();
    await getDb().delete(addons).where(eq(addons.id, data.id));
    return { ok: true };
  });

// ============================================================
// Addon collections — named groups of addons, attached to products as a unit.
// ============================================================

export const listAddonCollections = createServerFn({ method: "GET" }).handler(async () => {
  return getDb().select().from(addon_collections).orderBy(asc(addon_collections.sort_order));
});

export const createAddonCollection = createServerFn({ method: "POST" })
  .inputValidator((d: { title: string; active?: boolean; sort_order?: number }) => d)
  .handler(async ({ data }) => {
    await requireManager();
    const [row] = await getDb()
      .insert(addon_collections)
      .values(data)
      .returning({ id: addon_collections.id });
    return { id: row.id };
  });

export const updateAddonCollection = createServerFn({ method: "POST" })
  .inputValidator((d: { id: string; title?: string; active?: boolean; sort_order?: number }) => d)
  .handler(async ({ data }) => {
    await requireManager();
    const { id, ...fields } = data;
    const set = Object.fromEntries(Object.entries(fields).filter(([, v]) => v !== undefined));
    if (Object.keys(set).length === 0) return { ok: true };
    await getDb().update(addon_collections).set(set).where(eq(addon_collections.id, id));
    return { ok: true };
  });

export const deleteAddonCollection = createServerFn({ method: "POST" })
  .inputValidator((d: { id: string }) => d)
  .handler(async ({ data }) => {
    await requireManager();
    await getDb().delete(addon_collections).where(eq(addon_collections.id, data.id));
    return { ok: true };
  });

// ============================================================
// Addon collection membership (which addons belong to a collection).
// ============================================================

export const listAddonCollectionItems = createServerFn({ method: "GET" }).handler(async () => {
  return getDb().select().from(addon_collection_items);
});

// Replaces a collection's full set of addon members in one call — the admin
// picker always saves the complete checked list, not a diff (same convention
// as setProductCollections).
export const setAddonCollectionItems = createServerFn({ method: "POST" })
  .inputValidator((d: { addonCollectionId: string; addonIds: string[] }) => d)
  .handler(async ({ data }) => {
    await requireManager();
    const db = getDb();
    await db
      .delete(addon_collection_items)
      .where(eq(addon_collection_items.addon_collection_id, data.addonCollectionId));
    if (data.addonIds.length > 0) {
      await db.insert(addon_collection_items).values(
        data.addonIds.map((addon_id) => ({
          addon_collection_id: data.addonCollectionId,
          addon_id,
        })),
      );
    }
    return { ok: true };
  });

// ============================================================
// Product <-> addon collection assignment (which collections a product offers).
// ============================================================

export const listProductAddonCollections = createServerFn({ method: "GET" }).handler(async () => {
  return getDb().select().from(product_addon_collections);
});

// Replaces a product's full set of addon-collection links in one call — same
// convention as setProductCollections in src/data/collections.ts.
export const setProductAddonCollections = createServerFn({ method: "POST" })
  .inputValidator((d: { productId: string; addonCollectionIds: string[] }) => d)
  .handler(async ({ data }) => {
    await requireManager();
    const db = getDb();
    await db
      .delete(product_addon_collections)
      .where(eq(product_addon_collections.product_id, data.productId));
    if (data.addonCollectionIds.length > 0) {
      await db.insert(product_addon_collections).values(
        data.addonCollectionIds.map((addon_collection_id) => ({
          product_id: data.productId,
          addon_collection_id,
        })),
      );
    }
    return { ok: true };
  });

// Public: the addons a product's page should offer, resolved through its
// linked collections and deduped (a product can link to several collections
// that happen to share an addon). Draft/unpublished addons are excluded.
export const getProductAddons = createServerFn({ method: "GET" })
  .inputValidator((d: { productId: string }) => d)
  .handler(async ({ data }) => {
    const rows = await getDb()
      .select({ addon: addons })
      .from(product_addon_collections)
      .innerJoin(
        addon_collection_items,
        eq(addon_collection_items.addon_collection_id, product_addon_collections.addon_collection_id),
      )
      .innerJoin(addons, eq(addons.id, addon_collection_items.addon_id))
      .where(eq(product_addon_collections.product_id, data.productId));

    const seen = new Set<string>();
    const list: (typeof addons.$inferSelect)[] = [];
    for (const r of rows) {
      if (r.addon.status !== "published" || seen.has(r.addon.id)) continue;
      seen.add(r.addon.id);
      list.push(r.addon);
    }
    return list.sort((a, b) => a.sort_order - b.sort_order);
  });
