import { useState } from "react";
import { Reveal } from "@/components/wagyu/reveal";
import { useWagyuI18n, wagyuEn, type WagyuI18nKey } from "@/components/wagyu/wagyu-i18n";
import image1 from "../../image/cookingguide1.jpg";
import image2 from "../../image/cooking2.jpg";
import image3 from "../../image/cookingguide3.jpg";

const steps: {
  num: string;
  titleKey: WagyuI18nKey;
  titleAlwaysEn?: boolean;
  image: string;
  descKey: WagyuI18nKey;
  tipKey: WagyuI18nKey;
  showShopBtn?: boolean;
}[] = [
  {
    num: "01",
    titleKey: "cooking.step1.title",
    titleAlwaysEn: true,
    image: image1,
    descKey: "cooking.step1.desc",
    tipKey: "cooking.step1.tip",
  },
  {
    num: "02",
    titleKey: "cooking.step2.title",
    image: image2,
    descKey: "cooking.step2.desc",
    tipKey: "cooking.step2.tip",
  },
  {
    num: "03",
    titleKey: "cooking.step3.title",
    titleAlwaysEn: true,
    image: image3,
    descKey: "cooking.step3.desc",
    tipKey: "cooking.step3.tip",
    showShopBtn: true,
  },
];

const methods: {
  titleKey: WagyuI18nKey;
  prepKey: WagyuI18nKey;
  descKey: WagyuI18nKey;
  tipKey: WagyuI18nKey;
  emoji: string;
}[] = [
  {
    titleKey: "cooking.method1.title",
    prepKey: "cooking.method1.prep",
    descKey: "cooking.method1.desc",
    tipKey: "cooking.method1.tip",
    emoji: "🥩",
  },
  {
    titleKey: "cooking.method2.title",
    prepKey: "cooking.method2.prep",
    descKey: "cooking.method2.desc",
    tipKey: "cooking.method2.tip",
    emoji: "🔥",
  },
  {
    titleKey: "cooking.method3.title",
    prepKey: "cooking.method3.prep",
    descKey: "cooking.method3.desc",
    tipKey: "cooking.method3.tip",
    emoji: "🍚",
  },
];

// Renders the step photo when available; falls back to the editorial
// numeral/kanji panel for any step that doesn't have photography yet.
function StepPanel({ num, image }: { num: string; image?: string }) {
  const [imageFailed, setImageFailed] = useState(false);

  if (image && !imageFailed) {
    return (
      <div
        style={{
          position: "relative",
          aspectRatio: "1/1",
          border: "1px solid rgba(var(--wagyu-gold-rgb),0.2)",
          overflow: "hidden",
        }}
        className="rounded-sm"
      >
        <img
          src={image}
          alt={`Step ${num}`}
          onError={() => setImageFailed(true)}
          style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
        />
      </div>
    );
  }

  return (
    <div
      style={{
        position: "relative",
        aspectRatio: "1/1",
        background: "var(--wagyu-card)",
        border: "1px solid rgba(var(--wagyu-gold-rgb),0.2)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        overflow: "hidden",
      }}
    >
      <div
        className="kanji-watermark"
        style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: "clamp(80px, 14vw, 160px)",
        }}
      >
        和牛
      </div>
      <span
        style={{
          fontFamily: "'Cormorant Garamond', serif",
          fontSize: "clamp(6rem, 12vw, 9rem)",
          fontWeight: 300,
          color: "rgba(var(--wagyu-gold-rgb),0.35)",
          lineHeight: 1,
        }}
      >
        {num}
      </span>
    </div>
  );
}

