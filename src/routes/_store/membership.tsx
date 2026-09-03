import { createFileRoute, Link } from "@tanstack/react-router";
import { Gift, Sparkles } from "lucide-react";

const SITE = "https://bosbapremiumfoods.com";

export const Route = createFileRoute("/_store/membership")({
  head: () => ({
    meta: [
      { title: "BOSBA Plus Membership — BOSBA Premium Foods" },
      {
        name: "description",
        content: "BOSBA Plus, our upcoming rewards membership, is on its way.",
      },
    ],
    links: [{ rel: "canonical", href: `${SITE}/membership` }],
  }),
  component: Membership,
});

function Membership() {
  return (
    <div className="mx-auto max-w-3xl px-6 py-12 md:py-16">
      <h1 className="font-display font-semibold tracking-tight text-3xl md:text-4xl">BOSBA Plus</h1>

      <div className="mt-8 rounded-2xl border bg-muted p-8 text-center">
        <Sparkles className="size-8 mx-auto text-brand" />
        <p className="mt-4 font-display font-semibold text-xl text-foreground">Coming soon</p>
        <p className="mt-2 text-[15px] leading-relaxed text-muted-foreground max-w-md mx-auto">
          We're building BOSBA Plus, a rewards membership where you'll earn points on every order
          and redeem them for free products. It isn't live yet — there's nothing to sign up for
          today.
        </p>
      </div>

      <div className="mt-8 flex items-start gap-3 text-[15px] leading-relaxed text-muted-foreground">
        <Gift className="size-5 shrink-0 text-brand mt-0.5" />
        <p>
          In the meantime, follow us on social media for offers and new arrivals, or check our{" "}
          <Link to="/faq" className="text-brand underline">
            FAQ
          </Link>{" "}
          for other common questions.
        </p>
      </div>
    </div>
  );
}
