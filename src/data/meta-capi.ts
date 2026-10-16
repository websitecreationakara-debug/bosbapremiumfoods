import { createServerFn } from "@tanstack/react-start";
import { getRequest } from "@tanstack/react-start/server";
import { env } from "cloudflare:workers";
import { META_PIXEL_ID } from "@/lib/meta-pixel";
import { getAuth } from "@/lib/auth";

type ViewContentInput = {
  eventId: string;
  contentIds: string[];
  value: number;
  eventSourceUrl: string;
};

type CapiEventInput = {
  eventId: string;
  eventName: string;
  customData: Record<string, unknown>;
  eventSourceUrl: string;
};

// _fbp/_fbc are Meta's own first-party cookies (set by the Pixel snippet /
// ad-click redirect) — forwarded as-is, never hashed, to improve CAPI match
// quality. Not present until the Pixel script has run at least once.
function readCookie(cookieHeader: string, name: string): string | undefined {
  const match = cookieHeader
    .split(";")
    .map((p) => p.trim())
    .find((p) => p.startsWith(`${name}=`));
  return match?.slice(name.length + 1);
}

// The browser Pixel writes _fbc to document.cookie asynchronously on init,
// and our ViewContent/trackButtonClick effects fire fbq("track", ...) and
// this CAPI call back-to-back right after — so on a visitor's very first hit
// from an ad click, the CAPI request can race ahead of that cookie write and
// see no _fbc yet, even though the Pixel itself captured it fine (this is
// exactly what Events Manager's "server is sending an empty fbc" diagnostic
// flags). Meta's documented fallback: when the cookie is missing, derive the
// same value from the fbclid query param instead of relying on cookie timing.
// Format per Meta's spec: fb.<subdomain_index>.<creation_time_ms>.<fbclid>
// (subdomain_index 1 = cookie set on the eTLD+1, true for this site).
function deriveFbc(cookieHeader: string, eventSourceUrl: string): string | undefined {
  const fromCookie = readCookie(cookieHeader, "_fbc");
  if (fromCookie) return fromCookie;

  try {
    const fbclid = new URL(eventSourceUrl).searchParams.get("fbclid");
    return fbclid ? `fb.1.${Date.now()}.${fbclid}` : undefined;
  } catch {
    return undefined;
  }
}

async function sha256Hex(value: string): Promise<string> {
  const digest = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(value));
  return Array.from(new Uint8Array(digest))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

async function hashField(value: string | null | undefined): Promise<string | undefined> {
  if (!value) return undefined;
  const cleaned = value.trim().toLowerCase();
  return cleaned ? await sha256Hex(cleaned) : undefined;
}

function normalizePhone(raw: string | null | undefined): string | undefined {
  if (!raw) return undefined;
  const digits = raw.replace(/\D/g, "");
  return digits || undefined;
}

// Email/phone/name are only legitimately known once a visitor is logged in —
// an anonymous browser has given us nothing yet, and inventing data for them
// would violate Meta's requirement that event data reflect real known facts.
// So this only ever adds fields for a real, authenticated session; anonymous
// traffic is unaffected and keeps relying on fbp/fbc/IP/UA alone.
async function addIdentityUserData(
  userData: Record<string, string>,
  request: Request,
): Promise<void> {
  const session = await getAuth().api.getSession({ headers: request.headers });
  const user = session?.user as
    { id: string; email?: string | null; name?: string | null; phone?: string | null } | undefined;
  if (!user) return;

  const em = await hashField(user.email);
  if (em) userData.em = em;

  const phoneDigits = normalizePhone(user.phone);
  if (phoneDigits) userData.ph = await sha256Hex(phoneDigits);

  if (user.name) {
    const parts = user.name.trim().split(/\s+/);
    const fn = await hashField(parts[0]);
    if (fn) userData.fn = fn;
    if (parts.length > 1) {
      const ln = await hashField(parts.slice(1).join(" "));
      if (ln) userData.ln = ln;
    }
  }

  userData.external_id = await sha256Hex(user.id);
}

// Server-side mirror of the browser Pixel's ViewContent call (see the
// useEffect in product.$id.tsx) — passing the same event_id on both sides
// lets Meta deduplicate the two signals into one verified event instead of
// double-counting or discarding the server-only one. Best-effort: never
// throws, so a dispatch failure can't break the product page.
export const sendViewContentCapiEvent = createServerFn({ method: "POST" })
  .inputValidator((d: ViewContentInput) => d)
  .handler(async ({ data }) => {
    const token = env.META_CAPI_ACCESS_TOKEN;
    if (!token) return;

    const request = getRequest();
    const cookieHeader = request.headers.get("cookie") ?? "";
    const userData: Record<string, string> = {
      client_ip_address: request.headers.get("cf-connecting-ip") ?? "",
      client_user_agent: request.headers.get("user-agent") ?? "",
    };
    const fbp = readCookie(cookieHeader, "_fbp");
    if (fbp) userData.fbp = fbp;
    const fbc = deriveFbc(cookieHeader, data.eventSourceUrl);
    if (fbc) userData.fbc = fbc;
    await addIdentityUserData(userData, request);

    try {
      await fetch(`https://graph.facebook.com/v19.0/${META_PIXEL_ID}/events`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          access_token: token,
          data: [
            {
              event_name: "ViewContent",
              event_time: Math.floor(Date.now() / 1000),
              event_id: data.eventId,
              event_source_url: data.eventSourceUrl,
              action_source: "website",
              user_data: userData,
              custom_data: {
                content_ids: data.contentIds,
                content_type: "product",
                value: data.value,
                currency: "USD",
              },
            },
          ],
        }),
      });
    } catch {
      // best-effort — a CAPI dispatch failure must never break the product page
    }
  });

// Generic server-side mirror for any named Pixel event (standard, e.g.
// AddToCart/Purchase, or custom, e.g. trackButtonClick in product.$id.tsx) —
// same event_id on both sides so Meta dedupes the two into one verified
// event. Best-effort: never throws.
export const sendCapiEvent = createServerFn({ method: "POST" })
  .inputValidator((d: CapiEventInput) => d)
  .handler(async ({ data }) => {
    const token = env.META_CAPI_ACCESS_TOKEN;
    if (!token) return;

    const request = getRequest();
    const cookieHeader = request.headers.get("cookie") ?? "";
    const userData: Record<string, string> = {
      client_ip_address: request.headers.get("cf-connecting-ip") ?? "",
      client_user_agent: request.headers.get("user-agent") ?? "",
    };
    const fbp = readCookie(cookieHeader, "_fbp");
    if (fbp) userData.fbp = fbp;
    const fbc = deriveFbc(cookieHeader, data.eventSourceUrl);
    if (fbc) userData.fbc = fbc;
    await addIdentityUserData(userData, request);

    try {
      await fetch(`https://graph.facebook.com/v19.0/${META_PIXEL_ID}/events`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          access_token: token,
          data: [
            {
              event_name: data.eventName,
              event_time: Math.floor(Date.now() / 1000),
              event_id: data.eventId,
              event_source_url: data.eventSourceUrl,
              action_source: "website",
              user_data: userData,
              custom_data: data.customData,
            },
          ],
        }),
      });
    } catch {
      // best-effort — a CAPI dispatch failure must never break the product page
    }
  });
