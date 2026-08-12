import { useState } from "react";
import { Reveal } from "@/components/wagyu/reveal";
import image1 from "../../image/cooking1.jpg";
import image2 from "../../image/cooking2.jpg";
import image3 from "../../image/cooking3.jpg";

const steps = [
  {
    num: "01",
    title: "Bring to Room Temperature",
    image: image1,
    desc: "Remove your Wagyu from the refrigerator 30–45 minutes before cooking. This ensures even cooking throughout and prevents the exterior from overcooking before the center reaches temperature.",
    tip: "Chef's Tip: Pat dry with paper towels. Season only with fleur de sel — never marinate A5 Wagyu.",
  },
  {
    num: "02",
    title: "Sear 30–60 Seconds Per Side",
    image: image2,
    desc: "Heat a cast iron or stainless pan until smoking hot. No oil needed — Wagyu's own fat renders immediately. Sear each side for just 30–60 seconds for A5, up to 90 seconds for A4.",
    tip: "Chef's Tip: Baste with the rendered fat. The Maillard crust is everything — don't move the steak.",
  },
  {
    num: "03",
    title: "Rest, Then Slice & Serve",
    image: image3,
    desc: "Rest the steak for 2–3 minutes on a warm board. Slice against the grain into thin pieces — Wagyu is best enjoyed in smaller portions to fully appreciate its richness.",
    tip: "Chef's Tip: Serve with yuzu ponzu or wasabi. A5 pairs beautifully with a light red wine or sake.",
  },
];

const methods = [
  {
    title: "Wagyu Steak",
    prep: "Salt · Pepper · High Heat",
    desc: "A thick-cut sirloin, seasoned simply and seared to perfection. Let the marbling do the work.",
    tip: "2–3 min each side. Rest before serving.",
    emoji: "🥩",
  },
  {
    title: "Yakiniku",
    prep: "Thin slices · Japanese grill",
    desc: "Thin Wagyu slices on a Japanese grill. The fat renders quickly, creating an extraordinary aroma and flavor.",
    tip: "30–45 seconds per side. Serve immediately.",
    emoji: "🔥",
  },
  {
    title: "Wagyu Don",
    prep: "Wagyu · Japanese rice · Egg",
    desc: "Thinly sliced Wagyu over steamed Japanese rice, finished with a soft egg. Simple, satisfying, extraordinary.",
    tip: "Slice thin. Cook briefly. Serve over hot rice.",
    emoji: "🍚",
  },
];

// Renders the step photo when available; falls back to the editorial
// numeral/kanji panel for any step that doesn't have photography yet.
function StepPanel({ num, image }: { num: string; image?: string }) {
  const [imageFailed, setImageFailed] = useState(false);

  if (image && !imageFailed) {
    return (
      <div
        style={{
          position: "relative",
          aspectRatio: "1/1",
          border: "1px solid rgba(var(--wagyu-gold-rgb),0.2)",
          overflow: "hidden",
        }}
      >
        <img
          src={image}
          alt={`Step ${num}`}
          onError={() => setImageFailed(true)}
          style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
        />
      </div>
    );
  }

  return (
    <div
      style={{
        position: "relative",
        aspectRatio: "1/1",
        background: "var(--wagyu-card)",
        border: "1px solid rgba(var(--wagyu-gold-rgb),0.2)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        overflow: "hidden",
      }}
    >
      <div
        className="kanji-watermark"
        style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: "clamp(80px, 14vw, 160px)",
        }}
      >
        和牛
      </div>
      <span
        style={{
          fontFamily: "'Cormorant Garamond', serif",
          fontSize: "clamp(6rem, 12vw, 9rem)",
          fontWeight: 300,
          color: "rgba(var(--wagyu-gold-rgb),0.35)",
          lineHeight: 1,
        }}
      >
        {num}
      </span>
    </div>
  );
}

