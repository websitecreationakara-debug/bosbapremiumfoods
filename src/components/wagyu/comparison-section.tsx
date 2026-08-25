import { useRef, useState, useCallback } from "react";
import { Link } from "@tanstack/react-router";
import { Reveal } from "@/components/wagyu/reveal";
import { useWagyuI18n, type WagyuI18nKey } from "@/components/wagyu/wagyu-i18n";
import { trackShopButtonClick } from "@/lib/meta-pixel";
import A4 from "../../image/a4.jpg";
import A5 from "../../image/a5.jpg";
import { SupplyChainSection } from "@/components/wagyu/supply-chain-section";

const grades: {
  grade: string;
  taglineKey: WagyuI18nKey;
  descKey: WagyuI18nKey;
  marbling: number;
  richness: number;
  beefFlavor: number;
  textureKey: WagyuI18nKey;
  bms: string;
  price: string;
  unit: string;
  link: string;
}[] = [
  {
    grade: "A4",
    taglineKey: "comparison.a4.tagline",
    descKey: "comparison.a4.desc",
    marbling: 4,
    richness: 4,
    beefFlavor: 5,
    textureKey: "comparison.a4.texture",
    bms: "BMS 5–7",
    price: "$14",
    unit: "/ 100g",
    link: "https://bosbapremiumfoods.com/product/wagyu-a4",
  },
  {
    grade: "A5",
    taglineKey: "comparison.a5.tagline",
    descKey: "comparison.a5.desc",
    marbling: 5,
    richness: 5,
    beefFlavor: 4,
    textureKey: "comparison.a5.texture",
    bms: "BMS 8–12",
    price: "$19",
    unit: "/ 100g",
    link: "https://bosbapremiumfoods.com/product/wagyu-a5",
  },
];

function RatingDots({ filled }: { filled: number }) {
  return (
    <div style={{ display: "flex", gap: "0.35rem" }}>
      {Array.from({ length: 5 }, (_, i) => (
        <span
          key={i}
          style={{
            width: 8,
            height: 8,
            borderRadius: "50%",
            background: i < filled ? "var(--wagyu-gold)" : "rgba(var(--wagyu-text-rgb),0.15)",
          }}
        />
      ))}
    </div>
  );
}

