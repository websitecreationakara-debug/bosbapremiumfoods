import { useEffect, useRef, useState } from "react";
import { Reveal } from "@/components/wagyu/reveal";

const BullMon = ({ size = 50, opacity = 0.4 }: { size?: number; opacity?: number }) => (
  <svg viewBox="0 0 60 60" width={size} height={size} fill="none" style={{ opacity }}>
    <circle cx="30" cy="30" r="28" stroke="var(--wagyu-gold)" strokeWidth="0.8" />
    <path
      d="M30 10 C20 10 13 17 13 26 C13 33 17 38 22 40 L22 46 L38 46 L38 40 C43 38 47 33 47 26 C47 17 40 10 30 10Z"
      fill="none"
      stroke="var(--wagyu-gold)"
      strokeWidth="0.8"
    />
    <path d="M22 24 Q30 18 38 24" stroke="var(--wagyu-gold)" strokeWidth="1" fill="none" />
    <circle cx="24" cy="27" r="1.5" fill="var(--wagyu-gold)" />
    <circle cx="36" cy="27" r="1.5" fill="var(--wagyu-gold)" />
    <line x1="18" y1="46" x2="42" y2="46" stroke="var(--wagyu-gold)" strokeWidth="0.8" />
  </svg>
);

const tiers = [
  {
    label: "Regular Beef",
    desc: "Standard marbling, everyday flavor",
    bar: 20,
    color: "#6B6355",
    colorFaded: "#6B635580",
  },
  {
    label: "Australian Wagyu",
    desc: "Improved genetics, richer taste",
    bar: 55,
    color: "#9B7E3A",
    colorFaded: "#9B7E3A80",
  },
  {
    label: "Japanese Wagyu A4",
    desc: "Exceptional snowflake marbling",
    bar: 80,
    color: "var(--wagyu-gold)",
    colorFaded: "rgba(var(--wagyu-gold-rgb), 0.5)",
  },
  {
    label: "Japanese Wagyu A5",
    desc: "The pinnacle — pure luxury",
    bar: 100,
    color: "var(--wagyu-gold-light)",
    colorFaded: "rgba(var(--wagyu-gold-light-rgb), 0.5)",
  },
];

