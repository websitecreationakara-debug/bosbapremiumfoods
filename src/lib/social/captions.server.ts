import { requireSocialEnv, SITE_URL } from "./env.server";
import type { SocialPlatform } from "./platforms.server";

export type Captions = Record<SocialPlatform, string>;

// Raw Messages API call instead of @anthropic-ai/sdk: the SDK's
// `standardwebhooks` dependency breaks this repo's workerd/Vite build
// (its CJS dist loses the node:stream binding and throws at SSR/prerender).
// One JSON POST is all we need here.
const ANTHROPIC_API = "https://api.anthropic.com/v1/messages";

const CAPTION_SCHEMA = {
  type: "object",
  properties: {
    facebook: { type: "string", description: "Facebook Page post text" },
    instagram: {
      type: "string",
      description: "Instagram caption, max ~2000 chars, hashtags at the end",
    },
    telegram: { type: "string", description: "Telegram channel message, plain text, no markdown" },
    tiktok: { type: "string", description: "TikTok photo-post caption, short and punchy" },
  },
  required: ["facebook", "instagram", "telegram", "tiktok"],
  additionalProperties: false,
};

const SYSTEM = [
  "You write social media posts for BOSBA Premium Foods, a premium Japanese food importer and online shop in Phnom Penh, Cambodia.",
  "Audience: food lovers in Cambodia (English-speaking locals, expats, Japanese residents). Default to English unless the brief asks for Khmer or Japanese.",
  "Voice: warm, appetizing, premium but not stuffy. Short sentences. Emoji are welcome in moderation.",
  `Include the shop link ${SITE_URL} where a link makes sense (Facebook and Telegram; never in the Instagram caption body — say "link in bio" instead).`,
  "If the brief already contains finished caption text, treat it as final copy and only adapt formatting per platform — do not rewrite its meaning.",
].join("\n");

// Turns a post's topic + brief into final per-platform captions. The brief can
// be rough notes in any language; finished copy is kept as-is.
export async function generateCaptions(args: {
  topic: string;
  brief: string | null;
  hasImage: boolean;
}): Promise<Captions> {
  const res = await fetch(ANTHROPIC_API, {
    method: "POST",
    headers: {
      "x-api-key": requireSocialEnv("ANTHROPIC_API_KEY"),
      "anthropic-version": "2023-06-01",
      "content-type": "application/json",
    },
    body: JSON.stringify({
      model: "claude-opus-4-8",
      max_tokens: 2048,
      output_config: { format: { type: "json_schema", schema: CAPTION_SCHEMA } },
      system: SYSTEM,
      messages: [
        {
          role: "user",
          content: `Post topic: ${args.topic}\n\nBrief:\n${args.brief || "(no brief — write from the topic alone)"}\n\nThe post ${args.hasImage ? "includes a product photo" : "has NO image (text-only)"}.`,
        },
      ],
    }),
  });

  const data = (await res.json()) as {
    stop_reason?: string;
    content?: { type: string; text?: string }[];
    error?: { type: string; message: string };
  };
  if (!res.ok) {
    throw new Error(`Caption generation failed: ${data.error?.message ?? res.status}`);
  }
  if (data.stop_reason === "refusal") throw new Error("Caption generation was refused");
  const text = data.content?.find((b) => b.type === "text")?.text;
  if (!text) throw new Error("Caption generation returned no text");
  return JSON.parse(text) as Captions;
}
