// Server-only KHQR adapter using the NBC Bakong Open API against a personal
// (individual, non-merchant) Bakong account — see BAKONG_ACCOUNT_ID etc.
//
// Unlike src/lib/payment.ts (PPCBank's hosted-page gateway), KHQR generation
// here is fully local: `generateIndividual` builds a standards-compliant EMV
// QR string offline, no API call. The only network call is afterwards, to ask
// Bakong's ledger whether a transfer matching the QR's content-hash cleared.
//
// MOCK MODE: until BAKONG_TOKEN + BAKONG_ACCOUNT_ID are set as Worker secrets,
// the gateway is simulated the same way src/lib/payment.ts is.
import { env } from "cloudflare:workers";
// bakong-khqr is CommonJS-only; a static import lets Vite's CJS interop
// bundle it correctly. A dynamic createRequire()/require() call instead
// resolves at runtime, which the Workers module loader can't do — it treats
// the bare specifier as a path relative to this file and 404s.
import bakongKhqrPkg from "bakong-khqr";

const { BakongKHQR, khqrData, IndividualInfo } = bakongKhqrPkg as unknown as {
  BakongKHQR: new () => { generateIndividual: (info: unknown) => KhqrGenResult };
  khqrData: { currency: { usd: number; khr: number } };
  IndividualInfo: new (
    accountId: string,
    name: string,
    city: string,
    optional: Record<string, unknown>,
  ) => unknown;
};

type KhqrGenResult = {
  status: { code: number; errorCode: number | null; message: string | null };
  data: { qr: string; md5: string } | null;
};

const BASE_URL = "https://api-bakong.nbc.gov.kh";

export const bakongMockMode = () => !env.BAKONG_TOKEN || !env.BAKONG_ACCOUNT_ID;

async function bakongFetch<T>(path: string, body: unknown, useToken = true) {
  const res = await fetch(`${BASE_URL}${path}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(useToken ? { Authorization: `Bearer ${env.BAKONG_TOKEN}` } : {}),
    },
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error(`Bakong ${path} HTTP ${res.status}`);
  return (await res.json()) as {
    responseCode: number;
    responseMessage: string;
    errorCode: number | null;
    data: T | null;
  };
}

export type KhqrCharge = {
  qrString?: string;
  ref: string; // md5 of the QR — used to look the payment up
  mock: boolean;
  // ISO timestamp the QR stops being valid. Undefined in mock mode (no real
  // expiration to track).
  expiresAt?: string;
};

type ExistingCharge = { ref: string; qrString: string; expiresAt: string | null };

type CreateArgs = {
  orderId: string;
  amount: number;
  // An already-issued charge for this order, if any — reused verbatim rather
  // than regenerated (see the payment_qr column comment in db/schema.ts),
  // unless it's already past its own expiresAt.
  existing?: ExistingCharge | null;
  currency?: "USD" | "KHR";
  expireMinutes?: number;
};

export async function createBakongKhqr({
  orderId,
  amount,
  existing,
  currency = "USD",
  expireMinutes = 3,
}: CreateArgs): Promise<KhqrCharge> {
  if (existing && (!existing.expiresAt || new Date(existing.expiresAt).getTime() > Date.now())) {
    return {
      ref: existing.ref,
      mock: existing.ref.startsWith("mock:"),
      qrString: existing.qrString,
      expiresAt: existing.expiresAt ?? undefined,
    };
  }

  const billNumber = orderId.slice(0, 8).toUpperCase();

  if (bakongMockMode()) {
    return {
      ref: `mock:${billNumber}`,
      mock: true,
      qrString: `KHQR-MOCK|${currency}|${amount.toFixed(2)}|ref=${billNumber}`,
    };
  }

  const expiresAt = new Date(Date.now() + expireMinutes * 60 * 1000);
  const individualInfo = new IndividualInfo(
    // bakongMockMode() above already guarantees this is set.
    env.BAKONG_ACCOUNT_ID as string,
    env.BAKONG_ACCOUNT_NAME ?? "BOSBA Premium Foods",
    env.BAKONG_ACCOUNT_CITY ?? "Phnom Penh",
    {
      currency: currency === "KHR" ? khqrData.currency.khr : khqrData.currency.usd,
      amount,
      billNumber,
      storeLabel: "BOSBA Premium Foods",
      expirationTimestamp: expiresAt.getTime(),
    },
  );

  const khqr = new BakongKHQR();
  const result = khqr.generateIndividual(individualInfo);
  if (result.status.code !== 0 || !result.data) {
    throw new Error(`Bakong KHQR generation failed: ${result.status.message ?? result.status.errorCode}`);
  }
  return {
    ref: result.data.md5,
    mock: false,
    qrString: result.data.qr,
    expiresAt: expiresAt.toISOString(),
  };
}

// Poll a charge's status by the QR's md5. Mock mode never reaches here.
export async function retrieveBakongPaymentResult(
  md5: string,
): Promise<{ paid: boolean; referenceNo?: string }> {
  const r = await bakongFetch<{
    hash: string;
    fromAccountId: string;
    toAccountId: string;
    currency: string;
    amount: number;
    externalRef?: string;
  }>("/v1/check_transaction_by_md5", { md5 });

  // responseCode 0 = found (paid). errorCode 1 = not found yet (still
  // waiting) — the common, expected case while polling. errorCode 17 = daily
  // request quota exhausted (100/day on a personal-account token) — surfaced
  // distinctly rather than swallowed as "not paid yet", since that would
  // otherwise look identical to a genuinely unpaid order forever.
  if (r.errorCode === 17) {
    throw new Error("Bakong daily API quota exceeded — payment status can't be checked until it resets.");
  }
  if (r.responseCode === 0 && r.data) {
    return { paid: true, referenceNo: r.data.externalRef || r.data.hash };
  }
  return { paid: false };
}
