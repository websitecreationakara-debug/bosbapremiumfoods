import { useState } from "react";
import { Reveal } from "@/components/wagyu/reveal";

const GALLERY_IMAGES = [
  { src: "/wagyu/hero-beef.jpg", alt: "Snowflake marbling close-up", span: 2 },
  { src: "/wagyu/farm-reveal.jpg", alt: "The farmhouse where the cattle are raised", span: 1 },
  {
    src: "/wagyu/care-pasture.jpg",
    alt: "Cattle at pasture, raised with meticulous care",
    span: 1,
  },
  { src: "/wagyu/diet-hay.webp", alt: "Specialized feed as part of the daily diet", span: 1 },
  {
    src: "/wagyu/field-mountain.webp",
    alt: "The open mountain air of the grazing fields",
    span: 1,
  },
  { src: "/wagyu/map-kyushu-zoom.jpg", alt: "Kyushu, the prefecture of origin", span: 2 },
];

export function GallerySection() {
  const [lightbox, setLightbox] = useState<string | null>(null);

  return (
    <section
      id="gallery"
      style={{ backgroundColor: "var(--wagyu-bg)", padding: "clamp(3.25rem, 6vw, 5.5rem) 0" }}
    >
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 clamp(1.5rem, 5vw, 4rem)" }}>
        <div style={{ textAlign: "center", marginBottom: "2.25rem" }}>
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
                Gallery
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
                fontSize: "clamp(2.2rem, 4.5vw, 3.5rem)",
                fontWeight: 400,
                color: "var(--wagyu-text)",
                lineHeight: 1.2,
              }}
            >
              The Origin & The Craft
            </h2>
          </Reveal>
        </div>

        <div
          style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "0.75rem" }}
          className="gallery-grid"
        >
          {GALLERY_IMAGES.map((img, i) => (
            <Reveal
              key={img.src}
              delay={i * 60}
              className="gallery-tile"
              style={{ gridColumn: `span ${img.span}` }}
            >
              <div
                onClick={() => setLightbox(img.src)}
                style={{
                  position: "relative",
                  overflow: "hidden",
                  cursor: "pointer",
                  aspectRatio: img.span === 2 ? "16/7" : "1/1",
                }}
              >
                <img
                  src={img.src}
                  alt={img.alt}
                  style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
                />
                <div
                  className="gallery-tile-border"
                  style={{
                    position: "absolute",
                    inset: 0,
                    border: "1px solid rgba(var(--wagyu-gold-rgb),0.1)",
                    pointerEvents: "none",
                  }}
                />
                <div
                  style={{
                    position: "absolute",
                    bottom: 0,
                    left: 0,
                    right: 0,
                    background:
                      "linear-gradient(to top, rgba(var(--wagyu-bg-rgb),0.85), transparent)",
                    padding: "1.5rem 1rem 0.6rem",
                  }}
                >
                  <span
                    style={{
                      fontFamily: "'Jost', sans-serif",
                      fontSize: "0.7rem",
                      color: "rgba(var(--wagyu-text-rgb),0.8)",
                      letterSpacing: "0.03em",
                    }}
                  >
                    {img.alt}
                  </span>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>

      {lightbox && (
        <div
          onClick={() => setLightbox(null)}
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(var(--wagyu-bg-rgb),0.95)",
            zIndex: 100,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "2rem",
            cursor: "zoom-out",
          }}
        >
          <img
            src={lightbox}
            alt="Gallery"
            style={{
              maxWidth: "90vw",
              maxHeight: "90vh",
              objectFit: "contain",
              border: "1px solid rgba(var(--wagyu-gold-rgb),0.3)",
            }}
          />
          <button
            onClick={() => setLightbox(null)}
            style={{
              position: "absolute",
              top: "1.5rem",
              right: "1.5rem",
              background: "none",
              border: "1px solid rgba(var(--wagyu-gold-rgb),0.4)",
              color: "var(--wagyu-gold)",
              width: 44,
              height: 44,
              cursor: "pointer",
              fontSize: "1.2rem",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              transition: "all 0.25s ease",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "rgba(var(--wagyu-gold-rgb),0.15)";
              e.currentTarget.style.transform = "scale(1.08)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "none";
              e.currentTarget.style.transform = "scale(1)";
            }}
          >
            ✕
          </button>
        </div>
      )}
    </section>
  );
}
