import { useState } from "react";
import { Reveal } from "@/components/wagyu/reveal";
import { useWagyuI18n } from "@/components/wagyu/wagyu-i18n";
import artofwugyu1 from "../../image/artofwugyu1.jpg";
import artofwugyu2 from "../../image/artofwugyu2.jpg";
import artofwugyu3 from "../../image/artofwugyu3.jpg";
import artofwugyu4 from "../../image/artofwugyu4.jpg";
import artofwugyu5 from "../../image/artofwugyu5.jpg";
import artofwugyu6 from "../../image/artofwugyu6.jpg";
import artofwugyu7 from "../../image/artofwugyu7.jpg";
import artofwugyu8 from "../../image/artofwugyu8.jpg";
import artofwugyu9 from "../../image/artofwugyu9.jpg";
import artofwugyu10 from "../../image/artofwugyu10.jpg";

const GALLERY_IMAGES = [
  { src: artofwugyu1, span: 2 },
  { src: artofwugyu2, span: 1 },
  {
    src: artofwugyu3,
    span: 1,
  },
  { src: artofwugyu4, span: 1 },
  { src: artofwugyu5, span: 1 },
  { src: artofwugyu6, span: 1 },
  { src: artofwugyu7, span: 1 },
  { src: artofwugyu8, span: 1 },
  { src: artofwugyu9, span: 1 },
  {
    src: artofwugyu10,
    span: 2,
  },
];

export function GallerySection() {
  const [lightbox, setLightbox] = useState<string | null>(null);
  const { t, locale } = useWagyuI18n();
  const isKm = locale === "km";

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
                  fontFamily: "'DM Sans', sans-serif",
                  fontSize: "0.65rem",
                  letterSpacing: "0.3em",
                  textTransform: "uppercase",
                  color: "var(--wagyu-gold)",
                }}
              >
                {t("gallery.eyebrow")}
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
              {t("gallery.title")}
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
                className="rounded-sm"
              >
                <img
                  src={img.src}
                  // alt={img.alt}
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
                      fontFamily: "'DM Sans', sans-serif",
                      fontSize: "0.7rem",
                      color: "rgba(var(--wagyu-text-rgb),0.8)",
                      letterSpacing: "0.03em",
                    }}
                  >
                    {/* {img.alt} */}
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
