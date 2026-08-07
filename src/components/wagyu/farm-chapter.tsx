import { useRef } from "react";
import { motion, useScroll, useTransform } from "motion/react";

export function FarmChapter() {
  const trackRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: trackRef,
    offset: ["start start", "end end"],
  });

  const cardOpacity = useTransform(scrollYProgress, [0, 0.3], [1, 0]);
  const captionOpacity = useTransform(scrollYProgress, [0.5, 0.8], [0, 1]);

  return (
    <section id="farm" ref={trackRef} className="relative h-[200vh] bg-[#141210]">
      <div className="sticky top-0 h-screen overflow-hidden">
        <img
          src="/wagyu/farm-reveal.jpg"
          alt="A green mountain valley with grazing cattle in the distance"
          className="absolute inset-0 h-full w-full object-cover"
        />

        <motion.div
          style={{ opacity: captionOpacity }}
          className="absolute bottom-16 left-6 z-10 max-w-sm md:left-10"
        >
          <p className="mb-2 text-xs font-medium tracking-[0.2em] text-[#e6b8a8] uppercase">
            Step inside
          </p>
          <h3 className="font-serif text-3xl text-white italic sm:text-4xl">
            Where devotion begins.
          </h3>
        </motion.div>

        <motion.div
          style={{ opacity: cardOpacity }}
          className="absolute inset-0 z-20 flex items-center justify-center px-6"
        >
          <div className="max-w-md rounded-sm bg-[#f3ede1]/95 px-8 py-10 text-center shadow-2xl">
            <p className="mb-3 text-xs font-medium tracking-[0.2em] text-[#a8402f] uppercase">
              Chapter 02 — The farm
            </p>
            <h2 className="font-serif text-3xl leading-tight text-[#141210] sm:text-4xl">
              A craft measured in <span className="text-[#a8402f] italic">years</span>.
            </h2>
            <p className="mt-4 text-sm leading-relaxed text-[#5b5347]">
              Miyazaki's farms are small, family-run and fiercely patient.
              Keep scrolling.
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
