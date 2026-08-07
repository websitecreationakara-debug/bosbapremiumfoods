import { motion } from "motion/react";

const marqueeText = "Heritage — 宮崎牛 — Miyazaki Wagyu — The Art of Perfection — ";

const standards = [
  {
    title: "Born of Kyushu",
    body: "Only cattle born and raised within Miyazaki Prefecture, on Japan's southern island of Kyushu, may carry the name.",
  },
  {
    title: "Kuroge Washu",
    body: "Pure Japanese Black lineage, guided by elite sire lines managed by the prefecture's livestock improvement agency.",
  },
  {
    title: "Grade 4 & 5 Only",
    body: "Certification demands a Japan Meat Grading Association score of 4 or 5 — the summit of A5 marbling.",
  },
  {
    title: "Award-Winning",
    body: "A repeat winner of top honors at Japan's national wagyu competition, held once every five years.",
  },
];

export function StandardSection() {
  return (
    <section className="bg-[#f3ede1]">
      <div className="overflow-hidden border-y border-[#141210]/10 py-6">
        <div className="animate-wagyu-marquee flex w-max font-serif text-2xl whitespace-nowrap text-[#141210] italic sm:text-3xl">
          <span className="px-4">{marqueeText.repeat(4)}</span>
          <span className="px-4" aria-hidden="true">
            {marqueeText.repeat(4)}
          </span>
        </div>
      </div>

      <div className="mx-auto max-w-6xl px-6 py-20 md:px-10 md:py-28">
        <p className="mb-10 text-xs font-medium tracking-[0.2em] text-[#a8402f] uppercase">
          The Miyazaki Standard
        </p>
        <div className="grid grid-cols-1 gap-x-16 gap-y-10 border-t border-[#141210]/10 pt-10 sm:grid-cols-2">
          {standards.map((s, i) => (
            <motion.div
              key={s.title}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.4 }}
              transition={{ duration: 0.5, delay: i * 0.08 }}
              className="border-b border-[#141210]/10 pb-8"
            >
              <span className="font-serif text-sm text-[#a8402f]">
                {String(i + 1).padStart(2, "0")}
              </span>
              <h3 className="mt-2 font-serif text-2xl text-[#141210]">{s.title}</h3>
              <p className="mt-2 max-w-sm text-sm leading-relaxed text-[#5b5347]">{s.body}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
