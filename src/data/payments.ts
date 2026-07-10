import { createServerFn } from "@tanstack/react-start";
import { eq } from "drizzle-orm";
import { getDb } from "@/db";
import { orders, store_settings } from "@/db/schema";
import { notifyPaymentClaimed } from "@/lib/notify";

// Manual KHQR flow: the /pay screen shows the store's static QR (uploaded in
// admin Settings) and the exact amount; the customer pays in their banking app
// and taps "I have paid". No gateway — a human verifies the transfer.
//
// Guest-accessible: orders are addressed by their unguessable UUID, and these
// only ever expose that order's own payment details.
export const startPayment = createServerFn({ method: "POST" })
  .inputValidator((d: { orderId: string }) => d)
  .handler(async ({ data }) => {
    const db = getDb();
    const [order] = await db.select().from(orders).where(eq(orders.id, data.orderId));
    if (!order) throw new Error("Order not found");
    if (order.payment_method !== "khqr") throw new Error("This order is not paid online");

    const [settings] = await db.select().from(store_settings).limit(1);
    return {
      status: order.payment_status,
      amount: order.total,
      qrImageUrl: settings?.khqr_image_url ?? null,
    };
  });

// Polled by the thank-you page until staff accepts the payment, so the customer
// sees "we're preparing your order" the moment sales confirms the transfer.
export const checkPayment = createServerFn({ method: "GET" })
  .inputValidator((d: { orderId: string }) => d)
  .handler(async ({ data }) => {
    const [order] = await getDb()
      .select({
        payment_status: orders.payment_status,
        status: orders.status,
        total: orders.total,
      })
      .from(orders)
      .where(eq(orders.id, data.orderId));
    if (!order) throw new Error("Order not found");
    return { payment_status: order.payment_status, status: order.status, amount: order.total };
  });

// "I have paid" — mark the payment as claimed and ping the sales team to verify
// the transfer. Idempotent: tapping again won't re-notify or touch a paid order.
export const claimPaid = createServerFn({ method: "POST" })
  .inputValidator((d: { orderId: string }) => d)
  .handler(async ({ data }) => {
    const db = getDb();
    const [order] = await db.select().from(orders).where(eq(orders.id, data.orderId));
    if (!order) throw new Error("Order not found");
    if (order.payment_method !== "khqr") throw new Error("This order is not paid online");
    if (order.payment_status !== "unpaid") return { ok: true };

    await db.update(orders).set({ payment_status: "claimed" }).where(eq(orders.id, data.orderId));

    await notifyPaymentClaimed({
      id: order.id,
      total: order.total,
      items: JSON.parse(order.items || "[]"),
      customer_name: order.customer_name,
      customer_email: order.customer_email,
      customer_phone: order.customer_phone,
      address: order.address,
      city: order.city,
      postal_code: order.postal_code,
      scheduled_at: order.scheduled_at,
    });
    return { ok: true };
  });
