// Instagram and TikTok have no web "share this link" intent — the only real
// way to reach them from a browser is the OS share sheet via navigator.share,
// which is mobile-only and requires a user gesture (can't be called ahead of time).
export function canNativeShare(): boolean {
  return typeof navigator !== "undefined" && typeof navigator.share === "function";
}

export async function nativeShare(data: { title: string; url: string }): Promise<boolean> {
  try {
    await navigator.share(data);
    return true;
  } catch (err) {
    // AbortError just means the user closed the share sheet — not a failure.
    if (err instanceof Error && err.name === "AbortError") return true;
    return false;
  }
}

export function facebookShareUrl(url: string): string {
  return `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;
}

export async function copyLink(url: string): Promise<void> {
  await navigator.clipboard.writeText(url);
}
