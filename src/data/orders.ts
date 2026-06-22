import { createServerFn } from "@tanstack/react-start";
import { count, desc, eq } from "drizzle-orm";
import { getDb } from "@/db";
import { orders } from "@/db/schema";
import { notifyNewOrder } from "@/lib/notify";
import { getSessionUser, requireAdmin, requireStaff } from "./_auth";

type OrderItem = { id: string; title: string; qty: number; price: number };

type CreateOrderInput = {
  total: number;
  items: OrderItem[];
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  address: string;
  city: string;
  postal_code: string;
  location_lat?: number | null;
  location_lng?: number | null;
};

const parseItems = (row: typeof orders.$inferSelect) => ({
  ...row,
  items: JSON.parse(row.items || "[]") as OrderItem[],
});

export const listOrders = createServerFn({ method: "GET" }).handler(async () => {
  await requireStaff();
  const rows = await getDb().select().from(orders).orderBy(desc(orders.created_at));
  return rows.map(parseItems);
});

export const createOrder = createServerFn({ method: "POST" })
  .inputValidator((d: CreateOrderInput) => d)
  .handler(async ({ data }) => {
    // Guest checkout: a session is optional. Logged-in orders are stamped with
    // the user id; guest orders carry null and rely on the typed contact fields.
    const user = await getSessionUser();
    const [row] = await getDb()
      .insert(orders)
      .values({
        user_id: user?.id ?? null,
        total: data.total,
        status: "pending",
        items: JSON.stringify(data.items ?? []),
        customer_name: data.customer_name?.trim() || user?.name || null,
        customer_email: data.customer_email?.trim() || user?.email || null,
        customer_phone: data.customer_phone?.trim() || null,
        address: data.address?.trim() || null,
        city: data.city?.trim() || null,
        postal_code: data.postal_code?.trim() || null,
        location_lat: data.location_lat ?? null,
        location_lng: data.location_lng ?? null,
      })
      .returning();

    await notifyNewOrder({
      id: row.id,
      total: row.total,
      items: data.items ?? [],
      customer_name: row.customer_name,
      customer_email: row.customer_email,
      customer_phone: row.customer_phone,
      address: row.address,
      city: row.city,
      postal_code: row.postal_code,
      location_lat: row.location_lat,
      location_lng: row.location_lng,
    });

    return { ok: true, id: row.id };
  });

export const countPendingOrders = createServerFn({ method: "GET" }).handler(async () => {
  await requireStaff();
  const [r] = await getDb().select({ n: count() }).from(orders).where(eq(orders.status, "pending"));
  return r?.n ?? 0;
});

export const updateOrderStatus = createServerFn({ method: "POST" })
  .inputValidator((d: { id: string; status: string }) => d)
  .handler(async ({ data }) => {
    await requireStaff();
    await getDb().update(orders).set({ status: data.status }).where(eq(orders.id, data.id));
    return { ok: true };
  });

export const deleteOrder = createServerFn({ method: "POST" })
  .inputValidator((d: { id: string }) => d)
  .handler(async ({ data }) => {
    await requireAdmin();
    await getDb().delete(orders).where(eq(orders.id, data.id));
    return { ok: true };
  });
