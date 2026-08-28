// Static global-nav config. These entries genuinely don't need admin editing
// (6 top-level links, mega-menu column headings, the one Wagyu promo callout,
// the Sora Sake cross-link) — the *contents* of each mega-menu column come
// from the DB-driven `collections` table (see src/data/collections.ts) via
// their `nav_group`/`nav_column` keys, which match the ids used here.

import type { I18nKey } from "@/lib/i18n";

export type NavLinkItem = { type: "link"; labelKey: I18nKey; to: string; accent?: boolean };
export type NavMegaItem = { type: "mega"; labelKey: I18nKey; group: string };
export type NavItem = NavLinkItem | NavMegaItem;

// labelKey looks up an i18n string in src/lib/i18n.tsx (en/km/ja).
export const TOP_NAV: NavItem[] = [
  { type: "link", labelKey: "nav.allProducts", to: "/shop" },
  { type: "mega", labelKey: "nav.megaWagyu", group: "wagyu-meats" },
  { type: "mega", labelKey: "nav.megaSeafood", group: "seafood-sashimi" },
  { type: "mega", labelKey: "nav.megaOccasion", group: "shop-by-occasion" },
  { type: "mega", labelKey: "nav.megaPantry", group: "pantry-sake" },
  { type: "link", labelKey: "nav.offers", to: "/offers", accent: true },
];

// Column heading text, keyed by collections.nav_column. Groups whose
// collections have nav_column = null (Shop by Occasion, Pantry & Sake) render
// as a single flat list instead of a column grid.
export const NAV_COLUMN_LABELS: Record<string, string> = {
  "by-grade-origin": "By Grade & Origin",
  "by-cut-style": "By Cut & Preparation Style",
  "sashimi-grade": "Sashimi Grade Selections",
  "uni-roe": "Uni & Roe Collection",
  "crab-shellfish": "Crab & Shellfish",
};

// Shared source of truth for the admin Collections form's nav_group/nav_column
// selects, so they can't drift out of sync with what the mega-menu actually
// renders (see NAV_COLUMN_LABELS and TOP_NAV above).
export const NAV_GROUPS: { value: string; label: string }[] = [
  { value: "wagyu-meats", label: "Wagyu & Meats" },
  { value: "seafood-sashimi", label: "Seafood & Sashimi" },
  { value: "shop-by-occasion", label: "Shop by Occasion" },
  { value: "pantry-sake", label: "Pantry & Sake" },
];

// Empty array = that group renders as a flat list (no column sub-headings).
export const NAV_COLUMNS_BY_GROUP: Record<string, { value: string; label: string }[]> = {
  "wagyu-meats": [
    { value: "by-grade-origin", label: NAV_COLUMN_LABELS["by-grade-origin"] },
    { value: "by-cut-style", label: NAV_COLUMN_LABELS["by-cut-style"] },
  ],
  "seafood-sashimi": [
    { value: "sashimi-grade", label: NAV_COLUMN_LABELS["sashimi-grade"] },
    { value: "uni-roe", label: NAV_COLUMN_LABELS["uni-roe"] },
    { value: "crab-shellfish", label: NAV_COLUMN_LABELS["crab-shellfish"] },
  ],
  "shop-by-occasion": [],
  "pantry-sake": [],
};

// The single visual promo card in the Wagyu & Meats mega-menu (spec column D).
// Reuses the real "Wagyu A4" product photo already in media so the card isn't
// pointing at a placeholder. Hardcoded for v1 — revisit as a DB-backed table
// if this ever needs to change without a deploy.
export const WAGYU_PROMO = {
  navGroup: "wagyu-meats",
  imageUrl: "/media/cc2a5133-eae6-4a09-9abf-d99d0785a415-b330f533.webp",
  title: "New to Wagyu?",
  subtitle: "Start with Japanese A4",
  ctaLabel: "Shop Japanese A4",
  ctaLink: "/collections/japanese-a4-wagyu",
};

// Bosba doesn't carry sake itself — this reuses the same sister-site
// cross-link pattern already shown in the mobile drawer.
export const SORA_SAKE_LINK = {
  navGroup: "pantry-sake",
  label: "Sake & Beverage Pairings",
  sublabel: "Curated Japanese sakes — shop our sister store",
  href: "https://sorasake.wine",
};
