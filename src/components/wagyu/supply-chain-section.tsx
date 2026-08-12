import { Reveal } from "@/components/wagyu/reveal";
import logobosba from "../../image/BOSBA-Logo.png";

const CHAIN = [
  { icon: "🌿", title: "Miyazaki Farm", sub: "Origin", active: false },
  { icon: "🐄", title: "Wagyu", sub: "Raised & Graded", active: false },
  { icon: "✓", title: "Quality Handling", sub: "Inspection", active: false },
  { icon: "❄", title: "Cold Chain", sub: "Preservation", active: false },
  { icon: "✈", title: "Cambodia", sub: "Destination", active: false },
  { icon: logobosba, title: "BOSBA", sub: "Premium Foods", active: true },
  { icon: "🍽", title: "Your Table", sub: "Experience", active: true },
];

export function SupplyChainSection() {
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
            From its origin in Japan to your table in Cambodia, we carefully handle our premium
            products to preserve the quality you expect from BOSBA.
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
              <div key={node.title} style={{ display: "flex", alignItems: "flex-start" }}>
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
                    style={{
                      fontFamily: "'Jost', sans-serif",
                      fontSize: "0.8rem",
                      color: "var(--wagyu-text)",
                      marginTop: "0.75rem",
                    }}
                  >
                    {node.title}
                  </span>
                  <span
                    style={{
                      fontFamily: "'Jost', sans-serif",
                      fontSize: "0.62rem",
                      letterSpacing: "0.15em",
                      textTransform: "uppercase",
                      color: node.active ? "var(--wagyu-gold)" : "rgba(var(--wagyu-text-rgb),0.45)",
                      marginTop: "0.25rem",
                    }}
                  >
                    {node.sub}
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
