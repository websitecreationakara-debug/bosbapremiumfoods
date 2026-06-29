// Server-only KHQR payment gateway adapter (PPCBank).
//
// MOCK MODE: until PPCBANK_BASE_URL + credentials are set as Worker secrets, the
// gateway is simulated — `createKhqr` returns a placeholder QR payload and no
// real money moves. The customer confirms payment on the /pay screen via the
// `mockPay` server fn, which stands in for the bank's webhook. Once PPCBank's
// integration guide arrives, fill in the two TODO blocks below and set the
// secrets; nothing else in the app needs to change.
import { env } from "cloudflare:workers";

export const paymentMockMode = () => !env.PPCBANK_BASE_URL;

export type KhqrCharge = {
  // The EMVCo KHQR string the customer's bank app scans. In mock mode this is a
  // recognisable placeholder, not a scannable code.
  qrString: string;
  // Gateway transaction reference, stored on the order to match the callback.
  ref: string;
  mock: boolean;
};

type CreateArgs = { orderId: string; amount: number; currency?: "USD" | "KHR" };

export async function createKhqr({
  orderId,
  amount,
  currency = "USD",
}: CreateArgs): Promise<KhqrCharge> {
  if (paymentMockMode()) {
    const ref = `MOCK-${orderId.slice(0, 8)}-${Date.now().toString(36)}`;
    return {
      ref,
      mock: true,
      qrString: `KHQR-MOCK|${currency}|${amount.toFixed(2)}|ref=${ref}`,
    };
  }

  // TODO(PPCBank): POST to `${env.PPCBANK_BASE_URL}/...` with the merchant id +
  // signed payload from their integration guide; return their qrString + ref.
  throw new Error("PPCBank gateway not configured");
}

// Verify an inbound /api/payment/callback is genuinely from PPCBank.
// TODO(PPCBank): implement signature verification per their guide (HMAC/RSA over
// the documented fields). Mock mode never receives real callbacks.
export async function verifyCallback(_request: Request): Promise<boolean> {
  if (paymentMockMode()) return false;
  throw new Error("PPCBank callback verification not configured");
}
