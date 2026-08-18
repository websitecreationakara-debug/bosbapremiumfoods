import { ArrowRight } from "lucide-react";
import { Reveal } from "@/components/wagyu/reveal";
import { useWagyuI18n } from "@/components/wagyu/wagyu-i18n";

const FLOW = [
  { label: "Japan", sub: "Island Nation", active: false },
  { label: "Kyushu", sub: "Southern Island", active: false },
  { label: "Miyazaki", sub: "Southeastern Coast", active: true },
];

export function OriginSection() {
  const { t, locale } = useWagyuI18n();
  const isKm = locale === "km";

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
              fontFamily: "'DM Sans', sans-serif",
              fontSize: "0.65rem",
              letterSpacing: "0.3em",
              textTransform: "uppercase",
              color: "var(--wagyu-gold)",
            }}
          >
            {t("origin.eyebrow")}
          </span>
        </Reveal>

        <Reveal delay={100}>
          <h2
            lang={locale}
            style={{
              fontFamily: isKm
                ? "'Kantumruy Pro', 'Battambang', sans-serif"
                : "'Cormorant Garamond', serif",
              fontSize: isKm ? "clamp(2.1rem, 5vw, 3.6rem)" : "clamp(2.5rem, 6vw, 4.5rem)",
              fontWeight: isKm ? 700 : 400,
              color: "var(--wagyu-text)",
              lineHeight: isKm ? 1.3 : 1.1,
              letterSpacing: isKm ? "0.01em" : undefined,
              margin: "1rem 0 1.5rem",
            }}
          >
            {t("origin.title")}
          </h2>
        </Reveal>

        <Reveal delay={200}>
          <p
            lang={locale}
            style={{
              fontFamily: "'DM Sans', 'Battambang', sans-serif",
              fontSize: "1rem",
              fontWeight: 300,
              color: "rgba(var(--wagyu-text-rgb),0.65)",
              lineHeight: 1.8,
              maxWidth: 620,
              margin: "0 auto",
            }}
          >
            {t("origin.intro")}
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
                      fontFamily: "'DM Sans', sans-serif",
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
            className="rounded-sm"
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
                lang={locale}
                style={{
                  fontFamily: isKm
                    ? "'Kantumruy Pro', 'Battambang', sans-serif"
                    : "'Cormorant Garamond', serif",
                  fontSize: isKm ? "1.3rem" : "1.4rem",
                  fontWeight: isKm ? 700 : 500,
                  color: "var(--wagyu-text)",
                  lineHeight: isKm ? 1.35 : undefined,
                  marginBottom: "0.75rem",
                }}
              >
                {t("origin.why.title")}
              </h3>
              <p
                lang={locale}
                style={{
                  fontFamily: "'DM Sans', 'Battambang', sans-serif",
                  fontSize: "0.9rem",
                  fontWeight: 300,
                  color: "rgba(var(--wagyu-text-rgb),0.6)",
                  lineHeight: 1.8,
                }}
              >
                {t("origin.why.body")}
              </p>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
