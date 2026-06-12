import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles } from "lucide-react";
import { useHeroSlides } from "@/hooks/use-products";

export function HeroSlider() {
  const { data: slides = [] } = useHeroSlides();
  const [active, setActive] = useState(0);

  useEffect(() => {
    if (slides.length === 0) return;
    setActive((a) => a % slides.length);
    const id = setInterval(() => setActive((a) => (a + 1) % slides.length), 6500);
    return () => clearInterval(id);
  }, [slides.length]);

  // Countdown to next midnight
  const [time, setTime] = useState({ h: 0, m: 0, s: 0 });
  useEffect(() => {
    const tick = () => {
      const now = new Date();
      const end = new Date(now);
      end.setHours(24, 0, 0, 0);
      const diff = Math.max(0, end.getTime() - now.getTime());
      setTime({
        h: Math.floor(diff / 3600000),
        m: Math.floor((diff / 60000) % 60),
        s: Math.floor((diff / 1000) % 60),
      });
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  const s = slides[active];
  if (!s) return null;

  return (
    <section className="px-6 mx-auto max-w-7xl">
      <div className="relative rounded-[2.5rem] overflow-hidden bg-brand min-h-[480px] md:min-h-[560px] grid md:grid-cols-2">
        <div className="relative z-10 p-10 md:p-16 flex flex-col justify-center">
          {s.eyebrow && (
            <span className="inline-flex items-center gap-1.5 self-start px-3 py-1.5 bg-accent/20 text-accent rounded-full text-xs font-bold uppercase tracking-widest mb-6">
              <Sparkles className="size-3" /> {s.eyebrow}
            </span>
          )}
          <h1 className="font-display font-bold text-5xl md:text-7xl text-brand-foreground leading-[1.05] mb-6">
            {s.title_top}
            {s.title_top && <br />}
            {s.title_accent && <span className="italic text-accent">{s.title_accent}</span>}{" "}
            {s.title_bottom}
          </h1>
          {s.body && <p className="text-brand-foreground/75 text-lg max-w-md mb-8">{s.body}</p>}

          {s.cta_label && (
            <div className="flex flex-wrap items-center gap-4 mb-8">
              <Button size="lg" variant="secondary" className="rounded-full font-bold" asChild>
                <a href={s.cta_link}>
                  {s.cta_label} <ArrowRight className="size-4 ml-2" />
                </a>
              </Button>
            </div>
          )}

          <div className="flex items-center gap-3 text-brand-foreground/80">
            <span className="text-xs uppercase tracking-widest font-bold">Deal ends in</span>
            <div className="flex gap-1.5">
              {[
                { label: "h", v: time.h },
                { label: "m", v: time.m },
                { label: "s", v: time.s },
              ].map((t) => (
                <div
                  key={t.label}
                  className="bg-brand-foreground/10 px-2.5 py-1.5 rounded-md font-mono font-bold text-sm min-w-[44px] text-center"
                >
                  {String(t.v).padStart(2, "0")}
                  <span className="opacity-50 text-[10px] ml-0.5">{t.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="relative min-h-[300px] md:min-h-[560px]">
          {slides.map((slide, i) => (
            <img
              key={slide.id}
              src={slide.image_url ?? ""}
              alt=""
              loading={i === 0 ? "eager" : "lazy"}
              className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ${i === active ? "opacity-100" : "opacity-0"}`}
            />
          ))}
          <div className="absolute inset-0 bg-gradient-to-r md:bg-gradient-to-l from-transparent to-brand/40" />
        </div>

        {/* Indicators */}
        <div className="absolute bottom-6 left-10 md:left-16 flex gap-2 z-20">
          {slides.map((_, i) => (
            <button
              key={i}
              onClick={() => setActive(i)}
              aria-label={`Slide ${i + 1}`}
              className={`h-1.5 rounded-full transition-all ${i === active ? "w-10 bg-accent" : "w-4 bg-brand-foreground/30"}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
