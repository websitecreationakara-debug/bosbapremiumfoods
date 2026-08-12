import { useEffect, useRef, useState } from "react";

type ChapterNavProps = {
  sectionIds: string[];
};

/** Fixed left-edge dot rail that stays on screen and tracks which story chapter is in view. */
export function ChapterNav({ sectionIds }: ChapterNavProps) {
  const [activeId, setActiveId] = useState(sectionIds[0]);
  const [visible, setVisible] = useState(false);
  const observerRef = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    const elements = sectionIds
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => el !== null);

    if (elements.length === 0) return;

    observerRef.current = new IntersectionObserver(
      (entries) => {
        const visibleEntries = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visibleEntries[0]) setActiveId(visibleEntries[0].target.id);
      },
      { rootMargin: "-45% 0px -45% 0px", threshold: 0 },
    );

    elements.forEach((el) => observerRef.current?.observe(el));

    const firstEl = elements[0];
    const lastEl = elements[elements.length - 1];
    const onScroll = () => {
      const firstTop = firstEl.getBoundingClientRect().top;
      const lastBottom = lastEl.getBoundingClientRect().bottom;
      setVisible(firstTop < window.innerHeight * 0.6 && lastBottom > window.innerHeight * 0.15);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();

    return () => {
      observerRef.current?.disconnect();
      window.removeEventListener("scroll", onScroll);
    };
  }, [sectionIds]);

  return (
    <nav
      aria-label="Chapter navigation"
      style={{
        position: "fixed",
        left: "clamp(1rem, 3vw, 2rem)",
        top: "50%",
        transform: "translateY(-50%)",
        zIndex: 30,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: "0.65rem",
        opacity: visible ? 1 : 0,
        pointerEvents: visible ? "auto" : "none",
        transition: "opacity 0.4s ease",
      }}
      className="hidden sm:flex"
    >
      {sectionIds.map((id) => {
        const isActive = id === activeId;
        return (
          <button
            key={id}
            className="chapter-dot"
            aria-label={`Go to ${id.replace(/-/g, " ")} section`}
            aria-current={isActive}
            onClick={() => document.getElementById(id)?.scrollIntoView({ behavior: "smooth" })}
            style={{
              width: isActive ? 8 : 6,
              height: isActive ? 8 : 6,
              borderRadius: "50%",
              border: "1px solid rgba(var(--wagyu-gold-rgb),0.5)",
              background: isActive ? "var(--wagyu-gold)" : "transparent",
              boxShadow: isActive ? "0 0 8px rgba(var(--wagyu-gold-rgb),0.6)" : "none",
              padding: 0,
              cursor: "pointer",
              transition: "all 0.3s cubic-bezier(0.23,1,0.32,1)",
            }}
          />
        );
      })}
    </nav>
  );
}
