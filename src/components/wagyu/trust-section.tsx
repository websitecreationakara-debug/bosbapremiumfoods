import { useState, type ReactNode } from "react";
import { Reveal } from "@/components/wagyu/reveal";
import { useWagyuI18n, type WagyuI18nKey } from "@/components/wagyu/wagyu-i18n";

const ICONS = {
  dawn: (
    <svg
      viewBox="0 0 40 40"
      width="32"
      height="32"
      fill="none"
      stroke="var(--wagyu-gold)"
      strokeWidth="1.2"
    >
      <circle cx="20" cy="20" r="7" />
      <line x1="20" y1="4" x2="20" y2="9" />
      <line x1="20" y1="31" x2="20" y2="36" />
      <line x1="4" y1="20" x2="9" y2="20" />
      <line x1="31" y1="20" x2="36" y2="20" />
      <line x1="8.5" y1="8.5" x2="12" y2="12" />
      <line x1="28" y1="28" x2="31.5" y2="31.5" />
      <line x1="31.5" y1="8.5" x2="28" y2="12" />
      <line x1="12" y1="28" x2="8.5" y2="31.5" />
    </svg>
  ),
  cold: (
    <svg
      viewBox="0 0 40 40"
      width="32"
      height="32"
      fill="none"
      stroke="var(--wagyu-gold)"
      strokeWidth="1.2"
    >
      <line x1="20" y1="4" x2="20" y2="36" />
      <line x1="4" y1="20" x2="36" y2="20" />
      <line x1="8.7" y1="8.7" x2="31.3" y2="31.3" />
      <line x1="31.3" y1="8.7" x2="8.7" y2="31.3" />
      <circle cx="20" cy="20" r="4" fill="var(--wagyu-gold)" opacity="0.15" />
      <circle cx="20" cy="20" r="2" fill="var(--wagyu-gold)" opacity="0.6" />
    </svg>
  ),
  japan: (
    <svg
      viewBox="0 0 40 40"
      width="32"
      height="32"
      fill="none"
      stroke="var(--wagyu-gold)"
      strokeWidth="1.2"
    >
      <rect x="6" y="6" width="28" height="28" rx="0" />
      <circle cx="20" cy="20" r="7" fill="var(--wagyu-gold)" opacity="0.15" />
      <circle cx="20" cy="20" r="7" />
      <line x1="6" y1="20" x2="13" y2="20" />
      <line x1="27" y1="20" x2="34" y2="20" />
    </svg>
  ),
  gift: (
    <svg
      viewBox="0 0 40 40"
      width="32"
      height="32"
      fill="none"
      stroke="var(--wagyu-gold)"
      strokeWidth="1.2"
    >
      <rect x="5" y="16" width="30" height="4" />
      <rect x="8" y="20" width="24" height="15" />
      <path d="M20 16 C20 16 14 10 14 14 C14 18 20 16 20 16 C20 16 26 10 26 14 C26 18 20 16 20 16Z" />
      <line x1="20" y1="16" x2="20" y2="35" />
    </svg>
  ),
  cert: (
    <svg
      viewBox="0 0 40 40"
      width="32"
      height="32"
      fill="none"
      stroke="var(--wagyu-gold)"
      strokeWidth="1.2"
    >
      <path d="M20 4 L23.5 13 L33 13 L25.5 19 L28.5 28.5 L20 23 L11.5 28.5 L14.5 19 L7 13 L16.5 13 Z" />
    </svg>
  ),
  delivery: (
    <svg
      viewBox="0 0 40 40"
      width="32"
      height="32"
      fill="none"
      stroke="var(--wagyu-gold)"
      strokeWidth="1.2"
    >
      <rect x="4" y="12" width="22" height="16" rx="0" />
      <path d="M26 16 L36 16 L36 28 L26 28" />
      <circle cx="11" cy="30" r="3" />
      <circle cx="29" cy="30" r="3" />
      <line x1="26" y1="20" x2="36" y2="20" />
    </svg>
  ),
};

const TRUST_ITEMS: { icon: ReactNode; titleKey: WagyuI18nKey; descKey: WagyuI18nKey }[] = [
  {
    icon: ICONS.dawn,
    titleKey: "trust.dawn.title",
    descKey: "trust.dawn.desc",
  },
  {
    icon: ICONS.cold,
    titleKey: "trust.cold.title",
    descKey: "trust.cold.desc",
  },
  {
    icon: ICONS.japan,
    titleKey: "trust.japan.title",
    descKey: "trust.japan.desc",
  },
  {
    icon: ICONS.gift,
    titleKey: "trust.gift.title",
    descKey: "trust.gift.desc",
  },
  {
    icon: ICONS.cert,
    titleKey: "trust.cert.title",
    descKey: "trust.cert.desc",
  },
  {
    icon: ICONS.delivery,
    titleKey: "trust.delivery.title",
    descKey: "trust.delivery.desc",
  },
];

