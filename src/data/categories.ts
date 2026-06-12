import { createServerFn } from "@tanstack/react-start";
import { asc, eq } from "drizzle-orm";
import { getDb } from "@/db";
import { categories } from "@/db/schema";
import { requireAdmin } from "./_auth";

export const listCategories = createServerFn({ method: "GET" }).handler(async () => {
  return getDb().select().from(categories).orderBy(asc(categories.name));
});

export const createCategory = createServerFn({ method: "POST" })
  .inputValidator((d: { name: string; slug: string; image_url?: string | null }) => d)
  .handler(async ({ data }) => {
    await requireAdmin();
    await getDb().insert(categories).values(data);
    return { ok: true };
  });

export const updateCategory = createServerFn({ method: "POST" })
  .inputValidator((d: { id: string; image_url: string | null }) => d)
  .handler(async ({ data }) => {
    await requireAdmin();
    await getDb()
      .update(categories)
      .set({ image_url: data.image_url })
      .where(eq(categories.id, data.id));
    return { ok: true };
  });

export const deleteCategory = createServerFn({ method: "POST" })
  .inputValidator((d: { id: string }) => d)
  .handler(async ({ data }) => {
    await requireAdmin();
    await getDb().delete(categories).where(eq(categories.id, data.id));
    return { ok: true };
  });