export function CookingGuideSection() {
  const { t, locale } = useWagyuI18n();
  const isKm = locale === "km";

  return (
    <section
      id="cooking"
      style={{
        backgroundColor: "var(--wagyu-bg-alt)",
        padding: "clamp(3.25rem, 6vw, 5.5rem) 0",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 clamp(1.5rem, 5vw, 4rem)" }}>
        <div style={{ marginBottom: "2.75rem" }}>
          <Reveal>
            <div
              style={{ display: "flex", alignItems: "center", gap: "1rem", marginBottom: "1rem" }}
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
                {t("cooking.eyebrow")}
              </span>
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
                maxWidth: 600,
              }}
            >
              {t("cooking.title.pre")}
              <br />
              <em style={{ color: "var(--wagyu-gold)" }}>{t("cooking.title.em")}</em>
            </h2>
          </Reveal>
          <Reveal delay={200}>
            <p
              lang={locale}
              style={{
                fontFamily: "'DM Sans', 'Battambang', sans-serif",
                fontSize: "1rem",
                fontWeight: 300,
                color: "rgba(var(--wagyu-text-rgb),0.6)",
                maxWidth: 500,
                marginTop: "1rem",
                lineHeight: 1.7,
              }}
            >
              {t("cooking.subtitle")}
            </p>
          </Reveal>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "5rem" }}>
          {steps.map((step, i) => (
            <Reveal key={step.num} direction={i % 2 === 0 ? "right" : "left"} delay={100}>
              <div
                className="cooking-step-grid"
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: "clamp(2rem, 5vw, 5rem)",
                  alignItems: "center",
                  direction: i % 2 === 1 ? "rtl" : "ltr",
                }}
              >
                <div style={{ direction: "ltr" }}>
                  <StepPanel num={step.num} image={step.image} />
                </div>

                <div style={{ direction: "ltr" }}>
                  <div
                    style={{
                      fontFamily: "'Cormorant Garamond', serif",
                      fontSize: "5rem",
                      fontWeight: 300,
                      color: "rgba(var(--wagyu-gold-rgb),0.08)",
                      lineHeight: 1,
                      marginBottom: "-1rem",
                    }}
                  >
                    {step.num}
                  </div>
                  <h3
                    lang={step.titleAlwaysEn ? undefined : locale}
                    style={{
                      fontFamily:
                        isKm && !step.titleAlwaysEn
                          ? "'Kantumruy Pro', 'Battambang', sans-serif"
                          : "'Cormorant Garamond', serif",
                      fontSize:
                        isKm && !step.titleAlwaysEn
                          ? "clamp(1.3rem, 2.6vw, 1.9rem)"
                          : "clamp(1.5rem, 3vw, 2.2rem)",
                      fontWeight: isKm && !step.titleAlwaysEn ? 700 : 400,
                      color: "var(--wagyu-text)",
                      lineHeight: isKm && !step.titleAlwaysEn ? 1.4 : undefined,
                      marginBottom: "1rem",
                    }}
                  >
                    {t(step.titleKey)}
                  </h3>
                  <p
                    lang={locale}
                    style={{
                      fontFamily: "'DM Sans', 'Battambang', sans-serif",
                      fontSize: "0.95rem",
                      fontWeight: 300,
                      color: "rgba(var(--wagyu-text-rgb),0.65)",
                      lineHeight: 1.8,
                      marginBottom: "1.5rem",
                    }}
                  >
                    {t(step.descKey)}
                  </p>
                  <div
                    style={{
                      background: "rgba(var(--wagyu-gold-rgb),0.06)",
                      border: "1px solid rgba(var(--wagyu-gold-rgb),0.2)",
                      borderLeft: "3px solid var(--wagyu-gold)",
                      padding: "1rem 1.25rem",
                    }}
                  >
                    <p
                      lang={locale}
                      style={{
                        fontFamily: "'DM Sans', 'Battambang', sans-serif",
                        fontSize: "0.8rem",
                        fontWeight: 400,
                        color: "var(--wagyu-gold)",
                        lineHeight: 1.6,
                        fontStyle: isKm ? "normal" : "italic",
                      }}
                    >
                      {t(step.tipKey)}
                    </p>
                  </div>
                  {step.showShopBtn && (
                    <a
                      href="/shop?category=cook-yourself"
                      className="btn-gold"
                      lang={locale}
                      style={{
                        display: "inline-block",
                        marginTop: "1.5rem",
                        borderRadius: 0,
                        textDecoration: "none",
                      }}
                    >
                      {t("cooking.shopBtn")}
                    </a>
                  )}
                </div>
              </div>
            </Reveal>
          ))}
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 300px), 1fr))",
            gap: "2rem",
            marginTop: "3rem",
          }}
        >
          {methods.map((method, idx) => (
            <Reveal key={method.titleKey} delay={idx * 100}>
              <div
                style={{
                  background: "var(--wagyu-card)",
                  border: "1px solid rgba(var(--wagyu-gold-rgb),0.2)",
                  padding: "clamp(1.75rem, 4vw, 2.5rem)",
                  height: "100%",
                  transition: "border-color 0.3s ease",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = "rgba(var(--wagyu-gold-rgb),0.4)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = "rgba(var(--wagyu-gold-rgb),0.2)";
                }}
                className="rounded-sm"
              >
                <div style={{ fontSize: "2.25rem", marginBottom: "1.5rem" }}>{method.emoji}</div>
                <div
                  lang="en"
                  style={{
                    fontFamily: "'DM Sans', sans-serif",
                    fontSize: "0.6rem",
                    letterSpacing: "0.2em",
                    textTransform: "uppercase",
                    color: "var(--wagyu-gold)",
                    marginBottom: "0.75rem",
                  }}
                >
                  {wagyuEn[method.prepKey]}
                </div>
                <h3
                  lang="en"
                  style={{
                    fontFamily: "'Cormorant Garamond', serif",
                    fontSize: "1.5rem",
                    fontWeight: 500,
                    color: "var(--wagyu-text)",
                    marginBottom: "1rem",
                  }}
                >
                  {wagyuEn[method.titleKey]}
                </h3>
                <p
                  lang="en"
                  style={{
                    fontFamily: "'DM Sans', sans-serif",
                    fontSize: "0.9rem",
                    fontWeight: 300,
                    color: "rgba(var(--wagyu-text-rgb),0.65)",
                    lineHeight: 1.7,
                    marginBottom: "1.5rem",
                  }}
                >
                  {wagyuEn[method.descKey]}
                </p>
                <div
                  style={{
                    borderTop: "1px solid rgba(var(--wagyu-gold-rgb),0.15)",
                    paddingTop: "1rem",
                  }}
                >
                  <div
                    lang="en"
                    style={{
                      fontFamily: "'DM Sans', sans-serif",
                      fontSize: "0.6rem",
                      letterSpacing: "0.15em",
                      textTransform: "uppercase",
                      color: "rgba(var(--wagyu-text-rgb),0.45)",
                      marginBottom: "0.35rem",
                    }}
                  >
                    {wagyuEn["cooking.proTip"]}
                  </div>
                  <div
                    lang="en"
                    style={{
                      fontFamily: "'DM Sans', sans-serif",
                      fontSize: "0.8rem",
                      fontStyle: "italic",
                      color: "rgba(var(--wagyu-text-rgb),0.7)",
                    }}
                  >
                    {wagyuEn[method.tipKey]}
                  </div>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
