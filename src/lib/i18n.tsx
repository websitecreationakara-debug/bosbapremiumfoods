import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
  getTranslations,
  getSiteLocale,
  LOCALE_CODES,
  type Locale,
  type TranslationStrings,
} from "@/data/translations";

export type { Locale, TranslationStrings };

export const LOCALES: { code: Locale; label: string }[] = [
  { code: "en", label: "English" },
  { code: "km", label: "ខ្មែរ" },
  { code: "ja", label: "日本語" },
];

// Compile-time key list only — no wording lives here. Every user-facing string
// is stored in the `translations` table and edited at /admin/translations.
// Adding a new string: add its key here, call t(key) where it's used, then
// fill in the value via the admin page (or a seed migration row).
export const I18N_KEYS = [
  "lang.name",
  "bar.storeLocator",
  "bar.delivery",
  "theme.light",
  "theme.dark",
  "nav.allCategories",
  "nav.browse",
  "nav.allProducts",
  "nav.megaWagyu",
  "nav.megaSeafood",
  "nav.megaOccasion",
  "nav.megaPantry",
  "nav.searchPlaceholder",
  "nav.wishlist",
  "nav.signIn",
  "nav.adminDashboard",
  "nav.myOrders",
  "nav.myAddresses",
  "nav.account",
  "nav.signOut",
  "nav.cart",
  "home.premiumSelection",
  "home.finestProducts",
  "home.viewAll",
  "home.shopByCategory",
  "home.shopByCategorySub",
  "home.shop",
  "feature.delivery.title",
  "feature.delivery.body",
  "feature.sashimi.title",
  "feature.sashimi.body",
  "feature.quality.title",
  "feature.quality.body",
  "feature.cold.title",
  "feature.cold.body",
  "cta.member",
  "cta.title",
  "cta.body",
  "cta.join",
  "product.addToCart",
  "product.noImage",
  "product.from",
  "product.selectOptions",
  "shop.title",
  "shop.count",
  "shop.filters",
  "shop.clearAll",
  "shop.search",
  "shop.searchPlaceholder",
  "shop.categories",
  "shop.allProducts",
  "shop.price",
  "shop.offers",
  "shop.onSaleOnly",
  "shop.sort",
  "shop.sort.featured",
  "shop.sort.priceAsc",
  "shop.sort.priceDesc",
  "shop.sort.rating",
  "shop.noProducts",
  "shop.noProductsSub",
  "shop.clearFilters",
  "nav.offers",
  "offers.title",
  "offers.subtitle",
  "offers.empty",
  "offers.viewAll",
  "offers.ends",
  "offer.kind.limited",
  "offer.kind.seasonal",
  "offer.kind.special",
  "footer.tagline",
  "footer.marketplace",
  "footer.sashimiFillets",
  "footer.shellfish",
  "footer.roeUni",
  "footer.followTitle",
  "footer.followSub",
  "footer.privacy",
  "footer.sitemap",
  "footer.about",
  "footer.faq",
  "footer.shipping",
  "footer.refund",
] as const;

export type I18nKey = (typeof I18N_KEYS)[number];

const EMPTY_STRINGS: TranslationStrings = { en: {}, km: {}, ja: {} };

function interpolate(s: string, vars?: Record<string, string | number>) {
  if (!vars) return s;
  return s.replace(/\$?\{(\w+)\}/g, (_, k: string) =>
    vars[k] != null ? String(vars[k]) : `{${k}}`,
  );
}

// Cross-tab (and same-tab, different-component-tree) live refresh after an
// admin save. Three channels because no single one is reliable everywhere:
// BroadcastChannel doesn't fire in the tab that sent it, the storage event
// only fires in *other* tabs, and same-tab listeners need the custom event.
const BROADCAST_CHANNEL_NAME = "translations-updated";
const STORAGE_PING_KEY = "translations-updated-at";
const CUSTOM_EVENT_NAME = "translations-updated";

