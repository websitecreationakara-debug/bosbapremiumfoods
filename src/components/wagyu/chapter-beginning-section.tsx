import { Reveal } from "@/components/wagyu/reveal";
import { useWagyuI18n } from "@/components/wagyu/wagyu-i18n";
import imagefarm from "../../image/japenfarm.jpg";

export function ChapterBeginningSection() {
  const { t, locale } = useWagyuI18n();
  const isKm = locale === "km";

  return (
    <section
      id="chapter-beginning"
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
            gap: "clamp(3rem, 6vw, 7rem)",
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
              01
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
                    The Beginning
                  </span>
                </div>
              </Reveal>

              <Reveal delay={100}>
                <h2
                  lang={locale}
                  style={{
                    fontFamily: isKm
                      ? "'Kantumruy Pro', 'Battambang', sans-serif"
                      : "'Cormorant Garamond', serif",
                    fontSize: isKm ? "clamp(2.1rem, 4.3vw, 3.2rem)" : "clamp(2.5rem, 5vw, 3.8rem)",
                    fontWeight: isKm ? 700 : 400,
                    color: "var(--wagyu-text)",
                    lineHeight: isKm ? 1.35 : 1.15,
                    letterSpacing: isKm ? "0.01em" : undefined,
                    marginBottom: "2rem",
                  }}
                >
                  {t("chapterBeginning.title")}
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
                    marginBottom: "1.25rem",
                  }}
                >
                  {t("chapterBeginning.p1")}
                </p>
              </Reveal>

              <Reveal delay={280}>
                <p
                  lang={locale}
                  style={{
                    fontFamily: "'Jost', 'Battambang', sans-serif",
                    fontSize: "1rem",
                    fontWeight: 300,
                    color: "rgba(var(--wagyu-text-rgb),0.7)",
                    lineHeight: 1.8,
                    marginBottom: "1.25rem",
                  }}
                >
                  {t("chapterBeginning.p2")}
                </p>
              </Reveal>

              <Reveal delay={360}>
                <p
                  lang={locale}
                  style={{
                    fontFamily: "'Jost', 'Battambang', sans-serif",
                    fontSize: "1rem",
                    fontWeight: 300,
                    color: "rgba(var(--wagyu-text-rgb),0.7)",
                    lineHeight: 1.8,
                    marginBottom: "1.75rem",
                  }}
                >
                  {t("chapterBeginning.p3")}
                </p>
              </Reveal>

              <Reveal delay={440}>
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
                      fontSize: "1.3rem",
                      fontWeight: 400,
                      color: "rgba(var(--wagyu-text-rgb),0.85)",
                      lineHeight: 1.5,
                    }}
                  >
                    For our Wagyu, that story begins in{" "}
                    <span style={{ color: "var(--wagyu-gold)" }}>Miyazaki, Japan</span>.
                  </p>
                </div>
              </Reveal>
            </div>
          </div>

          <Reveal direction="right" delay={200} style={{ position: "relative" }}>
            <div style={{ position: "relative", overflow: "hidden" }}>
              <img
                src={imagefarm}
                alt="Misty mountains above a traditional Japanese farmhouse"
                style={{ width: "100%", aspectRatio: "4/5", objectFit: "cover", display: "block" }}
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

            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.6rem",
                marginTop: "1.25rem",
              }}
            >
              <span
                aria-hidden
                style={{
                  width: 6,
                  height: 6,
                  borderRadius: "50%",
                  background: "var(--wagyu-gold)",
                  flexShrink: 0,
                }}
              />
              <span
                style={{
                  fontFamily: "'Jost', sans-serif",
                  fontSize: "0.7rem",
                  letterSpacing: "0.2em",
                  textTransform: "uppercase",
                  color: "rgba(var(--wagyu-text-rgb),0.6)",
                }}
              >
                Miyazaki Prefecture, Japan
              </span>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
