import { env } from "cloudflare:workers";

// Social-posting secrets are set via `wrangler secret put` and are not part of
// worker-configuration.d.ts, hence the loose read.
export function socialEnv(name: string): string | undefined {
  return (env as unknown as Record<string, string | undefined>)[name];
}

export function requireSocialEnv(name: string): string {
  const value = socialEnv(name);
  if (!value) throw new Error(`${name} not configured`);
  return value;
}

export const SITE_URL = "https://bosbapremiumfoods.com";

// Image URLs are stored as the media library's site-relative /media/... paths;
// every platform needs an absolute, publicly fetchable URL.
export function absoluteImageUrl(url: string): string {
  return url.startsWith("http") ? url : `${SITE_URL}${url.startsWith("/") ? "" : "/"}${url}`;
}
