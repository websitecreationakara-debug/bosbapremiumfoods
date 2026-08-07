import { useRef } from "react";
import { motion, useScroll, useTransform } from "motion/react";

export function OriginChapter() {
  const trackRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: trackRef,
    offset: ["start start", "end end"],
  });

  const opacity = useTransform(scrollYProgress, [0.15, 0.4], [0, 1]);
  const y = useTransform(scrollYProgress, [0.15, 0.4], [24, 0]);

  return (
    <section id="origin" ref={trackRef} className="relative h-[220vh] bg-[#f3ede1]">
      <div className="sticky top-0 flex h-screen items-center justify-center overflow-hidden px-6">
        <img
          src="/wagyu/map-kyushu-zoom.jpg"
          alt="Aged map of Kyushu with Miyazaki prefecture highlighted"
          className="absolute inset-0 m-auto h-[80%] w-full max-w-2xl rounded-sm object-cover"
        />

        <motion.div
          style={{ opacity, y }}
          className="relative z-10 mx-auto max-w-2xl text-center"
        >
          <p className="mb-4 text-xs font-medium tracking-[0.2em] text-[#a8402f] uppercase">
            Chapter 01 — Where it comes from
          </p>
          <h2 className="font-serif text-4xl leading-tight text-[#141210] sm:text-5xl">
            One prefecture on the island of <span className="text-[#a8402f] italic">Kyushu</span>.
          </h2>
          <p className="mx-auto mt-6 max-w-lg text-[15px] leading-relaxed text-[#5b5347]">
            Deep in Japan's warm south lies Miyazaki — a land of volcanic
            soil, clean water and long sun. Only cattle born and raised here
            may carry the name.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
