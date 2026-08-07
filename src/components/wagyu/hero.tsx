import { motion } from "motion/react";

export function WagyuHero() {
  return (
    <section className="relative flex min-h-screen items-center bg-[#f3ede1] px-6 pt-24 pb-16 md:px-10">
      <div className="mx-auto grid w-full max-w-6xl items-center gap-12 md:grid-cols-2">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
        >
          <p className="mb-4 text-xs font-medium tracking-[0.2em] text-[#a8402f] uppercase">
            宮崎牛 · Miyazaki Prefecture, Japan
          </p>
          <h1 className="font-serif text-5xl leading-[1.05] text-[#141210] sm:text-6xl md:text-7xl">
            The <span className="text-[#a8402f] italic">Miyazaki</span>
            <br />
            Heritage
          </h1>
          <p className="mt-6 max-w-md text-[15px] leading-relaxed text-[#5b5347]">
            Follow the journey of a legendary regional beef — from a single
            southern prefecture, through the farmhouse door, to the open
            mountain air.
          </p>
          <div className="mt-10 flex items-center gap-2 text-xs font-medium tracking-[0.16em] text-[#5b5347] uppercase">
            <motion.span
              animate={{ y: [0, 4, 0] }}
              transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
            >
              ↓
            </motion.span>
            Scroll to begin the story
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.97 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, ease: "easeOut", delay: 0.15 }}
          className="relative mx-auto aspect-[4/5] w-full max-w-sm md:mx-0"
        >
          <img
            src="/wagyu/map-kyushu-zoom.jpg"
            alt="Aged map of Kyushu with Miyazaki prefecture highlighted"
            className="absolute top-0 right-0 h-3/4 w-3/4 rotate-1 rounded-sm object-cover shadow-lg"
          />
          <img
            src="/wagyu/hero-beef.jpg"
            alt="Marbled Miyazaki wagyu beef"
            className="absolute bottom-0 left-0 h-4/5 w-4/5 -rotate-1 rounded-sm object-cover shadow-xl"
          />
        </motion.div>
      </div>
    </section>
  );
}
