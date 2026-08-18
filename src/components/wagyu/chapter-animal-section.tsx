import { Reveal } from "@/components/wagyu/reveal";
import { useWagyuI18n } from "@/components/wagyu/wagyu-i18n";

export function ChapterAnimalSection() {
  const { t, locale } = useWagyuI18n();
  const isKm = locale === "km";

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
                fontFamily: "'DM Sans', sans-serif",
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
              <Reveal delay={100}>
                <h2
                  lang={locale}
                  style={{
                    fontFamily: isKm
                      ? "'Kantumruy Pro', 'Battambang', sans-serif"
                      : "'DM Sans', sans-serif",
                    fontSize: isKm ? "clamp(2.1rem, 4.3vw, 3.2rem)" : "clamp(2.5rem, 5vw, 3.8rem)",
                    fontWeight: isKm ? 700 : 400,
                    color: "var(--wagyu-text)",
                    lineHeight: isKm ? 1.35 : 1.15,
                    letterSpacing: isKm ? "0.01em" : undefined,
                  }}
                >
                  {t("chapterAnimal.title")}
                </h2>
              </Reveal>
            </div>
          </div>

          <div>
            <Reveal delay={150}>
              <p
                lang={locale}
                style={{
                  fontFamily: "'DM Sans', 'Battambang', sans-serif",
                  fontSize: "1rem",
                  fontWeight: 300,
                  color: "rgba(var(--wagyu-text-rgb),0.7)",
                  lineHeight: 1.8,
                  marginBottom: "1.25rem",
                }}
              >
                {t("chapterAnimal.p1")}
              </p>
            </Reveal>

            <Reveal delay={220}>
              <p
                lang={locale}
                style={{
                  fontFamily: "'DM Sans', 'Battambang', sans-serif",
                  fontSize: "1rem",
                  fontWeight: 300,
                  color: "rgba(var(--wagyu-text-rgb),0.7)",
                  lineHeight: 1.8,
                  marginBottom: "1.25rem",
                }}
              >
                {t("chapterAnimal.p2")}
              </p>
            </Reveal>

            <Reveal delay={290}>
              <p
                lang={locale}
                style={{
                  fontFamily: "'DM Sans', 'Battambang', sans-serif",
                  fontSize: "1rem",
                  fontWeight: 300,
                  color: "rgba(var(--wagyu-text-rgb),0.7)",
                  lineHeight: 1.8,
                  marginBottom: "1.75rem",
                }}
              >
                {t("chapterAnimal.p3")}
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
                  lang={locale}
                  style={{
                    fontFamily: isKm
                      ? "'Kantumruy Pro', 'Battambang', sans-serif"
                      : "'DM Sans', sans-serif",
                    fontStyle: isKm ? "normal" : "italic",
                    fontSize: isKm ? "1.2rem" : "1.5rem",
                    fontWeight: isKm ? 700 : 400,
                    color: "var(--wagyu-gold)",
                    lineHeight: isKm ? 1.5 : 1.4,
                  }}
                >
                  {t("chapterAnimal.quote")}
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
