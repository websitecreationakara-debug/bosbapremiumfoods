import { createFileRoute, Link } from "@tanstack/react-router";
import { Clock, MapPin, Phone, Truck } from "lucide-react";
import { LocationMap } from "@/components/checkout/location-map";

const SITE = "https://bosbapremiumfoods.com";
const STORE_ADDRESS = "Sangkat Tuol Svay Prey Ti Muoy, Phnom Penh, Cambodia";
const STORE_COORDS = { lat: 11.5487448, lng: 104.9069336 };
const DIRECTIONS_URL = `https://www.google.com/maps/dir/?api=1&destination=${STORE_COORDS.lat},${STORE_COORDS.lng}`;

export const Route = createFileRoute("/_store/store-locator")({
  head: () => ({
    meta: [
      { title: "Store Locator — BOSBA Premium Foods" },
      {
        name: "description",
        content: "Find and get directions to the BOSBA Premium Foods store in Phnom Penh.",
      },
    ],
    links: [{ rel: "canonical", href: `${SITE}/store-locator` }],
  }),
  component: StoreLocator,
});

function StoreLocator() {
  return (
    <div className="mx-auto max-w-3xl px-6 py-12 md:py-16">
      <h1 className="font-display font-semibold tracking-tight text-3xl md:text-4xl">
        Store Locator
      </h1>
      <p className="mt-2 text-[15px] text-muted-foreground">
        Visit us in Phnom Penh, or choose pickup at checkout to collect your order here.
      </p>

      <div className="mt-8">
        <LocationMap coords={STORE_COORDS} readOnly />
      </div>

      <div className="mt-8 grid gap-6 sm:grid-cols-2 text-[15px] leading-relaxed text-muted-foreground">
        <div className="flex items-start gap-3">
          <MapPin className="size-5 shrink-0 text-brand mt-0.5" />
          <div>
            <p className="font-display font-semibold text-foreground">Address</p>
            <p>{STORE_ADDRESS}</p>
            <a
              href={DIRECTIONS_URL}
              target="_blank"
              rel="noreferrer"
              className="text-brand underline"
            >
              Get directions
            </a>
          </div>
        </div>

        <div className="flex items-start gap-3">
          <Phone className="size-5 shrink-0 text-brand mt-0.5" />
          <div>
            <p className="font-display font-semibold text-foreground">Contact</p>
            <a href="tel:+85599361350" className="block hover:text-foreground">
              +855 99 361 350
            </a>
            <a
              href="https://t.me/bosbapremiumfoods_bot"
              target="_blank"
              rel="noreferrer"
              className="text-brand underline"
            >
              Message on Telegram
            </a>
          </div>
        </div>

        <div className="flex items-start gap-3">
          <Clock className="size-5 shrink-0 text-brand mt-0.5" />
          <div>
            <p className="font-display font-semibold text-foreground">Pickup hours</p>
            <p>Daily, 9:30 AM – 9:30 PM</p>
          </div>
        </div>

        <div className="flex items-start gap-3">
          <Truck className="size-5 shrink-0 text-brand mt-0.5" />
          <div>
            <p className="font-display font-semibold text-foreground">Delivery</p>
            <p>
              We also deliver across Phnom Penh — see our{" "}
              <Link to="/shipping-policy" className="text-brand underline">
                shipping policy
              </Link>{" "}
              for details.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
