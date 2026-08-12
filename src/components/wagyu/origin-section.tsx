import { ArrowRight } from "lucide-react";
import { Reveal } from "@/components/wagyu/reveal";

const FLOW = [
  { label: "Japan", sub: "Island Nation", active: false },
  { label: "Kyushu", sub: "Southern Island", active: false },
  { label: "Miyazaki", sub: "Southeastern Coast", active: true },
];

export function OriginSection() {
  return (
    <section
      id="origin"
      style={{
        backgroundColor: "var(--wagyu-bg)",
        padding: "clamp(3.25rem, 6vw, 5.5rem) 0",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <div className="kanji-watermark" style={{ right: "-5%", top: "10%" }}>
        故郷
      </div>

      <div
        style={{
          maxWidth: 900,
          margin: "0 auto",
          padding: "0 clamp(1.5rem, 5vw, 4rem)",
          textAlign: "center",
          position: "relative",
        }}
      >
        <Reveal>
          <div
            style={{
              width: 40,
              height: 1,
              background: "var(--wagyu-gold)",
              margin: "0 auto 1.25rem",
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
            The Origin
          </span>
        </Reveal>

        <Reveal delay={100}>
          <h2
            style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: "clamp(2.5rem, 6vw, 4.5rem)",
              fontWeight: 400,
              color: "var(--wagyu-text)",
              lineHeight: 1.1,
              margin: "1rem 0 1.5rem",
            }}
          >
            Miyazaki, Japan
          </h2>
        </Reveal>

        <Reveal delay={200}>
          <p
            style={{
              fontFamily: "'Jost', sans-serif",
              fontSize: "1rem",
              fontWeight: 300,
              color: "rgba(var(--wagyu-text-rgb),0.65)",
              lineHeight: 1.8,
              maxWidth: 620,
              margin: "0 auto",
            }}
          >
            On the southeastern coast of Kyushu lies Miyazaki, a region renowned for its Wagyu
            production. Here, the story of our A5 Wagyu begins.
          </p>
        </Reveal>

        <Reveal delay={300}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexWrap: "wrap",
              gap: "0.75rem",
              margin: "4rem 0 4.5rem",
            }}
          >
            {FLOW.map((step, i) => (
              <div
                key={step.label}
                style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}
              >
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                  <div
                    style={{
                      position: "relative",
                      width: "clamp(68px, 20vw, 96px)",
                      height: "clamp(68px, 20vw, 96px)",
                      borderRadius: "50%",
                      border: step.active
                        ? "1px solid var(--wagyu-gold)"
                        : "1px solid rgba(var(--wagyu-text-rgb),0.2)",
                      boxShadow: step.active ? "0 0 24px rgba(var(--wagyu-gold-rgb),0.35)" : "none",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      background: "var(--wagyu-card)",
                    }}
                  >
                    {step.active && (
                      <span
                        aria-hidden
                        style={{
                          position: "absolute",
                          top: 8,
                          width: 6,
                          height: 6,
                          borderRadius: "50%",
                          background: "var(--wagyu-gold)",
                        }}
                      />
                    )}
                    <span
                      style={{
                        fontFamily: "'Cormorant Garamond', serif",
                        fontSize: "clamp(1.05rem, 3vw, 1.35rem)",
                        color: step.active ? "var(--wagyu-gold)" : "var(--wagyu-text)",
                      }}
                    >
                      {step.label}
                    </span>
                  </div>
                  <span
                    style={{
                      fontFamily: "'Jost', sans-serif",
                      fontSize: "0.62rem",
                      letterSpacing: "0.2em",
                      textTransform: "uppercase",
                      color: "rgba(var(--wagyu-text-rgb),0.45)",
                      marginTop: "0.75rem",
                    }}
                  >
                    {step.sub}
                  </span>
                </div>

                {i < FLOW.length - 1 && (
                  <div style={{ display: "flex", alignItems: "center", gap: "0.3rem" }}>
                    <span
                      style={{
                        width: "clamp(12px, 3vw, 24px)",
                        height: 1,
                        background: "rgba(var(--wagyu-gold-rgb),0.4)",
                      }}
                    />
                    <ArrowRight size={14} color="var(--wagyu-gold)" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </Reveal>

        <Reveal delay={400}>
          <div
            style={{
              background: "var(--wagyu-card)",
              border: "1px solid rgba(var(--wagyu-gold-rgb),0.2)",
              padding: "clamp(1.75rem, 4vw, 2.5rem)",
              textAlign: "left",
              display: "flex",
              gap: "1.5rem",
            }}
          >
            <span
              aria-hidden
              style={{
                width: 8,
                height: 8,
                borderRadius: "50%",
                background: "var(--wagyu-gold)",
                marginTop: "0.6rem",
                flexShrink: 0,
              }}
            />
            <div>
              <h3
                style={{
                  fontFamily: "'Cormorant Garamond', serif",
                  fontSize: "1.4rem",
                  fontWeight: 500,
                  color: "var(--wagyu-text)",
                  marginBottom: "0.75rem",
                }}
              >
                Why Miyazaki?
              </h3>
              <p
                style={{
                  fontFamily: "'Jost', sans-serif",
                  fontSize: "0.9rem",
                  fontWeight: 300,
                  color: "rgba(var(--wagyu-text-rgb),0.6)",
                  lineHeight: 1.8,
                }}
              >
                Miyazaki Prefecture on the southeastern coast of Kyushu is one of Japan's most
                recognized regions for Wagyu production. The combination of climate, geography, and
                generations of dedicated farming has established Miyazaki as a source of exceptional
                Japanese beef.
              </p>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
