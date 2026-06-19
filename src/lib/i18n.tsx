import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from "react";

export type Locale = "en" | "km" | "ja";

export const LOCALES: { code: Locale; label: string }[] = [
  { code: "en", label: "English" },
  { code: "km", label: "ខ្មែរ" },
  { code: "ja", label: "日本語" },
];

const en = {
  "lang.name": "English",
  // top bar
  "bar.storeLocator": "Store Locator",
  "bar.delivery": "Free chilled delivery on orders over ${threshold}",
  "theme.light": "Light",
  "theme.dark": "Dark",
  // nav
  "nav.allCategories": "All Categories",
  "nav.browse": "Browse",
  "nav.allProducts": "All Products",
  "nav.searchPlaceholder": "Search tuna, salmon, uni, scallops...",
  "nav.wishlist": "Wishlist",
  "nav.signIn": "Sign in",
  "nav.adminDashboard": "Admin Dashboard",
  "nav.signOut": "Sign out",
  "nav.cart": "Cart",
  // home
  "home.premiumSelection": "Our Premium Selection",
  "home.finestProducts": "Shop Our Finest Products",
  "home.viewAll": "View all",
  "home.shopByCategory": "Shop by Category",
  "home.shopByCategorySub": "From sashimi to shellfish, all in one place.",
  "home.shop": "Shop",
  "feature.delivery.title": "Chilled Delivery",
  "feature.delivery.body": "Free shipping on orders over ${threshold}",
  "feature.sashimi.title": "Sashimi Grade",
  "feature.sashimi.body": "Sourced from Japanese waters",
  "feature.quality.title": "Quality Promise",
  "feature.quality.body": "Inspected at the market at dawn",
  "feature.cold.title": "Cold-Chain Fresh",
  "feature.cold.body": "Packed on ice, shipped overnight",
  "cta.member": "Become a member",
  "cta.title": "Save 10% on every order. Forever.",
  "cta.body":
    "BOSBA Plus gives you free chilled delivery, member-only deals, and early access to the day's freshest catch.",
  "cta.join": "Join BOSBA Plus",
  // product
  "product.addToCart": "Add to cart",
  "product.noImage": "No image",
  "product.from": "from",
  // shop
  "shop.title": "Shop the Marketplace",
  "shop.count": "{n} fresh products",
  "shop.filters": "Filters",
  "shop.clearAll": "Clear all",
  "shop.search": "Search",
  "shop.searchPlaceholder": "Tuna, salmon, uni...",
  "shop.categories": "Categories",
  "shop.allProducts": "All Products",
  "shop.price": "Price",
  "shop.offers": "Offers",
  "shop.onSaleOnly": "On sale only",
  "shop.sort": "Sort",
  "shop.sort.featured": "Featured",
  "shop.sort.priceAsc": "Price: Low to High",
  "shop.sort.priceDesc": "Price: High to Low",
  "shop.sort.rating": "Top Rated",
  "shop.noProducts": "No products found",
  "shop.noProductsSub": "Try adjusting your filters or search term.",
  "shop.clearFilters": "Clear filters",
  // footer
  "footer.tagline":
    "Sashimi-grade Japanese seafood, sourced at the market and shipped fresh on ice to your doorstep.",
  "footer.marketplace": "Marketplace",
  "footer.sashimiFillets": "Sashimi & Fillets",
  "footer.shellfish": "Shellfish",
  "footer.roeUni": "Roe & Uni",
  "footer.company": "Company",
  "footer.mission": "Our Mission",
  "footer.fisheries": "Our Fisheries",
  "footer.sustainability": "Sustainability",
  "footer.careers": "Careers",
  "footer.joinTitle": "Join the Catch",
  "footer.joinSub": "Weekly recipes and market updates.",
  "footer.emailPlaceholder": "Email address",
  "footer.join": "Join",
  "footer.privacy": "Privacy",
  "footer.terms": "Terms",
  "footer.sitemap": "Sitemap",
} as const;

export type I18nKey = keyof typeof en;
type Dict = Record<I18nKey, string>;

