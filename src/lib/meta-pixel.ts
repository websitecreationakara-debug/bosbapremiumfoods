declare global {
  interface Window {
    fbq?: (...args: unknown[]) => void;
  }
}

// Fires a custom Meta Pixel event whenever a "shop" CTA is clicked, tagged with
// which section/page it lives in so click volume can be broken out per section
// in Events Manager.
export function trackShopButtonClick(section: string) {
  if (typeof window === "undefined" || typeof window.fbq !== "function") return;
  window.fbq("trackCustom", "ShopButtonClick", { section });
}
