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
