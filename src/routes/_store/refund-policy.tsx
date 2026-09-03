import { createFileRoute } from "@tanstack/react-router";

const SITE = "https://bosbapremiumfoods.com";
const UPDATED = "3 September 2026";

export const Route = createFileRoute("/_store/refund-policy")({
  head: () => ({
    meta: [
      { title: "Refund Policy — BOSBA Premium Foods" },
      {
        name: "description",
        content: "Returns, refunds, and exchanges for BOSBA Premium Foods orders.",
      },
    ],
    links: [{ rel: "canonical", href: `${SITE}/refund-policy` }],
  }),
  component: RefundPolicy,
});

function RefundPolicy() {
  return (
    <div className="mx-auto max-w-3xl px-6 py-12 md:py-16">
      <h1 className="font-display font-semibold tracking-tight text-3xl md:text-4xl">
        Refund Policy
      </h1>
      <p className="mt-2 text-sm text-muted-foreground">Last updated: {UPDATED}</p>

      <div className="mt-8 space-y-8 text-[15px] leading-relaxed text-muted-foreground [&_h2]:font-display [&_h2]:font-semibold [&_h2]:text-lg [&_h2]:text-foreground [&_h2]:mt-8 [&_h2]:mb-2 [&_a]:text-brand [&_a]:underline">
        <p>
          Most of what we sell is fresh or frozen seafood and meat, so our approach to returns is
          built around food safety rather than a standard mail-back exchange. This policy explains
          when you can get a refund, replacement, or credit.
        </p>

        <div>
          <h2>Check your order on arrival</h2>
          <p>
            Please inspect your delivery or pickup order as soon as you receive it. Because products
            are perishable, issues need to be reported the same day for us to make it right.
          </p>
        </div>

        <div>
          <h2>Eligible for a refund or replacement</h2>
          <ul className="mt-2 list-disc pl-5 space-y-1">
            <li>An item arrives damaged, spoiled, or below the quality you’d expect.</li>
            <li>An item is missing from your order or doesn’t match what you ordered.</li>
            <li>Your order arrives significantly outside the scheduled delivery window.</li>
          </ul>
          <p className="mt-2">
            Contact us the same day with your order number and, where possible, a photo of the item.
            We’ll offer a replacement, store credit, or a refund to your original payment method or
            cash on delivery balance, depending on the situation.
          </p>
        </div>

        <div>
          <h2>Not eligible for a refund</h2>
          <ul className="mt-2 list-disc pl-5 space-y-1">
            <li>
              Change of mind after a fresh or frozen item has been delivered or picked up and
              accepted.
            </li>
            <li>Items left unrefrigerated for an extended period after delivery or pickup.</li>
            <li>Reports made more than 24 hours after delivery or pickup.</li>
          </ul>
        </div>

        <div>
          <h2>Cancelling an order</h2>
          <p>
            To cancel or change an order, contact us as soon as possible. We can usually cancel or
            adjust an order that hasn’t yet been prepared for delivery or pickup; once it has,
            standard refund eligibility above applies instead.
          </p>
        </div>

        <div>
          <h2>How refunds are issued</h2>
          <p>
            Refunds are issued to your original payment method where possible. For cash-on-delivery
            orders, we’ll arrange the refund directly with you (for example via bank transfer or
            adjusting your next order).
          </p>
        </div>

        <div>
          <h2>Contact us</h2>
          <p>
            BOSBA Premium Foods
            <br />
            Sangkat Tuol Svay Prey Ti Muoy, Phnom Penh, Cambodia
            <br />
            Phone: <a href="tel:+85599361350">+855 99 361 350</a>
            <br />
            Telegram: <a href="https://t.me/bosbapremiumfoods_bot">@bosbapremiumfoods_bot</a>
          </p>
        </div>
      </div>
    </div>
  );
}
