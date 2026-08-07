import { useRef } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { motion, useScroll, useSpring, useTransform, type MotionValue } from "motion/react";
import { ArrowRight, ChevronDown, Clock, Home, MapPin, ShieldCheck, Tag } from "lucide-react";
import { useProducts } from "@/hooks/use-products";
import { ProductCard } from "@/components/product-card";
import { Scene } from "@/components/wagyu/scroll-scene";
import { ProductShowcase3D } from "@/components/wagyu/product-showcase-3d";
import { BarnDoorScene } from "@/components/wagyu/barn-door-3d";

const SITE = "https://bosbapremiumfoods.com";

// Real facts pulled from the live product pages (wagyu-a4 / wagyu-a5) so the
// story's badges match what's actually sold, not invented numbers.
const A4_MARBLING = "5–7";
const A5_MARBLING = "8–12";

// PLACEHOLDER — no specific prefecture/farm is set in the product data yet
// (both products just say "Product of Japan"). Swap this for the real
// region/farm name once Demo has it; everything else on the page still holds.
const ORIGIN_REGION = "Kyushu, Japan";

// Real, freely-licensed photos (Wikimedia Commons, sized down to ~1280px
// thumbnails so the scroll animation stays smooth) chosen as stand-ins until
// real supplier/farm photography is available. Strength varies -- see the
// per-scene comments below for which ones are the best swap candidates.
const IMG = {
  // Demo's own real promotional banner (compressed from the original 2.96MB
  // PNG down to a 147KB JPEG so it doesn't fight the smoothness fix below).
  heroBanner: "/wagyu/hero-banner.jpg",
  // Standard Wikipedia locator map of Japan (real cartography, CC-licensed) --
  // tinted to look like an aged illustrated map rather than shown flat/blue.
  japanMap: "https://upload.wikimedia.org/wikipedia/commons/6/6e/Japan_location_map.svg",
  // Demo-provided photo of cattle at a feed rail (Broad Water Downs Wagyu's
  // own marketing photo, not free-licensed or ours) -- used for local preview
  // only per Demo's request. Flag before this ever ships live: swap for a
  // free-licensed or Demo's own supplier photo to avoid using another
  // company's proprietary imagery on a real deployed page.
  cowsFeeding: "/wagyu/cows-feeding.webp",
  // Real Tajima-bloodline wagyu calves inside an actual barn stall, ear tags
  // visible -- strong, authentic match for day-to-day care.
  care: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c7/Tajimagyu1.jpg/1280px-Tajimagyu1.jpg",
  // PLACEHOLDER -- generic UK cattle-feed photo, not Japan-specific. Weakest
  // image on the page; replace first if you get real feeding photos.
  diet: "https://upload.wikimedia.org/wikipedia/commons/b/b2/Hay_bales_and_cattle_feed_-_geograph.org.uk_-_5483557.jpg",
  // Real wagyu-type cow resting in a pasture with Mount Aso behind it --
  // exactly the "mountains + open air" shot originally asked for.
  pasture:
    "https://upload.wikimedia.org/wikipedia/commons/thumb/8/86/Cow_%26_Mt_Aso_01.JPG/1280px-Cow_%26_Mt_Aso_01.JPG",
};

