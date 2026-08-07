import type { ReactNode } from "react";

// Minimal contrast scrim for text sitting over a full-bleed photo/3D scene --
// editorial style favors clean typography over glass/blur UI chrome, so this
// is just enough of a dark wash to keep text legible, not a "card".
export function GlassPanel({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={`rounded-sm bg-[#141210]/40 px-6 py-6 backdrop-blur-[2px] md:px-10 md:py-8 ${className}`}>
      {children}
    </div>
  );
}
