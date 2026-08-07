import { useEffect, useRef, useState } from "react";

export type WagyuChapter = { id: string; label: string };

// Tracks which chapter section is most centered in the viewport so the dot
// rail and the section itself agree on "active" without prop-drilling scroll
// state through every chapter component.
export function useActiveChapter(chapters: WagyuChapter[]) {
  const [activeId, setActiveId] = useState(chapters[0]?.id ?? "");
  const ratios = useRef(new Map<string, number>());

  useEffect(() => {
    const elements = chapters
      .map((c) => document.getElementById(c.id))
      .filter((el): el is HTMLElement => el !== null);

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          ratios.current.set(entry.target.id, entry.intersectionRatio);
        }
        let bestId = activeId;
        let bestRatio = 0;
        for (const [id, ratio] of ratios.current) {
          if (ratio > bestRatio) {
            bestRatio = ratio;
            bestId = id;
          }
        }
        if (bestRatio > 0) setActiveId(bestId);
      },
      { threshold: [0, 0.25, 0.5, 0.75, 1] },
    );

    elements.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [chapters]);

  return activeId;
}

export function ChapterDots({
  chapters,
  activeId,
}: {
  chapters: WagyuChapter[];
  activeId: string;
}) {
  const activeIndex = Math.max(
    0,
    chapters.findIndex((c) => c.id === activeId),
  );

  return (
    <nav
      aria-label="Story chapters"
      className="fixed top-1/2 right-5 z-40 hidden -translate-y-1/2 flex-col items-end gap-4 md:right-8 md:flex"
    >
      {chapters.map((chapter, i) => {
        const isActive = i === activeIndex;
        return (
          <button
            key={chapter.id}
            type="button"
            onClick={() =>
              document.getElementById(chapter.id)?.scrollIntoView({ behavior: "smooth" })
            }
            className="group flex items-center gap-3"
            aria-current={isActive}
          >
            <span
              className={
                "text-[10px] font-medium tracking-[0.18em] uppercase transition-opacity " +
                (isActive
                  ? "opacity-100 text-[#141210]"
                  : "opacity-0 group-hover:opacity-60 text-[#141210]")
              }
            >
              {chapter.label}
            </span>
            <span
              className={
                "rounded-full transition-all " +
                (isActive
                  ? "size-2 bg-[#a8402f]"
                  : "size-[5px] bg-[#141210]/30 group-hover:bg-[#141210]/50")
              }
            />
          </button>
        );
      })}
    </nav>
  );
}
