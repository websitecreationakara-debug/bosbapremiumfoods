import { Reveal } from "@/components/wagyu/reveal";
import imagewugyu from "../../image/wugyu.jpg";

export function ProcessSection() {
  return (
    <section
      id="process"
      style={{
        backgroundColor: "var(--wagyu-bg)",
        padding: "clamp(3.25rem, 6vw, 5.5rem) 0",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 clamp(1.5rem, 5vw, 4rem)" }}>
        <div style={{ marginBottom: "2.25rem" }}>
          <Reveal>
            <div
              style={{
                width: 40,
                height: 1,
                background: "var(--wagyu-gold)",
                marginBottom: "1.25rem",
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
              The Process
            </span>
          </Reveal>

          <Reveal delay={100}>
            <h2
              style={{
                fontFamily: "'Cormorant Garamond', serif",
                fontSize: "clamp(2.5rem, 6vw, 4.5rem)",
                fontWeight: 400,
                color: "var(--wagyu-text)",
                lineHeight: 1.1,
                marginTop: "1rem",
              }}
            >
              Raised With Care.
            </h2>
          </Reveal>
        </div>

        <Reveal delay={200} style={{ position: "relative" }}>
          <div style={{ position: "relative", overflow: "hidden" }}>
            <img
              src={imagewugyu}
              alt="Cattle grazing beside a traditional Japanese farmhouse in the misty mountains"
              style={{
                width: "100%",
                aspectRatio: "16/9",
                objectFit: "cover",
                display: "block",
              }}
            />
            <div
              style={{
                position: "absolute",
                inset: 0,
                border: "1px solid rgba(var(--wagyu-gold-rgb),0.25)",
                pointerEvents: "none",
              }}
            />
          </div>
        </Reveal>
      </div>
    </section>
  );
}
