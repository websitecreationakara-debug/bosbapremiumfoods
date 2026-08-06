import { useRef } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { motion, useScroll, useTransform, type MotionValue } from "motion/react";
import { ArrowRight, ChevronDown, MapPin } from "lucide-react";
import { useProducts } from "@/hooks/use-products";
import { ProductCard } from "@/components/product-card";
import { Scene } from "@/components/wagyu/scroll-scene";

const SITE = "https://bosbapremiumfoods.com";

// Real facts pulled from the live product pages (wagyu-a4 / wagyu-a5) so the
// story's badges match what's actually sold, not invented numbers.
const A4_MARBLING = "5–7";
const A5_MARBLING = "8–12";

// PLACEHOLDER — no specific prefecture/farm is set in the product data yet
// (both products just say "Product of Japan"). Swap this for the real
// region/farm name once Demo has it; everything else on the page still holds.
const ORIGIN_REGION = "Kyushu, Japan";

// Real, freely-licensed photos (Wikimedia Commons) chosen as stand-ins until
// real supplier/farm photography is available. Strength varies -- see the
// per-scene comments below for which ones are the best swap candidates.
const IMG = {
  // Real BOSBA product photo, already live on this site's own hero banner.
  wagyuHero: "/media/wagyu-6da72c50.jpg",
  // Standard Wikipedia locator map of Japan (real cartography, CC-licensed).
  japanMap: "https://upload.wikimedia.org/wikipedia/commons/6/6e/Japan_location_map.svg",
  // Shirakawa-go gassho-zukuri farmhouse -- strong match, real thatched-roof
  // Japanese farmhouse with mountains already visible behind it.
  farmhouseDoor:
    "https://upload.wikimedia.org/wikipedia/commons/8/87/Gassho-zukuri_farmhouse-01.jpg",
  // Real black wagyu-type cattle on a Japanese farm (Utsunomiya). Decent but
  // not a perfect match -- best candidate to replace with real supplier photos
  // of actual day-to-day care (grooming, stalls, etc).
  care: "https://upload.wikimedia.org/wikipedia/commons/4/47/Utsunomiya_Cattle.jpg",
  // PLACEHOLDER -- generic UK cattle-feed photo, not Japan-specific. Weakest
  // image on the page; replace first if you get real feeding photos.
  diet: "https://upload.wikimedia.org/wikipedia/commons/b/b2/Hay_bales_and_cattle_feed_-_geograph.org.uk_-_5483557.jpg",
  // Wide Shirakawa-go valley shot -- real mountains + green fields, though no
  // cattle in frame. Best available real "open air" landscape found; a real
  // photo of your supplier's own pasture would be a strong upgrade here.
  pasture:
    "https://upload.wikimedia.org/wikipedia/commons/4/48/Historic_Village_of_Shirakawa-go_%282016%29_-_img_11.jpg",
};

const STAGES = ["Origin", "Care", "Diet", "Freedom", "Table"];

export const Route = createFileRoute("/_store/wagyu")({
  head: () => ({
    meta: [
      { title: "The Story of Our Wagyu — BOSBA Premium Foods" },
      {
        name: "description",
        content:
          "Where our Japanese wagyu comes from, how it's raised, and why the marbling speaks for itself. A4 and A5 grade, Product of Japan.",
      },
      { property: "og:url", content: `${SITE}/wagyu` },
    ],
    links: [{ rel: "canonical", href: `${SITE}/wagyu` }],
  }),
  component: WagyuStory,
});

function WagyuStory() {
  const storyRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: storyRef,
    offset: ["start start", "end end"],
  });
  const activeStage = useTransform(scrollYProgress, [0, 1], [0, STAGES.length - 1]);

  const { data: products = [] } = useProducts();
  const wagyuProducts = products.filter((p) => p.title.toLowerCase().includes("wagyu"));

  return (
    <div className="bg-black text-white">
      <Hero />

      {/* Slim progress rail, desktop only -- shows which beat of the story is active */}
      <div className="pointer-events-none fixed inset-y-0 left-4 z-30 hidden md:flex items-center">
        <div className="flex flex-col gap-4">
          {STAGES.map((label, i) => (
            <StageDot key={label} label={label} index={i} activeStage={activeStage} />
          ))}
        </div>
      </div>

      <div ref={storyRef}>
        <Scene image={IMG.farmhouseDoor} imageAlt="Traditional Japanese farmhouse" zoomFrom={1.15} zoomTo={1}>
          <div className="max-w-xl">
            <p className="mb-3 text-sm font-semibold uppercase tracking-widest text-brand">Origin</p>
            <h2 className="font-display text-3xl font-semibold leading-tight md:text-5xl">
              This is where the story starts
            </h2>
            <p className="mt-4 text-base text-white/80 md:text-lg">
              A working farmhouse in {ORIGIN_REGION} — generations of the same quiet,
              careful approach to raising cattle.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Badge label={`A4 marbling ${A4_MARBLING}`} />
              <Badge label={`A5 marbling ${A5_MARBLING}`} />
            </div>
          </div>
        </Scene>

        <Scene image={IMG.care} imageAlt="Wagyu cattle being cared for">
          <div className="max-w-xl">
            <p className="mb-3 text-sm font-semibold uppercase tracking-widest text-brand">Care</p>
            <h2 className="font-display text-3xl font-semibold leading-tight md:text-5xl">
              Raised without rushing
            </h2>
            <p className="mt-4 text-base text-white/80 md:text-lg">
              Every animal is looked after individually — clean housing, low stress,
              and the kind of patient daily attention that shows up later in the
              marbling. There are no shortcuts to A5.
            </p>
          </div>
        </Scene>

        <Scene image={IMG.diet} imageAlt="Cattle feed and roughage">
          <div className="max-w-xl">
            <p className="mb-3 text-sm font-semibold uppercase tracking-widest text-brand">Diet</p>
            <h2 className="font-display text-3xl font-semibold leading-tight md:text-5xl">
              A carefully balanced diet
            </h2>
            <p className="mt-4 text-base text-white/80 md:text-lg">
              Grain and roughage in careful proportion, fed on a steady daily rhythm —
              the slow, consistent feeding that builds the fine, even marbling wagyu
              is known for.
            </p>
          </div>
        </Scene>

        <Scene image={IMG.pasture} imageAlt="Green fields with mountains in the distance" zoomFrom={1} zoomTo={1.1}>
          <div className="max-w-xl">
            <p className="mb-3 text-sm font-semibold uppercase tracking-widest text-brand">Freedom</p>
            <h2 className="font-display text-3xl font-semibold leading-tight md:text-5xl">
              Open air, real ground underfoot
            </h2>
            <p className="mt-4 text-base text-white/80 md:text-lg">
              Mountains on the horizon, space to move, and fresh air every day —
              raised the way it's meant to be, not confined to a shed.
            </p>
          </div>
        </Scene>
      </div>

      <ShopSection products={wagyuProducts} />
    </div>
  );
}

