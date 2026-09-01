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
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Globe, Loader2, RotateCcw, CircleAlert, Search } from "lucide-react";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/admin/translations")({ component: TranslationsAdmin });

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

// Tabs mirror where a string actually renders on the site (site-header,
// homepage, /shop, /offers, site-footer) rather than the key's dotted prefix
// — an editor thinks in terms of "which page/section am I fixing". Matched by
// explicit predicate (not just a prefix list) so a single prefix like "nav"
// can still be split across two tabs (Navigation vs. Cart).
const PAGE_SECTIONS: { title: string; match: (key: I18nKey) => boolean }[] = [
  { title: "Homepage", match: (k) => k.startsWith("home.") || k.startsWith("cta.") },
  { title: "Features", match: (k) => k.startsWith("feature.") },
  { title: "Shop", match: (k) => k.startsWith("shop.") },
  { title: "Product", match: (k) => k.startsWith("product.") },
  { title: "Offers", match: (k) => k.startsWith("offers.") },
  { title: "Badges", match: (k) => k.startsWith("offer.") },
  { title: "Navigation", match: (k) => (k.startsWith("nav.") && k !== "nav.cart") || k.startsWith("lang.") },
  { title: "Top Bar", match: (k) => k.startsWith("bar.") },
  { title: "Cart", match: (k) => k === "nav.cart" },
  { title: "Theme", match: (k) => k.startsWith("theme.") },
  { title: "Footer", match: (k) => k.startsWith("footer.") },
];

type Section = { title: string; keys: I18nKey[] };

const SECTIONS: Section[] = (() => {
  const remaining = new Set(I18N_KEYS.filter((key) => !DEPRECATED_PREFIXES.includes(key.split(".")[0])));
  const sections: Section[] = PAGE_SECTIONS.map(({ title, match }) => {
    const keys = I18N_KEYS.filter((key) => remaining.has(key) && match(key));
    keys.forEach((k) => remaining.delete(k));
    return { title, keys };
  }).filter((s) => s.keys.length > 0);
  // Anything left over (e.g. a future key whose prefix isn't mapped above
  // yet) goes under "Other" so nothing silently disappears from the editor.
  const leftover = I18N_KEYS.filter((key) => remaining.has(key));
  if (leftover.length > 0) sections.push({ title: "Other", keys: leftover });
  return sections;
})();

// Khmer block U+1780–U+17FF; Japanese kana (hiragana/katakana) + CJK ideograph blocks.
const KM_SCRIPT = /[ក-៿]/;
const JA_SCRIPT = /[぀-ヿ一-鿿]/;

type EditMap = Record<string, Record<string, string>>;
const EMPTY_EDITS: EditMap = { en: {}, km: {}, ja: {} };

type FilterMode = "all" | "edited" | "needs-km" | "needs-ja";

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
  const [activeTab, setActiveTab] = useState(SECTIONS[0].title);
  const [search, setSearch] = useState("");
  const [filterMode, setFilterMode] = useState<FilterMode>("all");

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

  const section = SECTIONS.find((s) => s.title === activeTab) ?? SECTIONS[0];

  const completeness = (locale: "km" | "ja") => {
    if (section.keys.length === 0) return 100;
    const done = section.keys.filter(
      (key) => !needsTranslation(locale, key, currentValue(locale, key)),
    ).length;
    return Math.round((done / section.keys.length) * 100);
  };

  const q = search.trim().toLowerCase();
  const visibleKeys = section.keys.filter((key) => {
    if (q) {
      const haystack = [key, currentValue("en", key), currentValue("km", key), currentValue("ja", key)]
        .join(" ␟ ")
        .toLowerCase();
      if (!haystack.includes(q)) return false;
    }
    if (filterMode === "edited") {
      return isDirty("en", key) || isDirty("km", key) || isDirty("ja", key);
    }
    if (filterMode === "needs-km") return needsTranslation("km", key, currentValue("km", key));
    if (filterMode === "needs-ja") return needsTranslation("ja", key, currentValue("ja", key));
    return true;
  });

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

      <div className="bg-card border rounded-2xl p-5 space-y-5">
        <div className="flex flex-wrap gap-2">
          {SECTIONS.map((s) => (
            <button
              key={s.title}
              type="button"
              onClick={() => setActiveTab(s.title)}
              className={cn(
                "rounded-full px-4 py-1.5 text-sm font-bold transition-colors",
                activeTab === s.title
                  ? "bg-brand text-brand-foreground"
                  : "bg-muted text-muted-foreground hover:text-foreground",
              )}
            >
              {s.title}
            </button>
          ))}
        </div>

        <div className="space-y-2.5">
          {(["km", "ja"] as const).map((code) => {
            const pct = completeness(code);
            const label = LOCALES.find((l) => l.code === code)?.label ?? code;
            return (
              <div key={code} className="flex items-center gap-3">
                <span className="w-16 shrink-0 text-sm font-medium">{label}</span>
                <div className="flex-1 h-2 rounded-full bg-muted overflow-hidden">
                  <div
                    className={cn(
                      "h-full rounded-full transition-all",
                      pct === 100 ? "bg-emerald-500" : "bg-amber-500",
                    )}
                    style={{ width: `${pct}%` }}
                  />
                </div>
                <span className="w-10 shrink-0 text-sm text-muted-foreground text-right">{pct}%</span>
                <span
                  className={cn(
                    "w-24 shrink-0 text-sm font-medium",
                    pct === 100 ? "text-emerald-500" : "text-amber-500",
                  )}
                >
                  {pct === 100 ? "complete" : "in progress"}
                </span>
              </div>
            );
          })}
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search all text..."
              className="pl-9 rounded-full"
            />
          </div>
          <div className="flex flex-wrap gap-2">
            {(
              [
                ["all", "All"],
                ["edited", "Edited"],
                ["needs-km", "Needs ខ្មែរ"],
                ["needs-ja", "Needs 日本語"],
              ] as [FilterMode, string][]
            ).map(([mode, label]) => (
              <button
                key={mode}
                type="button"
                onClick={() => setFilterMode(mode)}
                className={cn(
                  "rounded-full px-3.5 py-1.5 text-xs font-bold transition-colors",
                  filterMode === mode
                    ? "bg-brand text-brand-foreground"
                    : "bg-muted text-muted-foreground hover:text-foreground",
                )}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-6">
          {visibleKeys.length === 0 && (
            <p className="text-sm text-muted-foreground py-6 text-center">
              No strings match your search/filter in this section.
            </p>
          )}
          {visibleKeys.map((key) => (
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
    </div>
  );
}