const km: Dict = {
  "lang.name": "ខ្មែរ",
  "bar.storeLocator": "ទីតាំងហាង",
  "bar.delivery": "ដឹកជញ្ជូនត្រជាក់ឥតគិតថ្លៃសម្រាប់ការបញ្ជាទិញលើស ${threshold}",
  "theme.light": "ភ្លឺ",
  "theme.dark": "ងងឹត",
  "nav.allCategories": "ប្រភេទទាំងអស់",
  "nav.browse": "រកមើល",
  "nav.allProducts": "ផលិតផលទាំងអស់",
  "nav.searchPlaceholder": "ស្វែងរក ត្រាប់ ត្រីសាល់ម៉ុង អ៊ូនី...",
  "nav.wishlist": "បញ្ជីប្រាថ្នា",
  "nav.signIn": "ចូលគណនី",
  "nav.adminDashboard": "ផ្ទាំងគ្រប់គ្រង",
  "nav.signOut": "ចាកចេញ",
  "nav.cart": "កន្ត្រក",
  "home.premiumSelection": "ការជ្រើសរើសពិសេសរបស់យើង",
  "home.finestProducts": "ទិញផលិតផលល្អបំផុតរបស់យើង",
  "home.viewAll": "មើលទាំងអស់",
  "home.shopByCategory": "ទិញតាមប្រភេទ",
  "home.shopByCategorySub": "ពីសាស៊ីមី រហូតដល់សត្វសំបកសមុទ្រ ទាំងអស់នៅកន្លែងតែមួយ។",
  "home.shop": "ទិញ",
  "feature.delivery.title": "ដឹកជញ្ជូនត្រជាក់",
  "feature.delivery.body": "ដឹកជញ្ជូនឥតគិតថ្លៃសម្រាប់ការបញ្ជាទិញលើស ${threshold}",
  "feature.sashimi.title": "កម្រិតសាស៊ីមី",
  "feature.sashimi.body": "ប្រភពពីដែនទឹកជប៉ុន",
  "feature.quality.title": "ការធានាគុណភាព",
  "feature.quality.body": "ត្រួតពិនិត្យនៅផ្សារពេលព្រឹកព្រលឹម",
  "feature.cold.title": "ស្រស់ត្រជាក់",
  "feature.cold.body": "ខ្ចប់ជាមួយទឹកកក ដឹកជញ្ជូនពេលយប់",
  "cta.member": "ក្លាយជាសមាជិក",
  "cta.title": "សន្សំ ១០% លើការបញ្ជាទិញគ្រប់ពេល ជារៀងរហូត។",
  "cta.body":
    "BOSBA Plus ផ្តល់ឱ្យអ្នកនូវការដឹកជញ្ជូនត្រជាក់ឥតគិតថ្លៃ ការផ្តល់ជូនពិសេសសម្រាប់សមាជិក និងសិទ្ធិទទួលបានមុនគេនូវត្រីស្រស់ៗប្រចាំថ្ងៃ។",
  "cta.join": "ចូលរួម BOSBA Plus",
  "product.addToCart": "បន្ថែមទៅកន្ត្រក",
  "product.noImage": "គ្មានរូបភាព",
  "product.from": "ចាប់ពី",
  "shop.title": "ទិញនៅផ្សារ",
  "shop.count": "{n} ផលិតផលស្រស់",
  "shop.filters": "តម្រង",
  "shop.clearAll": "សម្អាតទាំងអស់",
  "shop.search": "ស្វែងរក",
  "shop.searchPlaceholder": "ត្រាប់ ត្រីសាល់ម៉ុង អ៊ូនី...",
  "shop.categories": "ប្រភេទ",
  "shop.allProducts": "ផលិតផលទាំងអស់",
  "shop.price": "តម្លៃ",
  "shop.offers": "ការផ្តល់ជូន",
  "shop.onSaleOnly": "តែទំនិញបញ្ចុះតម្លៃ",
  "shop.sort": "តម្រៀប",
  "shop.sort.featured": "លេចធ្លោ",
  "shop.sort.priceAsc": "តម្លៃ៖ ទាបទៅខ្ពស់",
  "shop.sort.priceDesc": "តម្លៃ៖ ខ្ពស់ទៅទាប",
  "shop.sort.rating": "ការវាយតម្លៃខ្ពស់",
  "shop.noProducts": "រកមិនឃើញផលិតផល",
  "shop.noProductsSub": "សូមកែតម្រូវតម្រង ឬពាក្យស្វែងរករបស់អ្នក។",
  "shop.clearFilters": "សម្អាតតម្រង",
  "footer.tagline":
    "ត្រីសមុទ្រជប៉ុនកម្រិតសាស៊ីមី ប្រភពពីផ្សារ និងដឹកជញ្ជូនស្រស់លើទឹកកកដល់ផ្ទះអ្នក។",
  "footer.marketplace": "ផ្សារ",
  "footer.sashimiFillets": "សាស៊ីមី និងសាច់ត្រី",
  "footer.shellfish": "សត្វសំបកសមុទ្រ",
  "footer.roeUni": "ពងត្រី និងអ៊ូនី",
  "footer.company": "ក្រុមហ៊ុន",
  "footer.mission": "បេសកកម្មរបស់យើង",
  "footer.fisheries": "កន្លែងនេសាទរបស់យើង",
  "footer.sustainability": "និរន្តរភាព",
  "footer.careers": "ការងារ",
  "footer.joinTitle": "ចូលរួមការនេសាទ",
  "footer.joinSub": "រូបមន្ត និងព័ត៌មានផ្សារប្រចាំសប្តាហ៍។",
  "footer.emailPlaceholder": "អាសយដ្ឋានអ៊ីមែល",
  "footer.join": "ចូលរួម",
  "footer.privacy": "ឯកជនភាព",
  "footer.terms": "លក្ខខណ្ឌ",
  "footer.sitemap": "ផែនទីគេហទំព័រ",
};

