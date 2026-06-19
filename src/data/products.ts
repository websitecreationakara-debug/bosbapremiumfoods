import { createServerFn } from "@tanstack/react-start";
import { eq, or, asc, desc } from "drizzle-orm";
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
  rating: number | null;
  weight: string | null;
  parent_id: string | null;
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
          .orderBy(asc(products.created_at));
    return rows;
  });

export const getProduct = createServerFn({ method: "GET" })
  .inputValidator((d: { id: string }) => d)
  .handler(async ({ data }) => {
    const [row] = await getDb().select().from(products).where(eq(products.id, data.id));
    return row ?? null;
  });

// All published members of a product's variant family (parent + children),
// resolved from any member id. Ordered cheapest-first so the lightest weight
// leads. Returns [] if the product is unknown.
export const getVariants = createServerFn({ method: "GET" })
  .inputValidator((d: { id: string }) => d)
  .handler(async ({ data }) => {
    const db = getDb();
    const [self] = await db.select().from(products).where(eq(products.id, data.id));
    if (!self) return [];
    const groupId = self.parent_id ?? self.id;
    const rows = await db
      .select()
      .from(products)
      .where(or(eq(products.id, groupId), eq(products.parent_id, groupId)));
    return rows
      .filter((r) => r.status === "published")
      .sort((a, b) => (a.sale_price ?? a.price) - (b.sale_price ?? b.price));
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
