import { createFileRoute, Link } from "@tanstack/react-router";
import { HeroSlider } from "@/components/hero-slider";
import { ProductCard } from "@/components/product-card";
import { useCategories, useProducts, useStoreSettings } from "@/hooks/use-products";
import { ArrowRight, Truck, Fish, ShieldCheck, Snowflake } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

export const Route = createFileRoute("/_store/")({
  component: Home,
});

function Home() {
  const { data: products = [], isLoading } = useProducts();
  const { data: categories = [] } = useCategories();
  const { data: settings } = useStoreSettings();
  const featured = products.slice(0, 8);
  const shipThreshold = Number(settings?.free_shipping_threshold ?? 50);

  const features = [
    { icon: Truck, title: "Chilled Delivery", body: `Free shipping on orders over $${shipThreshold}` },
    { icon: Fish, title: "Sashimi Grade", body: "Sourced from Japanese waters" },
    { icon: ShieldCheck, title: "Quality Promise", body: "Inspected at the market at dawn" },
    { icon: Snowflake, title: "Cold-Chain Fresh", body: "Packed on ice, shipped overnight" },
  ];

  return (
    <div className="space-y-20 pb-12">
      <div className="pt-6">
        <HeroSlider />
      </div>

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
            <h2 className="font-display font-bold text-3xl md:text-4xl">Shop by Category</h2>
            <p className="text-muted-foreground mt-1">From sashimi to shellfish, all in one place.</p>
          </div>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {categories.map((c, i) => (
            <Link
              key={c.id}
              to="/shop"
              search={{ category: c.slug }}
              className="group relative aspect-square rounded-3xl bg-gradient-to-br from-brand/15 to-accent/30 border overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all p-5 flex flex-col justify-between"
            >
              {c.image_url ? (
                <img
                  src={c.image_url}
                  alt=""
                  className="size-16 object-contain drop-shadow-md transition-transform group-hover:scale-110 group-hover:-rotate-6"
                />
              ) : (
                <span className="text-3xl">{["🐟", "🍣", "🦐", "🦀", "🦑", "🐙"][i % 6]}</span>
              )}
              <div>
                <p className="font-display font-bold text-sm">{c.name}</p>
                <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                  Shop{" "}
                  <ArrowRight className="size-3 group-hover:translate-x-0.5 transition-transform" />
                </p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured Products */}
      <section className="mx-auto max-w-7xl px-6">
        <div className="flex items-end justify-between mb-8">
          <div>
            <h2 className="font-display font-bold text-3xl md:text-4xl">Today's Catch</h2>
            <p className="text-muted-foreground mt-1">Landed this morning, on ice by noon.</p>
          </div>
          <Link
            to="/shop"
            className="hidden sm:inline-flex items-center gap-2 text-sm font-bold text-brand hover:gap-3 transition-all"
          >
            View all <ArrowRight className="size-4" />
          </Link>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
          {isLoading
            ? Array.from({ length: 8 }).map((_, i) => (
                <Skeleton key={i} className="aspect-[3/4] rounded-3xl" />
              ))
            : featured.map((p) => <ProductCard key={p.id} product={p} />)}
        </div>
      </section>

      {/* CTA Banner */}
      <section className="mx-auto max-w-7xl px-6">
        <div className="relative overflow-hidden rounded-3xl bg-surface border border-border p-10 md:p-16 grid md:grid-cols-2 gap-8 items-center">
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-brand mb-3">
              Become a member
            </p>
            <h3 className="font-display font-bold text-3xl md:text-5xl text-foreground leading-tight">
              Save 10% on every order. Forever.
            </h3>
            <p className="text-muted-foreground mt-4 max-w-md">
              BOSBA Plus gives you free chilled delivery, member-only deals, and early access to the
              day's freshest catch.
            </p>
            <Link
              to="/auth"
              className="inline-flex mt-6 items-center gap-2 rounded-full bg-brand text-brand-foreground px-6 py-3 text-sm font-bold hover:bg-secondary-accent transition-colors"
            >
              Join BOSBA Plus <ArrowRight className="size-4" />
            </Link>
          </div>
          <div className="hidden md:block text-9xl text-center">🍣</div>
        </div>
      </section>
    </div>
  );
}
