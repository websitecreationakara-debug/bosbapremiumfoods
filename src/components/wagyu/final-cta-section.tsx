import { Reveal } from "@/components/wagyu/reveal";
import { useWagyuI18n, type WagyuI18nKey } from "@/components/wagyu/wagyu-i18n";

const PARTICLES = Array.from({ length: 24 }, (_, i) => ({
  id: i,
  left: `${Math.random() * 100}%`,
  delay: `${Math.random() * 5}s`,
  duration: `${2.5 + Math.random() * 3}s`,
  size: `${1.5 + Math.random() * 3}px`,
}));

export function FinalCTASection() {
  const { t, locale } = useWagyuI18n();
  const isKm = locale === "km";

  return (
    <section
      id="final-cta"
      style={{ position: "relative", overflow: "hidden", padding: "clamp(4rem, 7vw, 6.5rem) 0" }}
    >
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage: "url(/wagyu/field-mountain.webp)",
          backgroundSize: "cover",
          backgroundPosition: "center",
          zIndex: 0,
        }}
      />
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "linear-gradient(to right, rgba(var(--wagyu-bg-rgb),0.92) 0%, rgba(var(--wagyu-bg-rgb),0.8) 50%, rgba(var(--wagyu-bg-rgb),0.92) 100%)",
          zIndex: 1,
        }}
      />

      <div style={{ position: "absolute", inset: 0, zIndex: 2, pointerEvents: "none" }}>
        {PARTICLES.map((p) => (
          <div
            key={p.id}
            style={{
              position: "absolute",
              bottom: "10%",
              left: p.left,
              width: p.size,
              height: p.size,
              borderRadius: "50%",
              background: "radial-gradient(circle, var(--wagyu-gold-light), var(--wagyu-gold))",
              boxShadow: "0 0 4px var(--wagyu-gold)",
              animation: `wagyu-float-up ${p.duration} ease-out ${p.delay} infinite`,
            }}
          />
        ))}
      </div>

      <div
        style={{
          position: "relative",
          zIndex: 3,
          maxWidth: 800,
          margin: "0 auto",
          padding: "0 clamp(1.5rem, 5vw, 4rem)",
          textAlign: "center",
        }}
      >
        <Reveal>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "1rem",
              marginBottom: "1.5rem",
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
              lang={locale}
              style={{
                fontFamily: "'Jost', 'Battambang', sans-serif",
                fontSize: isKm ? "0.75rem" : "0.65rem",
                letterSpacing: isKm ? "normal" : "0.3em",
                textTransform: isKm ? "none" : "uppercase",
                color: "var(--wagyu-gold)",
              }}
            >
              {t("finalCta.eyebrow")}
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
              fontSize: isKm ? "clamp(2.1rem, 5vw, 3.8rem)" : "clamp(2.5rem, 6vw, 5rem)",
              fontWeight: isKm ? 700 : 300,
              color: "var(--wagyu-text)",
              lineHeight: isKm ? 1.35 : 1.1,
              letterSpacing: isKm ? "0.01em" : "-0.02em",
              marginBottom: "1.5rem",
            }}
          >
            {t("finalCta.title.pre")}
            <br />
            <em style={{ color: "var(--wagyu-gold)", fontStyle: isKm ? "normal" : "italic" }}>
              {t("finalCta.title.em")}
            </em>
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
              maxWidth: 520,
              margin: "0 auto 2.5rem",
              lineHeight: 1.8,
            }}
          >
            {t("finalCta.body")}
          </p>
        </Reveal>

        <Reveal delay={300}>
          <div style={{ display: "flex", gap: "1rem", justifyContent: "center", flexWrap: "wrap" }}>
            <a
              href="/shop"
              className="btn-gold"
              lang={locale}
              style={{ borderRadius: 0, textDecoration: "none" }}
            >
              {t("finalCta.exploreBtn")}
            </a>
            <a
              href="tel:+85599361350"
              className="btn-outline-gold"
              lang={locale}
              style={{ borderRadius: 0, textDecoration: "none" }}
            >
              {t("finalCta.contactBtn")}
            </a>
          </div>
        </Reveal>

        <Reveal delay={400}>
          <div
            style={{
              display: "flex",
              gap: "2.5rem",
              justifyContent: "center",
              marginTop: "3.5rem",
              flexWrap: "wrap",
            }}
          >
            {(
              [
                "finalCta.badge.certified",
                "finalCta.badge.coldChain",
                "finalCta.badge.freeSauce",
                "finalCta.badge.authentic",
              ] as WagyuI18nKey[]
            ).map((badgeKey) => (
              <div key={badgeKey} style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                <span style={{ color: "var(--wagyu-gold)", fontSize: "0.9rem" }}>✓</span>
                <span
                  lang={locale}
                  style={{
                    fontFamily: "'Jost', 'Battambang', sans-serif",
                    fontSize: "0.7rem",
                    letterSpacing: isKm ? "normal" : "0.1em",
                    color: "rgba(var(--wagyu-text-rgb),0.6)",
                    textTransform: isKm ? "none" : "uppercase",
                  }}
                >
                  {t(badgeKey)}
                </span>
              </div>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
