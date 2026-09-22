// Client-side image downscale + re-encode so large photos fit under the D1 BLOB
// limit (2 MB hard cap). Runs in the browser before upload. SVG/GIF pass through
// untouched (vector / animation would be ruined by canvas re-encoding).

type CompressOpts = { maxDim?: number; targetBytes?: number };

export async function compressImage(file: File, opts: CompressOpts = {}): Promise<File> {
  if (!file.type.startsWith("image/")) return file;
  if (file.type === "image/svg+xml" || file.type === "image/gif") return file;

  const maxDim = opts.maxDim ?? 1600;
  const targetBytes = opts.targetBytes ?? 1_200_000;

  const bitmap = await createImageBitmap(file).catch(() => null);
  if (!bitmap) return file;

  const scale = Math.min(1, maxDim / Math.max(bitmap.width, bitmap.height));
  const width = Math.round(bitmap.width * scale);
  const height = Math.round(bitmap.height * scale);

  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d");
  if (!ctx) return file;
  ctx.drawImage(bitmap, 0, 0, width, height);
  bitmap.close?.();

  const encode = (type: string, q: number) =>
    new Promise<Blob | null>((res) => canvas.toBlob(res, type, q));

  let quality = 0.85;
  let blob = await encode("image/webp", quality);
  let ext = "webp";
  let type = "image/webp";

  // Some browsers can't encode webp from canvas — fall back to jpeg.
  if (!blob) {
    blob = await encode("image/jpeg", quality);
    ext = "jpg";
    type = "image/jpeg";
  }
  if (!blob) return file;

  while (blob.size > targetBytes && quality > 0.4) {
    quality -= 0.15;
    blob = (await encode(type, quality)) ?? blob;
  }

  // If re-encoding didn't actually shrink it (already-optimized small file), keep the original.
  if (blob.size >= file.size) return file;

  const base = file.name.includes(".") ? file.name.slice(0, file.name.lastIndexOf(".")) : file.name;
  return new File([blob], `${base}.${ext}`, { type });
}

// Facebook/social link-preview cards render a ~1.91:1 landscape image; our
// storefront product photos are square (aspect-square cards/gallery), so
// feeding Facebook the raw square photo gets it center-cropped or shown as a
// small thumbnail instead of the full card. This pads the square photo onto a
// 1200x630 canvas (blurred cover copy behind, full photo "contain"-fit on
// top) so the whole image stays visible with no crop.
export async function letterboxImage(sourceUrl: string): Promise<File | null> {
  const W = 1200;
  const H = 630;

  const res = await fetch(sourceUrl).catch(() => null);
  if (!res?.ok) return null;
  const bitmap = await createImageBitmap(await res.blob()).catch(() => null);
  if (!bitmap) return null;

  const canvas = document.createElement("canvas");
  canvas.width = W;
  canvas.height = H;
  const ctx = canvas.getContext("2d");
  if (!ctx) return null;

  // Blurred, cropped-to-fill backdrop so the letterbox bars aren't flat color.
  const coverScale = Math.max(W / bitmap.width, H / bitmap.height);
  const coverW = bitmap.width * coverScale;
  const coverH = bitmap.height * coverScale;
  ctx.filter = "blur(24px) brightness(0.85)";
  ctx.drawImage(bitmap, (W - coverW) / 2, (H - coverH) / 2, coverW, coverH);
  ctx.filter = "none";

  // Full photo, uncropped, centered on top.
  const containScale = Math.min(W / bitmap.width, H / bitmap.height);
  const w = bitmap.width * containScale;
  const h = bitmap.height * containScale;
  ctx.drawImage(bitmap, (W - w) / 2, (H - h) / 2, w, h);
  bitmap.close?.();

  const blob = await new Promise<Blob | null>((r) => canvas.toBlob(r, "image/jpeg", 0.85));
  if (!blob) return null;
  return new File([blob], "social.jpg", { type: "image/jpeg" });
}
