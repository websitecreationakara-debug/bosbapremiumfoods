import { useRef, type ReactNode } from "react";
import { motion, useScroll, useSpring, useTransform } from "motion/react";

// A single "beat" of the scroll story. Renders a tall (default 220vh) track;
// while that track is passing through the viewport, its visual content stays
// pinned (position: sticky) full-screen and crossfades/zooms in and out based
// on scroll progress through the track -- the actual "camera push" effect.
// image swaps to the next scene's photo happen via each Scene's own fade,
// stacked in document order, so the transition reads as one continuous scroll.
export function Scene({
  image,
  imageAlt,
  heightVh = 220,
  zoomFrom = 1,
  zoomTo = 1.12,
  imageClassName,
  overlay,
  children,
}: {
  image: string;
  imageAlt: string;
  heightVh?: number;
  zoomFrom?: number;
  zoomTo?: number;
  // Extra classes on the <img> itself -- e.g. a color filter to restyle a
  // source image (like the light-blue Wikipedia map) to fit the dark theme.
  imageClassName?: string;
  // Rendered directly over the image (e.g. a map pin), independent of the
  // bottom/center-aligned text `children` below it.
  overlay?: ReactNode;
  children?: ReactNode;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end end"],
  });
  // Raw scroll progress jumps a full frame at a time on some trackpads/mouse
  // wheels, which reads as jittery on a directly-driven transform. Springing
  // it lags the motion just enough (stiffness/damping tuned for a quick but
  // not bouncy catch-up) to feel like one continuous camera move.
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 260,
    damping: 40,
    mass: 0.4,
  });

  // Fade in over the first 18%, hold, fade out over the last 18% -- so each
  // scene reads as a distinct beat instead of an abrupt cut.
  const opacity = useTransform(smoothProgress, [0, 0.18, 0.82, 1], [0, 1, 1, 0]);
  const scale = useTransform(smoothProgress, [0, 1], [zoomFrom, zoomTo]);
  const contentY = useTransform(smoothProgress, [0, 0.25, 0.75, 1], [24, 0, 0, -24]);

  return (
    <div ref={ref} style={{ height: `${heightVh}vh` }} className="relative">
      <motion.div
        style={{ opacity, willChange: "opacity" }}
        className="sticky top-0 h-screen w-full overflow-hidden bg-[#0c1f16]"
      >
        <motion.img
          src={image}
          alt={imageAlt}
          style={{ scale, willChange: "transform" }}
          className={`absolute inset-0 h-full w-full object-cover ${imageClassName ?? ""}`}
        />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-black/30" />
        {overlay}
        {children && (
          <motion.div style={{ y: contentY }} className="relative z-10 flex h-full items-end pb-20 md:items-center md:pb-0">
            <div className="mx-auto w-full max-w-6xl px-6">{children}</div>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
}
