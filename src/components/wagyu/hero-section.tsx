import { forwardRef, useEffect, useRef } from "react";
import { ChevronDown } from "lucide-react";
import heroImage from "../../image/hero_wagyu_landscape_1cc86d18.jpg";
export const HeroSection = forwardRef<HTMLElement>((_, ref) => {
  const bgRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = bgRef.current;
    if (!el) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let target = window.scrollY * 0.4;
    let current = target;
    let frame = 0;

    const animate = () => {
      current += (target - current) * 0.09;
      el.style.transform = `translate3d(0, ${current.toFixed(2)}px, 0)`;

      if (Math.abs(target - current) > 0.05) {
        frame = requestAnimationFrame(animate);
      } else {
        frame = 0;
      }
    };

    const onScroll = () => {
      target = window.scrollY * 0.4;
      if (!frame) frame = requestAnimationFrame(animate);
    };

    window.addEventListener("scroll", onScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", onScroll);
      if (frame) cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <section
      ref={ref as React.RefObject<HTMLElement>}
      id="hero"
      className="relative h-screen min-h-[700px] overflow-hidden flex items-center"
    >
      <div>
        <div
          ref={bgRef}
          className="absolute inset-0 -top-[20%] -bottom-[20%]"
          style={{ willChange: "transform" }}
        >
          <img
            src={heroImage}
            alt="Japanese Black Wagyu in Miyazaki landscape"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-black/10" />
        </div>
        <div
          className="relative z-10 w-full pt-28 pb-16 md:pt-32 md:pb-24"
          style={{
            maxWidth: 1400,
            margin: "0 auto",
            paddingLeft: "clamp(1.5rem, 5vw, 4rem)",
            paddingRight: "clamp(1.5rem, 5vw, 4rem)",
          }}
        >
          <div className="max-w-3xl">
            <div className="font-mono-label text-xs tracking-[0.3em] uppercase text-white/60 mb-6">
              BOSBA Premium Foods — Japanese Wagyu
            </div>
            <h1 className="font-display text-5xl md:text-7xl lg:text-8xl font-light text-white leading-[0.95] mb-6">
              The Journey of
              <br />
              <em className="font-medium not-italic">Japanese Wagyu</em>
            </h1>
            <p className="font-body text-lg md:text-xl text-white/80 font-light leading-relaxed mb-8 max-w-xl">
              From Miyazaki, Japan.
              <br />
              Raised with care. Crafted by nature.
            </p>
            <p className="font-body text-sm text-white/60 mb-10">
              Discover the story behind Japanese Wagyu A4 &amp; A5.
            </p>
            <a
              href="#journey"
              className="btn-gold"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "0.5rem",
                textDecoration: "none",
              }}
            >
              Explore the Journey <ChevronDown size={16} />
            </a>
          </div>
        </div>
        <div className="absolute bottom-8 right-8 md:right-12 flex flex-col items-center gap-2 text-white/40">
          <div className="w-px h-12 bg-white/20 relative overflow-hidden">
            <div
              className="absolute top-0 left-0 w-full bg-white/60"
              style={{ height: "40%", animation: "scrollLine 2s ease-in-out infinite" }}
            />
          </div>
        </div>
      </div>

      <style>{`@keyframes scrollLine{0%{transform:translateY(-100%)}100%{transform:translateY(300%)}}`}</style>
    </section>
  );
});
