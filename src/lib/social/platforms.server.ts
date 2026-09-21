export type SocialPlatform = "facebook" | "instagram" | "telegram" | "tiktok" | "threads";
export const SOCIAL_PLATFORMS: SocialPlatform[] = [
  "facebook",
  "instagram",
  "telegram",
  "tiktok",
  "threads",
];

// Credentials come from the social_connections table (admin-configured at
// /admin/social-connections), not Worker secrets — see src/data/social-connections.ts.
export type SocialCredentials = {
  fb_page_id: string | null;
  fb_page_access_token: string | null;
  ig_user_id: string | null;
  telegram_bot_token: string | null;
  telegram_channel_id: string | null;
  tiktok_access_token: string | null;
  tiktok_privacy: string;
  // Threads is a Meta product but has its own separate Graph API and OAuth
  // token — does not reuse fb_page_access_token.
  threads_user_id: string | null;
  threads_access_token: string | null;
};

type PostArgs = {
  caption: string;
  imageUrls: string[];
  creds: SocialCredentials;
  // The product page to send customers to when they click the post. Facebook
  // link-posts to it (see postToFacebook) instead of uploading the photo
  // directly — a directly-uploaded photo opens Facebook's own photo viewer on
  // click, with no way back to the site. Null for freeform posts with no
  // linked product, which fall back to a plain photo/feed post.
  productUrl: string | null;
};

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

function require(value: string | null, label: string): string {
  if (!value) throw new Error(`${label} not connected — set it up in Social Connections`);
  return value;
}

export async function postToFacebook({
  caption,
  imageUrls,
  creds,
  productUrl,
}: PostArgs): Promise<string> {
  const pageId = require(creds.fb_page_id, "Facebook Page ID");
  const access_token = require(creds.fb_page_access_token, "Facebook Page access token");

  // Linked to a real product: post as a link post so the whole card (image
  // included) is clickable through to the product page. A directly-uploaded
  // photo (the branches below) opens in Facebook's own photo viewer instead —
  // there's no click-through at all, regardless of what the caption text
  // says. Facebook scrapes `link` for its own preview image via the product
  // page's og:image, so the photo doesn't need separate uploading here.
  if (productUrl) {
    const data = await graphPost(`${pageId}/feed`, { message: caption, link: productUrl, access_token });
    return `post ${data.id}`;
  }

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
export async function postToInstagram({ caption, imageUrls, creds }: PostArgs): Promise<string> {
  const igId = require(creds.ig_user_id, "Instagram User ID");
  const access_token = require(creds.fb_page_access_token, "Facebook Page access token");
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

// Threads Graph API — separate host/version from the Facebook Graph API
// above, and its own OAuth token (see SocialCredentials.threads_access_token).
const THREADS_API = "https://graph.threads.net/v1.0";

async function threadsPost(path: string, body: Record<string, unknown>) {
  const res = await fetch(`${THREADS_API}/${path}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  const data = (await res.json()) as { error?: unknown; [key: string]: unknown };
  if (!res.ok || data.error) {
    throw new Error(`Threads ${path}: ${JSON.stringify(data.error ?? data)}`);
  }
  return data;
}

// Same container-then-publish shape as Instagram: create a media container
// (single image or a carousel of children), then publish it by creation_id.
// Threads renders plain-text URLs as clickable links (unlike Instagram), so
// the caption already carries the real shop link — see buildCaptions.
export async function postToThreads({ caption, imageUrls, creds }: PostArgs): Promise<string> {
  const userId = require(creds.threads_user_id, "Threads User ID");
  const access_token = require(creds.threads_access_token, "Threads access token");

  let creationId: string;
  if (imageUrls.length === 0) {
    const container = await threadsPost(`${userId}/threads`, {
      media_type: "TEXT",
      text: caption,
      access_token,
    });
    creationId = String(container.id);
  } else if (imageUrls.length === 1) {
    const container = await threadsPost(`${userId}/threads`, {
      media_type: "IMAGE",
      image_url: imageUrls[0],
      text: caption,
      access_token,
    });
    creationId = String(container.id);
  } else {
    const children: string[] = [];
    for (const url of imageUrls.slice(0, 10)) {
      const child = await threadsPost(`${userId}/threads`, {
        media_type: "IMAGE",
        image_url: url,
        is_carousel_item: true,
        access_token,
      });
      children.push(String(child.id));
    }
    const container = await threadsPost(`${userId}/threads`, {
      media_type: "CAROUSEL",
      children: children.join(","),
      text: caption,
      access_token,
    });
    creationId = String(container.id);
  }

  // Meta recommends waiting for the container to finish processing before
  // publishing — same pattern as Instagram's retry loop below, just an
  // upfront wait here since Threads containers are usually ready faster.
  await new Promise((r) => setTimeout(r, 5000));
  let lastError: unknown;
  for (let attempt = 0; attempt < 3; attempt++) {
    try {
      const published = await threadsPost(`${userId}/threads_publish`, {
        creation_id: creationId,
        access_token,
      });
      return `thread ${published.id}`;
    } catch (err) {
      lastError = err;
      await new Promise((r) => setTimeout(r, 5000));
    }
  }
  throw lastError;
}

export async function postToTelegram({ caption, imageUrls, creds }: PostArgs): Promise<string> {
  const token = require(creds.telegram_bot_token, "Telegram bot token");
  const chat_id = require(creds.telegram_channel_id, "Telegram channel ID");

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
// passes TikTok's audit, direct posts are forced private (SELF_ONLY) — flip
// the Post visibility field in Social Connections to PUBLIC_TO_EVERYONE once
// TikTok approves the app.
export async function postToTikTok({ caption, imageUrls, creds }: PostArgs): Promise<string> {
  const token = require(creds.tiktok_access_token, "TikTok access token");
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
        privacy_level: creds.tiktok_privacy || "SELF_ONLY",
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
  threads: postToThreads,
};

// Platforms whose credentials are actually filled in — used as the default
// when a post doesn't pick platforms explicitly.
export function configuredPlatforms(creds: SocialCredentials): SocialPlatform[] {
  const out: SocialPlatform[] = [];
  if (creds.fb_page_id && creds.fb_page_access_token) out.push("facebook");
  if (creds.ig_user_id && creds.fb_page_access_token) out.push("instagram");
  if (creds.telegram_bot_token && creds.telegram_channel_id) out.push("telegram");
  if (creds.tiktok_access_token) out.push("tiktok");
  if (creds.threads_user_id && creds.threads_access_token) out.push("threads");
  return out;
}
