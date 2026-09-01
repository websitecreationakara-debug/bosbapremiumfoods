import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  getTranslations,
  getSiteLocale,
  getAcceptedKeys,
  saveTranslations,
  setSiteLocale,
  setAcceptedKey,
} from "@/data/translations";
import { I18N_KEYS, LOCALES, broadcastTranslationsUpdated, type I18nKey, type Locale } from "@/lib/i18n";
import type { TranslationStrings } from "@/data/translations";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Globe, Loader2, RotateCcw, CircleAlert } from "lucide-react";

export const Route = createFileRoute("/admin/translations")({ component: TranslationsAdmin });

// Friendly section headings, grouped by each key's dotted prefix. New prefixes
// just fall back to showing the raw prefix as the heading.
const SECTION_LABELS: Record<string, string> = {
  lang: "Language",
  bar: "Top Bar",
  theme: "Theme",
  nav: "Navigation",
  home: "Homepage",
  feature: "Feature Highlights",
  cta: "Membership CTA",
  product: "Product",
  shop: "Shop Page",
  offers: "Offers Page",
  offer: "Offer Badges",
  footer: "Footer",
};

// Retired key prefixes stay out of the editor entirely (but their rows, if
// any, are left alone in the database — nothing here deletes data).
const DEPRECATED_PREFIXES: string[] = [];

// Only keys whose raw dotted name wouldn't already be self-explanatory to a
// non-developer editor need a friendlier label here.
const KEY_LABELS: Partial<Record<I18nKey, string>> = {
  "bar.delivery": "Free-delivery banner ({threshold} = dollar amount)",
  "feature.delivery.body": "Delivery feature body ({threshold} = dollar amount)",
  "shop.count": "Product count label ({n} = number)",
  "offers.ends": "Offer end-date label ({date} = date)",
};

type Section = { prefix: string; title: string; keys: I18nKey[] };

const SECTIONS: Section[] = (() => {
  const order: string[] = [];
  const groups = new Map<string, I18nKey[]>();
  for (const key of I18N_KEYS) {
    const prefix = key.split(".")[0];
    if (DEPRECATED_PREFIXES.includes(prefix)) continue;
    if (!groups.has(prefix)) {
      groups.set(prefix, []);
      order.push(prefix);
    }
    groups.get(prefix)!.push(key);
  }
  return order.map((prefix) => ({
    prefix,
    title: SECTION_LABELS[prefix] ?? prefix,
    keys: groups.get(prefix)!,
  }));
})();

// Khmer block U+1780–U+17FF; Japanese kana (hiragana/katakana) + CJK ideograph blocks.
const KM_SCRIPT = /[ក-៿]/;
const JA_SCRIPT = /[぀-ヿ一-鿿]/;

type EditMap = Record<string, Record<string, string>>;
const EMPTY_EDITS: EditMap = { en: {}, km: {}, ja: {} };

