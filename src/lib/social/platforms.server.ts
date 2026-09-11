import { requireSocialEnv, socialEnv } from "./env.server";

export type SocialPlatform = "facebook" | "instagram" | "telegram" | "tiktok";
export const SOCIAL_PLATFORMS: SocialPlatform[] = ["facebook", "instagram", "telegram", "tiktok"];

type PostArgs = { caption: string; imageUrls: string[] };

const GRAPH_API = "https://graph.facebook.com/v21.0";

async function graphPost(path: string, body: Record<string, unknown>) {
  const res = await fetch(`${GRAPH_API}/${path}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  const data = (await res.json()) as { error?: unknown; [key: string]: unknown };
  if (!res.ok || data.error) {
    throw new Error(`Facebook Graph ${path}: ${JSON.stringify(data.error ?? data)}`);
  }
  return data;
}

export async function postToFacebook({ caption, imageUrls }: PostArgs): Promise<string> {
  const pageId = requireSocialEnv("FB_PAGE_ID");
  const access_token = requireSocialEnv("FB_PAGE_ACCESS_TOKEN");

  if (imageUrls.length === 0) {
    const data = await graphPost(`${pageId}/feed`, { message: caption, access_token });
    return `post ${data.id}`;
  }
  if (imageUrls.length === 1) {
    const data = await graphPost(`${pageId}/photos`, { url: imageUrls[0], caption, access_token });
    return `photo ${data.post_id ?? data.id}`;
  }
  // Multi-photo: upload each unpublished, then attach all to one feed post.
  const mediaIds: string[] = [];
  for (const url of imageUrls) {
    const photo = await graphPost(`${pageId}/photos`, { url, published: false, access_token });
    mediaIds.push(String(photo.id));
  }
  const data = await graphPost(`${pageId}/feed`, {
    message: caption,
    attached_media: mediaIds.map((id) => ({ media_fbid: id })),
    access_token,
  });
  return `post ${data.id}`;
}

// Instagram content publishing: create a media container, then publish it.
export async function postToInstagram({ caption, imageUrls }: PostArgs): Promise<string> {
  const igId = requireSocialEnv("IG_USER_ID");
  const access_token = requireSocialEnv("FB_PAGE_ACCESS_TOKEN");
  if (imageUrls.length === 0) throw new Error("Instagram needs at least one image");

  let creationId: string;
  if (imageUrls.length === 1) {
    const container = await graphPost(`${igId}/media`, {
      image_url: imageUrls[0],
      caption,
      access_token,
    });
    creationId = String(container.id);
  } else {
    const children: string[] = [];
    for (const url of imageUrls.slice(0, 10)) {
      const child = await graphPost(`${igId}/media`, {
        image_url: url,
        is_carousel_item: true,
        access_token,
      });
      children.push(String(child.id));
    }
    const container = await graphPost(`${igId}/media`, {
      media_type: "CAROUSEL",
      children: children.join(","),
      caption,
      access_token,
    });
    creationId = String(container.id);
  }

  // Publishing can briefly fail while Instagram processes the container.
  let lastError: unknown;
  for (let attempt = 0; attempt < 3; attempt++) {
    try {
      const published = await graphPost(`${igId}/media_publish`, {
        creation_id: creationId,
        access_token,
      });
      return `media ${published.id}`;
    } catch (err) {
      lastError = err;
      await new Promise((r) => setTimeout(r, 5000));
    }
  }
  throw lastError;
}

export async function postToTelegram({ caption, imageUrls }: PostArgs): Promise<string> {
  const token = requireSocialEnv("TELEGRAM_BOT_TOKEN");
  const chat_id = requireSocialEnv("TELEGRAM_CHANNEL_ID");

  const call = async (method: string, body: Record<string, unknown>) => {
    const res = await fetch(`https://api.telegram.org/bot${token}/${method}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    const data = (await res.json()) as { ok: boolean; result?: unknown };
    if (!data.ok) throw new Error(`Telegram ${method}: ${JSON.stringify(data)}`);
    return data.result;
  };

  if (imageUrls.length > 1) {
    // Album: the caption on the first photo renders under the whole album.
    const media = imageUrls
      .slice(0, 10)
      .map((url, i) => ({ type: "photo", media: url, ...(i === 0 ? { caption } : {}) }));
    const result = (await call("sendMediaGroup", { chat_id, media })) as { message_id?: number }[];
    return `message ${result[0]?.message_id}`;
  }
  if (imageUrls.length === 1) {
    const result = (await call("sendPhoto", { chat_id, photo: imageUrls[0], caption })) as {
      message_id: number;
    };
    return `message ${result.message_id}`;
  }
  const result = (await call("sendMessage", { chat_id, text: caption })) as { message_id: number };
  return `message ${result.message_id}`;
}

// EXPERIMENTAL: needs an approved TikTok Content Posting app. Until the app
// passes TikTok's audit, direct posts are forced private (SELF_ONLY). Set the
// TIKTOK_PRIVACY secret to PUBLIC_TO_EVERYONE after approval.
export async function postToTikTok({ caption, imageUrls }: PostArgs): Promise<string> {
  const token = requireSocialEnv("TIKTOK_ACCESS_TOKEN");
  if (imageUrls.length === 0) throw new Error("TikTok photo post needs at least one image");

  const res = await fetch("https://open.tiktokapis.com/v2/post/publish/content/init/", {
    method: "POST",
    headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      media_type: "PHOTO",
      post_mode: "DIRECT_POST",
      post_info: {
        title: caption.slice(0, 90),
        description: caption,
        privacy_level: socialEnv("TIKTOK_PRIVACY") ?? "SELF_ONLY",
      },
      source_info: {
        source: "PULL_FROM_URL",
        photo_cover_index: 0,
        photo_images: imageUrls.slice(0, 35),
      },
    }),
  });
  const data = (await res.json()) as {
    error?: { code?: string };
    data?: { publish_id?: string };
  };
  if (!res.ok || data.error?.code !== "ok") {
    throw new Error(`TikTok post: ${JSON.stringify(data.error ?? data)}`);
  }
  return `publish ${data.data?.publish_id}`;
}

export const PUBLISHERS: Record<SocialPlatform, (args: PostArgs) => Promise<string>> = {
  facebook: postToFacebook,
  instagram: postToInstagram,
  telegram: postToTelegram,
  tiktok: postToTikTok,
};

// Platforms whose credentials are actually configured — used as the default
// when a post doesn't pick platforms explicitly.
export function configuredPlatforms(): SocialPlatform[] {
  const out: SocialPlatform[] = [];
  if (socialEnv("FB_PAGE_ID") && socialEnv("FB_PAGE_ACCESS_TOKEN")) out.push("facebook");
  if (socialEnv("IG_USER_ID") && socialEnv("FB_PAGE_ACCESS_TOKEN")) out.push("instagram");
  if (socialEnv("TELEGRAM_BOT_TOKEN") && socialEnv("TELEGRAM_CHANNEL_ID")) out.push("telegram");
  if (socialEnv("TIKTOK_ACCESS_TOKEN")) out.push("tiktok");
  return out;
}