const STAGES = ["Origin", "Arrival", "Care", "Diet", "Freedom"];

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
  const smoothProgress = useSpring(scrollYProgress, { stiffness: 260, damping: 40, mass: 0.4 });
  const activeStage = useTransform(smoothProgress, [0, 1], [0, STAGES.length - 1]);

  const { data: products = [] } = useProducts();
  const wagyuProducts = products.filter((p) => p.title.toLowerCase().includes("wagyu"));

  return (
    <div className="bg-[#f0ece1] text-[#2a2420]">
      <Hero />

      {/* Slim progress rail, desktop only -- shows which beat of the story is active */}
      <div className="pointer-events-none fixed inset-y-0 left-4 z-30 hidden md:flex items-center">
        <div className="flex flex-col gap-4 rounded-full border border-[#2a2420]/10 bg-[#f0ece1]/70 px-4 py-5 backdrop-blur-md">
          {STAGES.map((label, i) => (
            <StageDot key={label} label={label} index={i} activeStage={activeStage} />
          ))}
        </div>
      </div>

      <div ref={storyRef}>
        <Scene
          image={IMG.japanMap}
          imageAlt="Illustrated map of Japan"
          heightVh={180}
          zoomFrom={1}
          zoomTo={1.5}
          imageClassName="!object-contain p-16 md:p-28 [filter:sepia(0.75)_saturate(2.2)_brightness(0.85)_contrast(1.05)_hue-rotate(-10deg)]"
          overlay={
            <div className="pointer-events-none absolute z-10" style={{ left: "38%", top: "78%" }}>
              <span className="absolute -inset-3 animate-ping rounded-full bg-[#C97A2B]/40" />
              <MapPin
                className="relative size-6 -translate-x-1/2 -translate-y-full text-[#C97A2B]"
                fill="currentColor"
              />
            </div>
          }
        >
          <p className="mb-3 text-sm font-semibold uppercase tracking-widest text-[#C97A2B]">
            Origin
          </p>
          <h2 className="font-serif text-3xl font-semibold leading-tight text-white md:text-5xl">
            Every great <em className="italic">wagyu</em> starts with where it's from
          </h2>
          <p className="mt-4 font-light text-base text-white/80 md:text-lg">{ORIGIN_REGION}</p>
        </Scene>

        <BarnDoorScene interiorImage={IMG.cowsFeeding}>
          <p className="mb-3 text-sm font-semibold uppercase tracking-widest text-[#C97A2B]">
            Arrival
          </p>
          <h2 className="font-serif text-3xl font-semibold leading-tight text-white md:text-5xl">
            This is where the <em className="italic">cattle</em> live
          </h2>
          <p className="mt-4 font-light text-base text-white/80 md:text-lg">
            A working cattle barn in {ORIGIN_REGION} — open-sided sheds, rice paddies out front, and
            generations of the same quiet, careful approach to raising cattle.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Badge label={`A4 marbling ${A4_MARBLING}`} />
            <Badge label={`A5 marbling ${A5_MARBLING}`} />
          </div>
        </BarnDoorScene>

        <CareGrid />
        <DietList />

        <Scene
          image={IMG.pasture}
          imageAlt="Wagyu cow resting in a green pasture with a mountain behind it"
          zoomFrom={1}
          zoomTo={1.1}
        >
          <p className="mb-3 text-sm font-semibold uppercase tracking-widest text-[#C97A2B]">
            Freedom
          </p>
          <h2 className="font-serif text-3xl font-semibold leading-tight text-white md:text-5xl">
            Open air, real ground underfoot
          </h2>
          <p className="mt-4 font-light text-base text-white/80 md:text-lg">
            Mountains on the horizon, space to move, and fresh air every day — raised the way it's
            meant to be, not confined indoors.
          </p>
        </Scene>
      </div>

      <Closing />

      <ProductShowcase3D
        imageUrl={wagyuProducts[0]?.image_url}
        label={wagyuProducts[0]?.title ?? "A5 Wagyu"}
      />

      <ShopSection products={wagyuProducts} />
    </div>
  );
}

