import { Reveal } from "@/components/wagyu/reveal";

const STEPS = [
  { num: 1, label: "Birth" },
  { num: 2, label: "Growth" },
  { num: 3, label: "Development" },
  { num: 4, label: "Finished Wagyu" },
];

export function JourneyTimelineSection() {
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
          >
            <div style={{ textAlign: "center", marginBottom: "2.25rem" }}>
              <span
                style={{
                  fontFamily: "'Jost', sans-serif",
                  fontSize: "0.65rem",
                  letterSpacing: "0.3em",
                  textTransform: "uppercase",
                  color: "var(--wagyu-gold)",
                }}
              >
                The Journey Of A Wagyu
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
                          width: 48,
                          height: 48,
                          borderRadius: "50%",
                          border: active
                            ? "1px solid var(--wagyu-gold)"
                            : "1px solid rgba(var(--wagyu-text-rgb),0.25)",
                          boxShadow: active ? "0 0 16px rgba(var(--wagyu-gold-rgb),0.4)" : "none",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontFamily: "'Jost', sans-serif",
                          fontSize: "0.95rem",
                          color: active ? "var(--wagyu-gold)" : "var(--wagyu-text)",
                        }}
                      >
                        {step.num}
                      </div>
                      <span
                        style={{
                          fontFamily: "'Jost', sans-serif",
                          fontSize: "0.8rem",
                          color: active ? "var(--wagyu-text)" : "rgba(var(--wagyu-text-rgb),0.6)",
                          marginTop: "0.75rem",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {step.label}
                      </span>
                    </div>

                    {i < STEPS.length - 1 && (
                      <span
                        style={{
                          width: "clamp(2rem, 6vw, 4.5rem)",
                          height: 1,
                          background: "rgba(var(--wagyu-gold-rgb),0.25)",
                          margin: "0 0.5rem",
                          alignSelf: "flex-start",
                          marginTop: 23,
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
