import { createServerFn } from "@tanstack/react-start";
import { eq, desc } from "drizzle-orm";
import { getDb } from "@/db";
import { products } from "@/db/schema";
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
};

export const listProducts = createServerFn({ method: "GET" })
  .inputValidator((d: { all?: boolean } | undefined) => d ?? {})
  .handler(async ({ data }) => {
    const db = getDb();
    const rows = data.all
      ? await db.select().from(products).orderBy(desc(products.created_at))
      : await db
          .select()
          .from(products)
          .where(eq(products.status, "published"))
          .orderBy(desc(products.created_at));
    return rows;
  });

export const createProduct = createServerFn({ method: "POST" })
  .inputValidator((d: ProductInput) => d)
  .handler(async ({ data }) => {
    await requireAdmin();
    await getDb().insert(products).values(data);
    return { ok: true };
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

export const deleteProduct = createServerFn({ method: "POST" })
  .inputValidator((d: { id: string }) => d)
  .handler(async ({ data }) => {
    await requireAdmin();
    await getDb().delete(products).where(eq(products.id, data.id));
    return { ok: true };
  });
