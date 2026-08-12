import { createFileRoute } from "@tanstack/react-router";
import "@/components/wagyu/wagyu.css";
import { WagyuHeader } from "@/components/wagyu/wagyu-header";
import { ChapterNav } from "@/components/wagyu/chapter-nav";
import { HeroSection } from "@/components/wagyu/hero-section";
import { ChapterBeginningSection } from "@/components/wagyu/chapter-beginning-section";
import { OriginSection } from "@/components/wagyu/origin-section";
import { ChapterAnimalSection } from "@/components/wagyu/chapter-animal-section";
import { ProcessSection } from "@/components/wagyu/process-section";
import { SceneCardsSection } from "@/components/wagyu/scene-cards-section";
import { JourneyTimelineSection } from "@/components/wagyu/journey-timeline-section";
import { SupplyChainSection } from "@/components/wagyu/supply-chain-section";
import { WhyWagyuSection } from "@/components/wagyu/why-wagyu-section";
import { TrustSection } from "@/components/wagyu/trust-section";
import { ComparisonSection } from "@/components/wagyu/comparison-section";
import { CookingGuideSection } from "@/components/wagyu/cooking-guide-section";
import { GallerySection } from "@/components/wagyu/gallery-section";
import { FAQSection } from "@/components/wagyu/faq-section";
import { FinalCTASection } from "@/components/wagyu/final-cta-section";

export const Route = createFileRoute("/_store/wagyu")({
  head: () => ({
    meta: [
      { title: "Authentic Japanese Wagyu — BOSBA Premium Foods" },
      {
        name: "description",
        content:
          "Discover why Japanese Wagyu A4 and A5 are unlike any other beef — snowflake marbling, certified origin, and a cooking guide to match.",
      },
      { property: "og:url", content: "https://bosbapremiumfoods.com/wagyu" },
    ],
    links: [
      { rel: "canonical", href: "https://bosbapremiumfoods.com/wagyu" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;1,300;1,400&family=Jost:wght@300;400;500;600&family=Noto+Serif+JP:wght@300;400&display=swap",
      },
    ],
  }),
  component: WagyuPage,
});

// Excludes "hero" — the dot rail should only appear once the reader scrolls
// past the banner, not over the hero itself. Every section after that is
// tracked so the rail covers the full page.
const ALL_SECTION_IDS = [
  "chapter-beginning",
  "origin",
  "chapter-animal",
  "process",
  "scene-cards",
  "journey",
  "supply-chain",
  "why-wagyu",
  "trust",
  "comparison",
  "cooking",
  "gallery",
  "faq",
  "final-cta",
];

function WagyuPage() {
  return (
    <div className="wagyu-obsidian">
      <WagyuHeader />
      <ChapterNav sectionIds={ALL_SECTION_IDS} />
      <HeroSection />
      <ChapterBeginningSection />
      <OriginSection />
      <ChapterAnimalSection />
      <ProcessSection />
      <SceneCardsSection />
      <JourneyTimelineSection />
      <WhyWagyuSection />
      <TrustSection />
      <ComparisonSection />
      <CookingGuideSection />
      <GallerySection />
      <FAQSection />
      <FinalCTASection />
    </div>
  );
}
