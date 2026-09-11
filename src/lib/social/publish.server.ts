import { eq, and, lte } from "drizzle-orm";
import { getDb } from "@/db";
import { social_posts } from "@/db/schema";
import { generateCaptions } from "./captions.server";
import { absoluteImageUrl } from "./env.server";
import {
  PUBLISHERS,
  configuredPlatforms,
  SOCIAL_PLATFORMS,
  type SocialPlatform,
} from "./platforms.server";

export type PublishResult = Record<SocialPlatform | string, { ok: boolean; detail: string }>;

function parseJsonArray(value: string | null): string[] {
  try {
    const parsed = JSON.parse(value ?? "[]");
    return Array.isArray(parsed) ? parsed.filter((v) => typeof v === "string") : [];
  } catch {
    return [];
  }
}

export async function publishPost(postId: string): Promise<PublishResult> {
  const db = getDb();
  const [post] = await db.select().from(social_posts).where(eq(social_posts.id, postId));
  if (!post) throw new Error("Post not found");

  const imageUrls = parseJsonArray(post.image_urls).map(absoluteImageUrl);
  const chosen = parseJsonArray(post.platforms).filter((p): p is SocialPlatform =>
    (SOCIAL_PLATFORMS as string[]).includes(p),
  );
  const platforms = chosen.length > 0 ? chosen : configuredPlatforms();
  if (platforms.length === 0) throw new Error("No platforms selected or configured");

  const captions = await generateCaptions({
    topic: post.topic,
    brief: post.brief,
    hasImage: imageUrls.length > 0,
  });

  const results: PublishResult = {};
  for (const platform of platforms) {
    try {
      results[platform] = {
        ok: true,
        detail: await PUBLISHERS[platform]({ caption: captions[platform], imageUrls }),
      };
    } catch (err) {
      results[platform] = { ok: false, detail: err instanceof Error ? err.message : String(err) };
    }
  }

  const anySuccess = Object.values(results).some((r) => r.ok);
  await db
    .update(social_posts)
    .set({
      status: anySuccess ? "published" : "failed",
      captions: JSON.stringify(captions),
      results: JSON.stringify(results),
      published_at: anySuccess ? new Date().toISOString() : null,
    })
    .where(eq(social_posts.id, postId));

  return results;
}

// Cron entry point (src/server.ts `scheduled`). Publishes every scheduled post
// whose time has passed. Failed posts stay `failed` and are not retried
// automatically — retry from the admin page after fixing the cause.
export async function publishDuePosts(): Promise<{ id: string; results?: PublishResult }[]> {
  const db = getDb();
  const due = await db
    .select({ id: social_posts.id })
    .from(social_posts)
    .where(
      and(
        eq(social_posts.status, "scheduled"),
        lte(social_posts.scheduled_at, new Date().toISOString()),
      ),
    );

  const runs: { id: string; results?: PublishResult }[] = [];
  for (const { id } of due) {
    try {
      runs.push({ id, results: await publishPost(id) });
    } catch (err) {
      console.error(`social publish failed for ${id}`, err);
      await db
        .update(social_posts)
        .set({
          status: "failed",
          results: JSON.stringify({ error: err instanceof Error ? err.message : String(err) }),
        })
        .where(eq(social_posts.id, id));
      runs.push({ id });
    }
  }
  return runs;
}
