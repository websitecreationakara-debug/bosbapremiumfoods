import { createServerFn } from "@tanstack/react-start";
import { desc, eq } from "drizzle-orm";
import { getDb } from "@/db";
import { social_posts } from "@/db/schema";
import { requireManager } from "./_auth";

export type SocialPostInput = {
  product_id: string;
  topic: string; // auto-filled from the product's title, not typed by hand
  brief: string | null; // auto-filled from the product's description + price, plus optional notes
  image_urls: string[]; // chosen from the product's own photos
  platforms: string[]; // subset of facebook | instagram | telegram | tiktok; empty = all configured
  scheduled_at: string; // ISO datetime (UTC)
};

function validateInput(d: SocialPostInput): SocialPostInput {
  if (!d.product_id) throw new Error("A product is required");
  if (!d.topic?.trim()) throw new Error("Topic is required");
  if (d.image_urls.length === 0) throw new Error("Choose at least one photo to post");
  if (!d.scheduled_at || Number.isNaN(Date.parse(d.scheduled_at)))
    throw new Error("A valid schedule time is required");
  return d;
}

export const listSocialPosts = createServerFn({ method: "GET" }).handler(async () => {
  await requireManager();
  return getDb().select().from(social_posts).orderBy(desc(social_posts.scheduled_at));
});

export const createSocialPost = createServerFn({ method: "POST" })
  .inputValidator(validateInput)
  .handler(async ({ data }) => {
    await requireManager();
    await getDb()
      .insert(social_posts)
      .values({
        product_id: data.product_id,
        topic: data.topic.trim(),
        brief: data.brief,
        image_urls: JSON.stringify(data.image_urls),
        platforms: JSON.stringify(data.platforms),
        scheduled_at: data.scheduled_at,
      });
    return { ok: true };
  });

export const updateSocialPost = createServerFn({ method: "POST" })
  .inputValidator((d: SocialPostInput & { id: string }) => ({ ...validateInput(d), id: d.id }))
  .handler(async ({ data }) => {
    await requireManager();
    await getDb()
      .update(social_posts)
      .set({
        product_id: data.product_id,
        topic: data.topic.trim(),
        brief: data.brief,
        image_urls: JSON.stringify(data.image_urls),
        platforms: JSON.stringify(data.platforms),
        scheduled_at: data.scheduled_at,
        // Editing a failed post re-queues it for the next cron run.
        status: "scheduled",
        results: null,
      })
      .where(eq(social_posts.id, data.id));
    return { ok: true };
  });

export const deleteSocialPost = createServerFn({ method: "POST" })
  .inputValidator((d: { id: string }) => d)
  .handler(async ({ data }) => {
    await requireManager();
    await getDb().delete(social_posts).where(eq(social_posts.id, data.id));
    return { ok: true };
  });

// "Post now" from the admin page — same path the cron takes, so it's also the
// way to test the pipeline end-to-end without waiting for the hour.
export const publishSocialPostNow = createServerFn({ method: "POST" })
  .inputValidator((d: { id: string }) => d)
  .handler(async ({ data }) => {
    await requireManager();
    const { publishPost } = await import("@/lib/social/publish.server");
    return publishPost(data.id);
  });