const ja: Dict = {
  "lang.name": "日本語",
  "bar.storeLocator": "店舗検索",
  "bar.delivery": "${threshold}以上のご注文で冷蔵配送無料",
  "theme.light": "ライト",
  "theme.dark": "ダーク",
  "nav.allCategories": "すべてのカテゴリー",
  "nav.browse": "見る",
  "nav.allProducts": "すべての商品",
  "nav.searchPlaceholder": "マグロ、サーモン、うに、ホタテを検索...",
  "nav.wishlist": "お気に入り",
  "nav.signIn": "ログイン",
  "nav.adminDashboard": "管理ダッシュボード",
  "nav.signOut": "ログアウト",
  "nav.cart": "カート",
  "home.premiumSelection": "プレミアムセレクション",
  "home.finestProducts": "厳選された商品",
  "home.viewAll": "すべて見る",
  "home.shopByCategory": "カテゴリーから探す",
  "home.shopByCategorySub": "刺身から貝類まで、すべてここに。",
  "home.shop": "見る",
  "feature.delivery.title": "冷蔵配送",
  "feature.delivery.body": "${threshold}以上のご注文で送料無料",
  "feature.sashimi.title": "刺身グレード",
  "feature.sashimi.body": "日本の海から直送",
  "feature.quality.title": "品質保証",
  "feature.quality.body": "夜明けの市場で検品",
  "feature.cold.title": "コールドチェーン鮮度",
  "feature.cold.body": "氷詰めで翌日配送",
  "cta.member": "会員になる",
  "cta.title": "すべての注文がいつでも10%オフ。",
  "cta.body":
    "BOSBA Plus なら、冷蔵配送無料、会員限定セール、その日の新鮮な魚介への早期アクセスが楽しめます。",
  "cta.join": "BOSBA Plus に参加",
  "product.addToCart": "カートに追加",
  "product.noImage": "画像なし",
  "product.from": "〜",
  "shop.title": "マーケットで買う",
  "shop.count": "{n} 点の新鮮な商品",
  "shop.filters": "フィルター",
  "shop.clearAll": "すべてクリア",
  "shop.search": "検索",
  "shop.searchPlaceholder": "マグロ、サーモン、うに...",
  "shop.categories": "カテゴリー",
  "shop.allProducts": "すべての商品",
  "shop.price": "価格",
  "shop.offers": "セール",
  "shop.onSaleOnly": "セール商品のみ",
  "shop.sort": "並び替え",
  "shop.sort.featured": "おすすめ",
  "shop.sort.priceAsc": "価格: 安い順",
  "shop.sort.priceDesc": "価格: 高い順",
  "shop.sort.rating": "評価が高い順",
  "shop.noProducts": "商品が見つかりません",
  "shop.noProductsSub": "フィルターや検索語を調整してください。",
  "shop.clearFilters": "フィルターをクリア",
  "footer.tagline":
    "刺身グレードの日本産魚介を市場から仕入れ、氷詰めで新鮮なままご自宅へお届けします。",
  "footer.marketplace": "マーケット",
  "footer.sashimiFillets": "刺身・切り身",
  "footer.shellfish": "貝類",
  "footer.roeUni": "魚卵・うに",
  "footer.company": "会社情報",
  "footer.mission": "私たちの使命",
  "footer.fisheries": "漁場について",
  "footer.sustainability": "サステナビリティ",
  "footer.careers": "採用情報",
  "footer.joinTitle": "Join the Catch",
  "footer.joinSub": "毎週のレシピと市場情報。",
  "footer.emailPlaceholder": "メールアドレス",
  "footer.join": "登録",
  "footer.privacy": "プライバシー",
  "footer.terms": "利用規約",
  "footer.sitemap": "サイトマップ",
};

const DICTS: Record<Locale, Dict> = { en, km, ja };

function interpolate(s: string, vars?: Record<string, string | number>) {
  if (!vars) return s;
  return s.replace(/\$?\{(\w+)\}/g, (_, k: string) =>
    vars[k] != null ? String(vars[k]) : `{${k}}`,
  );
}

type Ctx = {
  locale: Locale;
  setLocale: (l: Locale) => void;
  t: (key: I18nKey, vars?: Record<string, string | number>) => string;
};

const I18nContext = createContext<Ctx | null>(null);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>("en");

  useEffect(() => {
    const saved = localStorage.getItem("locale") as Locale | null;
    if (saved && saved in DICTS) {
      setLocaleState(saved);
      document.documentElement.lang = saved;
    }
  }, []);

  const setLocale = (l: Locale) => {
    setLocaleState(l);
    localStorage.setItem("locale", l);
    document.documentElement.lang = l;
  };

  const t = useCallback<Ctx["t"]>(
    (key, vars) => interpolate(DICTS[locale][key] ?? en[key] ?? key, vars),
    [locale],
  );

  return <I18nContext.Provider value={{ locale, setLocale, t }}>{children}</I18nContext.Provider>;
}

export function useI18n() {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error("useI18n must be used within LanguageProvider");
  return ctx;
}
