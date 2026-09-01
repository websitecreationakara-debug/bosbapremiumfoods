import { createServerFn } from "@tanstack/react-start";
import { and, eq } from "drizzle-orm";
import { getDb } from "@/db";
import { translations } from "@/db/schema";
import { requireAdmin } from "./_auth";

export type Locale = "en" | "km" | "ja";
export const LOCALE_CODES: Locale[] = ["en", "km", "ja"];

// The translations table also carries site-wide config that isn't a
// per-language string, under locales that can never collide with a real
// language code — see the comment on the table in src/db/schema.ts.
const DEFAULT_LOCALE_ROW = { locale: "_default", key: "locale" } as const;
const acceptedLocale = (locale: "km" | "ja") => `_accept_${locale}`;

export type TranslationStrings = Record<Locale, Record<string, string>>;

// Public — every storefront page needs this to render translated text, and it
// carries no sensitive data.
export const getTranslations = createServerFn({ method: "GET" }).handler(async () => {
  const rows = await getDb().select().from(translations);
  const out: TranslationStrings = { en: {}, km: {}, ja: {} };
  for (const row of rows) {
    if ((LOCALE_CODES as string[]).includes(row.locale)) {
      out[row.locale as Locale][row.key] = row.value;
    }
  }
  return out;
});

export const getSiteLocale = createServerFn({ method: "GET" }).handler(async () => {
  const rows = await getDb()
    .select()
    .from(translations)
    .where(
      and(eq(translations.locale, DEFAULT_LOCALE_ROW.locale), eq(translations.key, DEFAULT_LOCALE_ROW.key)),
    )
    .limit(1);
  const value = rows[0]?.value;
  return ((LOCALE_CODES as string[]).includes(value ?? "") ? value : "en") as Locale;
});

export const setSiteLocale = createServerFn({ method: "POST" })
  .inputValidator((d: { locale: Locale }) => d)
  .handler(async ({ data }) => {
    await requireAdmin();
    const now = new Date().toISOString();
    await getDb()
      .insert(translations)
      .values({ ...DEFAULT_LOCALE_ROW, value: data.locale, updated_at: now })
      .onConflictDoUpdate({
        target: [translations.locale, translations.key],
        set: { value: data.locale, updated_at: now },
      });
    return { ok: true };
  });

// Batch upsert from the admin editor — only dirty fields are sent. A blank
// value deletes the row instead of storing an empty string, so lookups fall
// back through the normal chain (locale -> English -> raw key).
export const saveTranslations = createServerFn({ method: "POST" })
  .inputValidator((d: { entries: { locale: Locale; key: string; value: string }[] }) => d)
  .handler(async ({ data }) => {
    await requireAdmin();
    const now = new Date().toISOString();
    const db = getDb();
    for (const entry of data.entries) {
      if (entry.value.trim() === "") {
        await db
          .delete(translations)
          .where(and(eq(translations.locale, entry.locale), eq(translations.key, entry.key)));
        continue;
      }
      await db
        .insert(translations)
        .values({ locale: entry.locale, key: entry.key, value: entry.value, updated_at: now })
        .onConflictDoUpdate({
          target: [translations.locale, translations.key],
          set: { value: entry.value, updated_at: now },
        });
    }
    return { ok: true };
  });

// "Same as English" flags — a key intentionally left untranslated (e.g. a
// brand name) shouldn't keep showing up as "needs translation" in the admin
// completeness check.
export const getAcceptedKeys = createServerFn({ method: "GET" }).handler(async () => {
  const rows = await getDb().select().from(translations);
  const out: Record<"km" | "ja", string[]> = { km: [], ja: [] };
  for (const row of rows) {
    if (row.locale === acceptedLocale("km") && row.value === "1") out.km.push(row.key);
    if (row.locale === acceptedLocale("ja") && row.value === "1") out.ja.push(row.key);
  }
  return out;
});

export const setAcceptedKey = createServerFn({ method: "POST" })
  .inputValidator((d: { key: string; locale: "km" | "ja"; accepted: boolean }) => d)
  .handler(async ({ data }) => {
    await requireAdmin();
    const locale = acceptedLocale(data.locale);
    if (!data.accepted) {
      await getDb()
        .delete(translations)
        .where(and(eq(translations.locale, locale), eq(translations.key, data.key)));
      return { ok: true };
    }
    const now = new Date().toISOString();
    await getDb()
      .insert(translations)
      .values({ locale, key: data.key, value: "1", updated_at: now })
      .onConflictDoUpdate({
        target: [translations.locale, translations.key],
        set: { value: "1", updated_at: now },
      });
    return { ok: true };
  });