const BullMon = () => (
  <svg viewBox="0 0 60 60" width="40" height="40" fill="none">
    <circle cx="30" cy="30" r="28" stroke="var(--wagyu-gold)" strokeWidth="0.8" opacity="0.3" />
    <path
      d="M30 10 C20 10 13 17 13 26 C13 33 17 38 22 40 L22 46 L38 46 L38 40 C43 38 47 33 47 26 C47 17 40 10 30 10Z"
      fill="var(--wagyu-gold)"
      opacity="0.15"
      stroke="var(--wagyu-gold)"
      strokeWidth="0.8"
    />
    <path d="M22 24 Q30 18 38 24" stroke="var(--wagyu-gold)" strokeWidth="1" fill="none" />
    <circle cx="24" cy="27" r="2" fill="var(--wagyu-gold)" opacity="0.7" />
    <circle cx="36" cy="27" r="2" fill="var(--wagyu-gold)" opacity="0.7" />
    <line x1="18" y1="46" x2="42" y2="46" stroke="var(--wagyu-gold)" strokeWidth="0.8" />
  </svg>
);

export function TrustSection() {
  const [hovered, setHovered] = useState<number | null>(null);
  const { t, locale } = useWagyuI18n();
  const isKm = locale === "km";

  return (
    <section
      id="trust"
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
            gridTemplateColumns: "1fr 2fr",
            gap: "3rem",
            alignItems: "flex-end",
            marginBottom: "2.75rem",
          }}
          className="trust-header-grid"
        >
          <div>
            <Reveal>
              <div style={{ marginBottom: "1rem" }}>
                <BullMon />
              </div>
            </Reveal>
            <Reveal delay={100}>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "1rem",
                  marginBottom: "0.75rem",
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
                  {t("trust.eyebrow")}
                </span>
              </div>
            </Reveal>
            <Reveal delay={150}>
              <h2
                style={{
                  fontFamily: "'Cormorant Garamond', serif",
                  fontSize: "clamp(2rem, 4vw, 3.2rem)",
                  fontWeight: 400,
                  color: "var(--wagyu-text)",
                  lineHeight: 1.15,
                }}
              >
                The{" "}
                <span style={{ color: "var(--wagyu-gold)", fontWeight: 700 }}>
                  {t("trust.title.bosba")}
                </span>
                <br />
                <em style={{ color: "var(--wagyu-gold)" }}>{t("trust.title.em")}</em>
                <br />
                {t("trust.title.post")}
              </h2>
            </Reveal>
          </div>
          <Reveal delay={200} style={{ paddingBottom: "0.5rem" }}>
            <p
              lang={locale}
              style={{
                fontFamily: "'Jost', 'Battambang', sans-serif",
                fontSize: "1rem",
                fontWeight: 300,
                color: "rgba(var(--wagyu-text-rgb),0.6)",
                lineHeight: 1.8,
                maxWidth: 520,
              }}
            >
              {t("trust.intro")}
            </p>
          </Reveal>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
            gap: "1px",
            background: "rgba(var(--wagyu-gold-rgb),0.08)",
          }}
        >
          {TRUST_ITEMS.map((item, i) => (
            <Reveal key={item.titleKey} delay={i * 60}>
              <div
                onMouseEnter={() => setHovered(i)}
                onMouseLeave={() => setHovered(null)}
                style={{
                  background: hovered === i ? "var(--wagyu-card-hover)" : "var(--wagyu-card)",
                  padding: "2.25rem",
                  transition:
                    "background-color 0.25s cubic-bezier(0.23,1,0.32,1), transform 0.25s cubic-bezier(0.23,1,0.32,1), box-shadow 0.25s cubic-bezier(0.23,1,0.32,1)",
                  transform: hovered === i ? "translateY(-4px)" : "translateY(0)",
                  boxShadow:
                    hovered === i
                      ? "0 16px 48px rgba(var(--wagyu-gold-rgb),0.1)"
                      : "0 16px 48px rgba(var(--wagyu-gold-rgb),0)",
                  willChange: "transform",
                  cursor: "default",
                  position: "relative",
                  height: "100%",
                }}
              >
                <div
                  style={{
                    marginBottom: "1.25rem",
                    opacity: hovered === i ? 1 : 0.7,
                    transition: "opacity 0.25s",
                  }}
                >
                  {item.icon}
                </div>
                <h3
                  style={{
                    fontFamily: "'Cormorant Garamond', serif",
                    fontSize: "1.2rem",
                    fontWeight: 500,
                    color: "var(--wagyu-text)",
                    marginBottom: "0.75rem",
                    letterSpacing: "0.02em",
                  }}
                >
                  {t(item.titleKey)}
                </h3>
                <p
                  lang={locale}
                  style={{
                    fontFamily: "'Jost', 'Battambang', sans-serif",
                    fontSize: "0.85rem",
                    fontWeight: 300,
                    color: "rgba(var(--wagyu-text-rgb),0.55)",
                    lineHeight: 1.7,
                  }}
                >
                  {t(item.descKey)}
                </p>
                <div
                  style={{
                    width: hovered === i ? "100%" : "24px",
                    height: 1,
                    background: "var(--wagyu-gold)",
                    marginTop: "1.5rem",
                    transition: "width 0.4s ease-out",
                  }}
                />
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