export function ComparisonSection() {
  const [sliderPos, setSliderPos] = useState(50);
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const { t, locale } = useWagyuI18n();
  const isKm = locale === "km";

  const updateSlider = useCallback((clientX: number) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const pos = Math.max(5, Math.min(95, ((clientX - rect.left) / rect.width) * 100));
    setSliderPos(pos);
  }, []);

  const onMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    updateSlider(e.clientX);
  };
  const onMouseMove = (e: React.MouseEvent) => {
    if (isDragging) updateSlider(e.clientX);
  };
  const onMouseUp = () => setIsDragging(false);
  const onTouchMove = (e: React.TouchEvent) => updateSlider(e.touches[0].clientX);

  return (
    <section
      id="comparison"
      style={{
        backgroundColor: "var(--wagyu-bg)",
        padding: "clamp(3.25rem, 6vw, 5.5rem) 0",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <div className="mb-40">
        <SupplyChainSection />
      </div>
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 clamp(1.5rem, 5vw, 4rem)" }}>
        <div style={{ textAlign: "center", marginBottom: "2.75rem" }}>
          <Reveal>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "1rem",
                marginBottom: "1rem",
              }}
            >
              <span
                style={{
                  width: 40,
                  height: 1,
                  background: "var(--wagyu-gold)",
                  display: "inline-block",
                }}
              />
              <span
                lang={locale}
                style={{
                  fontFamily: "'DM Sans', 'Battambang', sans-serif",
                  fontSize: isKm ? "0.75rem" : "0.65rem",
                  letterSpacing: isKm ? "normal" : "0.3em",
                  textTransform: isKm ? "none" : "uppercase",
                  color: "var(--wagyu-gold)",
                }}
              >
                {t("comparison.eyebrow")}
              </span>
              <span
                style={{
                  width: 40,
                  height: 1,
                  background: "var(--wagyu-gold)",
                  display: "inline-block",
                }}
              />
            </div>
          </Reveal>
          <Reveal delay={100}>
            <h2
              lang={locale}
              style={{
                fontFamily: isKm
                  ? "'Kantumruy Pro', 'Battambang', sans-serif"
                  : "'DM Sans', sans-serif",
                fontSize: isKm ? "clamp(1.9rem, 4vw, 3rem)" : "clamp(2.2rem, 4.5vw, 3.5rem)",
                fontWeight: isKm ? 700 : 400,
                color: "var(--wagyu-text)",
                lineHeight: isKm ? 1.35 : 1.2,
                letterSpacing: isKm ? "0.01em" : undefined,
              }}
            >
              {t("comparison.title")}
            </h2>
          </Reveal>
          <Reveal delay={200}>
            <p
              lang={locale}
              style={{
                fontFamily: "'DM Sans', 'Battambang', sans-serif",
                fontSize: "1rem",
                fontWeight: 300,
                color: "rgba(var(--wagyu-text-rgb),0.6)",
                maxWidth: 480,
                margin: "1rem auto 0",
                lineHeight: 1.7,
              }}
            >
              {t("comparison.subtitle")}
            </p>
          </Reveal>
        </div>
        {/* Interactive comparison slider */}
        <Reveal delay={300}>
          <div
            ref={containerRef}
            onMouseDown={onMouseDown}
            onMouseMove={onMouseMove}
            onMouseUp={onMouseUp}
            onMouseLeave={onMouseUp}
            onTouchStart={(e) => updateSlider(e.touches[0].clientX)}
            onTouchMove={onTouchMove}
            style={{
              position: "relative",
              width: "100%",
              aspectRatio: "16/7",
              overflow: "hidden",
              cursor: isDragging ? "grabbing" : "ew-resize",
              userSelect: "none",
              border: "1px solid rgba(var(--wagyu-gold-rgb),0.2)",
              marginBottom: "2.75rem",
            }}
            className="rounded-sm"
          >
            {/* A5 (right, full width) */}
            <img
              src={A5}
              alt="Wagyu A5 marbling"
              style={{
                position: "absolute",
                inset: 0,
                width: "100%",
                height: "100%",
                objectFit: "cover",
                objectPosition: "center",
              }}
              draggable={false}
            />
            {/* A4 (left, clipped) */}
            <div
              style={{
                position: "absolute",
                inset: 0,
                clipPath: `inset(0 ${100 - sliderPos}% 0 0)`,
              }}
            >
              <img
                src={A4}
                alt="Wagyu A4 marbling"
                style={{
                  position: "absolute",
                  inset: 0,
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                  objectPosition: "center",
                }}
                draggable={false}
              />
            </div>

            {/* Labels */}
            <div
              style={{
                position: "absolute",
                top: "1rem",
                left: "1.5rem",
                background: "rgba(var(--wagyu-bg-rgb),0.8)",
                border: "1px solid rgba(var(--wagyu-gold-rgb),0.4)",
                padding: "0.4rem 1rem",
                backdropFilter: "blur(8px)",
              }}
            >
              <span
                style={{
                  fontFamily: "'DM Sans', sans-serif",
                  fontSize: "1.1rem",
                  color: "var(--wagyu-gold)",
                  letterSpacing: "0.05em",
                }}
              >
                A4
              </span>
            </div>
            <div
              style={{
                position: "absolute",
                top: "1rem",
                right: "1.5rem",
                background: "rgba(var(--wagyu-bg-rgb),0.8)",
                border: "1px solid rgba(var(--wagyu-gold-rgb),0.4)",
                padding: "0.4rem 1rem",
                backdropFilter: "blur(8px)",
              }}
            >
              <span
                style={{
                  fontFamily: "'DM Sans', sans-serif",
                  fontSize: "1.1rem",
                  color: "var(--wagyu-gold-light)",
                  letterSpacing: "0.05em",
                }}
              >
                A5
              </span>
            </div>

            {/* Slider line */}
            <div
              style={{
                position: "absolute",
                top: 0,
                bottom: 0,
                left: `${sliderPos}%`,
                width: 2,
                background: "var(--wagyu-gold)",
                boxShadow: "0 0 12px rgba(var(--wagyu-gold-rgb),0.6)",
                transform: "translateX(-50%)",
              }}
            >
              <div
                style={{
                  position: "absolute",
                  top: "50%",
                  left: "50%",
                  transform: "translate(-50%, -50%)",
                  width: 44,
                  height: 44,
                  borderRadius: "50%",
                  background: "var(--wagyu-bg)",
                  border: "2px solid var(--wagyu-gold)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  boxShadow: "0 0 20px rgba(var(--wagyu-gold-rgb),0.4)",
                }}
              >
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path
                    d="M5 8L2 5M5 8L2 11M11 8L14 5M11 8L14 11"
                    stroke="var(--wagyu-gold)"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                  />
                  <line x1="5" y1="8" x2="11" y2="8" stroke="var(--wagyu-gold)" strokeWidth="1.5" />
                </svg>
              </div>
            </div>
          </div>
        </Reveal>

        {/* Two-side comparison cards */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 340px), 1fr))",
            gap: "2rem",
          }}
        >
          {grades.map((g, i) => (
            <Reveal key={g.grade} direction={i === 0 ? "left" : "right"} delay={100}>
              <div
                style={{
                  background: "var(--wagyu-card)",
                  border: "1px solid rgba(var(--wagyu-gold-rgb),0.2)",
                  padding: "clamp(1.75rem, 4vw, 2.75rem)",
                  height: "100%",
                }}
                className="rounded-sm"
              >
                <div
                  style={{
                    display: "flex",
                    flexWrap: "wrap",
                    justifyContent: "space-between",
                    alignItems: "flex-start",
                    gap: "1rem",
                    marginBottom: "2rem",
                  }}
                >
                  <div>
                    <div
                      style={{
                        fontFamily: "'DM Sans', sans-serif",
                        fontSize: "clamp(3rem, 6vw, 4.5rem)",
                        fontWeight: 400,
                        color: "var(--wagyu-gold)",
                        lineHeight: 1,
                      }}
                    >
                      {g.grade}
                    </div>
                    <div
                      style={{
                        fontFamily: "'DM Sans', sans-serif",
                        fontSize: "0.65rem",
                        letterSpacing: "0.2em",
                        textTransform: "uppercase",
                        color: "rgba(var(--wagyu-text-rgb),0.5)",
                        marginTop: "0.35rem",
                      }}
                    >
                      {t(g.taglineKey)}
                    </div>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <div
                      style={{
                        fontFamily: "'DM Sans', sans-serif",
                        fontSize: "1.8rem",
                        fontWeight: 400,
                        color: "var(--wagyu-text)",
                      }}
                    >
                      {g.price}
                      <span
                        style={{
                          fontFamily: "'DM Sans', sans-serif",
                          fontSize: "0.9rem",
                          color: "rgba(var(--wagyu-text-rgb),0.5)",
                        }}
                      >
                        {g.unit}
                      </span>
                    </div>
                    <div
                      style={{
                        fontFamily: "'DM Sans', sans-serif",
                        fontSize: "0.65rem",
                        letterSpacing: "0.15em",
                        textTransform: "uppercase",
                        color: "rgba(var(--wagyu-text-rgb),0.45)",
                        marginTop: "0.25rem",
                      }}
                    >
                      Sirloin · {g.bms}
                    </div>
                  </div>
                </div>

                <p
                  style={{
                    fontFamily: "'DM Sans', sans-serif",
                    fontSize: "0.95rem",
                    fontWeight: 300,
                    color: "rgba(var(--wagyu-text-rgb),0.65)",
                    lineHeight: 1.8,
                  }}
                >
                  {t(g.descKey)}
                </p>

                <div
                  style={{
                    borderTop: "1px solid rgba(var(--wagyu-gold-rgb),0.15)",
                    marginTop: "2rem",
                    paddingTop: "1.75rem",
                    display: "grid",
                    gridTemplateColumns: "repeat(2, 1fr)",
                    rowGap: "1.5rem",
                  }}
                >
                  {(
                    [
                      { labelKey: "comparison.attr.marbling", value: g.marbling },
                      { labelKey: "comparison.attr.richness", value: g.richness },
                      { labelKey: "comparison.attr.beefFlavor", value: g.beefFlavor },
                    ] as { labelKey: WagyuI18nKey; value: number }[]
                  ).map((attr) => (
                    <div key={attr.labelKey}>
                      <div
                        style={{
                          fontFamily: "'DM Sans', sans-serif",
                          fontSize: "0.65rem",
                          letterSpacing: "0.15em",
                          textTransform: "uppercase",
                          color: "rgba(var(--wagyu-text-rgb),0.45)",
                          marginBottom: "0.6rem",
                        }}
                      >
                        {t(attr.labelKey)}
                      </div>
                      <RatingDots filled={attr.value} />
                    </div>
                  ))}
                  <div>
                    <div
                      style={{
                        fontFamily: "'DM Sans', sans-serif",
                        fontSize: "0.65rem",
                        letterSpacing: "0.15em",
                        textTransform: "uppercase",
                        color: "rgba(var(--wagyu-text-rgb),0.45)",
                        marginBottom: "0.6rem",
                      }}
                    >
                      {t("comparison.attr.texture")}
                    </div>
                    <div
                      style={{
                        fontFamily: "'DM Sans', sans-serif",
                        fontSize: "1.05rem",
                        color: "var(--wagyu-text)",
                      }}
                    >
                      {t(g.textureKey)}
                    </div>
                  </div>
                </div>

                <div style={{ marginTop: "2rem" }}>
                  <Link
                    to={g.link}
                    onClick={() =>
                      trackShopButtonClick(`wagyu_comparison_${g.grade.toLowerCase()}`)
                    }
                    className="btn-gold rounded-sm"
                    style={{ display: "inline-block", textDecoration: "none" }}
                  >
                    {t("comparison.cta")} {g.grade}
                  </Link>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
