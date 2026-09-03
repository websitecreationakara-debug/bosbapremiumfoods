import type { ReactNode } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const SITE = "https://bosbapremiumfoods.com";

const FAQS: { question: string; answer: ReactNode }[] = [
  {
    question: "Where do you deliver?",
    answer:
      "We currently deliver across Phnom Penh. You can also pick up your order directly from our store.",
  },
  {
    question: "How much is delivery?",
    answer:
      "A delivery fee applies below our free-shipping threshold, shown in your cart. Orders at or above the threshold ship free, and pickup is always free. See our shipping policy for details.",
  },
  {
    question: "How fresh are your products?",
    answer:
      "Our seafood is sashimi grade, sourced from Japanese waters and inspected at the market at dawn. Everything is packed on ice and kept cold through delivery.",
  },
  {
    question: "What payment methods do you accept?",
    answer: "You can pay by cash on delivery or, when available, KHQR online payment.",
  },
  {
    question: "Can I return or get a refund on an item?",
    answer:
      "If an item arrives damaged, spoiled, missing, or otherwise not as ordered, contact us the same day and we'll sort out a replacement, credit, or refund. See our refund policy for the full details.",
  },
  {
    question: "Can I cancel or change my order?",
    answer:
      "Contact us as soon as possible after ordering. We can usually cancel or adjust an order before it's been prepared for delivery or pickup.",
  },
  {
    question: "Do you have a loyalty or membership program?",
    answer: (
      <>
        We're working on <Link to="/membership">BOSBA Plus</Link>, a dedicated membership program
        with points on every order. In the meantime, follow us on social media for offers and new
        arrivals.
      </>
    ),
  },
  {
    question: "How do I track my order?",
    answer: (
      <>
        Once you're signed in, you can see the status of your current and past orders under{" "}
        <Link to="/orders">My Orders</Link>.
      </>
    ),
  },
];

export const Route = createFileRoute("/_store/faq")({
  head: () => ({
    meta: [
      { title: "FAQ — BOSBA Premium Foods" },
      {
        name: "description",
        content: "Answers to common questions about delivery, payment, freshness, and returns.",
      },
    ],
    links: [{ rel: "canonical", href: `${SITE}/faq` }],
  }),
  component: Faq,
});

function Faq() {
  return (
    <div className="mx-auto max-w-3xl px-6 py-12 md:py-16">
      <h1 className="font-display font-semibold tracking-tight text-3xl md:text-4xl">
        Frequently Asked Questions
      </h1>
      <p className="mt-2 text-sm text-muted-foreground">
        Have another question? Reach us at{" "}
        <a href="tel:+85599361350" className="text-brand underline">
          +855 99 361 350
        </a>{" "}
        or via{" "}
        <a
          href="https://t.me/bosbapremiumfoods_bot"
          className="text-brand underline"
          target="_blank"
          rel="noreferrer"
        >
          Telegram
        </a>
        .
      </p>

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
  );
}