export function CookingGuideSection() {
  return (
    <section
      id="cooking"
      style={{
        backgroundColor: "var(--wagyu-bg-alt)",
        padding: "clamp(3.25rem, 6vw, 5.5rem) 0",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 clamp(1.5rem, 5vw, 4rem)" }}>
        <div style={{ marginBottom: "2.75rem" }}>
          <Reveal>
            <div
              style={{ display: "flex", alignItems: "center", gap: "1rem", marginBottom: "1rem" }}
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
                style={{
                  fontFamily: "'Jost', sans-serif",
                  fontSize: "0.65rem",
                  letterSpacing: "0.3em",
                  textTransform: "uppercase",
                  color: "var(--wagyu-gold)",
                }}
              >
                Cooking Guide
              </span>
            </div>
          </Reveal>
          <Reveal delay={100}>
            <h2
              style={{
                fontFamily: "'Cormorant Garamond', serif",
                fontSize: "clamp(2.2rem, 4.5vw, 3.5rem)",
                fontWeight: 400,
                color: "var(--wagyu-text)",
                lineHeight: 1.2,
                maxWidth: 600,
              }}
            >
              Luxury Becomes
              <br />
              <em style={{ color: "var(--wagyu-gold)" }}>Approachable</em>
            </h2>
          </Reveal>
          <Reveal delay={200}>
            <p
              style={{
                fontFamily: "'Jost', sans-serif",
                fontSize: "1rem",
                fontWeight: 300,
                color: "rgba(var(--wagyu-text-rgb),0.6)",
                maxWidth: 500,
                marginTop: "1rem",
                lineHeight: 1.7,
              }}
            >
              Three steps. That's all it takes to cook the world's finest beef perfectly at home.
            </p>
          </Reveal>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "5rem" }}>
          {steps.map((step, i) => (
            <Reveal key={step.num} direction={i % 2 === 0 ? "right" : "left"} delay={100}>
              <div
                className="cooking-step-grid"
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: "clamp(2rem, 5vw, 5rem)",
                  alignItems: "center",
                  direction: i % 2 === 1 ? "rtl" : "ltr",
                }}
              >
                <div style={{ direction: "ltr" }}>
                  <StepPanel num={step.num} image={step.image} />
                </div>

                <div style={{ direction: "ltr" }}>
                  <div
                    style={{
                      fontFamily: "'Cormorant Garamond', serif",
                      fontSize: "5rem",
                      fontWeight: 300,
                      color: "rgba(var(--wagyu-gold-rgb),0.08)",
                      lineHeight: 1,
                      marginBottom: "-1rem",
                    }}
                  >
                    {step.num}
                  </div>
                  <h3
                    style={{
                      fontFamily: "'Cormorant Garamond', serif",
                      fontSize: "clamp(1.5rem, 3vw, 2.2rem)",
                      fontWeight: 400,
                      color: "var(--wagyu-text)",
                      marginBottom: "1rem",
                    }}
                  >
                    {step.title}
                  </h3>
                  <p
                    style={{
                      fontFamily: "'Jost', sans-serif",
                      fontSize: "0.95rem",
                      fontWeight: 300,
                      color: "rgba(var(--wagyu-text-rgb),0.65)",
                      lineHeight: 1.8,
                      marginBottom: "1.5rem",
                    }}
                  >
                    {step.desc}
                  </p>
                  <div
                    style={{
                      background: "rgba(var(--wagyu-gold-rgb),0.06)",
                      border: "1px solid rgba(var(--wagyu-gold-rgb),0.2)",
                      borderLeft: "3px solid var(--wagyu-gold)",
                      padding: "1rem 1.25rem",
                    }}
                  >
                    <p
                      style={{
                        fontFamily: "'Jost', sans-serif",
                        fontSize: "0.8rem",
                        fontWeight: 400,
                        color: "var(--wagyu-gold)",
                        lineHeight: 1.6,
                        fontStyle: "italic",
                      }}
                    >
                      {step.tip}
                    </p>
                  </div>
                </div>
              </div>
            </Reveal>
          ))}
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 300px), 1fr))",
            gap: "2rem",
            marginTop: "3rem",
          }}
        >
          {methods.map((method, idx) => (
            <Reveal key={method.title} delay={idx * 100}>
              <div
                style={{
                  background: "var(--wagyu-card)",
                  border: "1px solid rgba(var(--wagyu-gold-rgb),0.2)",
                  padding: "clamp(1.75rem, 4vw, 2.5rem)",
                  height: "100%",
                  transition: "border-color 0.3s ease",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = "rgba(var(--wagyu-gold-rgb),0.4)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = "rgba(var(--wagyu-gold-rgb),0.2)";
                }}
              >
                <div style={{ fontSize: "2.25rem", marginBottom: "1.5rem" }}>{method.emoji}</div>
                <div
                  style={{
                    fontFamily: "'Jost', sans-serif",
                    fontSize: "0.6rem",
                    letterSpacing: "0.2em",
                    textTransform: "uppercase",
                    color: "var(--wagyu-gold)",
                    marginBottom: "0.75rem",
                  }}
                >
                  {method.prep}
                </div>
                <h3
                  style={{
                    fontFamily: "'Cormorant Garamond', serif",
                    fontSize: "1.5rem",
                    fontWeight: 500,
                    color: "var(--wagyu-text)",
                    marginBottom: "1rem",
                  }}
                >
                  {method.title}
                </h3>
                <p
                  style={{
                    fontFamily: "'Jost', sans-serif",
                    fontSize: "0.9rem",
                    fontWeight: 300,
                    color: "rgba(var(--wagyu-text-rgb),0.65)",
                    lineHeight: 1.7,
                    marginBottom: "1.5rem",
                  }}
                >
                  {method.desc}
                </p>
                <div
                  style={{
                    borderTop: "1px solid rgba(var(--wagyu-gold-rgb),0.15)",
                    paddingTop: "1rem",
                  }}
                >
                  <div
                    style={{
                      fontFamily: "'Jost', sans-serif",
                      fontSize: "0.6rem",
                      letterSpacing: "0.15em",
                      textTransform: "uppercase",
                      color: "rgba(var(--wagyu-text-rgb),0.45)",
                      marginBottom: "0.35rem",
                    }}
                  >
                    Pro tip
                  </div>
                  <div
                    style={{
                      fontFamily: "'Jost', sans-serif",
                      fontSize: "0.8rem",
                      fontStyle: "italic",
                      color: "rgba(var(--wagyu-text-rgb),0.7)",
                    }}
                  >
                    {method.tip}
                  </div>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
