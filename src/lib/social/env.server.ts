export const SITE_URL = "https://bosbapremiumfoods.com";

// Image URLs are stored as the media library's site-relative /media/... paths;
// every platform needs an absolute, publicly fetchable URL.
export function absoluteImageUrl(url: string): string {
  return url.startsWith("http") ? url : `${SITE_URL}${url.startsWith("/") ? "" : "/"}${url}`;
}