function Hero() {
  return (
    <section className="relative flex min-h-screen flex-col items-center justify-end overflow-hidden">
      <img
        src={IMG.heroBanner}
        alt="BOSBA Premium Foods — Japanese A4 A5 Wagyu Steak, unmatched marbling, unforgettable flavor"
        className="absolute inset-0 h-full w-full object-cover"
      />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#f0ece1] via-[#141210]/10 to-[#141210]/30" />

      <div className="relative z-10 mb-16 max-w-2xl px-6 text-center text-white">
        <p className="mb-3 text-xs uppercase tracking-[0.3em] text-[#D9A35F]">和牛 · Wagyu</p>
        <h1 className="font-serif text-4xl font-semibold leading-tight md:text-6xl">
          Crafted in Japan, <em className="italic">raised</em> without shortcuts
        </h1>
        <p className="mx-auto mt-4 max-w-md font-light text-white/80">
          A4 and A5 grade Japanese wagyu — the marbling speaks for itself.
        </p>
      </div>

      <motion.div
        animate={{ y: [0, 8, 0] }}
        transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
        className="relative z-10 mb-10 flex flex-col items-center gap-1 text-white/70"
      >
        <span className="text-xs uppercase tracking-widest">Scroll to see where it's from</span>
        <ChevronDown className="size-5 text-[#D9A35F]" />
      </motion.div>
    </section>
  );
}

function Badge({ label }: { label: string }) {
  return (
    <span className="rounded-full border border-[#D9A35F]/50 bg-[#141210]/40 px-4 py-1.5 text-sm font-medium text-[#D9A35F] backdrop-blur-sm">
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
      <motion.span style={{ opacity, scale }} className="size-2 rounded-full bg-[#C97A2B]" />
      <motion.span style={{ opacity }} className="text-xs uppercase tracking-widest text-[#2a2420]">
        {label}
      </motion.span>
    </div>
  );
}

// Chapter 4 of the reference structure: a 2x2 icon-card grid next to a
// supporting photo -- the same real Care facts the old flat Scene had,
// just restructured into individually legible cards instead of one paragraph.
function CareGrid() {
  const items = [
    {
      icon: Tag,
      title: "Individually Tagged",
      body: "Every animal is tracked and looked after on its own, not as a herd.",
    },
    {
      icon: Home,
      title: "Clean Housing",
      body: "Open-sided shelter, kept clean, low-stress by design.",
    },
    {
      icon: ShieldCheck,
      title: "No Shortcuts",
      body: "There's no fast path to A5 — only consistent, patient care.",
    },
    {
      icon: Clock,
      title: "Daily Attention",
      body: "The kind of quiet, repeated attention that shows up later in the marbling.",
    },
  ];
  return (
    <section className="bg-[#f0ece1] px-6 py-20 text-[#2a2420] md:py-28">
      <div className="mx-auto grid max-w-[1280px] gap-12 md:grid-cols-2 md:items-center">
        <div>
          <p className="mb-3 text-sm font-semibold uppercase tracking-widest text-[#C97A2B]">
            Care
          </p>
          <h2 className="font-serif text-3xl font-semibold leading-tight md:text-4xl">
            Raised <em className="italic">without</em> rushing
          </h2>
          <div className="mt-8 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-2">
            {items.map(({ icon: Icon, title, body }) => (
              <div key={title} className="border-t border-[#2a2420]/15 pt-4">
                <Icon className="mb-3 size-5 text-[#C97A2B]" />
                <p className="font-serif text-lg font-semibold">{title}</p>
                <p className="mt-1 font-light text-sm text-[#2a2420]/70">{body}</p>
              </div>
            ))}
          </div>
        </div>
        <img
          src={IMG.care}
          alt="Wagyu cattle being cared for inside the barn"
          className="aspect-[4/5] w-full rounded-sm object-cover"
        />
      </div>
    </section>
  );
}

