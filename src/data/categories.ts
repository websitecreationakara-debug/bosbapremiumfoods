import { createServerFn } from "@tanstack/react-start";
import { asc, eq, isNull } from "drizzle-orm";
import { getDb } from "@/db";
import { categories } from "@/db/schema";
import { requireManager } from "./_auth";

export const listCategories = createServerFn({ method: "GET" }).handler(async () => {
  return getDb().select().from(categories).orderBy(asc(categories.sort_order), asc(categories.created_at));
});

export const createCategory = createServerFn({ method: "POST" })
  .inputValidator(
    (d: { name: string; slug: string; image_url?: string | null; parent_id?: string | null }) => d,
  )
  .handler(async ({ data }) => {
    await requireManager();
    const db = getDb();
    const siblings = await db
      .select({ id: categories.id })
      .from(categories)
      .where(data.parent_id ? eq(categories.parent_id, data.parent_id) : isNull(categories.parent_id));
    await db.insert(categories).values({ ...data, sort_order: siblings.length });
    return { ok: true };
  });

// Reorders siblings (same parent) in one shot: index in `ids` becomes sort_order.
export const reorderCategories = createServerFn({ method: "POST" })
  .inputValidator((d: { ids: string[] }) => d)
  .handler(async ({ data }) => {
    await requireManager();
    const db = getDb();
    await Promise.all(
      data.ids.map((id, i) => db.update(categories).set({ sort_order: i }).where(eq(categories.id, id))),
    );
    return { ok: true };
  });

export const updateCategory = createServerFn({ method: "POST" })
  .inputValidator(
    (d: {
      id: string;
      image_url?: string | null;
      name?: string;
      slug?: string;
      parent_id?: string | null;
    }) => d,
  )
  .handler(async ({ data }) => {
    await requireManager();
    const { id, ...fields } = data;
    const set = Object.fromEntries(Object.entries(fields).filter(([, v]) => v !== undefined));
    if (Object.keys(set).length === 0) return { ok: true };
    await getDb().update(categories).set(set).where(eq(categories.id, id));
    return { ok: true };
  });

export const deleteCategory = createServerFn({ method: "POST" })
  .inputValidator((d: { id: string }) => d)
  .handler(async ({ data }) => {
    await requireManager();
    const db = getDb();
    // Detach any children so they don't dangle, then delete the category.
    await db.update(categories).set({ parent_id: null }).where(eq(categories.parent_id, data.id));
    await db.delete(categories).where(eq(categories.id, data.id));
    return { ok: true };
  });