function TranslationsAdmin() {
  const qc = useQueryClient();
  const { data: strings = { en: {}, km: {}, ja: {} } as TranslationStrings } = useQuery({
    queryKey: ["translations"],
    queryFn: () => getTranslations() as Promise<TranslationStrings>,
  });
  const { data: siteLocale = "en" as Locale } = useQuery({
    queryKey: ["site-locale"],
    queryFn: () => getSiteLocale() as Promise<Locale>,
  });
  const { data: accepted = { km: [], ja: [] } as Record<"km" | "ja", string[]> } = useQuery({
    queryKey: ["accepted-keys"],
    queryFn: () => getAcceptedKeys() as Promise<Record<"km" | "ja", string[]>>,
  });

  const [edits, setEdits] = useState<EditMap>(EMPTY_EDITS);
  const [saving, setSaving] = useState(false);
  const [savingLocale, setSavingLocale] = useState(false);

  const baselineValue = (locale: Locale, key: string) => strings[locale]?.[key] ?? "";
  const currentValue = (locale: Locale, key: string) =>
    key in edits[locale] ? edits[locale][key] : baselineValue(locale, key);
  const isDirty = (locale: Locale, key: string) =>
    key in edits[locale] && edits[locale][key] !== baselineValue(locale, key);

  const setEdit = (locale: Locale, key: string, value: string) =>
    setEdits((prev) => ({ ...prev, [locale]: { ...prev[locale], [key]: value } }));

  const resetEdit = (locale: Locale, key: string) =>
    setEdits((prev) => {
      const next = { ...prev[locale] };
      delete next[key];
      return { ...prev, [locale]: next };
    });

  const dirtyEntries: { locale: Locale; key: string; value: string }[] = [];
  for (const locale of ["en", "km", "ja"] as Locale[]) {
    for (const key of Object.keys(edits[locale])) {
      if (isDirty(locale, key)) dirtyEntries.push({ locale, key, value: edits[locale][key] });
    }
  }
  const dirtyCount = dirtyEntries.length;

  // Warn on tab close/refresh with unsaved edits — in-app navigation between
  // admin pages isn't guarded, only leaving the browser tab/window.
  useEffect(() => {
    const handler = (e: BeforeUnloadEvent) => {
      if (dirtyCount === 0) return;
      e.preventDefault();
      e.returnValue = "";
    };
    window.addEventListener("beforeunload", handler);
    return () => window.removeEventListener("beforeunload", handler);
  }, [dirtyCount]);

  const save = async () => {
    if (dirtyCount === 0) return;
    setSaving(true);
    try {
      await saveTranslations({ data: { entries: dirtyEntries } });
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to save translations");
      setSaving(false);
      return;
    }
    toast.success(`Saved ${dirtyCount} change${dirtyCount === 1 ? "" : "s"}`);
    setEdits(EMPTY_EDITS);
    qc.invalidateQueries({ queryKey: ["translations"] });
    broadcastTranslationsUpdated();
    setSaving(false);
  };

  const changeSiteLocale = async (locale: Locale) => {
    setSavingLocale(true);
    try {
      await setSiteLocale({ data: { locale } });
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to update default language");
      setSavingLocale(false);
      return;
    }
    toast.success("Default website language updated");
    qc.invalidateQueries({ queryKey: ["site-locale"] });
    broadcastTranslationsUpdated();
    setSavingLocale(false);
  };

  const toggleAccepted = async (locale: "km" | "ja", key: string, next: boolean) => {
    qc.setQueryData(["accepted-keys"], (prev?: Record<"km" | "ja", string[]>) => {
      const p = prev ?? { km: [], ja: [] };
      const set = new Set(p[locale]);
      if (next) set.add(key);
      else set.delete(key);
      return { ...p, [locale]: [...set] };
    });
    try {
      await setAcceptedKey({ data: { key, locale, accepted: next } });
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to update flag");
    }
    qc.invalidateQueries({ queryKey: ["accepted-keys"] });
  };

  const needsTranslation = (locale: "km" | "ja", key: string, value: string) => {
    if (accepted[locale].includes(key)) return false;
    if (value.trim() === "") return true;
    return !(locale === "km" ? KM_SCRIPT : JA_SCRIPT).test(value);
  };

  return (
    <div className="space-y-6 max-w-5xl">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-display font-bold text-3xl">Translations</h1>
          <p className="text-muted-foreground mt-1">
            Every user-facing string on the storefront, editable in English, Khmer and Japanese.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 text-sm">
            <Globe className="size-4 text-muted-foreground" />
            <span className="text-muted-foreground">Default website language</span>
            <Select
              value={siteLocale}
              onValueChange={(v) => changeSiteLocale(v as Locale)}
              disabled={savingLocale}
            >
              <SelectTrigger className="h-9 w-36">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {LOCALES.map((l) => (
                  <SelectItem key={l.code} value={l.code}>
                    {l.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <Button onClick={save} disabled={dirtyCount === 0 || saving} className="rounded-full">
            {saving && <Loader2 className="size-4 mr-1.5 animate-spin" />}
            {dirtyCount > 0 ? `Save ${dirtyCount} change${dirtyCount === 1 ? "" : "s"}` : "Save"}
          </Button>
        </div>
      </div>

      {SECTIONS.map((section) => (
        <div key={section.prefix} className="bg-card border rounded-2xl p-5 space-y-5">
          <h2 className="font-display font-bold text-lg">{section.title}</h2>
          <div className="space-y-6">
            {section.keys.map((key) => (
              <div key={key} className="space-y-2 pb-5 border-b last:border-b-0 last:pb-0">
                <div>
                  <p className="text-sm font-semibold">{KEY_LABELS[key] ?? key}</p>
                  <p className="text-xs text-muted-foreground font-mono">{key}</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  {LOCALES.map((l) => {
                    const value = currentValue(l.code, key);
                    const dirty = isDirty(l.code, key);
                    const flagged = l.code !== "en" && needsTranslation(l.code, key, value);
                    return (
                      <div key={l.code} className="space-y-1.5">
                        <div className="flex items-center justify-between">
                          <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                            {l.label}
                          </label>
                          {dirty && (
                            <button
                              type="button"
                              onClick={() => resetEdit(l.code, key)}
                              className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground"
                              title="Discard unsaved edit"
                            >
                              <RotateCcw className="size-3" /> Reset
                            </button>
                          )}
                        </div>
                        <Textarea
                          rows={2}
                          value={value}
                          onChange={(e) => setEdit(l.code, key, e.target.value)}
                          className={dirty ? "border-brand ring-1 ring-brand/30" : undefined}
                        />
                        {l.code !== "en" && (
                          <div className="flex items-center justify-between gap-2 min-h-5">
                            <label className="flex items-center gap-1.5 text-xs text-muted-foreground cursor-pointer">
                              <Checkbox
                                checked={accepted[l.code as "km" | "ja"].includes(key)}
                                onCheckedChange={(v) =>
                                  toggleAccepted(l.code as "km" | "ja", key, v === true)
                                }
                              />
                              Same as English
                            </label>
                            {flagged && (
                              <span className="flex items-center gap-1 text-xs font-medium text-amber-500">
                                <CircleAlert className="size-3.5" /> Needs translation
                              </span>
                            )}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