export function broadcastTranslationsUpdated() {
  window.dispatchEvent(new CustomEvent(CUSTOM_EVENT_NAME));
  try {
    localStorage.setItem(STORAGE_PING_KEY, String(Date.now()));
  } catch {
    // localStorage can throw in locked-down/private-browsing contexts — the
    // custom-event listener in this tab still fires either way.
  }
  try {
    new BroadcastChannel(BROADCAST_CHANNEL_NAME).postMessage(Date.now());
  } catch {
    // BroadcastChannel isn't available in every browser — storage + custom
    // event already cover this tab and same-origin tabs that support it.
  }
}

type Ctx = {
  locale: Locale;
  setLocale: (l: Locale) => void;
  t: (key: I18nKey, vars?: Record<string, string | number>) => string;
  strings: TranslationStrings;
  siteLocale: Locale;
};

const I18nContext = createContext<Ctx | null>(null);

export function LanguageProvider({
  children,
  initialStrings,
  initialSiteLocale,
}: {
  children: ReactNode;
  initialStrings?: TranslationStrings;
  initialSiteLocale?: Locale;
}) {
  const qc = useQueryClient();

  const { data: strings } = useQuery({
    queryKey: ["translations"],
    queryFn: () => getTranslations() as Promise<TranslationStrings>,
    initialData: initialStrings,
    staleTime: 0,
    refetchOnWindowFocus: true,
  });

  const { data: siteLocale } = useQuery({
    queryKey: ["site-locale"],
    queryFn: () => getSiteLocale() as Promise<Locale>,
    initialData: initialSiteLocale,
    staleTime: 0,
    refetchOnWindowFocus: true,
  });

  const resolvedSiteLocale = siteLocale ?? "en";
  const [locale, setLocaleState] = useState<Locale>(initialSiteLocale ?? "en");
  // Whether the visitor has an explicit saved preference — once true, changes
  // to the admin's site-wide default should no longer override this tab.
  const hasSavedPreference = useRef(false);

  useEffect(() => {
    let saved: string | null = null;
    try {
      saved = localStorage.getItem("locale");
    } catch {
      // ignore — falls through to the site default below
    }
    if (saved && (LOCALE_CODES as string[]).includes(saved)) {
      hasSavedPreference.current = true;
      setLocaleState(saved as Locale);
      document.documentElement.lang = saved;
    }
  }, []);

  useEffect(() => {
    if (hasSavedPreference.current) return;
    setLocaleState(resolvedSiteLocale);
    document.documentElement.lang = resolvedSiteLocale;
  }, [resolvedSiteLocale]);

  const setLocale = (l: Locale) => {
    hasSavedPreference.current = true;
    setLocaleState(l);
    document.documentElement.lang = l;
    try {
      localStorage.setItem("locale", l);
    } catch {
      // Preference just won't persist across reloads in this context.
    }
  };

  useEffect(() => {
    const invalidate = () => {
      qc.invalidateQueries({ queryKey: ["translations"] });
      qc.invalidateQueries({ queryKey: ["site-locale"] });
    };
    const onStorage = (e: StorageEvent) => {
      if (e.key === STORAGE_PING_KEY) invalidate();
    };
    window.addEventListener(CUSTOM_EVENT_NAME, invalidate);
    window.addEventListener("storage", onStorage);
    let channel: BroadcastChannel | null = null;
    try {
      channel = new BroadcastChannel(BROADCAST_CHANNEL_NAME);
      channel.onmessage = invalidate;
    } catch {
      // No BroadcastChannel support — same-tab custom event and cross-tab
      // storage event still cover the common cases.
    }
    return () => {
      window.removeEventListener(CUSTOM_EVENT_NAME, invalidate);
      window.removeEventListener("storage", onStorage);
      channel?.close();
    };
  }, [qc]);

  const resolvedStrings = strings ?? EMPTY_STRINGS;

  const t = useCallback<Ctx["t"]>(
    (key, vars) =>
      interpolate(resolvedStrings[locale]?.[key] ?? resolvedStrings.en[key] ?? key, vars),
    [resolvedStrings, locale],
  );

  return (
    <I18nContext.Provider
      value={{ locale, setLocale, t, strings: resolvedStrings, siteLocale: resolvedSiteLocale }}
    >
      {children}
    </I18nContext.Provider>
  );
}

export function useI18n() {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error("useI18n must be used within LanguageProvider");
  return ctx;
}
