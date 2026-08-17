import { Reveal } from "@/components/wagyu/reveal";
import { useWagyuI18n, type WagyuI18nKey } from "@/components/wagyu/wagyu-i18n";

const STEPS: { num: number; labelKey: WagyuI18nKey }[] = [
  { num: 1, labelKey: "journey.step.birth" },
  { num: 2, labelKey: "journey.step.growth" },
  { num: 3, labelKey: "journey.step.development" },
  { num: 4, labelKey: "journey.step.finished" },
];

export function JourneyTimelineSection() {
  const { t, locale } = useWagyuI18n();
  const isKm = locale === "km";

  return (
    <section
      id="journey"
      style={{
        backgroundColor: "var(--wagyu-bg)",
        padding: "clamp(2.75rem, 5vw, 4rem) 0",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "0 clamp(1.5rem, 5vw, 4rem)" }}>
        <Reveal>
          <div
            style={{
              background: "var(--wagyu-card)",
              border: "1px solid rgba(var(--wagyu-gold-rgb),0.2)",
              padding: "clamp(2.5rem, 6vw, 4rem) clamp(1.5rem, 5vw, 3rem)",
            }}
            className="rounded-sm"
          >
            <div style={{ textAlign: "center", marginBottom: "2.25rem" }}>
              <span
                lang={locale}
                style={{
                  fontFamily: "'Jost', 'Battambang', sans-serif",
                  fontSize: isKm ? "0.75rem" : "0.65rem",
                  letterSpacing: isKm ? "normal" : "0.3em",
                  textTransform: isKm ? "none" : "uppercase",
                  color: "var(--wagyu-gold)",
                }}
              >
                {t("journey.eyebrow")}
              </span>
            </div>

            <div
              style={{
                display: "flex",
                alignItems: "flex-start",
                justifyContent: "center",
                flexWrap: "wrap",
                gap: "0.5rem",
              }}
            >
              {STEPS.map((step, i) => {
                const active = i === STEPS.length - 1;
                return (
                  <div key={step.num} style={{ display: "flex", alignItems: "center" }}>
                    <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                      <div
                        style={{
                          width: "clamp(36px, 10vw, 48px)",
                          height: "clamp(36px, 10vw, 48px)",
                          borderRadius: "50%",
                          border: active
                            ? "1px solid var(--wagyu-gold)"
                            : "1px solid rgba(var(--wagyu-text-rgb),0.25)",
                          boxShadow: active ? "0 0 16px rgba(var(--wagyu-gold-rgb),0.4)" : "none",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontFamily: "'Jost', sans-serif",
                          fontSize: "0.85rem",
                          color: active ? "var(--wagyu-gold)" : "var(--wagyu-text)",
                        }}
                      >
                        {step.num}
                      </div>
                      <span
                        lang={locale}
                        style={{
                          fontFamily: "'Jost', 'Battambang', sans-serif",
                          fontSize: "0.75rem",
                          color: active ? "var(--wagyu-text)" : "rgba(var(--wagyu-text-rgb),0.6)",
                          marginTop: "0.6rem",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {t(step.labelKey)}
                      </span>
                    </div>

                    {i < STEPS.length - 1 && (
                      <span
                        style={{
                          width: "clamp(1.1rem, 5vw, 4.5rem)",
                          height: 1,
                          background: "rgba(var(--wagyu-gold-rgb),0.25)",
                          margin: "0 0.35rem",
                          alignSelf: "flex-start",
                          marginTop: "clamp(18px, 5vw, 23px)",
                        }}
                      />
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
