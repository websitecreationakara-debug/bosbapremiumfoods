import { createServerFn } from "@tanstack/react-start";
import { getRequest } from "@tanstack/react-start/server";
import { env } from "cloudflare:workers";
import { META_PIXEL_ID } from "@/lib/meta-pixel";

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
    const fbc = readCookie(cookieHeader, "_fbc");
    if (fbc) userData.fbc = fbc;

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
    const fbc = readCookie(cookieHeader, "_fbc");
    if (fbc) userData.fbc = fbc;

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
