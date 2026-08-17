import { useState } from "react";
import { Reveal } from "@/components/wagyu/reveal";
import { useWagyuI18n, type WagyuI18nKey } from "@/components/wagyu/wagyu-i18n";

const FAQS: { qKey: WagyuI18nKey; aKey: WagyuI18nKey }[] = [
  { qKey: "faq.q1.q", aKey: "faq.q1.a" },
  { qKey: "faq.q2.q", aKey: "faq.q2.a" },
  { qKey: "faq.q3.q", aKey: "faq.q3.a" },
  { qKey: "faq.q4.q", aKey: "faq.q4.a" },
  { qKey: "faq.q5.q", aKey: "faq.q5.a" },
  { qKey: "faq.q6.q", aKey: "faq.q6.a" },
];

export function FAQSection() {
  const [open, setOpen] = useState<number | null>(0);
  const { t, locale } = useWagyuI18n();
  const isKm = locale === "km";

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
                {t("faq.eyebrow")}
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
              lang={locale}
              style={{
                fontFamily: isKm
                  ? "'Kantumruy Pro', 'Battambang', sans-serif"
                  : "'Cormorant Garamond', serif",
                fontSize: isKm ? "clamp(1.9rem, 4vw, 3rem)" : "clamp(2.2rem, 4.5vw, 3.5rem)",
                fontWeight: isKm ? 700 : 400,
                color: "var(--wagyu-text)",
                lineHeight: isKm ? 1.35 : 1.2,
                letterSpacing: isKm ? "0.01em" : undefined,
              }}
            >
              {t("faq.title")}
            </h2>
          </Reveal>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
          {FAQS.map((faq, i) => (
            <Reveal key={faq.qKey} delay={i * 60}>
              <div
                style={{
                  background: "var(--wagyu-card)",
                  border: `1px solid ${open === i ? "rgba(var(--wagyu-gold-rgb),0.4)" : "rgba(var(--wagyu-gold-rgb),0.12)"}`,
                  transition: "border-color 0.3s",
                }}
                className="rounded-sm"
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
                    lang={locale}
                    style={{
                      fontFamily: isKm
                        ? "'Kantumruy Pro', 'Battambang', sans-serif"
                        : "'Cormorant Garamond', serif",
                      fontSize: isKm ? "1.05rem" : "1.15rem",
                      fontWeight: isKm ? 700 : 500,
                      color: open === i ? "var(--wagyu-gold)" : "var(--wagyu-text)",
                      lineHeight: isKm ? 1.4 : undefined,
                      transition: "color 0.3s",
                    }}
                  >
                    {t(faq.qKey)}
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
                      lang={locale}
                      style={{
                        fontFamily: "'Jost', 'Battambang', sans-serif",
                        fontSize: "0.9rem",
                        fontWeight: 300,
                        color: "rgba(var(--wagyu-text-rgb),0.65)",
                        lineHeight: 1.8,
                      }}
                    >
                      {t(faq.aKey)}
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
