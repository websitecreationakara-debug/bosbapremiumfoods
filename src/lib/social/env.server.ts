import { slugify } from "@/lib/utils";

export const SITE_URL = "https://bosbapremiumfoods.com";

// Image URLs are stored as the media library's site-relative /media/... paths;
// every platform needs an absolute, publicly fetchable URL.
export function absoluteImageUrl(url: string): string {
  return url.startsWith("http") ? url : `${SITE_URL}${url.startsWith("/") ? "" : "/"}${url}`;
}

// Same slug-or-id pattern the storefront's own product page URL/canonical
// link uses (src/routes/_store/product.$id.tsx) — getProduct's loader
// accepts either.
export function productUrl(title: string, id: string): string {
  return `${SITE_URL}/product/${slugify(title) || id}`;
}
