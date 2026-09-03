import { createFileRoute, Link } from "@tanstack/react-router";

const SITE = "https://bosbapremiumfoods.com";

export const Route = createFileRoute("/_store/about")({
  head: () => ({
    meta: [
      { title: "About Us — BOSBA Premium Foods" },
      {
        name: "description",
        content:
          "BOSBA Premium Foods brings sashimi-grade seafood, premium wagyu, and other Japanese ingredients to Phnom Penh, delivered fresh.",
      },
    ],
    links: [{ rel: "canonical", href: `${SITE}/about` }],
  }),
  component: About,
});

function About() {
  return (
    <div className="mx-auto max-w-3xl px-6 py-12 md:py-16">
      <h1 className="font-display font-semibold tracking-tight text-3xl md:text-4xl">About Us</h1>

      <div className="mt-8 space-y-8 text-[15px] leading-relaxed text-muted-foreground [&_h2]:font-display [&_h2]:font-semibold [&_h2]:text-lg [&_h2]:text-foreground [&_h2]:mt-8 [&_h2]:mb-2 [&_a]:text-brand [&_a]:underline">
        <p>
          BOSBA Premium Foods brings high-premium quality foods from Japan to your door in Phnom
          Penh — sashimi-grade seafood, premium wagyu, and other ingredients that are hard to find
          fresh and reliably in Cambodia.
        </p>

        <div>
          <h2>What we sell</h2>
          <p>
            Our catalog spans sashimi and sashimi sets, fresh uni, hamachi, salmon, tuna otoro,
            nishin, hotate, premium wagyu for BBQ and home cooking, and a range of Japanese
            condiments and ready-to-eat items. Browse the full range in our{" "}
            <Link to="/shop">shop</Link>, or see our dedicated <Link to="/wagyu">wagyu page</Link>{" "}
            for the story behind our Miyazaki wagyu.
          </p>
        </div>

        <div>
          <h2>Sashimi grade, sourced from Japanese waters</h2>
          <p>
            Our seafood is sashimi grade and sourced from Japanese waters, inspected at the market
            at dawn before it makes its way to Cambodia.
          </p>
        </div>

        <div>
          <h2>Cold chain, from the market to your table</h2>
          <p>
            Freshness depends on the chain never breaking. Our products are packed on ice and
            shipped cold, and we deliver in chilled conditions so what arrives at your door is as
            close as possible to what left the market.
          </p>
        </div>

        <div>
          <h2>Delivery in Phnom Penh</h2>
          <p>
            We deliver across Phnom Penh, with pickup available directly from our store. See our{" "}
            <Link to="/shipping-policy">Shipping Policy</Link> for delivery areas, timing, and fees.
          </p>
        </div>

        <div>
          <h2>Get in touch</h2>
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
