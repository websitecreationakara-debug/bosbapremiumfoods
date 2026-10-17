// Shared between the browser Pixel snippet (routes/__root.tsx) and the
// Conversions API dispatcher (data/meta-capi.ts) — both must target the same
// pixel/dataset for server-side events to attach to the right dataset.
export const META_PIXEL_ID = "557782553161482";

// The Pixel script (connect.facebook.net/.../fbevents.js) loads via an async
// <script> tag and only writes _fbp/_fbc once it has actually executed
// `fbq('init', ...)`. Our own fbq("track", ...)/CAPI-dispatch effects can run
// before that happens — e.g. on a fast device, React hydration + the effect
// can beat the async script download — so a CAPI call fired immediately after
// mount sometimes ships with no _fbp/_fbc even though the browser Pixel
// captured it a moment later. Events Manager's EMQ "fbp" coverage (dropping
// well below 100%) is exactly this race. _fbc matters even more here: when
// the cookie isn't ready yet, data/meta-capi.ts derives its own fbc from the
// fbclid URL param using the *current* timestamp — a different value than
// the one the Pixel's own cookie will carry once it finally writes (set at
// the moment fbevents.js itself processed the click), so a later event on
// the same visit that reads the real cookie sends a *different* fbc string
// for what should be the same click. Waiting here means we almost always
// pick up the Pixel's authoritative cookie value instead of guessing our own.
// Give up after timeoutMs so a blocked/absent Pixel (ad blockers) can't stall
// the event indefinitely.
export function waitForPixelCookies(timeoutMs = 1500): Promise<void> {
  if (typeof document === "undefined") return Promise.resolve();
  const hasFbp = () => /(?:^|; )_fbp=/.test(document.cookie);
  const hasFbc = () => /(?:^|; )_fbc=/.test(document.cookie);
  const expectsFbc = () => {
    try {
      return new URL(window.location.href).searchParams.has("fbclid");
    } catch {
      return false;
    }
  };
  const ready = () => hasFbp() && (!expectsFbc() || hasFbc());
  if (ready()) return Promise.resolve();
  return new Promise((resolve) => {
    const start = Date.now();
    const poll = () => {
      if (ready() || Date.now() - start > timeoutMs) {
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

// Meta's spec for fn/ln explicitly requires "no punctuation" before hashing
// (e.g. a name like "Sok-Dara" or "O'Brien" must be hashed as "sokdara" /
// "obrien"). Left as plain hashField (lowercase+trim only), an apostrophe or
// hyphen survives into the hash, producing a different SHA-256 than the one
// Meta computes from its own stripped-punctuation copy of the same name —
// so, same failure mode as the unnormalized phone number: the field gets
// sent but silently never matches. Internal spacing (multi-word last names)
// is preserved since the spec only forbids punctuation here, not spaces.
export async function hashName(value: string | null | undefined): Promise<string | undefined> {
  if (!value) return undefined;
  const cleaned = value
    .trim()
    .toLowerCase()
    .replace(/[^\p{L}\p{N}\s]/gu, "")
    .replace(/\s+/g, " ")
    .trim();
  return cleaned ? await sha256Hex(cleaned) : undefined;
}

// ct/st (city/state) have the stricter rule: no punctuation *and* no spaces
// at all before hashing.
export async function hashPlace(value: string | null | undefined): Promise<string | undefined> {
  if (!value) return undefined;
  const cleaned = value
    .trim()
    .toLowerCase()
    .replace(/[^\p{L}\p{N}]/gu, "");
  return cleaned ? await sha256Hex(cleaned) : undefined;
}

// Meta's hashing spec requires the full country code with no leading zero
// (e.g. a US number must be hashed as "1650...", not "0650..."). Customers
// overwhelmingly type their own number the way they read it back home —
// Cambodian mobile numbers as a national-format "012 345 678", no +855 —
// even though the field's placeholder shows the international format. Left
// unfixed, that hashes to a completely different string than the "855..."
// form Meta's own records use for the same person, so the ph field gets
// "sent" (counts toward coverage) but can never actually match. This is a
// Cambodia-only delivery service (see STORE_ADDRESS/ORG_JSON_LD in
// checkout.tsx), so a short number with no country code is safe to assume is
// local and gets 855 prepended; anything already 10+ digits (its own country
// code already included) is left alone.
export function normalizePhone(raw: string | null | undefined): string | undefined {
  if (!raw) return undefined;
  let digits = raw.replace(/\D/g, "");
  if (!digits) return undefined;
  if (digits.startsWith("855")) return digits;
  if (digits.startsWith("0")) digits = digits.slice(1);
  if (digits.length <= 9) digits = "855" + digits;
  return digits;
}

// Persisted (already-hashed, so no raw PII sits in a cookie) after a guest
// checkout completes — see checkout.tsx. Read back by every CAPI dispatch in
// data/meta-capi.ts and by the inline Pixel snippet in __root.tsx, so a
// returning guest's PageView/ViewContent/AddToCart on a later visit carries
// the same em/ph/fn/ln/ct/st/country their last order gave us, instead of
// only the one Purchase event ever having that data.
export const RETURNING_GUEST_COOKIE = "_bid";

export type ReturningGuestFields = Partial<
  Record<"em" | "ph" | "fn" | "ln" | "ct" | "st" | "country", string>
>;
