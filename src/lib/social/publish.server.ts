import { eq, and, lte, asc } from "drizzle-orm";
import { getDb } from "@/db";
import { social_posts, social_connections, products, product_variations } from "@/db/schema";
import { priceRangeText } from "@/lib/variants";
import { buildCaptions, type Captions } from "./captions.server";
import { absoluteImageUrl, productUrl } from "./env.server";
import {
  PUBLISHERS,
  configuredPlatforms,
  SOCIAL_PLATFORMS,
  type SocialCredentials,
  type SocialPlatform,
} from "./platforms.server";

export type PublishResult = Record<SocialPlatform | string, { ok: boolean; detail: string }>;

const EMPTY_CREDS: SocialCredentials = {
  fb_page_id: null,
  fb_page_access_token: null,
  ig_user_id: null,
  telegram_bot_token: null,
  telegram_channel_id: null,
  tiktok_access_token: null,
  tiktok_privacy: "SELF_ONLY",
  threads_user_id: null,
  threads_access_token: null,
};

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

  const [connections] = await db
    .select()
    .from(social_connections)
    .where(eq(social_connections.id, "default"));
  const creds: SocialCredentials = connections ?? EMPTY_CREDS;

  const imageUrls = parseJsonArray(post.image_urls).map(absoluteImageUrl);
  const chosen = parseJsonArray(post.platforms).filter((p): p is SocialPlatform =>
    (SOCIAL_PLATFORMS as string[]).includes(p),
  );
  const platforms = chosen.length > 0 ? chosen : configuredPlatforms(creds);
  if (platforms.length === 0)
    throw new Error("No platforms selected, or none are connected yet — see Social Connections");

  // Built from the product's *current* description/tabs/price (not what was
  // captured at schedule time), so an edit or a price change before the post
  // goes out is reflected automatically. If the product was since deleted,
  // fall back to the topic/note captured when the post was scheduled.
  const [product] = post.product_id
    ? await db.select().from(products).where(eq(products.id, post.product_id))
    : [];
  // A variable product's own price/stock columns are unused placeholders —
  // its real prices live per-variation, so only fetch variations for those.
  const variations =
    product?.type === "variable"
      ? await db
          .select()
          .from(product_variations)
          .where(eq(product_variations.product_id, product.id))
      : [];
  const captions: Captions = product
    ? buildCaptions({
        title: product.title,
        description: product.description,
        priceText: priceRangeText(product, variations),
        productId: product.id,
        note: post.brief,
      })
    : {
        facebook: [post.topic, post.brief].filter(Boolean).join("\n\n"),
        instagram: [post.topic, post.brief].filter(Boolean).join("\n\n"),
        telegram: [post.topic, post.brief].filter(Boolean).join("\n\n"),
        tiktok: [post.topic, post.brief].filter(Boolean).join("\n\n"),
        threads: [post.topic, post.brief].filter(Boolean).join("\n\n"),
      };

  const linkUrl = product ? productUrl(product.title, product.id) : null;
  const results: PublishResult = {};
  for (const platform of platforms) {
    try {
      results[platform] = {
        ok: true,
        detail: await PUBLISHERS[platform]({
          caption: captions[platform],
          imageUrls,
          creds,
          productUrl: linkUrl,
        }),
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

// Cron entry point (src/server.ts `scheduled`, hourly). Publishes scheduled
// posts whose time has passed — but at most one per run. Meta's spam/quality
// systems throttle distribution hard for accounts posting frequent,
// near-identical templated promotional content (this pipeline's posts all
// share the same product-name/description/price/shop-link shape), so if
// several products are scheduled for the same hour, firing them all within
// the same few seconds is exactly the pattern that gets suppressed. Limiting
// to one per hourly tick spreads them out naturally with no extra
// infrastructure — the rest just get published on the next run(s). Failed
// posts stay `failed` and are not retried automatically — retry from the
// admin page after fixing the cause.
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
    )
    .orderBy(asc(social_posts.scheduled_at))
    .limit(1);

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
