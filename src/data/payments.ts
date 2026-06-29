import { createServerFn } from "@tanstack/react-start";
import { eq } from "drizzle-orm";
import { getDb } from "@/db";
import { orders } from "@/db/schema";
import { createKhqr, paymentMockMode } from "@/lib/payment";
import { markOrderPaid } from "./orders";

// Generate (or re-use) the KHQR for an awaiting-payment order and return what the
// /pay screen needs to render it. Guest-accessible: orders are addressed by their
// unguessable UUID, and this only ever exposes that order's own payment details.
export const startPayment = createServerFn({ method: "POST" })
  .inputValidator((d: { orderId: string }) => d)
  .handler(async ({ data }) => {
    const db = getDb();
    const [order] = await db.select().from(orders).where(eq(orders.id, data.orderId));
    if (!order) throw new Error("Order not found");
    if (order.payment_method !== "khqr") throw new Error("This order is not paid online");

    if (order.payment_status === "paid") {
      return { status: "paid" as const, amount: order.total, mock: paymentMockMode() };
    }

    const charge = await createKhqr({ orderId: order.id, amount: order.total });
    await db
      .update(orders)
      .set({ payment_ref: charge.ref })
      .where(eq(orders.id, order.id));

    return {
      status: "unpaid" as const,
      qrString: charge.qrString,
      ref: charge.ref,
      amount: order.total,
      mock: charge.mock,
    };
  });

// Polled by the /pay screen until the gateway confirms payment.
export const checkPayment = createServerFn({ method: "GET" })
  .inputValidator((d: { orderId: string }) => d)
  .handler(async ({ data }) => {
    const [order] = await getDb()
      .select({ payment_status: orders.payment_status, total: orders.total })
      .from(orders)
      .where(eq(orders.id, data.orderId));
    if (!order) throw new Error("Order not found");
    return { status: order.payment_status, amount: order.total };
  });

// MOCK ONLY: stands in for PPCBank's payment webhook so the flow is testable
// before the real gateway exists. Disabled the moment real credentials are set —
// production payment confirmation must come from the verified callback.
export const mockPay = createServerFn({ method: "POST" })
  .inputValidator((d: { orderId: string }) => d)
  .handler(async ({ data }) => {
    if (!paymentMockMode()) throw new Error("Mock payment is disabled");
    return markOrderPaid(data.orderId, `MOCK-CONFIRMED-${Date.now()}`);
  });
