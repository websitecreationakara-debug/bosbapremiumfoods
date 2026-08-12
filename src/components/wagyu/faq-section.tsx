import { useState } from "react";
import { Reveal } from "@/components/wagyu/reveal";

const FAQS = [
  {
    q: "Why is Japanese Wagyu so expensive?",
    a: "Japanese Wagyu cattle are raised for 30+ months under strict regulations — nearly three times longer than standard beef. The meticulous feeding program, stress-free environment, and limited production create a scarcity that reflects in the price. You're paying for an experience that cannot be replicated.",
  },
  {
    q: "What is the difference between A4 and A5 Wagyu?",
    a: "Both are exceptional, but A5 represents the absolute pinnacle. A4 has a BMS (Beef Marbling Score) of 6–8, offering rich flavor with balanced fat. A5 scores 9–12, with extreme intramuscular fat that melts at body temperature. A4 is ideal for steak lovers; A5 is a once-in-a-lifetime luxury experience.",
  },
  {
    q: "How should I cook Japanese Wagyu at home?",
    a: "Keep it simple. Bring to room temperature, heat a dry cast iron pan until smoking, sear 30–60 seconds per side (A5) or up to 90 seconds (A4). Rest 2–3 minutes, slice thinly against the grain. Season only with fleur de sel. No marinades, no sauces needed — the beef is the star.",
  },
  {
    q: "How is the Wagyu delivered?",
    a: "All orders are shipped in premium insulated packaging with dry ice or gel packs to maintain the cold chain. Your Wagyu arrives frozen and in perfect condition. We include a complimentary wagyu sauce and premium black pepper with every order.",
  },
  {
    q: "How long can Wagyu stay frozen?",
    a: "Properly stored in your freezer at -18°C or below, Japanese Wagyu can be kept for up to 6 months without any loss of quality. Once thawed in the refrigerator (24 hours), cook within 2–3 days for the best experience.",
  },
  {
    q: "Is the origin of your Wagyu certified?",
    a: "Yes. All our Wagyu is sourced from certified Japanese farms and graded by the Japan Meat Grading Association (JMGA). We provide full traceability documentation with every order, including the prefecture of origin and official grade certificate.",
  },
];

export function FAQSection() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section
      id="faq"
      style={{ backgroundColor: "var(--wagyu-bg)", padding: "clamp(3.25rem, 6vw, 5.5rem) 0" }}
    >
      <div style={{ maxWidth: 800, margin: "0 auto", padding: "0 clamp(1.5rem, 5vw, 4rem)" }}>
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
                style={{
                  fontFamily: "'Jost', sans-serif",
                  fontSize: "0.65rem",
                  letterSpacing: "0.3em",
                  textTransform: "uppercase",
                  color: "var(--wagyu-gold)",
                }}
              >
                FAQ
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
              style={{
                fontFamily: "'Cormorant Garamond', serif",
                fontSize: "clamp(2.2rem, 4.5vw, 3.5rem)",
                fontWeight: 400,
                color: "var(--wagyu-text)",
                lineHeight: 1.2,
              }}
            >
              Your Questions, Answered
            </h2>
          </Reveal>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
          {FAQS.map((faq, i) => (
            <Reveal key={faq.q} delay={i * 60}>
              <div
                style={{
                  background: "var(--wagyu-card)",
                  border: `1px solid ${open === i ? "rgba(var(--wagyu-gold-rgb),0.4)" : "rgba(var(--wagyu-gold-rgb),0.12)"}`,
                  transition: "border-color 0.3s",
                }}
              >
                <button
                  className="faq-trigger"
                  onClick={() => setOpen(open === i ? null : i)}
                  style={{
                    width: "100%",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    padding: "1.5rem",
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    textAlign: "left",
                    gap: "1rem",
                  }}
                >
                  <span
                    style={{
                      fontFamily: "'Cormorant Garamond', serif",
                      fontSize: "1.15rem",
                      fontWeight: 500,
                      color: open === i ? "var(--wagyu-gold)" : "var(--wagyu-text)",
                      transition: "color 0.3s",
                    }}
                  >
                    {faq.q}
                  </span>
                  <span
                    style={{
                      color: "var(--wagyu-gold)",
                      fontSize: "1.2rem",
                      flexShrink: 0,
                      transition: "transform 0.3s",
                      transform: open === i ? "rotate(45deg)" : "rotate(0deg)",
                      display: "inline-block",
                    }}
                  >
                    +
                  </span>
                </button>
                {open === i && (
                  <div style={{ padding: "0 1.5rem 1.5rem" }}>
                    <div
                      style={{
                        width: "100%",
                        height: 1,
                        background: "rgba(var(--wagyu-gold-rgb),0.15)",
                        marginBottom: "1rem",
                      }}
                    />
                    <p
                      style={{
                        fontFamily: "'Jost', sans-serif",
                        fontSize: "0.9rem",
                        fontWeight: 300,
                        color: "rgba(var(--wagyu-text-rgb),0.65)",
                        lineHeight: 1.8,
                      }}
                    >
                      {faq.a}
                    </p>
                  </div>
                )}
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
