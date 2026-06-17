import { useState, useEffect } from "react";
import { Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { useHeroSlides } from "@/hooks/use-products";
import type { HeroSlide } from "@/lib/types";

const FALLBACK_IMAGE =
  "https://images.unsplash.com/photo-1553621042-f6e147245754?w=1400&q=80";

const FALLBACK_SLIDE: HeroSlide = {
  id: "fallback",
  eyebrow: null,
  title_top: "Premium",
  title_accent: "Bluefin Tuna",
  title_bottom: null,
  body: "Hand-cut at the market at dawn.\nThe deepest cuts of the season.",
  image_url: FALLBACK_IMAGE,
  cta_label: "Browse Tuna",
  cta_link: "/shop",
  sort_order: 0,
  active: true,
  created_at: "",
};

export function HeroSlider() {
  const { data: slides = [] } = useHeroSlides();
  const [active, setActive] = useState(0);

  const list = slides.length > 0 ? slides : [FALLBACK_SLIDE];

  useEffect(() => {
    if (list.length <= 1) return;
    setActive((a) => a % list.length);
    const id = setInterval(() => setActive((a) => (a + 1) % list.length), 6500);
    return () => clearInterval(id);
  }, [list.length]);

  const s = list[active] ?? list[0];

  const lineOne = s.title_top || "Premium";
  const lineTwo = [s.title_accent || "Bluefin Tuna", s.title_bottom].filter(Boolean).join(" ");
  const sub = s.body || "Hand-cut at the market at dawn.\nThe deepest cuts of the season.";
  const ctaLabel = s.cta_label || "Browse Tuna";
  const ctaLink = s.cta_link || "/shop";

  return (
    <section className="relative w-full bg-black">
      <div className="grid md:grid-cols-2 min-h-[560px] md:min-h-[620px]">
        {/* Left — dark editorial panel */}
        <div className="relative z-10 flex flex-col bg-black px-8 py-10 md:px-16 md:py-14">
          <Link to="/" className="inline-flex items-center gap-2.5 self-start">
            <img
              src="/logo.png"
              alt="BOSBA Premium Foods"
              className="size-10 rounded-lg object-contain"
            />
            <span className="font-display text-lg font-bold tracking-tight text-foreground">
              BOSBA Premium Foods
            </span>
          </Link>

          <div className="my-auto max-w-lg py-10">
            <h1 className="font-serif leading-[1.03] tracking-tight text-[clamp(3rem,6vw,4.5rem)]">
              <span className="block font-bold text-white">{lineOne}</span>
              <span className="block font-medium italic text-brand">{lineTwo}</span>
            </h1>

            <p className="mt-6 max-w-md whitespace-pre-line text-sm leading-relaxed text-muted-foreground md:text-base">
              {sub}
            </p>

            <a
              href={ctaLink}
              className="mt-8 inline-flex items-center gap-2 rounded-full bg-brand px-7 py-3.5 text-sm font-bold text-brand-foreground transition-colors hover:bg-secondary-accent"
            >
              {ctaLabel} <ArrowRight className="size-4" />
            </a>
          </div>

          {list.length > 1 && (
            <div className="flex gap-2 self-start">
              {list.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setActive(i)}
                  aria-label={`Slide ${i + 1}`}
                  className={`h-1.5 rounded-full transition-all ${
                    i === active ? "w-10 bg-brand" : "w-4 bg-white/25 hover:bg-white/40"
                  }`}
                />
              ))}
            </div>
          )}
        </div>

        {/* Right — full-bleed photography, halves meet flush */}
        <div className="relative min-h-[320px] bg-black md:min-h-full">
          {list.map((slide, i) => (
            <img
              key={slide.id}
              src={slide.image_url || FALLBACK_IMAGE}
              alt=""
              loading={i === 0 ? "eager" : "lazy"}
              className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-1000 ${
                i === active ? "opacity-100" : "opacity-0"
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
