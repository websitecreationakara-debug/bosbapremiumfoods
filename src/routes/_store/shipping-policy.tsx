import { createFileRoute, Link } from "@tanstack/react-router";

const SITE = "https://bosbapremiumfoods.com";
const UPDATED = "3 September 2026";

export const Route = createFileRoute("/_store/shipping-policy")({
  head: () => ({
    meta: [
      { title: "Shipping Policy — BOSBA Premium Foods" },
      {
        name: "description",
        content: "Delivery areas, timing, and fees for BOSBA Premium Foods orders.",
      },
    ],
    links: [{ rel: "canonical", href: `${SITE}/shipping-policy` }],
  }),
  component: ShippingPolicy,
});

function ShippingPolicy() {
  return (
    <div className="mx-auto max-w-3xl px-6 py-12 md:py-16">
      <h1 className="font-display font-semibold tracking-tight text-3xl md:text-4xl">
        Shipping Policy
      </h1>
      <p className="mt-2 text-sm text-muted-foreground">Last updated: {UPDATED}</p>

      <div className="mt-8 space-y-8 text-[15px] leading-relaxed text-muted-foreground [&_h2]:font-display [&_h2]:font-semibold [&_h2]:text-lg [&_h2]:text-foreground [&_h2]:mt-8 [&_h2]:mb-2 [&_a]:text-brand [&_a]:underline">
        <p>
          BOSBA Premium Foods delivers fresh and frozen products across Phnom Penh, or you can
          collect your order directly from our store. This policy explains how delivery and pickup
          work.
        </p>

        <div>
          <h2>Delivery area</h2>
          <p>
            We currently deliver within Phnom Penh. At checkout, enter your delivery address and
            city so our team can confirm coverage and the best delivery slot for your area.
          </p>
        </div>

        <div>
          <h2>Delivery fee &amp; free shipping</h2>
          <p>
            A delivery fee applies to orders below our free-shipping threshold, shown in your cart
            and at checkout. Orders at or above the threshold ship free. Pickup at our store is
            always free.
          </p>
        </div>

        <div>
          <h2>Delivery time &amp; scheduling</h2>
          <p>
            At checkout you can choose a delivery time slot or, for pickup, a date and time to
            collect your order at our store. Same-day slots are offered when there’s enough lead
            time left in the day; otherwise you’ll be offered the next available slot.
          </p>
        </div>

        <div>
          <h2>Pickup at our store</h2>
          <p>
            Choose “Pickup at store” at checkout and pick a date and time. Our store address is{" "}
            Sangkat Tuol Svay Prey Ti Muoy, Phnom Penh.
          </p>
        </div>

        <div>
          <h2>Fresh &amp; frozen handling</h2>
          <p>
            Many of our products are fresh or frozen seafood and meat. We pack orders in insulated,
            temperature-controlled packaging and aim to get them to you or ready for pickup within
            the scheduled slot to preserve quality. Please be available to receive your delivery, or
            collect pickup orders promptly, so products don’t sit outside cold storage longer than
            necessary.
          </p>
        </div>

        <div>
          <h2>Payment</h2>
          <p>
            You can pay by cash on delivery or, when available, KHQR online payment. See our{" "}
            <Link to="/privacy">Privacy Policy</Link> for how payments are processed.
          </p>
        </div>

        <div>
          <h2>Questions about your delivery</h2>
          <p>
            If your order hasn’t arrived within the expected window, or you need to change your
            delivery details, contact us using the details below.
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
