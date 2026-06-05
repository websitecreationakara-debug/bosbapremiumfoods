import { createServerFn } from "@tanstack/react-start";
import { desc, eq } from "drizzle-orm";
import { getDb } from "@/db";
import { orders } from "@/db/schema";
import { requireAdmin, requireUser } from "./_auth";

type OrderItem = { id: string; title: string; qty: number; price: number };

const parseItems = (row: typeof orders.$inferSelect) => ({
  ...row,
  items: JSON.parse(row.items || "[]") as OrderItem[],
});

export const listOrders = createServerFn({ method: "GET" }).handler(async () => {
  await requireAdmin();
  const rows = await getDb().select().from(orders).orderBy(desc(orders.created_at));
  return rows.map(parseItems);
});

export const createOrder = createServerFn({ method: "POST" })
  .inputValidator((d: { total: number; items: OrderItem[] }) => d)
  .handler(async ({ data }) => {
    const user = await requireUser();
    await getDb()
      .insert(orders)
      .values({
        user_id: user.id,
        total: data.total,
        status: "pending",
        items: JSON.stringify(data.items ?? []),
      });
    return { ok: true };
  });

export const updateOrderStatus = createServerFn({ method: "POST" })
  .inputValidator((d: { id: string; status: string }) => d)
  .handler(async ({ data }) => {
    await requireAdmin();
    await getDb().update(orders).set({ status: data.status }).where(eq(orders.id, data.id));
    return { ok: true };
  });
