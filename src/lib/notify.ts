// Server-only: emails the store admin when a new order comes in. Reuses the same
// Resend setup as auth emails. Never throws — a failed notification must not fail
// the order itself.
import { Resend } from "resend";

type OrderItem = { id: string; title: string; qty: number; price: number };

export type OrderNotification = {
  id: string;
  total: number;
  items: OrderItem[];
  customer_name?: string | null;
  customer_email?: string | null;
  address?: string | null;
  city?: string | null;
  postal_code?: string | null;
};

const env: Record<string, string | undefined> = (() => {
  if (typeof process !== "undefined" && typeof process.env !== "undefined") {
    return process.env as Record<string, string | undefined>;
  }
  if (
    typeof import.meta !== "undefined" &&
    typeof (import.meta as { env?: Record<string, string | undefined> }).env !== "undefined"
  ) {
    return (import.meta as { env?: Record<string, string | undefined> }).env!;
  }
  if (
    typeof globalThis !== "undefined" &&
    typeof (globalThis as { env?: Record<string, string | undefined> }).env !== "undefined"
  ) {
    return (globalThis as { env?: Record<string, string | undefined> }).env!;
  }
  return {} as Record<string, string | undefined>;
})();

const escapeHtml = (s: string) =>
  s.replace(
    /[&<>"']/g,
    (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c] ?? c,
  );

export async function notifyNewOrder(order: OrderNotification): Promise<void> {
  const short = order.id.slice(0, 8);
  const shipTo = [order.address, order.city, order.postal_code].filter(Boolean).join(", ");
  const textSummary = [
    `Order #${short}`,
    `Customer: ${order.customer_name ?? "—"} (${order.customer_email ?? "—"})`,
    `Deliver to: ${shipTo || "—"}`,
    "Items:",
    ...order.items.map((i) => `  ${i.qty}× ${i.title} — $${(i.price * i.qty).toFixed(2)}`),
    `Total: $${order.total.toFixed(2)}`,
  ].join("\n");

  const to = env.ADMIN_NOTIFY_EMAIL;
  if (!env.RESEND_API_KEY || !to) {
    // No mail configured (e.g. local dev) — log so the order is still visible.
    console.log(`[order-notify]\n${textSummary}`);
    return;
  }

  try {
    const resend = new Resend(env.RESEND_API_KEY);
    const from = env.RESEND_FROM ?? "BOSBA Premium Foods <onboarding@resend.dev>";
    const rows = order.items
      .map(
        (i) =>
          `<tr><td style="padding:4px 10px">${i.qty}×</td><td style="padding:4px 10px">${escapeHtml(i.title)}</td><td style="padding:4px 10px;text-align:right;white-space:nowrap">$${(i.price * i.qty).toFixed(2)}</td></tr>`,
      )
      .join("");
    const html = `
      <div style="font-family:system-ui,sans-serif;max-width:560px">
        <h2 style="margin:0 0 4px">🛎️ New order #${short}</h2>
        <p style="margin:0 0 16px;color:#555">A new order was just placed.</p>
        <p style="margin:0 0 2px"><strong>Customer:</strong> ${escapeHtml(order.customer_name ?? "—")}</p>
        <p style="margin:0 0 2px"><strong>Email:</strong> ${escapeHtml(order.customer_email ?? "—")}</p>
        <p style="margin:0 0 16px"><strong>Deliver to:</strong> ${escapeHtml(shipTo || "—")}</p>
        <table style="border-collapse:collapse;width:100%;border-top:1px solid #eee">${rows}</table>
        <p style="margin:16px 0 0;font-size:18px"><strong>Total: $${order.total.toFixed(2)}</strong></p>
      </div>`;
    await resend.emails.send({
      from,
      to,
      subject: `🛎️ New order #${short} — $${order.total.toFixed(2)}`,
      html,
    });
  } catch (e) {
    console.error("[order-notify] send failed", e);
    console.log(`[order-notify]\n${textSummary}`);
  }
}
