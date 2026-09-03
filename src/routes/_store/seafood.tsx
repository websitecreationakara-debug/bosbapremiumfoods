import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Clock3, Fish, Flame, Snowflake, Sparkles, Truck, Waves } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const SITE = "https://bosbapremiumfoods.com";

export const Route = createFileRoute("/_store/seafood")({
  head: () => ({
    meta: [
      { title: "Japanese Sashimi & Seafood — BOSBA Premium Foods" },
      {
        name: "description",
        content:
          "Sashimi-grade seafood sourced from Japanese waters, inspected at dawn, and delivered cold to Phnom Penh.",
      },
      { property: "og:url", content: `${SITE}/seafood` },
    ],
    links: [{ rel: "canonical", href: `${SITE}/seafood` }],
  }),
  component: SeafoodPage,
});

const PROMISES = [
  {
    icon: Waves,
    title: "Japanese Waters",
    body: "Sourced from Japanese waters, the same standard behind sashimi served in Japan itself.",
  },
  {
    icon: Clock3,
    title: "Dawn Market Inspection",
    body: "Selected at first light before the market opens to the public, so only the finest catch makes the cut.",
  },
  {
    icon: Snowflake,
    title: "Unbroken Cold Chain",
    body: "Packed on ice and kept cold at every step, from the market to your door in Phnom Penh.",
  },
  {
    icon: Truck,
    title: "Fast, Careful Delivery",
    body: "Delivered chilled, or ready for pickup at our store — timed so it reaches you at its best.",
  },
];

const CATEGORIES = [
  { label: "Sashimi Sets", query: "sashimi" },
  { label: "Fresh Uni", query: "uni" },
  { label: "Hamachi", query: "hamachi" },
  { label: "Salmon", query: "salmon" },
  { label: "Tuna Otoro", query: "tuna" },
  { label: "Hotate", query: "hotate" },
];

const SERVING_STEPS = [
  {
    title: "Thaw Gently, If Frozen",
    body: "Move frozen sashimi to the refrigerator 12–24 hours before serving. Thawing slowly and cold keeps the texture intact — never thaw at room temperature or under hot water.",
  },
  {
    title: "Slice Against the Grain",
    body: "Use a sharp knife and a single smooth pull, not a sawing motion, for clean cuts that don't tear the flesh. Keep both the fish and your knife well chilled.",
  },
  {
    title: "Serve Cold, Serve Simple",
    body: "Plate straight from the fridge with soy sauce, wasabi, and pickled ginger. Sashimi is best enjoyed within the day — don't let it sit out.",
  },
];

const FAQS: { question: string; answer: string }[] = [
  {
    question: "Is it safe to eat this seafood raw?",
    answer:
      "Yes — our sashimi-grade seafood is selected and handled specifically for raw consumption, kept cold from the market through delivery. Once it arrives, keep it refrigerated and enjoy it the same day.",
  },
  {
    question: "Does it arrive fresh or frozen?",
    answer:
      "Depending on the item, seafood ships fresh-chilled or flash-frozen to lock in quality — check each product page for specifics. Either way, it's packed on ice or kept frozen through delivery.",
  },
  {
    question: "How long can I keep it before eating?",
    answer:
      "For the best experience, eat fresh sashimi the day it arrives. Frozen items can be kept in the freezer and thawed in the refrigerator 12–24 hours before serving.",
  },
  {
    question: "What if I'm not sure how to prepare it?",
    answer:
      "See our serving guide below for the basics, or message us on Telegram — we're happy to walk you through it.",
  },
];

