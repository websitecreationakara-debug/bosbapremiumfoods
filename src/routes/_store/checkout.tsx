import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useCart, itemKey, itemUnitPrice } from "@/hooks/use-cart";
import { useAuth } from "@/hooks/use-auth";
import { useStoreSettings } from "@/hooks/use-products";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useRef, useState } from "react";
import { createOrder } from "@/data/orders";
import { toast } from "sonner";
import { MapPin, Check } from "lucide-react";

export const Route = createFileRoute("/_store/checkout")({
  component: Checkout,
});

function Checkout() {
  const { items, subtotal, clear } = useCart();
  const { user } = useAuth();
  const { data: settings } = useStoreSettings();
  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState(false);
  const [coords, setCoords] = useState<{ lat: number; lng: number } | null>(null);
  const [locating, setLocating] = useState(false);
  const nameRef = useRef<HTMLInputElement>(null);
  const emailRef = useRef<HTMLInputElement>(null);
  const phoneRef = useRef<HTMLInputElement>(null);
  const addressRef = useRef<HTMLInputElement>(null);
  const cityRef = useRef<HTMLInputElement>(null);

  const threshold = Number(settings?.free_shipping_threshold ?? 50);
  const shipping = subtotal >= threshold || subtotal === 0 ? 0 : 4.99;
  const total = subtotal + shipping;

  const captureLocation = () => {
    if (!navigator.geolocation) {
      toast.error("Location isn't supported on this device.");
      return;
    }
    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const lat = pos.coords.latitude;
        const lng = pos.coords.longitude;
        setCoords({ lat, lng });
        // Reverse-geocode the pin to auto-fill the address (free, no API key).
        try {
          const res = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lng}&accept-language=en`,
          );
          const data = await res.json();
          if (data?.display_name && addressRef.current)
            addressRef.current.value = data.display_name;
          const a = data?.address ?? {};
          const city = a.city || a.town || a.village || a.suburb || a.county;
          if (city && cityRef.current && !cityRef.current.value) cityRef.current.value = city;
        } catch {
          // Geocoding failed — coordinates are still saved; customer can type the address.
        }
        setLocating(false);
        toast.success("Location pinned — address filled in!");
      },
      (err) => {
        setLocating(false);
        toast.error(
          err.code === err.PERMISSION_DENIED
            ? "Location permission denied — you can still order with your address."
            : "Couldn't get your location. Please try again.",
        );
      },
      { enableHighAccuracy: true, timeout: 10000 },
    );
  };

  const placeOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (items.length === 0) return;
    setSubmitting(true);
    const orderItems = items.map((i) => ({
      id: i.variation?.id ?? i.product.id,
      title: i.variation ? `${i.product.title} (${i.variation.weight})` : i.product.title,
      qty: i.qty,
      price: itemUnitPrice(i),
    }));
    const customerName = nameRef.current?.value?.trim() || (user?.name ?? "");
    const customerEmail = emailRef.current?.value?.trim() ?? "";
    let res;
    try {
      res = await createOrder({
        data: {
          items: orderItems,
          customer_name: customerName,
          customer_email: customerEmail,
          customer_phone: phoneRef.current?.value ?? "",
          address: addressRef.current?.value ?? "",
          city: cityRef.current?.value ?? "",
          location_lat: coords?.lat ?? null,
          location_lng: coords?.lng ?? null,
        },
      });
    } catch (err) {
      setSubmitting(false);
      toast.error(err instanceof Error ? err.message : "Failed to place order");
      return;
    }
    setSubmitting(false);
    try {
      sessionStorage.setItem(
        "bosba:last-order",
        JSON.stringify({
          id: res.id,
          total: res.total,
          items: orderItems,
          customer_name: customerName,
          customer_email: customerEmail,
        }),
      );
    } catch {
      // sessionStorage unavailable — the page falls back to a generic thank-you.
    }
    clear();
    navigate({ to: "/thank-you" });
  };

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-3xl px-6 py-20 text-center">
        <h1 className="font-display font-semibold tracking-tight text-3xl">Your cart is empty</h1>
        <Button asChild className="mt-6 rounded-full">
          <Link to="/shop">Continue shopping</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl px-6 py-12 grid lg:grid-cols-[1fr_400px] gap-10">
      <form onSubmit={placeOrder} className="space-y-6">
        <h1 className="font-display font-semibold tracking-tight text-3xl">Checkout</h1>

        <section className="space-y-4 bg-muted rounded-2xl p-6">
          <h2 className="font-display font-semibold text-lg">Delivery Details</h2>
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <Label>Full name</Label>
              <Input ref={nameRef} required defaultValue={user?.name ?? ""} />
            </div>
            <div>
              <Label>
                Email{!user && <span className="text-muted-foreground"> (optional)</span>}
              </Label>
              <Input
                ref={emailRef}
                required={!!user}
                type="email"
                defaultValue={user?.email ?? ""}
              />
            </div>
            <div className="sm:col-span-2">
              <Label>Phone</Label>
              <Input ref={phoneRef} required type="tel" placeholder="+855 12 345 678" />
            </div>
            <div className="sm:col-span-2">
              <Label>Address</Label>
              <div className="flex gap-2">
                <Input
                  ref={addressRef}
                  required
                  placeholder="123 Phnom Penh"
                  className="flex-1 min-w-0"
                />
                <Button
                  type="button"
                  variant="outline"
                  onClick={captureLocation}
                  disabled={locating}
                  className="shrink-0 gap-2"
                >
                  <MapPin className="size-4" />
                  {locating ? "Locating…" : coords ? "Pinned" : "Pin location"}
                </Button>
              </div>
              {coords && (
                <a
                  href={`https://www.google.com/maps?q=${coords.lat},${coords.lng}`}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-2 inline-flex items-center gap-1 text-sm font-medium text-brand hover:underline"
                >
                  <Check className="size-4" /> Location pinned — view on map
                </a>
              )}
            </div>
            <div className="sm:col-span-2">
              <Label>City</Label>
              <Input ref={cityRef} required />
            </div>
          </div>
        </section>

        <section className="space-y-4 bg-muted rounded-2xl p-6">
          <h2 className="font-display font-semibold text-lg">Payment</h2>
          <p className="text-sm text-muted-foreground">
            Demo checkout — no real payment is processed.
          </p>
        </section>

        <Button type="submit" disabled={submitting} size="lg" className="w-full rounded-full">
          {submitting ? "Placing order..." : `Place order — $${total.toFixed(2)}`}
        </Button>
      </form>

      <aside className="bg-muted rounded-2xl p-6 h-fit sticky top-28 space-y-4">
        <h2 className="font-display font-semibold text-lg">Order Summary</h2>
        <div className="space-y-2 max-h-72 overflow-y-auto">
          {items.map((item) => (
            <div key={itemKey(item)} className="flex justify-between text-sm">
              <span className="truncate pr-2">
                {item.product.title}
                {item.variation ? ` (${item.variation.weight})` : ""} × {item.qty}
              </span>
              <span className="font-bold">${(itemUnitPrice(item) * item.qty).toFixed(2)}</span>
            </div>
          ))}
        </div>
        <div className="border-t pt-4 space-y-2 text-sm">
          <div className="flex justify-between">
            <span>Subtotal</span>
            <span>${subtotal.toFixed(2)}</span>
          </div>
          <div className="flex justify-between">
            <span>Shipping</span>
            <span>{shipping === 0 ? "Free" : `$${shipping.toFixed(2)}`}</span>
          </div>
          <div className="flex justify-between font-display font-semibold text-lg pt-2 border-t">
            <span>Total</span>
            <span>${total.toFixed(2)}</span>
          </div>
        </div>
      </aside>
    </div>
  );
}
