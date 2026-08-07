import { motion } from "motion/react";
import { PlaceholderImage } from "./placeholder-image";

const items = [
  { name: "Corn", note: "Energy & sweetness" },
  { name: "Barley", note: "Steady, clean growth" },
  { name: "Wheat Bran", note: "Fibre & digestion" },
  { name: "Rice Straw", note: "Roughage & rumen health" },
];

export function DietChapter() {
  return (
    <section id="diet" className="bg-[#ede5d4] px-6 py-24 md:px-10 md:py-32">
      <div className="mx-auto grid max-w-6xl items-start gap-12 md:grid-cols-2 md:gap-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.6 }}
        >
          <PlaceholderImage label="Cattle feeding on hay" className="aspect-[4/3] w-full rounded-sm" />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          <p className="mb-4 text-xs font-medium tracking-[0.2em] text-[#a8402f] uppercase">
            Chapter 04 — Diet
          </p>
          <h2 className="mb-6 font-serif text-4xl leading-tight text-[#141210] sm:text-5xl">
            What the cattle <span className="text-[#a8402f] italic">eat</span>.
          </h2>
          <p className="mb-8 max-w-md text-[15px] leading-relaxed text-[#5b5347]">
            A proprietary blend, refined over generations, feeds the animals
            through a long finishing phase — the secret behind that
            snowflake marbling.
          </p>

          <div className="divide-y divide-[#141210]/10 border-t border-[#141210]/10">
            {items.map((item, i) => (
              <div key={item.name} className="flex items-baseline justify-between gap-4 py-4">
                <div className="flex items-baseline gap-4">
                  <span className="font-serif text-xs text-[#a8402f]">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span className="font-serif text-xl text-[#141210]">{item.name}</span>
                </div>
                <span className="text-right text-xs text-[#5b5347]">{item.note}</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
