import { createServerFn } from "@tanstack/react-start";
import { eq } from "drizzle-orm";
import { getDb } from "@/db";
import { orders } from "@/db/schema";
import { bakongMockMode, createBakongKhqr, retrieveBakongPaymentResult } from "@/lib/bakong";
import { markOrderPaid } from "./orders";

// Generate (or re-use) the KHQR for an awaiting-payment order and return what the
// /pay screen needs. Guest-accessible: orders are addressed by their unguessable
// UUID, and this only ever exposes that order's own payment details.
//
// A previously-issued QR is re-served as-is (see the payment_qr column
// comment) rather than regenerated on every load.
export const startPayment = createServerFn({ method: "POST" })
  .inputValidator((d: { orderId: string }) => d)
  .handler(async ({ data }) => {
    const db = getDb();
    const [order] = await db.select().from(orders).where(eq(orders.id, data.orderId));
    if (!order) throw new Error("Order not found");
    if (order.payment_method !== "khqr") throw new Error("This order is not paid online");

    if (order.payment_status === "paid") {
      return { status: "paid" as const, amount: order.total, mock: bakongMockMode() };
    }

    const existing =
      order.payment_ref && order.payment_qr
        ? { ref: order.payment_ref, qrString: order.payment_qr }
        : null;
    const charge = await createBakongKhqr({ orderId: order.id, amount: order.total, existing });
    if (!existing) {
      await db
        .update(orders)
        .set({ payment_ref: charge.ref, payment_qr: charge.qrString })
        .where(eq(orders.id, order.id));
    }

    return {
      status: "unpaid" as const,
      qrString: charge.qrString,
      ref: charge.ref,
      amount: order.total,
      mock: charge.mock,
    };
  });

// Polled by the /pay screen until payment confirms. In real mode this asks
// Bakong (check_transaction_by_md5) and flips the order to paid on
// confirmation; in mock mode it just reflects the DB status (set by mockPay).
export const checkPayment = createServerFn({ method: "GET" })
  .inputValidator((d: { orderId: string }) => d)
  .handler(async ({ data }) => {
    const [order] = await getDb()
      .select({
        payment_status: orders.payment_status,
        payment_method: orders.payment_method,
        payment_ref: orders.payment_ref,
        total: orders.total,
      })
      .from(orders)
      .where(eq(orders.id, data.orderId));
    if (!order) throw new Error("Order not found");

    if (
      !bakongMockMode() &&
      order.payment_method === "khqr" &&
      order.payment_status !== "paid" &&
      order.payment_ref
    ) {
      const result = await retrieveBakongPaymentResult(order.payment_ref);
      if (result.paid) {
        await markOrderPaid(data.orderId, result.referenceNo ?? order.payment_ref);
        return { status: "paid" as const, amount: order.total };
      }
    }

    return { status: order.payment_status, amount: order.total };
  });

// MOCK ONLY: stands in for a real settlement so the flow is testable before the
// gateway is connected. Disabled the moment real credentials are set.
export const mockPay = createServerFn({ method: "POST" })
  .inputValidator((d: { orderId: string }) => d)
  .handler(async ({ data }) => {
    if (!bakongMockMode()) throw new Error("Mock payment is disabled");
    return markOrderPaid(data.orderId, `MOCK-CONFIRMED-${Date.now()}`);
  });
