import { Reveal } from "@/components/wagyu/reveal";
import { useWagyuI18n, type WagyuI18nKey } from "@/components/wagyu/wagyu-i18n";
import logobosba from "../../image/BOSBA-Logo.png";

const CHAIN: {
  icon: string;
  titleKey: WagyuI18nKey;
  subKey: WagyuI18nKey;
  active: boolean;
}[] = [
  { icon: "🌿", titleKey: "supplyChain.farm.title", subKey: "supplyChain.farm.sub", active: false },
  {
    icon: "🐄",
    titleKey: "supplyChain.wagyu.title",
    subKey: "supplyChain.wagyu.sub",
    active: false,
  },
  {
    icon: "✓",
    titleKey: "supplyChain.quality.title",
    subKey: "supplyChain.quality.sub",
    active: false,
  },
  { icon: "❄", titleKey: "supplyChain.cold.title", subKey: "supplyChain.cold.sub", active: false },
  {
    icon: "✈",
    titleKey: "supplyChain.cambodia.title",
    subKey: "supplyChain.cambodia.sub",
    active: false,
  },
  { icon: logobosba, titleKey: "trust.title.bosba", subKey: "supplyChain.bosba.sub", active: true },
  {
    icon: "🍽",
    titleKey: "supplyChain.table.title",
    subKey: "supplyChain.table.sub",
    active: true,
  },
];

export function SupplyChainSection() {
  const { t, locale } = useWagyuI18n();
  const isKm = locale === "km";
  return (
    <section
      id="supply-chain"
      className="mb-20"
      style={{
        backgroundColor: "var(--wagyu-bg-alt)",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          maxWidth: 1200,
          margin: "0 auto",
          padding: "0 clamp(1.5rem, 5vw, 4rem)",
          textAlign: "center",
        }}
      >
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
            {t("supplyChain.intro")}
          </p>
        </Reveal>

        <Reveal delay={300}>
          <div
            style={{
              display: "flex",
              alignItems: "flex-start",
              justifyContent: "center",
              flexWrap: "wrap",
              gap: "0.25rem",
              marginTop: "4rem",
            }}
          >
            {CHAIN.map((node, i) => (
              <div key={node.titleKey} style={{ display: "flex", alignItems: "flex-start" }}>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    width: "clamp(78px, 22vw, 108px)",
                  }}
                >
                  <div
                    style={{
                      width: "clamp(48px, 14vw, 64px)",
                      height: "clamp(48px, 14vw, 64px)",
                      borderRadius: "50%",
                      border: node.active
                        ? "1px solid var(--wagyu-gold)"
                        : "1px solid rgba(var(--wagyu-text-rgb),0.2)",
                      background: node.active
                        ? "rgba(var(--wagyu-gold-rgb),0.1)"
                        : "var(--wagyu-card)",
                      boxShadow: node.active ? "0 0 16px rgba(var(--wagyu-gold-rgb),0.35)" : "none",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      overflow: "hidden",
                      fontSize: "clamp(1rem, 3.5vw, 1.3rem)",
                      color: node.active ? "var(--wagyu-gold)" : "var(--wagyu-text)",
                    }}
                  >
                    {node.icon === logobosba ? (
                      <img
                        src={logobosba}
                        alt="BOSBA"
                        style={{
                          width: "100%",
                          height: "100%",
                          objectFit: "cover",
                          borderRadius: "50%",
                        }}
                      />
                    ) : (
                      node.icon
                    )}
                  </div>
                  <span
                    lang={locale}
                    style={{
                      fontFamily: "'DM Sans', 'Battambang', sans-serif",
                      fontSize: "0.8rem",
                      color: "var(--wagyu-text)",
                      marginTop: "0.75rem",
                    }}
                  >
                    {t(node.titleKey)}
                  </span>
                  <span
                    lang={locale}
                    style={{
                      fontFamily: "'DM Sans', 'Battambang', sans-serif",
                      fontSize: isKm ? "0.68rem" : "0.62rem",
                      letterSpacing: isKm ? "normal" : "0.15em",
                      textTransform: isKm ? "none" : "uppercase",
                      color: node.active ? "var(--wagyu-gold)" : "rgba(var(--wagyu-text-rgb),0.45)",
                      marginTop: "0.25rem",
                    }}
                  >
                    {t(node.subKey)}
                  </span>
                </div>

                {i < CHAIN.length - 1 && (
                  <span
                    aria-hidden
                    style={{
                      width: "clamp(0.5rem, 2vw, 1.5rem)",
                      height: 1,
                      background: "rgba(var(--wagyu-gold-rgb),0.25)",
                      marginTop: "clamp(24px, 7vw, 31px)",
                    }}
                  />
                )}
              </div>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
