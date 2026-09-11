import { parseProductContent } from "@/lib/format-description";
import { slugify } from "@/lib/utils";
import { SITE_URL } from "./env.server";
import type { SocialPlatform } from "./platforms.server";

export type Captions = Record<SocialPlatform, string>;

function escapeHtml(s: string): string {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

// The description field's "**bold**" and "- bullet" markdown, rendered plain
// for platforms with no rich text — bold markers dropped, bullets become "• ".
function toPlainText(text: string): string {
  return text
    .replace(/\*\*([^*]+)\*\*/g, "$1")
    .split("\n")
    .map((line) => (line.trimStart().startsWith("- ") ? `• ${line.trim().slice(2)}` : line))
    .join("\n");
}

// Telegram's HTML parse_mode: bold survives as <b>, everything else escaped.
function toTelegramHtml(text: string): string {
  return escapeHtml(text)
    .replace(/\*\*([^*]+)\*\*/g, "<b>$1</b>")
    .split("\n")
    .map((line) => (line.trimStart().startsWith("- ") ? `• ${line.trim().slice(2)}` : line))
    .join("\n");
}

// Combines the product's real tagline, intro, offer callouts, and every
// "## Tab" section into one body — this is the product's own copy (the same
// text customers see on its product page), not text generated for the post.
function productBody(description: string | null): string {
  if (!description) return "";
  const { tagline, intro, offers, tabs } = parseProductContent(description);
  const parts = [tagline, intro, offers.length ? offers.map((o) => `- ${o}`).join("\n") : ""];
  for (const tab of tabs) parts.push(`**${tab.title}**\n${tab.body}`);
  return parts.filter(Boolean).join("\n\n");
}

// Cuts at the nearest paragraph/sentence break so a platform length limit
// never lands mid-word or mid-sentence.
function truncate(text: string, max: number): string {
  if (text.length <= max) return text;
  const cut = text.slice(0, max - 1);
  const lastBreak = Math.max(cut.lastIndexOf("\n\n"), cut.lastIndexOf(". "));
  return `${(lastBreak > max * 0.5 ? cut.slice(0, lastBreak + 1) : cut).trimEnd()}…`;
}

// Builds each platform's caption directly from the product's real name,
// description, tabs, and price — no AI rewriting, so the wording is always
// exactly what's on the product page (plus an optional admin note and the
// shop link/"link in bio"). `priceText` is pre-formatted by the caller (see
// `priceRangeText` in `@/lib/variants`) since a variable product's price
// spans its variations, not the product row's own price column.
export function buildCaptions(args: {
  title: string;
  description: string | null;
  priceText: string;
  productId: string;
  note: string | null;
}): Captions {
  const url = `${SITE_URL}/product/${slugify(args.title) || args.productId}`;
  const body = [args.note?.trim(), productBody(args.description)].filter(Boolean).join("\n\n");
  const price = `Price: ${args.priceText}`;

  const withLink = [args.title, body, price, `Shop now: ${url}`].filter(Boolean).join("\n\n");
  const withBioLink = [args.title, body, price, "🔗 Link in bio"].filter(Boolean).join("\n\n");

  return {
    facebook: truncate(toPlainText(withLink), 8000),
    instagram: truncate(toPlainText(withBioLink), 2190),
    telegram: truncate(toTelegramHtml(withLink), 4000),
    tiktok: truncate(toPlainText(withBioLink), 2190),
  };
}
