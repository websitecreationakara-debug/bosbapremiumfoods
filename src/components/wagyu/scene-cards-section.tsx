import { useState } from "react";
import { Reveal } from "@/components/wagyu/reveal";

const SCENES = [
  {
    num: "01",
    icon: "🏠",
    title: "A Carefully Managed Environment",
    desc: "The environment in which cattle are raised plays an important role in their development. Each animal is given space, clean conditions, and the attention required to develop properly.",
  },
  {
    num: "02",
    icon: "🌱",
    title: "Careful Nutrition",
    desc: "Feeding and management are carefully controlled as the cattle develop. Nutrition is managed with precision to support the natural development of the animal.",
  },
  {
    num: "03",
    icon: "⏳",
    title: "Time Matters",
    desc: "Exceptional Wagyu isn't created overnight. It is developed over time through careful breeding, management and patience — from birth through to the finished product.",
  },
  {
    num: "04",
    icon: "🤝",
    title: "Attention to Every Animal",
    desc: "Behind the final cut of Wagyu are people who dedicate themselves to raising cattle with care. Each animal receives individual attention throughout its development.",
  },
];

export function SceneCardsSection() {
  const [hovered, setHovered] = useState<number | null>(null);

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
                    fontFamily: "'Cormorant Garamond', serif",
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
                    style={{
                      fontFamily: "'Cormorant Garamond', serif",
                      fontSize: "1.5rem",
                      fontWeight: 500,
                      color: "var(--wagyu-text)",
                      margin: "0.6rem 0 1rem",
                      lineHeight: 1.25,
                    }}
                  >
                    {scene.title}
                  </h3>
                  <p
                    style={{
                      fontFamily: "'Jost', sans-serif",
                      fontSize: "0.9rem",
                      fontWeight: 300,
                      color: "rgba(var(--wagyu-text-rgb),0.6)",
                      lineHeight: 1.75,
                    }}
                  >
                    {scene.desc}
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
