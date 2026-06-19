import { createFileRoute, Link } from "@tanstack/react-router";
import { HeroSlider } from "@/components/hero-slider";
import { ProductCard } from "@/components/product-card";
import {
  useCategories,
  useProducts,
  useStoreSettings,
  useAllVariations,
} from "@/hooks/use-products";
import { ArrowRight, Truck, Fish, ShieldCheck, Snowflake } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { useI18n } from "@/lib/i18n";
import { groupVariations, productFromPrice } from "@/lib/variants";

export const Route = createFileRoute("/_store/")({
  component: Home,
});

function Home() {
  const { data: products = [], isLoading } = useProducts();
  const { data: categories = [] } = useCategories();
  const { data: settings } = useStoreSettings();
  const { data: variations = [] } = useAllVariations();
  const { t } = useI18n();
  const variationsByProduct = groupVariations(variations);
  const featured = products.slice(0, 6);
  const shipThreshold = Number(settings?.free_shipping_threshold ?? 50);

  const features = [
    {
      icon: Truck,
      title: t("feature.delivery.title"),
      body: t("feature.delivery.body", { threshold: shipThreshold }),
    },
    { icon: Fish, title: t("feature.sashimi.title"), body: t("feature.sashimi.body") },
    { icon: ShieldCheck, title: t("feature.quality.title"), body: t("feature.quality.body") },
    { icon: Snowflake, title: t("feature.cold.title"), body: t("feature.cold.body") },
  ];

  return (
    <div className="space-y-20 pb-12">
      <HeroSlider />

      {/* Features strip */}
      <section className="mx-auto max-w-7xl px-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {features.map((f) => (
            <div key={f.title} className="bg-card border rounded-2xl p-5 flex items-start gap-4">
              <div className="size-11 rounded-xl bg-brand/10 text-brand grid place-items-center shrink-0">
                <f.icon className="size-5" />
              </div>
              <div>
                <p className="font-display font-bold text-sm">{f.title}</p>
                <p className="text-xs text-muted-foreground mt-0.5">{f.body}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Categories */}
      <section className="mx-auto max-w-7xl px-6">
        <div className="flex items-end justify-between mb-8">
          <div>
            <h2 className="font-display font-bold text-3xl md:text-4xl">
              {t("home.shopByCategory")}
            </h2>
            <p className="text-muted-foreground mt-1">{t("home.shopByCategorySub")}</p>
          </div>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {categories.map((c, i) => (
            <Link
              key={c.id}
              to="/shop"
              search={{ category: c.slug }}
              className="group relative aspect-square rounded-3xl bg-surface border border-[rgba(201,168,76,0.18)] overflow-hidden p-5 flex flex-col items-center justify-center text-center transition-all duration-500 hover:-translate-y-1 hover:border-[rgba(201,168,76,0.5)]"
            >
              {/* Gold halo pedestal */}
              <div className="relative mb-4 grid place-items-center">
                <div className="pointer-events-none absolute -inset-3 rounded-full bg-[radial-gradient(circle,rgba(201,168,76,0.30),transparent_70%)] opacity-70 blur-md transition-opacity duration-500 group-hover:opacity-100" />
                <div className="relative size-24 overflow-hidden rounded-full border border-[rgba(201,168,76,0.4)] bg-muted grid place-items-center">
                  {c.image_url ? (
                    <img
                      src={c.image_url}
                      alt=""
                      className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                  ) : (
                    <span className="text-4xl">{["🐟", "🍣", "🦐", "🦀", "🦑", "🐙"][i % 6]}</span>
                  )}
                </div>
              </div>
              <p className="font-serif text-base text-foreground">{c.name}</p>
              <p className="mt-1 inline-flex items-center gap-1 text-xs text-muted-foreground transition-colors group-hover:text-brand">
                {t("home.shop")}{" "}
                <ArrowRight className="size-3 transition-transform group-hover:translate-x-0.5" />
              </p>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured Products */}
      <section className="mx-auto max-w-7xl px-6">
        <div className="mb-10 flex flex-col items-center text-center">
          <span className="text-xs font-bold uppercase tracking-[0.25em] text-brand">
            {t("home.premiumSelection")}
          </span>
          <h2 className="mt-3 font-serif text-[32px] leading-tight text-foreground">
            {t("home.finestProducts")}
          </h2>
          <span className="mt-4 block h-px w-16 bg-brand/50" aria-hidden />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {isLoading
            ? Array.from({ length: 6 }).map((_, i) => (
                <Skeleton key={i} className="aspect-[4/5] rounded-[16px]" />
              ))
            : featured.map((p) => (
                <ProductCard
                  key={p.id}
                  product={p}
                  fromPrice={productFromPrice(p, variationsByProduct.get(p.id) ?? [])}
                />
              ))}
        </div>
        <div className="mt-10 text-center">
          <Link
            to="/shop"
            className="inline-flex items-center gap-2 text-sm font-bold text-brand transition-all hover:gap-3"
          >
            {t("home.viewAll")} <ArrowRight className="size-4" />
          </Link>
        </div>
      </section>

      {/* CTA Banner */}
      <section className="mx-auto max-w-7xl px-6">
        <div className="relative overflow-hidden rounded-3xl bg-surface border border-border p-10 md:p-16 grid md:grid-cols-2 gap-8 items-center">
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-brand mb-3">
              {t("cta.member")}
            </p>
            <h3 className="font-display font-bold text-3xl md:text-5xl text-foreground leading-tight">
              {t("cta.title")}
            </h3>
            <p className="text-muted-foreground mt-4 max-w-md">{t("cta.body")}</p>
            <Link
              to="/auth"
              className="inline-flex mt-6 items-center gap-2 rounded-full bg-brand text-brand-foreground px-6 py-3 text-sm font-bold hover:bg-secondary-accent transition-colors"
            >
              {t("cta.join")} <ArrowRight className="size-4" />
            </Link>
          </div>
          <div className="hidden md:block text-9xl text-center">🍣</div>
        </div>
      </section>
    </div>
  );
}