function Hero() {
  return (
    <section className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden px-6 py-24">
      <div className="mx-auto grid w-full max-w-6xl items-center gap-10 md:grid-cols-2">
        <div className="order-2 md:order-1">
          <p className="mb-3 text-sm font-semibold uppercase tracking-widest text-brand">
            Product of Japan
          </p>
          <h1 className="font-display text-4xl font-semibold leading-tight md:text-6xl">
            The Story of Our Wagyu
          </h1>
          <p className="mt-5 max-w-md text-base text-white/70 md:text-lg">
            From a small farm in {ORIGIN_REGION} to your table — scroll to see how
            it's raised.
          </p>
        </div>
        <div className="order-1 md:order-2">
          <img
            src={IMG.wagyuHero}
            alt="BOSBA A5 Wagyu"
            className="aspect-[4/3] w-full rounded-2xl object-cover shadow-2xl"
          />
        </div>
      </div>

      <div className="relative mx-auto mt-14 aspect-square w-full max-w-md">
        <img
          src={IMG.japanMap}
          alt="Map of Japan"
          className="h-full w-full object-contain opacity-90 [filter:grayscale(1)_brightness(0.55)_sepia(0.4)_hue-rotate(-10deg)_saturate(2)]"
        />
        {/* Placeholder pin -- approximate Kyushu position on the standard Japan locator map */}
        <div className="absolute" style={{ left: "38%", top: "78%" }}>
          <span className="absolute -inset-3 animate-ping rounded-full bg-brand/40" />
          <MapPin className="relative size-6 -translate-x-1/2 -translate-y-full text-brand" fill="currentColor" />
        </div>
      </div>

      <motion.div
        animate={{ y: [0, 8, 0] }}
        transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
        className="absolute bottom-8 flex flex-col items-center gap-1 text-white/60"
      >
        <span className="text-xs uppercase tracking-widest">Scroll</span>
        <ChevronDown className="size-5" />
      </motion.div>
    </section>
  );
}

function Badge({ label }: { label: string }) {
  return (
    <span className="rounded-full border border-brand/50 bg-black/40 px-4 py-1.5 text-sm font-medium text-brand backdrop-blur-sm">
      {label}
    </span>
  );
}

function StageDot({
  label,
  index,
  activeStage,
}: {
  label: string;
  index: number;
  activeStage: MotionValue<number>;
}) {
  const opacity = useTransform(activeStage, (v) => (Math.round(v) === index ? 1 : 0.4));
  const scale = useTransform(activeStage, (v) => (Math.round(v) === index ? 1 : 0.7));
  return (
    <div className="flex items-center gap-2">
      <motion.span style={{ opacity, scale }} className="size-2 rounded-full bg-brand" />
      <motion.span style={{ opacity }} className="text-xs uppercase tracking-widest text-white">
        {label}
      </motion.span>
    </div>
  );
}

function ShopSection({ products }: { products: ReturnType<typeof useProducts>["data"] }) {
  return (
    <section className="bg-white px-6 py-20 text-black md:py-28">
      <div className="mx-auto max-w-6xl text-center">
        <p className="mb-3 text-sm font-semibold uppercase tracking-widest text-brand">Table</p>
        <h2 className="font-display text-3xl font-semibold md:text-5xl">Now it's yours</h2>
        <p className="mx-auto mt-4 max-w-xl text-muted-foreground">
          Real A4 and A5 grade Japanese wagyu, delivered chilled across Cambodia.
        </p>

        {products && products.length > 0 && (
          <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-2">
            {products.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        )}

        <Link
          to="/shop"
          className="mt-10 inline-flex items-center gap-2 rounded-full bg-brand px-8 py-3.5 text-sm font-semibold text-brand-foreground shadow-lg transition-colors hover:bg-secondary-accent"
        >
          Shop all Wagyu <ArrowRight className="size-4" />
        </Link>
      </div>
    </section>
  );
}
