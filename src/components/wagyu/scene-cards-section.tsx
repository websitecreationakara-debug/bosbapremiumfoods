import { useState } from "react";
import { Reveal } from "@/components/wagyu/reveal";
import { useWagyuI18n, type WagyuI18nKey } from "@/components/wagyu/wagyu-i18n";

const SCENES: { num: string; icon: string; titleKey: WagyuI18nKey; descKey: WagyuI18nKey }[] = [
  {
    num: "01",
    icon: "🏠",
    titleKey: "sceneCards.env.title",
    descKey: "sceneCards.env.desc",
  },
  {
    num: "02",
    icon: "🌱",
    titleKey: "sceneCards.nutrition.title",
    descKey: "sceneCards.nutrition.desc",
  },
  {
    num: "03",
    icon: "⏳",
    titleKey: "sceneCards.time.title",
    descKey: "sceneCards.time.desc",
  },
  {
    num: "04",
    icon: "🤝",
    titleKey: "sceneCards.attention.title",
    descKey: "sceneCards.attention.desc",
  },
];

export function SceneCardsSection() {
  const [hovered, setHovered] = useState<number | null>(null);
  const { t, locale } = useWagyuI18n();
  const isKm = locale === "km";

  return (
    <section
      id="scene-cards"
      style={{
        backgroundColor: "var(--wagyu-bg-alt)",
        padding: "clamp(3.25rem, 6vw, 5.5rem) 0",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 clamp(1.5rem, 5vw, 4rem)" }}>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 400px), 1fr))",
            gap: "1px",
            background: "rgba(var(--wagyu-gold-rgb),0.08)",
          }}
        >
          {SCENES.map((scene, i) => (
            <Reveal key={scene.num} delay={i * 80}>
              <div
                onMouseEnter={() => setHovered(i)}
                onMouseLeave={() => setHovered(null)}
                style={{
                  background: hovered === i ? "var(--wagyu-card-hover)" : "var(--wagyu-card)",
                  padding: "2.5rem",
                  position: "relative",
                  overflow: "hidden",
                  transition:
                    "background-color 0.25s cubic-bezier(0.23,1,0.32,1), transform 0.25s cubic-bezier(0.23,1,0.32,1), box-shadow 0.25s cubic-bezier(0.23,1,0.32,1)",
                  transform: hovered === i ? "translateY(-4px)" : "translateY(0)",
                  boxShadow:
                    hovered === i
                      ? "0 16px 48px rgba(var(--wagyu-gold-rgb),0.1)"
                      : "0 16px 48px rgba(var(--wagyu-gold-rgb),0)",
                  willChange: "transform",
                  height: "100%",
                }}
              >
                <span
                  aria-hidden
                  style={{
                    position: "absolute",
                    top: "0.5rem",
                    right: "1rem",
                    fontFamily: "'DM Sans', sans-serif",
                    fontSize: "5rem",
                    fontWeight: 300,
                    color: "rgba(var(--wagyu-gold-rgb),0.06)",
                    lineHeight: 1,
                  }}
                >
                  {scene.num}
                </span>

                <div style={{ position: "relative", zIndex: 1 }}>
                  <div style={{ fontSize: "1.75rem", marginBottom: "1rem" }}>{scene.icon}</div>
                  <h3
                    lang={locale}
                    style={{
                      fontFamily: isKm
                        ? "'Kantumruy Pro', 'Battambang', sans-serif"
                        : "'DM Sans', sans-serif",
                      fontSize: isKm ? "1.3rem" : "1.5rem",
                      fontWeight: isKm ? 700 : 500,
                      color: "var(--wagyu-text)",
                      margin: "0.6rem 0 1rem",
                      lineHeight: isKm ? 1.4 : 1.25,
                    }}
                  >
                    {t(scene.titleKey)}
                  </h3>
                  <p
                    lang={locale}
                    style={{
                      fontFamily: "'DM Sans', 'Battambang', sans-serif",
                      fontSize: "0.9rem",
                      fontWeight: 300,
                      color: "rgba(var(--wagyu-text-rgb),0.6)",
                      lineHeight: 1.75,
                    }}
                  >
                    {t(scene.descKey)}
                  </p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
