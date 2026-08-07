import { motion } from "motion/react";
import { HeartPulse, Footprints, Wind, Clock, type LucideIcon } from "lucide-react";

const items: { icon: LucideIcon; title: string; body: string }[] = [
  {
    icon: HeartPulse,
    title: "Individual Attention",
    body: "Every animal is known by name. Farmers monitor health, temperament and comfort daily.",
  },
  {
    icon: Footprints,
    title: "Hoof & Coat Care",
    body: "Regular hoof trimming and brushing keep each animal relaxed and sound.",
  },
  {
    icon: Wind,
    title: "Gentle Exercise",
    body: "Measured daily movement builds the fine, snowflake-like marbling wagyu is known for.",
  },
  {
    icon: Clock,
    title: "28–32 Months",
    body: "Cattle are raised slowly and patiently, with an intensive finishing phase.",
  },
];

export function CareChapter() {
  return (
    <section id="care" className="bg-[#f3ede1] px-6 py-24 md:px-10 md:py-32">
      <div className="mx-auto grid max-w-6xl gap-12 md:grid-cols-2 md:gap-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.6 }}
        >
          <p className="mb-4 text-xs font-medium tracking-[0.2em] text-[#a8402f] uppercase">
            Chapter 03 — Care
          </p>
          <h2 className="mb-8 font-serif text-4xl leading-tight text-[#141210] sm:text-5xl">
            How they raise a legend.
          </h2>
          <img
            src="/wagyu/care-pasture.jpg"
            alt="Cattle grazing in a green pasture"
            className="aspect-[4/3] w-full rounded-sm object-cover"
          />
        </motion.div>

        <div className="grid grid-cols-1 divide-y divide-[#141210]/10 border border-[#141210]/10 sm:grid-cols-2 sm:divide-x sm:divide-y-0">
          {items.map(({ icon: Icon, title, body }, i) => (
            <motion.div
              key={title}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.4 }}
              transition={{ duration: 0.5, delay: i * 0.08 }}
              className="p-6"
            >
              <Icon className="mb-4 size-5 text-[#a8402f]" strokeWidth={1.5} />
              <h3 className="font-serif text-lg text-[#141210]">{title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-[#5b5347]">{body}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
