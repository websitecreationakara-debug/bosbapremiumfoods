import { createServerFn } from "@tanstack/react-start";
import { env } from "cloudflare:workers";
import { desc, eq } from "drizzle-orm";
import { getDb } from "@/db";
import { media } from "@/db/schema";
import { requireAdmin } from "./_auth";

const MAX_BYTES = 5 * 1024 * 1024;

export const listMedia = createServerFn({ method: "GET" }).handler(async () => {
  return getDb().select().from(media).orderBy(desc(media.created_at));
});

export const uploadMedia = createServerFn({ method: "POST" })
  .inputValidator((d: FormData) => {
    if (!(d instanceof FormData)) throw new Error("Expected multipart form data");
    return d;
  })
  .handler(async ({ data }) => {
    await requireAdmin();
    const file = data.get("file");
    if (!(file instanceof File)) throw new Error("No file provided");
    if (!file.type.startsWith("image/")) throw new Error("Only image files are allowed");
    if (file.size > MAX_BYTES) throw new Error("Image must be 5 MB or smaller");

    const ext = file.name.includes(".") ? file.name.split(".").pop() : "bin";
    const key = `${crypto.randomUUID()}.${ext}`;
    await env.MEDIA.put(key, await file.arrayBuffer(), {
      httpMetadata: { contentType: file.type },
    });

    const url = `/media/${key}`;
    await getDb().insert(media).values({
      key,
      url,
      filename: file.name,
      content_type: file.type,
      size: file.size,
    });
    return { url, key };
  });

export const deleteMedia = createServerFn({ method: "POST" })
  .inputValidator((d: { id: string }) => d)
  .handler(async ({ data }) => {
    await requireAdmin();
    const db = getDb();
    const [row] = await db.select().from(media).where(eq(media.id, data.id));
    if (!row) return { ok: true };
    await env.MEDIA.delete(row.key);
    await db.delete(media).where(eq(media.id, data.id));
    return { ok: true };
  });