export function WhyWagyuSection() {
  const barsRef = useRef<HTMLDivElement>(null);
  const [barsFilled, setBarsFilled] = useState(false);

  useEffect(() => {
    const el = barsRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setBarsFilled(true);
          observer.disconnect();
        }
      },
      { threshold: 0.3 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      id="why-wagyu"
      style={{
        backgroundColor: "var(--wagyu-bg)",
        padding: "clamp(3.25rem, 6vw, 5.5rem) 0",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <div
        className="kanji-watermark"
        style={{ left: "-5%", top: "50%", transform: "translateY(-50%)" }}
      >
        霜降
      </div>

      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 clamp(1.5rem, 5vw, 4rem)" }}>
        <Reveal>
          <div style={{ marginBottom: "1rem", display: "flex", alignItems: "center", gap: "1rem" }}>
            <span
              style={{
                width: 40,
                height: 1,
                background: "var(--wagyu-gold)",
                display: "inline-block",
              }}
            />
            <span
              style={{
                fontFamily: "'Jost', sans-serif",
                fontSize: "0.65rem",
                letterSpacing: "0.3em",
                textTransform: "uppercase",
                color: "var(--wagyu-gold)",
              }}
            >
              Education
            </span>
          </div>
        </Reveal>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 440px), 1fr))",
            gap: "clamp(3rem, 6vw, 7rem)",
            alignItems: "center",
          }}
        >
          <div>
            <Reveal delay={100}>
              <h2
                style={{
                  fontFamily: "'Cormorant Garamond', serif",
                  fontSize: "clamp(2.5rem, 5vw, 4rem)",
                  fontWeight: 400,
                  color: "var(--wagyu-text)",
                  lineHeight: 1.1,
                  marginBottom: "1.5rem",
                }}
              >
                Why is Wagyu
                <br />
                <em style={{ color: "var(--wagyu-gold)" }}>unlike anything</em>
                <br />
                else?
              </h2>
            </Reveal>

            <Reveal delay={200}>
              <p
                style={{
                  fontFamily: "'Jost', sans-serif",
                  fontSize: "1rem",
                  fontWeight: 300,
                  color: "rgba(var(--wagyu-text-rgb),0.7)",
                  lineHeight: 1.8,
                  marginBottom: "1.5rem",
                }}
              >
                The secret lies in <strong style={{ color: "var(--wagyu-gold)" }}>Sashi</strong> —
                the Japanese term for the intricate snowflake-like fat marbling that runs through
                every fiber of the meat. This intramuscular fat melts at body temperature, creating
                a buttery, umami-rich experience that no other beef can replicate.
              </p>
            </Reveal>

            <Reveal delay={300}>
              <p
                style={{
                  fontFamily: "'Jost', sans-serif",
                  fontSize: "1rem",
                  fontWeight: 300,
                  color: "rgba(var(--wagyu-text-rgb),0.7)",
                  lineHeight: 1.8,
                  marginBottom: "2.5rem",
                }}
              >
                Japanese Wagyu cattle are raised for 30+ months — nearly triple the time of standard
                beef — with meticulous care, specialized feed, and stress-free environments. The
                result is beef graded on a scale from A1 to A5, where A5 represents the absolute
                pinnacle of quality.
              </p>
            </Reveal>

            <Reveal delay={400}>
              <div ref={barsRef} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                {tiers.map((tier, i) => (
                  <div key={tier.label}>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        marginBottom: "0.35rem",
                      }}
                    >
                      <span
                        style={{
                          fontFamily: "'Jost', sans-serif",
                          fontSize: "0.8rem",
                          color: tier.color,
                          letterSpacing: "0.05em",
                        }}
                      >
                        {tier.label}
                      </span>
                      <span
                        style={{
                          fontFamily: "'Jost', sans-serif",
                          fontSize: "0.7rem",
                          color: "rgba(var(--wagyu-text-rgb),0.45)",
                        }}
                      >
                        {tier.desc}
                      </span>
                    </div>
                    <div
                      style={{
                        height: 3,
                        background: "rgba(var(--wagyu-gold-rgb),0.1)",
                        borderRadius: 2,
                        overflow: "hidden",
                      }}
                    >
                      <div
                        style={{
                          height: "100%",
                          width: barsFilled ? `${tier.bar}%` : "0%",
                          background: `linear-gradient(90deg, ${tier.colorFaded}, ${tier.color})`,
                          borderRadius: 2,
                          transition: "width 2.2s cubic-bezier(0.16, 1, 0.3, 1)",
                          transitionDelay: `${i * 220}ms`,
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </Reveal>
          </div>

          <Reveal direction="right" delay={200} style={{ position: "relative" }}>
            <div style={{ position: "relative", overflow: "hidden" }}>
              <img
                src="/wagyu/hero-beef.jpg"
                alt="Wagyu snowflake marbling close-up"
                style={{ width: "100%", aspectRatio: "4/3", objectFit: "cover", display: "block" }}
              />
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  border: "1px solid rgba(var(--wagyu-gold-rgb),0.3)",
                  pointerEvents: "none",
                }}
              />
              <div
                style={{
                  position: "absolute",
                  top: -12,
                  right: -12,
                  width: 60,
                  height: 60,
                  borderTop: "2px solid var(--wagyu-gold)",
                  borderRight: "2px solid var(--wagyu-gold)",
                }}
              />
              <div
                style={{
                  position: "absolute",
                  bottom: -12,
                  left: -12,
                  width: 60,
                  height: 60,
                  borderBottom: "2px solid var(--wagyu-gold)",
                  borderLeft: "2px solid var(--wagyu-gold)",
                }}
              />
            </div>

            <div style={{ position: "absolute", top: -20, left: -20 }}>
              <BullMon size={50} opacity={0.4} />
            </div>
          </Reveal>
        </div>
      </div>

      <div style={{ maxWidth: 1200, margin: "3rem auto 0", padding: "0 clamp(1.5rem, 5vw, 4rem)" }}>
        <div className="gold-divider" style={{ width: "100%" }} />
      </div>
    </section>
  );
}
