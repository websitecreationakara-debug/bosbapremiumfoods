import { motion } from "motion/react";

export function FieldChapter() {
  return (
    <section id="field" className="relative flex min-h-screen items-end overflow-hidden bg-[#141210]">
      <img
        src="/wagyu/field-mountain.webp"
        alt="Wagyu cattle grazing in a misty mountain valley at sunset"
        className="absolute inset-0 h-full w-full object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.5 }}
        transition={{ duration: 0.7 }}
        className="relative z-10 max-w-xl px-6 pb-24 md:px-10"
      >
        <p className="mb-4 text-xs font-medium tracking-[0.2em] text-[#e6b8a8] uppercase">
          Chapter 05 — The field
        </p>
        <h2 className="font-serif text-4xl leading-tight text-white sm:text-6xl">
          Raised in
          <br />
          <span className="italic">mountain air</span>.
        </h2>
        <p className="mt-6 max-w-md text-[15px] leading-relaxed text-white/80">
          Beyond the farmhouse, the fields open toward the peaks. Clean wind,
          room to roam, and the unhurried calm of the countryside — the
          final gift Miyazaki gives its cattle.
        </p>
      </motion.div>
    </section>
  );
}
