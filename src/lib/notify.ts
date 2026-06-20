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

  // Fan out to every configured channel; one failing must not block the others or the order.
  const results = await Promise.allSettled([
    sendTelegram(textSummary),
    sendEmail(order, short, shipTo),
  ]);
  if (results.every((r) => r.status === "fulfilled" && r.value === "skipped")) {
    // Nothing configured (e.g. local dev) — log so the order is still visible.
    console.log(`[order-notify]\n${textSummary}`);
  }
}

async function sendTelegram(text: string): Promise<"sent" | "skipped"> {
  const token = env.TELEGRAM_BOT_TOKEN;
  const chatId = env.TELEGRAM_CHAT_ID;
  if (!token || !chatId) return "skipped";
  try {
    const res = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        chat_id: chatId,
        text: `🛎️ New order\n\n${text}`,
        disable_web_page_preview: true,
      }),
    });
    if (!res.ok) console.error("[order-notify] telegram failed", res.status, await res.text());
  } catch (e) {
    console.error("[order-notify] telegram error", e);
  }
  return "sent";
}

async function sendEmail(
  order: OrderNotification,
  short: string,
  shipTo: string,
): Promise<"sent" | "skipped"> {
  const to = (env.ADMIN_NOTIFY_EMAIL ?? "")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
  if (!env.RESEND_API_KEY || to.length === 0) return "skipped";
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
    console.error("[order-notify] email failed", e);
  }
  return "sent";
}
