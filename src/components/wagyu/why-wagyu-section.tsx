import { useEffect, useRef, useState } from "react";
import { Reveal } from "@/components/wagyu/reveal";
import { useWagyuI18n, type WagyuI18nKey } from "@/components/wagyu/wagyu-i18n";
import eduimage from "../../image/eduimage.jpg";

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

const tiers: {
  labelKey: WagyuI18nKey;
  descKey: WagyuI18nKey;
  bar: number;
  color: string;
  colorFaded: string;
}[] = [
  {
    labelKey: "whyWagyu.tier.regular.label",
    descKey: "whyWagyu.tier.regular.desc",
    bar: 20,
    color: "#6B6355",
    colorFaded: "#6B635580",
  },
  {
    labelKey: "whyWagyu.tier.australian.label",
    descKey: "whyWagyu.tier.australian.desc",
    bar: 55,
    color: "#9B7E3A",
    colorFaded: "#9B7E3A80",
  },
  {
    labelKey: "whyWagyu.tier.a4.label",
    descKey: "whyWagyu.tier.a4.desc",
    bar: 80,
    color: "var(--wagyu-gold)",
    colorFaded: "rgba(var(--wagyu-gold-rgb), 0.5)",
  },
  {
    labelKey: "whyWagyu.tier.a5.label",
    descKey: "whyWagyu.tier.a5.desc",
    bar: 100,
    color: "var(--wagyu-gold-light)",
    colorFaded: "rgba(var(--wagyu-gold-light-rgb), 0.5)",
  },
];

export function WhyWagyuSection() {
  const barsRef = useRef<HTMLDivElement>(null);
  const [barsFilled, setBarsFilled] = useState(false);
  const { t, locale } = useWagyuI18n();
  const isKm = locale === "km";

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
              {t("whyWagyu.eyebrow")}
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
                lang={locale}
                style={{
                  fontFamily: isKm
                    ? "'Kantumruy Pro', 'Battambang', sans-serif"
                    : "'Cormorant Garamond', serif",
                  fontSize: isKm ? "clamp(2.1rem, 4.3vw, 3.4rem)" : "clamp(2.5rem, 5vw, 4rem)",
                  fontWeight: isKm ? 700 : 400,
                  color: "var(--wagyu-text)",
                  lineHeight: isKm ? 1.35 : 1.1,
                  letterSpacing: isKm ? "0.01em" : undefined,
                  marginBottom: "1.5rem",
                }}
              >
                {t("whyWagyu.title.pre")}
                <br />
                <em style={{ color: "var(--wagyu-gold)", fontStyle: isKm ? "normal" : "italic" }}>
                  {t("whyWagyu.title.em")}
                </em>
                <br />
                {t("whyWagyu.title.post")}
              </h2>
            </Reveal>

            <Reveal delay={200}>
              <p
                lang={locale}
                style={{
                  fontFamily: "'Jost', 'Battambang', sans-serif",
                  fontSize: "1rem",
                  fontWeight: 300,
                  color: "rgba(var(--wagyu-text-rgb),0.7)",
                  lineHeight: 1.8,
                  marginBottom: "1.5rem",
                }}
              >
                {t("whyWagyu.p1.pre")}{" "}
                <strong style={{ color: "var(--wagyu-gold)" }}>{t("whyWagyu.p1.strong")}</strong>{" "}
                {t("whyWagyu.p1.post")}
              </p>
            </Reveal>

            <Reveal delay={300}>
              <p
                lang={locale}
                style={{
                  fontFamily: "'Jost', 'Battambang', sans-serif",
                  fontSize: "1rem",
                  fontWeight: 300,
                  color: "rgba(var(--wagyu-text-rgb),0.7)",
                  lineHeight: 1.8,
                  marginBottom: "2.5rem",
                }}
              >
                {t("whyWagyu.p2")}
              </p>
            </Reveal>

            <Reveal delay={400}>
              <div ref={barsRef} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                {tiers.map((tier, i) => (
                  <div key={tier.labelKey}>
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
                        {t(tier.labelKey)}
                      </span>
                      <span
                        style={{
                          fontFamily: "'Jost', sans-serif",
                          fontSize: "0.7rem",
                          color: "rgba(var(--wagyu-text-rgb),0.45)",
                        }}
                      >
                        {t(tier.descKey)}
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
                src={eduimage}
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

            <a
              href="/shop?category=cook-yourself"
              className="btn-gold"
              lang={locale}
              style={{
                display: "inline-block",
                marginTop: "1.75rem",
                borderRadius: 0,
                textDecoration: "none",
              }}
            >
              {t("whyWagyu.shopBtn")}
            </a>
          </Reveal>
        </div>
      </div>

      <div style={{ maxWidth: 1200, margin: "3rem auto 0", padding: "0 clamp(1.5rem, 5vw, 4rem)" }}>
        <div className="gold-divider" style={{ width: "100%" }} />
      </div>
    </section>
  );
}
