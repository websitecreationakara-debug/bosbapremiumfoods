import { asc, eq } from "drizzle-orm";
import { getDb } from "@/db";
import { products } from "@/db/schema";
import { assemble, type ProductPayload } from "./public-api.server";
import { slugify } from "./utils";
import { hasValidPrice, variationPrice } from "./variants";
import { parseProductContent } from "./format-description";

// Scheduled-fetch feed for Google Merchant Center (Data sources -> Add product
// source -> Scheduled fetch), replacing reliance on "Found by Google" auto
// crawling. Declaring g:shipping/g:country explicitly here is what actually
// fixes Merchant Center inferring US availability from USD-priced pages with
// no shipping signal (same fix as the Offer JSON-LD in product.$id.tsx, but
// this is the authoritative source once Merchant Center is pointed at it).

const SITE = "https://bosbapremiumfoods.com";
const BRAND = "BOSBA Premium Foods";

function escapeXml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

// Descriptions are plain text with lightweight markdown (see
// format-description.ts) — strip the **bold**/tagline/tab markers so the feed
// carries clean prose instead of raw markup.
function cleanDescription(raw: string | null, fallback: string): string {
  const text = raw?.trim();
  if (!text) return fallback;
  const { intro, tagline } = parseProductContent(text);
  const base = intro.trim() || tagline || text;
  return base.replace(/\*\*([^*]+)\*\*/g, "$1").replace(/\s+/g, " ").trim() || fallback;
}

function availabilityFor(preOrder: boolean, stock: number | null): string {
  if (preOrder) return "preorder";
  if (stock === 0) return "out of stock";
  return "in stock";
}

function productLink(p: ProductPayload): string {
  return `${SITE}/product/${slugify(p.title) || p.id}`;
}

type FeedItem = {
  id: string;
  itemGroupId?: string;
  title: string;
  description: string;
  link: string;
  imageLink: string;
  availability: string;
  price: number;
  salePrice?: number;
};

function buildItems(p: ProductPayload): FeedItem[] {
  const link = productLink(p);
  const image = p.image_url ?? p.images[0]?.url ?? "";
  const description = cleanDescription(p.description, p.title);

  if (p.type !== "variable") {
    return [
      {
        id: slugify(p.title) || p.id,
        title: p.title,
        description,
        link,
        imageLink: image,
        availability: availabilityFor(p.pre_order, p.stock),
        price: p.price,
        salePrice: p.sale_price != null && p.sale_price < p.price ? p.sale_price : undefined,
      },
    ];
  }

  // Variable products carry no real price on their own row (see the `type`
  // column comment in db/schema.ts) — feed one item per priced variation
  // instead, grouped under the parent via g:item_group_id.
  const groupId = slugify(p.title) || p.id;
  return p.variations.filter(hasValidPrice).map((v) => ({
    id: `${groupId}-${v.id}`,
    itemGroupId: groupId,
    title: `${p.title} (${v.weight})`,
    description,
    link,
    imageLink: v.image_url ?? image,
    availability: availabilityFor(p.pre_order, v.stock),
    price: variationPrice(v),
  }));
}

function itemXml(item: FeedItem): string {
  const parts = [
    `<g:id>${escapeXml(item.id)}</g:id>`,
    item.itemGroupId ? `<g:item_group_id>${escapeXml(item.itemGroupId)}</g:item_group_id>` : "",
    `<title>${escapeXml(item.title)}</title>`,
    `<description>${escapeXml(item.description)}</description>`,
    `<link>${escapeXml(item.link)}</link>`,
    item.imageLink ? `<g:image_link>${escapeXml(item.imageLink)}</g:image_link>` : "",
    `<g:condition>new</g:condition>`,
    `<g:availability>${item.availability}</g:availability>`,
    `<g:price>${item.price.toFixed(2)} USD</g:price>`,
    item.salePrice != null ? `<g:sale_price>${item.salePrice.toFixed(2)} USD</g:sale_price>` : "",
    `<g:brand>${escapeXml(BRAND)}</g:brand>`,
    // No GTIN/MPN exist for this boutique catalog — tells Google that's expected.
    `<g:identifier_exists>no</g:identifier_exists>`,
    // Country only, no flat rate: real delivery fee depends on the free-shipping
    // threshold (see shipping-policy.tsx) rather than a single fixed price.
    `<g:shipping><g:country>KH</g:country></g:shipping>`,
  ];
  return `<item>${parts.filter(Boolean).join("")}</item>`;
}

export async function buildGoogleShoppingFeedXml(): Promise<string> {
  const rows = await getDb()
    .select()
    .from(products)
    .where(eq(products.status, "published"))
    .orderBy(asc(products.sort_order));
  const assembled = await assemble(rows);
  const items = assembled.flatMap(buildItems).map(itemXml).join("");

  return (
    `<?xml version="1.0" encoding="UTF-8"?>` +
    `<rss version="2.0" xmlns:g="http://base.google.com/ns/1.0"><channel>` +
    `<title>${escapeXml(BRAND)} Product Feed</title>` +
    `<link>${SITE}</link>` +
    `<description>Product feed for Google Merchant Center</description>` +
    items +
    `</channel></rss>`
  );
}