function SeafoodPage() {
  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-b from-sky-950 via-slate-950 to-background text-white">
        <div className="mx-auto max-w-5xl px-6 py-20 md:py-28 text-center">
          <span className="text-xs font-medium tracking-[0.3em] uppercase text-sky-300">
            BOSBA Premium Foods — Sashimi &amp; Seafood
          </span>
          <h1 className="mt-4 font-display font-semibold tracking-tight text-4xl md:text-6xl">
            From Japanese Waters
            <br className="hidden sm:block" /> to Your Table
          </h1>
          <p className="mt-5 text-base md:text-lg text-white/70 max-w-2xl mx-auto">
            Sashimi-grade seafood, inspected at dawn and kept cold every step of the way — delivered
            fresh to Phnom Penh.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <Button asChild size="lg">
              <Link to="/shop" search={{ category: "sashimi-set" }}>
                Shop Sashimi &amp; Seafood
              </Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="bg-transparent text-white border-white/30 hover:bg-white/10 hover:text-white"
            >
              <a href="#faq">Have Questions?</a>
            </Button>
          </div>
        </div>
      </section>

      {/* Promise / trust grid */}
      <section className="mx-auto max-w-6xl px-6 py-16 md:py-20">
        <div className="text-center max-w-2xl mx-auto">
          <span className="text-xs font-medium tracking-[0.3em] uppercase text-brand">
            Our Promise
          </span>
          <h2 className="mt-3 font-display font-semibold tracking-tight text-2xl md:text-3xl">
            Every step is built around freshness
          </h2>
        </div>
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {PROMISES.map(({ icon: Icon, title, body }) => (
            <div key={title} className="rounded-2xl border bg-card p-6">
              <Icon className="size-7 text-brand" />
              <p className="mt-4 font-display font-semibold text-foreground">{title}</p>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Category showcase */}
      <section className="bg-muted/40 py-16 md:py-20">
        <div className="mx-auto max-w-6xl px-6">
          <div className="text-center max-w-2xl mx-auto">
            <span className="text-xs font-medium tracking-[0.3em] uppercase text-brand">
              Explore
            </span>
            <h2 className="mt-3 font-display font-semibold tracking-tight text-2xl md:text-3xl">
              Sashimi &amp; seafood, by the piece or the set
            </h2>
          </div>
          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {CATEGORIES.map(({ label, query }) => (
              <Link
                key={label}
                to="/shop"
                search={{ q: query }}
                className="group flex items-center justify-between rounded-xl border bg-card px-6 py-5 transition-colors hover:border-brand"
              >
                <span className="flex items-center gap-3 font-display font-semibold text-foreground">
                  <Fish className="size-5 text-brand" /> {label}
                </span>
                <ArrowRight className="size-4 text-muted-foreground transition-transform group-hover:translate-x-1 group-hover:text-brand" />
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Serving guide */}
      <section className="mx-auto max-w-5xl px-6 py-16 md:py-20">
        <div className="text-center max-w-2xl mx-auto">
          <span className="text-xs font-medium tracking-[0.3em] uppercase text-brand">
            Serving Guide
          </span>
          <h2 className="mt-3 font-display font-semibold tracking-tight text-2xl md:text-3xl">
            Three steps to serving sashimi at home
          </h2>
        </div>
        <div className="mt-10 grid gap-8 md:grid-cols-3">
          {SERVING_STEPS.map((step, i) => (
            <div key={step.title}>
              <div className="flex size-9 items-center justify-center rounded-full bg-brand text-brand-foreground font-display font-semibold">
                {i + 1}
              </div>
              <p className="mt-4 font-display font-semibold text-foreground">{step.title}</p>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{step.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="bg-muted/40 py-16 md:py-20">
        <div className="mx-auto max-w-3xl px-6">
          <div className="text-center">
            <span className="text-xs font-medium tracking-[0.3em] uppercase text-brand">FAQ</span>
            <h2 className="mt-3 font-display font-semibold tracking-tight text-2xl md:text-3xl">
              Sashimi &amp; seafood, answered
            </h2>
          </div>
          <Accordion type="single" collapsible defaultValue="faq-0" className="mt-8">
            {FAQS.map((faq, i) => (
              <AccordionItem key={i} value={`faq-${i}`}>
                <AccordionTrigger className="font-display font-semibold text-base text-left">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-[15px] leading-relaxed text-muted-foreground">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>

      {/* Final CTA */}
      <section className="relative overflow-hidden bg-gradient-to-b from-background to-sky-950 text-white">
        <div className="mx-auto max-w-3xl px-6 py-16 md:py-20 text-center">
          <Sparkles className="size-7 mx-auto text-sky-300" />
          <h2 className="mt-4 font-display font-semibold tracking-tight text-2xl md:text-4xl">
            Ready for sashimi-grade freshness?
          </h2>
          <p className="mt-3 text-white/70 max-w-xl mx-auto">
            Browse our full range of sashimi, sets, and seafood — delivered cold, straight to your
            door in Phnom Penh.
          </p>
          <div className="mt-7 flex flex-wrap items-center justify-center gap-3">
            <Button asChild size="lg">
              <Link to="/shop" search={{ category: "sashimi-set" }}>
                Shop Now
              </Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="bg-transparent text-white border-white/30 hover:bg-white/10 hover:text-white"
            >
              <a href="https://t.me/bosbapremiumfoods_bot" target="_blank" rel="noreferrer">
                <Flame className="size-4" /> Ask Our Team
              </a>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
