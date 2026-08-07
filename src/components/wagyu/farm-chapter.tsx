import { motion } from "motion/react";

export function FarmChapter() {
  return (
    <section id="farm" className="bg-[#f3ede1] px-6 py-24 md:px-10 md:py-32">
      <div className="mx-auto grid max-w-6xl items-center gap-12 md:grid-cols-2 md:gap-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.6 }}
          className="md:order-2"
        >
          <img
            src="/wagyu/farm-reveal.jpg"
            alt="A green mountain valley where Miyazaki's farms raise their cattle"
            className="aspect-[4/3] w-full rounded-sm object-cover"
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="md:order-1"
        >
          <p className="mb-4 text-xs font-medium tracking-[0.2em] text-[#a8402f] uppercase">
            Chapter 02 — The farm
          </p>
          <h2 className="mb-6 font-serif text-4xl leading-tight text-[#141210] sm:text-5xl">
            Raised by hands that know them <span className="text-[#a8402f] italic">well</span>.
          </h2>
          <p className="max-w-md text-[15px] leading-relaxed text-[#5b5347]">
            Miyazaki's farms are small and family-run — often just one
            household caring for a few dozen cattle by name, with patience
            passed down through generations.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