// Chapter 5: a numbered list next to a photo. Kept to the same level of
// specificity as the site's existing, already-reviewed diet copy ("grain and
// roughage... steady daily rhythm") rather than inventing more precise
// ingredient claims (e.g. a specific rice-straw/barley mix) that haven't been
// confirmed for this actual supplier.
function DietList() {
  const items = [
    { n: "01", name: "Grain", note: "energy and marbling" },
    { n: "02", name: "Roughage", note: "fiber, steady digestion" },
    { n: "03", name: "Fresh water", note: "always available" },
    { n: "04", name: "Steady rhythm", note: "same time, every day" },
  ];
  return (
    <section className="bg-[#f0ece1] px-6 py-20 text-[#2a2420] md:py-28">
      <div className="mx-auto grid max-w-[1280px] gap-12 md:grid-cols-2 md:items-center">
        <img
          src={IMG.diet}
          alt="Cattle feed and roughage"
          className="aspect-[4/5] w-full rounded-sm object-cover md:order-1"
        />
        <div>
          <p className="mb-3 text-sm font-semibold uppercase tracking-widest text-[#C97A2B]">
            Diet
          </p>
          <h2 className="font-serif text-3xl font-semibold leading-tight md:text-4xl">
            A carefully <em className="italic">balanced</em> diet
          </h2>
          <ul className="mt-8 divide-y divide-[#2a2420]/15">
            {items.map(({ n, name, note }) => (
              <li key={n} className="flex items-baseline gap-4 py-4">
                <span className="font-serif text-sm text-[#C97A2B]">{n}</span>
                <span className="font-medium">{name}</span>
                <span className="flex-1 border-b border-dashed border-[#2a2420]/25" />
                <span className="font-light text-sm text-[#2a2420]/60">{note}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}

// Chapter 6: horizontally scrolling marquee, then a dark closing statement
// with real facts (marbling ranges already used elsewhere on this page,
// not invented) and a small footer -- reusing the site's real address/phone
// already shown in the mobile nav (site-header.tsx), not new/fabricated data.
function Closing() {
  const phrases = ["A5 Wagyu", "Product of Japan", "BOSBA Premium Foods"];
  const marquee = [...phrases, ...phrases, ...phrases, ...phrases];

  return (
    <section className="bg-[#141210] text-white">
      <div className="overflow-hidden border-y border-white/10 py-6">
        <motion.div
          animate={{ x: ["0%", "-50%"] }}
          transition={{ duration: 22, repeat: Infinity, ease: "linear" }}
          className="flex w-max items-center gap-8 whitespace-nowrap"
        >
          {[...marquee, ...marquee].map((phrase, i) => (
            <span
              key={i}
              className="flex items-center gap-8 text-sm uppercase tracking-widest text-white/50"
            >
              {phrase}
              <span className="text-[#C97A2B]">✦</span>
            </span>
          ))}
        </motion.div>
      </div>

      <div className="mx-auto max-w-[1280px] px-6 py-20 md:py-28">
        <p className="font-serif text-2xl italic leading-snug text-white/90 md:text-4xl">
          From {ORIGIN_REGION} to your table — real wagyu, delivered chilled across Cambodia.
        </p>

        <div className="mt-10 flex flex-wrap gap-x-10 gap-y-4 text-sm uppercase tracking-widest text-white/60">
          <span>
            A4 marbling <span className="text-[#D9A35F]">{A4_MARBLING}</span>
          </span>
          <span>
            A5 marbling <span className="text-[#D9A35F]">{A5_MARBLING}</span>
          </span>
          <span>Product of Japan</span>
        </div>

        <p className="mt-6 max-w-lg font-light text-xs text-white/40">
          A4 and A5 refer to Japan's official BMS marbling grade — the scale used across the
          industry, not a BOSBA-specific rating.
        </p>

        <div className="mt-16 flex flex-col gap-2 border-t border-white/10 pt-8 text-sm text-white/50 md:flex-row md:items-center md:justify-between">
          <span className="font-serif text-base text-white">BOSBA Premium Foods</span>
          <span>Sangkat Tuol Svay Prey Ti Muoy, Phnom Penh · +855 99 361 350</span>
        </div>
      </div>
    </section>
  );
}

function ShopSection({ products }: { products: ReturnType<typeof useProducts>["data"] }) {
  return (
    <section className="bg-white px-6 py-20 text-black md:py-28">
      <div className="mx-auto max-w-[1280px] text-center">
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
