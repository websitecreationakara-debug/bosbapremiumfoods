// Shared between the browser Pixel snippet (routes/__root.tsx) and the
// Conversions API dispatcher (data/meta-capi.ts) — both must target the same
// pixel/dataset for server-side events to attach to the right dataset.
export const META_PIXEL_ID = "557782553161482";

// The Pixel script (connect.facebook.net/.../fbevents.js) loads via an async
// <script> tag and only writes the _fbp cookie once it has actually executed
// `fbq('init', ...)`. Our own fbq("track", ...)/CAPI-dispatch effects can run
// before that happens — e.g. on a fast device, React hydration + the effect
// can beat the async script download — so a CAPI call fired immediately after
// mount sometimes ships with no _fbp even though the browser Pixel captured
// it a moment later. Events Manager's EMQ "fbp" coverage (dropping well below
// 100%) is exactly this race. Poll briefly for the cookie before dispatching
// CAPI; give up after timeoutMs so a blocked/absent Pixel (ad blockers) can't
// stall the event indefinitely.
export function waitForFbp(timeoutMs = 1500): Promise<void> {
  if (typeof document === "undefined") return Promise.resolve();
  const hasFbp = () => /(?:^|; )_fbp=/.test(document.cookie);
  if (hasFbp()) return Promise.resolve();
  return new Promise((resolve) => {
    const start = Date.now();
    const poll = () => {
      if (hasFbp() || Date.now() - start > timeoutMs) {
        resolve();
        return;
      }
      setTimeout(poll, 100);
    };
    poll();
  });
}

// crypto.subtle is identical in the browser and in Cloudflare Workers, so
// these are safe to share between the client (checkout.tsx, hashing form
// input before it ever leaves the browser) and the server (data/meta-capi.ts,
// hashing session data read from the database).
export async function sha256Hex(value: string): Promise<string> {
  const digest = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(value));
  return Array.from(new Uint8Array(digest))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

export async function hashField(value: string | null | undefined): Promise<string | undefined> {
  if (!value) return undefined;
  const cleaned = value.trim().toLowerCase();
  return cleaned ? await sha256Hex(cleaned) : undefined;
}

export function normalizePhone(raw: string | null | undefined): string | undefined {
  if (!raw) return undefined;
  const digits = raw.replace(/\D/g, "");
  return digits || undefined;
}

// Persisted (already-hashed, so no raw PII sits in a cookie) after a guest
// checkout completes — see checkout.tsx. Read back by every CAPI dispatch in
// data/meta-capi.ts and by the inline Pixel snippet in __root.tsx, so a
// returning guest's PageView/ViewContent/AddToCart on a later visit carries
// the same em/ph/fn/ln/ct/country their last order gave us, instead of only
// the one Purchase event ever having that data.
export const RETURNING_GUEST_COOKIE = "_bid";

export type ReturningGuestFields = Partial<
  Record<"em" | "ph" | "fn" | "ln" | "ct" | "country", string>
>;
