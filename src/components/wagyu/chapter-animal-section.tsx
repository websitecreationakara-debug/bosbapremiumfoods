import { Reveal } from "@/components/wagyu/reveal";

export function ChapterAnimalSection() {
  return (
    <section
      id="chapter-animal"
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
            gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 440px), 1fr))",
            gap: "clamp(3rem, 6vw, 6rem)",
            alignItems: "center",
          }}
        >
          <div style={{ position: "relative" }}>
            <span
              aria-hidden
              style={{
                position: "absolute",
                top: "-1.5rem",
                left: "-0.5rem",
                fontFamily: "'Cormorant Garamond', serif",
                fontSize: "clamp(8rem, 16vw, 13rem)",
                fontWeight: 300,
                color: "rgba(var(--wagyu-gold-rgb),0.06)",
                lineHeight: 1,
                userSelect: "none",
                zIndex: 0,
              }}
            >
              04
            </span>

            <div style={{ position: "relative", zIndex: 1 }}>
              <Reveal>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "0.75rem",
                    marginBottom: "1.5rem",
                  }}
                >
                  <span
                    style={{
                      width: 30,
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
                    Chapter 04 — The Animal
                  </span>
                </div>
              </Reveal>

              <Reveal delay={100}>
                <h2
                  style={{
                    fontFamily: "'Cormorant Garamond', serif",
                    fontSize: "clamp(2.5rem, 5vw, 3.8rem)",
                    fontWeight: 400,
                    color: "var(--wagyu-text)",
                    lineHeight: 1.15,
                  }}
                >
                  Before It Becomes Wagyu, It Begins Here.
                </h2>
              </Reveal>
            </div>
          </div>

          <div>
            <Reveal delay={150}>
              <p
                style={{
                  fontFamily: "'Jost', sans-serif",
                  fontSize: "1rem",
                  fontWeight: 300,
                  color: "rgba(var(--wagyu-text-rgb),0.7)",
                  lineHeight: 1.8,
                  marginBottom: "1.25rem",
                }}
              >
                Japanese Wagyu is closely associated with carefully bred cattle and generations of
                selective breeding.
              </p>
            </Reveal>

            <Reveal delay={220}>
              <p
                style={{
                  fontFamily: "'Jost', sans-serif",
                  fontSize: "1rem",
                  fontWeight: 300,
                  color: "rgba(var(--wagyu-text-rgb),0.7)",
                  lineHeight: 1.8,
                  marginBottom: "1.25rem",
                }}
              >
                The cattle are raised under controlled management, with attention paid to their
                development throughout their lives.
              </p>
            </Reveal>

            <Reveal delay={290}>
              <p
                style={{
                  fontFamily: "'Jost', sans-serif",
                  fontSize: "1rem",
                  fontWeight: 300,
                  color: "rgba(var(--wagyu-text-rgb),0.7)",
                  lineHeight: 1.8,
                  marginBottom: "1.75rem",
                }}
              >
                The goal is not simply to produce more beef.
              </p>
            </Reveal>

            <Reveal delay={360}>
              <div
                style={{
                  borderLeft: "2px solid var(--wagyu-gold)",
                  padding: "0.25rem 0 0.25rem 1.5rem",
                }}
              >
                <p
                  style={{
                    fontFamily: "'Cormorant Garamond', serif",
                    fontStyle: "italic",
                    fontSize: "1.5rem",
                    fontWeight: 400,
                    color: "var(--wagyu-gold)",
                    lineHeight: 1.4,
                  }}
                >
                  "It is to produce exceptional beef."
                </p>
              </div>
            </Reveal>
          </div>
        </div>

        <Reveal delay={200} style={{ marginTop: "3rem" }}>
          <div className="gold-divider" style={{ width: "100%" }} />
        </Reveal>
      </div>
    </section>
  );
}
