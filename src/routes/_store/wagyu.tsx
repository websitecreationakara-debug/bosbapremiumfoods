import { createFileRoute } from "@tanstack/react-router";
import { ChapterDots, useActiveChapter, type WagyuChapter } from "@/components/wagyu/chapter-nav";
import { WagyuHero } from "@/components/wagyu/hero";
import { OriginChapter } from "@/components/wagyu/origin-chapter";
import { FarmChapter } from "@/components/wagyu/farm-chapter";
import { CareChapter } from "@/components/wagyu/care-chapter";
import { DietChapter } from "@/components/wagyu/diet-chapter";
import { FieldChapter } from "@/components/wagyu/field-chapter";
import { StandardSection } from "@/components/wagyu/standard-section";

const chapters: WagyuChapter[] = [
  { id: "origin", label: "01 · Origin" },
  { id: "farm", label: "02 · The Farm" },
  { id: "care", label: "03 · Care" },
  { id: "diet", label: "04 · Diet" },
  { id: "field", label: "05 · The Field" },
];

export const Route = createFileRoute("/_store/wagyu")({
  head: () => ({
    meta: [
      { title: "The Miyazaki Heritage — BOSBA Premium Foods" },
      {
        name: "description",
        content: "Follow the origin story of Miyazaki wagyu, from prefecture to farmhouse to table.",
      },
      { property: "og:url", content: "https://bosbapremiumfoods.com/wagyu" },
    ],
    links: [{ rel: "canonical", href: "https://bosbapremiumfoods.com/wagyu" }],
  }),
  component: WagyuPage,
});

function WagyuPage() {
  const activeId = useActiveChapter(chapters);

  return (
    <div className="relative">
      <ChapterDots chapters={chapters} activeId={activeId} />

      <WagyuHero />
      <OriginChapter />
      <FarmChapter />
      <CareChapter />
      <DietChapter />
      <FieldChapter />
      <StandardSection />
    </div>
  );
}
