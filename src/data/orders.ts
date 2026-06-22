import { createServerFn } from "@tanstack/react-start";
import { count, desc, eq, inArray } from "drizzle-orm";
import { getDb } from "@/db";
import { orders, products, product_variations, store_settings } from "@/db/schema";
import { notifyNewOrder } from "@/lib/notify";
import { getSessionUser, requireAdmin, requireStaff } from "./_auth";

type OrderItem = { id: string; title: string; qty: number; price: number };

// Order line ids are either a simple product id or a product_variation id.
type CreateOrderInput = {
  items: { id: string; title: string; qty: number }[];
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  address: string;
  city: string;
  location_lat?: number | null;
  location_lng?: number | null;
};

// Flat-rate shipping below the free-delivery threshold (kept in sync with the
// store-front summary in checkout.tsx).
const SHIPPING_FEE = 4.99;

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
    const db = getDb();

    const rawItems = Array.isArray(data.items) ? data.items : [];
    if (rawItems.length === 0) throw new Error("Your cart is empty");

    // SECURITY: never trust client-sent prices or totals. Re-price every line
    // from the DB (matching either a simple product or a variation id) and
    // recompute the total + shipping server-side.
    const ids = rawItems.map((i) => i.id).filter(Boolean);
    const [prodRows, varRows, settingsRow] = await Promise.all([
      db
        .select({ id: products.id, price: products.price, sale_price: products.sale_price })
        .from(products)
        .where(inArray(products.id, ids)),
      db
        .select({
          id: product_variations.id,
          price: product_variations.price,
          sale_price: product_variations.sale_price,
        })
        .from(product_variations)
        .where(inArray(product_variations.id, ids)),
      db.select().from(store_settings).limit(1),
    ]);

    const priceById = new Map<string, number>();
    for (const p of prodRows) priceById.set(p.id, p.sale_price ?? p.price);
    for (const v of varRows) priceById.set(v.id, v.sale_price ?? v.price);

    const items: OrderItem[] = rawItems.map((i) => {
      const price = priceById.get(i.id);
      if (price == null) throw new Error("One or more items are no longer available");
      const qty = Math.floor(Number(i.qty));
      if (!Number.isFinite(qty) || qty < 1 || qty > 999) throw new Error("Invalid quantity");
      return { id: i.id, title: String(i.title ?? "").slice(0, 200), qty, price };
    });

    const subtotal = items.reduce((sum, i) => sum + i.price * i.qty, 0);
    const threshold = Number(settingsRow?.free_shipping_threshold ?? 50);
    const shipping = subtotal >= threshold || subtotal === 0 ? 0 : SHIPPING_FEE;
    const total = Math.round((subtotal + shipping) * 100) / 100;

    const [row] = await db
      .insert(orders)
      .values({
        user_id: user?.id ?? null,
        total,
        status: "pending",
        items: JSON.stringify(items),
        customer_name: data.customer_name?.trim() || user?.name || null,
        customer_email: data.customer_email?.trim() || user?.email || null,
        customer_phone: data.customer_phone?.trim() || null,
        address: data.address?.trim() || null,
        city: data.city?.trim() || null,
        location_lat: data.location_lat ?? null,
        location_lng: data.location_lng ?? null,
      })
      .returning();

    await notifyNewOrder({
      id: row.id,
      total: row.total,
      items,
      customer_name: row.customer_name,
      customer_email: row.customer_email,
      customer_phone: row.customer_phone,
      address: row.address,
      city: row.city,
      postal_code: row.postal_code,
      location_lat: row.location_lat,
      location_lng: row.location_lng,
    });

    return { ok: true, id: row.id, total };
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
