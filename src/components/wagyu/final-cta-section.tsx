import { Reveal } from "@/components/wagyu/reveal";

const PARTICLES = Array.from({ length: 24 }, (_, i) => ({
  id: i,
  left: `${Math.random() * 100}%`,
  delay: `${Math.random() * 5}s`,
  duration: `${2.5 + Math.random() * 3}s`,
  size: `${1.5 + Math.random() * 3}px`,
}));

export function FinalCTASection() {
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
              style={{
                fontFamily: "'Jost', sans-serif",
                fontSize: "0.65rem",
                letterSpacing: "0.3em",
                textTransform: "uppercase",
                color: "var(--wagyu-gold)",
              }}
            >
              Begin Your Journey
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
            style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: "clamp(2.5rem, 6vw, 5rem)",
              fontWeight: 300,
              color: "var(--wagyu-text)",
              lineHeight: 1.1,
              letterSpacing: "-0.02em",
              marginBottom: "1.5rem",
            }}
          >
            Ready to Experience
            <br />
            <em style={{ color: "var(--wagyu-gold)" }}>Authentic Japanese Wagyu?</em>
          </h2>
        </Reveal>

        <Reveal delay={200}>
          <p
            style={{
              fontFamily: "'Jost', sans-serif",
              fontSize: "1rem",
              fontWeight: 300,
              color: "rgba(var(--wagyu-text-rgb),0.7)",
              maxWidth: 520,
              margin: "0 auto 2.5rem",
              lineHeight: 1.8,
            }}
          >
            Not all beef is created equal. This is proof. Explore our collection of certified
            Japanese Wagyu A4 and A5 — delivered with care, reverence, and a promise of the
            extraordinary.
          </p>
        </Reveal>

        <Reveal delay={300}>
          <div style={{ display: "flex", gap: "1rem", justifyContent: "center", flexWrap: "wrap" }}>
            <a
              href="/shop"
              className="btn-gold"
              style={{ borderRadius: 0, textDecoration: "none" }}
            >
              Explore Collection
            </a>
            <a
              href="tel:+85599361350"
              className="btn-outline-gold"
              style={{ borderRadius: 0, textDecoration: "none" }}
            >
              Contact Our Team
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
            {[
              "Certified A4 & A5",
              "Cold Chain Guaranteed",
              "Free Sauce & Pepper",
              "Authentic Japan",
            ].map((t) => (
              <div key={t} style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                <span style={{ color: "var(--wagyu-gold)", fontSize: "0.9rem" }}>✓</span>
                <span
                  style={{
                    fontFamily: "'Jost', sans-serif",
                    fontSize: "0.7rem",
                    letterSpacing: "0.1em",
                    color: "rgba(var(--wagyu-text-rgb),0.6)",
                    textTransform: "uppercase",
                  }}
                >
                  {t}
                </span>
              </div>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
