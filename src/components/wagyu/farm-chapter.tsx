import { useRef } from "react";
import { motion, useScroll, useTransform } from "motion/react";

export function FarmChapter() {
  const trackRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: trackRef,
    offset: ["start start", "end end"],
  });

  const cardOpacity = useTransform(scrollYProgress, [0, 0.18], [1, 0]);
  const leftDoorX = useTransform(scrollYProgress, [0.25, 0.75], ["0vw", "-60vw"]);
  const rightDoorX = useTransform(scrollYProgress, [0.25, 0.75], ["0vw", "60vw"]);
  const captionOpacity = useTransform(scrollYProgress, [0.7, 0.95], [0, 1]);

  return (
    <section id="farm" ref={trackRef} className="relative h-[260vh] bg-[#141210]">
      <div className="sticky top-0 h-screen overflow-hidden">
        {/* Field revealed behind the door */}
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

        {/* Door — a properly-proportioned frame (matches the source image's
            848:1264 aspect ratio) split into two halves that swing open,
            rather than a full-bleed stretch that distorted the artwork. */}
        <div className="absolute inset-0 z-20 flex items-center justify-center">
          <div className="relative aspect-[848/1264] h-[86vh] max-h-[820px] drop-shadow-2xl">
            <motion.div
              style={{
                x: leftDoorX,
                backgroundImage: "url(/wagyu/farm-door.jpg)",
                backgroundSize: "200% 100%",
                backgroundPosition: "left center",
              }}
              className="absolute inset-y-0 left-0 w-1/2 border-r border-black/30 bg-[#3a2a18]"
            />
            <motion.div
              style={{
                x: rightDoorX,
                backgroundImage: "url(/wagyu/farm-door.jpg)",
                backgroundSize: "200% 100%",
                backgroundPosition: "right center",
              }}
              className="absolute inset-y-0 right-0 w-1/2 bg-[#3a2a18]"
            />
          </div>
        </div>

        <motion.div
          style={{ opacity: cardOpacity }}
          className="absolute inset-0 z-30 flex items-center justify-center px-6"
        >
          <div className="max-w-md rounded-sm bg-[#f3ede1]/95 px-8 py-10 text-center shadow-2xl">
            <p className="mb-3 text-xs font-medium tracking-[0.2em] text-[#a8402f] uppercase">
              Chapter 02 — The farm
            </p>
            <h2 className="font-serif text-3xl leading-tight text-[#141210] sm:text-4xl">
              Behind this door, a craft measured in <span className="text-[#a8402f] italic">years</span>.
            </h2>
            <p className="mt-4 text-sm leading-relaxed text-[#5b5347]">
              Miyazaki's farms are small, family-run and fiercely patient.
              Keep scrolling to open the door.
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
