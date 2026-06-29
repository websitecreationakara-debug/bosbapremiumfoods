import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useCart, itemKey, itemUnitPrice } from "@/hooks/use-cart";
import { useAuth } from "@/hooks/use-auth";
import { useStoreSettings } from "@/hooks/use-products";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useRef, useState, useEffect } from "react";
import { createOrder } from "@/data/orders";
import { validatePromoCode } from "@/data/promo-codes";
import { promoCodeDiscount } from "@/lib/promo-code";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import {
  MapPin,
  Check,
  Tag,
  X,
  Zap,
  CalendarClock,
  Minus,
  Plus,
  Trash2,
  Banknote,
  QrCode,
} from "lucide-react";

// Half-hour delivery slots, 8:00 AM – 8:00 PM.
const TIME_SLOTS = (() => {
  const out: string[] = [];
  for (let h = 8; h <= 20; h++) {
    out.push(`${String(h).padStart(2, "0")}:00`);
    if (h < 20) out.push(`${String(h).padStart(2, "0")}:30`);
  }
  return out;
})();
const timeLabel = (t: string) => {
  const [h, m] = t.split(":").map(Number);
  const h12 = h % 12 === 0 ? 12 : h % 12;
  return `${h12}:${String(m).padStart(2, "0")} ${h < 12 ? "AM" : "PM"}`;
};
const slotMinutes = (t: string) => {
  const [h, m] = t.split(":").map(Number);
  return h * 60 + m;
};
// Minimum lead time before a same-day slot can be booked (so customers can't
// pick a slot that's already passed, or one that's only minutes away).
const LEAD_MINUTES = 30;
const localToday = () => {
  const d = new Date();
  return new Date(d.getTime() - d.getTimezoneOffset() * 60000).toISOString().slice(0, 10);
};

export const Route = createFileRoute("/_store/checkout")({
  component: Checkout,
});

function Checkout() {
  const { items, subtotal, clear, setQty, remove } = useCart();
  const { user } = useAuth();
  const { data: settings } = useStoreSettings();
  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState(false);
  const [coords, setCoords] = useState<{ lat: number; lng: number } | null>(null);
  const [locating, setLocating] = useState(false);
  const [code, setCode] = useState("");
  const [applied, setApplied] = useState<{ code: string; type: string; value: number } | null>(
    null,
  );
  const [checking, setChecking] = useState(false);
  const nameRef = useRef<HTMLInputElement>(null);
  const emailRef = useRef<HTMLInputElement>(null);
  const phoneRef = useRef<HTMLInputElement>(null);
  const addressRef = useRef<HTMLInputElement>(null);
  const cityRef = useRef<HTMLInputElement>(null);
  const [schedMode, setSchedMode] = useState<"asap" | "schedule">("asap");
  const [schedDate, setSchedDate] = useState("");
  const [schedTime, setSchedTime] = useState("");
  const [payment, setPayment] = useState<"cod" | "khqr">("cod");
  const scheduledAt =
    schedMode === "schedule" && schedDate && schedTime ? `${schedDate}T${schedTime}` : null;

  // For a same-day delivery, only offer slots at least LEAD_MINUTES from now so a
  // customer can't schedule a time that's already passed. Future dates: all slots.
  const isToday = schedDate === localToday();
  const earliestToday = (() => {
    const d = new Date();
    return d.getHours() * 60 + d.getMinutes() + LEAD_MINUTES;
  })();
  const availableSlots = isToday
    ? TIME_SLOTS.filter((t) => slotMinutes(t) >= earliestToday)
    : TIME_SLOTS;

  // If the day changes (or time passes) and the chosen slot is no longer valid,
  // clear it so a stale past time can't be submitted.
  useEffect(() => {
    if (schedTime && !availableSlots.includes(schedTime)) setSchedTime("");
  }, [schedTime, availableSlots]);

  const discount = applied ? promoCodeDiscount(applied.type, applied.value, subtotal) : 0;
  const discountedSubtotal = Math.max(0, subtotal - discount);
  const threshold = Number(settings?.free_shipping_threshold ?? 50);
  const shipping = discountedSubtotal >= threshold || discountedSubtotal === 0 ? 0 : 2.5;
  const total = discountedSubtotal + shipping;

  const applyCode = async () => {
    const c = code.trim();
    if (!c) return;
    setChecking(true);
    try {
      const r = await validatePromoCode({ data: { code: c, subtotal } });
      if (!r.valid) {
        setApplied(null);
        toast.error(r.message ?? "Invalid code");
      } else if (r.discount <= 0) {
        setApplied(null);
        toast.error("This code doesn't apply to your cart.");
      } else {
        setApplied({ code: r.code, type: r.type, value: r.value });
        toast.success(`Code ${r.code} applied`);
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Couldn't apply code");
    } finally {
      setChecking(false);
    }
  };

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
    // Guard against a scheduled time that has already passed (e.g. the slot
    // lapsed while the form sat open).
    if (scheduledAt && new Date(scheduledAt).getTime() <= Date.now()) {
      toast.error("That delivery time has already passed — please pick a later time.");
      return;
    }
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
          promo_code: applied?.code ?? null,
          scheduled_at: scheduledAt,
          payment_method: payment,
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
          discount,
          promo_code: applied?.code ?? null,
          scheduled_at: scheduledAt,
          items: orderItems,
          customer_name: customerName,
          customer_email: customerEmail,
          customer_phone: phoneRef.current?.value ?? "",
          address: addressRef.current?.value ?? "",
          city: cityRef.current?.value ?? "",
          created_at: new Date().toISOString(),
        }),
      );
    } catch {
      // sessionStorage unavailable — the page falls back to a generic thank-you.
    }
    clear();
    // KHQR orders aren't confirmed yet — send the customer to pay first; the pay
    // screen advances to /thank-you once payment lands. COD is done immediately.
    if (res.payment_method === "khqr") {
      navigate({ to: "/pay/$id", params: { id: res.id } });
    } else {
      navigate({ to: "/thank-you" });
    }
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
            <div className="sm:col-span-2">
              <Label>Delivery time</Label>
              <div className="mt-1.5 grid grid-cols-2 gap-2">
                {(
                  [
                    { key: "asap", label: "As soon as possible", icon: Zap },
                    { key: "schedule", label: "Schedule (pre-order)", icon: CalendarClock },
                  ] as const
                ).map((opt) => (
                  <button
                    key={opt.key}
                    type="button"
                    onClick={() => setSchedMode(opt.key)}
                    className={cn(
                      "flex items-center justify-center gap-2 rounded-xl border px-3 py-3 text-sm font-medium transition-colors",
                      schedMode === opt.key
                        ? "border-brand bg-brand/10 text-brand"
                        : "border-border hover:bg-background",
                    )}
                  >
                    <opt.icon className="size-4" />
                    {opt.label}
                  </button>
                ))}
              </div>

              {schedMode === "schedule" && (
                <div className="mt-3 grid grid-cols-2 gap-3">
                  <div>
                    <Label className="text-xs text-muted-foreground">Date</Label>
                    <Input
                      type="date"
                      min={localToday()}
                      value={schedDate}
                      onChange={(e) => {
                        const v = e.target.value;
                        // Mobile pickers don't always enforce `min`; reject past dates here.
                        if (v && v < localToday()) {
                          toast.error("Please choose today or a later date.");
                          return;
                        }
                        setSchedDate(v);
                      }}
                      className="bg-background"
                    />
                  </div>
                  <div>
                    <Label className="text-xs text-muted-foreground">Time</Label>
                    <Select
                      value={schedTime}
                      onValueChange={setSchedTime}
                      disabled={!schedDate || availableSlots.length === 0}
                    >
                      <SelectTrigger className="bg-background">
                        <SelectValue placeholder="Pick a time" />
                      </SelectTrigger>
                      <SelectContent className="max-h-60">
                        {availableSlots.map((t) => (
                          <SelectItem key={t} value={t}>
                            {timeLabel(t)}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  {isToday && availableSlots.length === 0 ? (
                    <p className="col-span-2 text-xs text-destructive">
                      No more delivery slots today — please choose another date.
                    </p>
                  ) : (
                    (!schedDate || !schedTime) && (
                      <p className="col-span-2 text-xs text-muted-foreground">
                        Pick a date and time, or switch back to “As soon as possible.”
                      </p>
                    )
                  )}
                </div>
              )}
            </div>
          </div>
        </section>

        <section className="space-y-4 bg-muted rounded-2xl p-6">
          <h2 className="font-display font-semibold text-lg">Payment Method</h2>
          <div className="grid sm:grid-cols-2 gap-3">
            {(
              [
                {
                  key: "cod",
                  label: "Cash on Delivery",
                  desc: "Pay with cash when your order arrives.",
                  icon: Banknote,
                },
                {
                  key: "khqr",
                  label: "KHQR",
                  desc: "Scan & pay now with any bank app.",
                  icon: QrCode,
                },
              ] as const
            ).map((opt) => (
              <button
                key={opt.key}
                type="button"
                onClick={() => setPayment(opt.key)}
                className={cn(
                  "flex items-start gap-3 rounded-xl border px-4 py-3 text-left transition-colors",
                  payment === opt.key
                    ? "border-brand bg-brand/10"
                    : "border-border hover:bg-background",
                )}
              >
                <opt.icon
                  className={cn("size-5 mt-0.5 shrink-0", payment === opt.key && "text-brand")}
                />
                <span>
                  <span className="block text-sm font-medium">{opt.label}</span>
                  <span className="block text-xs text-muted-foreground mt-0.5">{opt.desc}</span>
                </span>
              </button>
            ))}
          </div>
        </section>

        <Button type="submit" disabled={submitting} size="lg" className="w-full rounded-full">
          {submitting
            ? "Placing order..."
            : payment === "khqr"
              ? `Continue to payment — $${total.toFixed(2)}`
              : `Place order — $${total.toFixed(2)}`}
        </Button>
      </form>

      <aside className="bg-muted rounded-2xl p-6 h-fit sticky top-28 space-y-4">
        <h2 className="font-display font-semibold text-lg">Order Summary</h2>
        <div className="space-y-3 max-h-80 overflow-y-auto">
          {items.map((item) => {
            const key = itemKey(item);
            const unit = itemUnitPrice(item);
            return (
              <div key={key} className="flex items-center gap-2 text-sm">
                <div className="flex-1 min-w-0">
                  <p className="truncate font-medium">
                    {item.product.title}
                    {item.variation ? ` (${item.variation.weight})` : ""}
                  </p>
                  <p className="text-xs text-muted-foreground mt-0.5">${unit.toFixed(2)} each</p>
                </div>
                <div className="flex items-center gap-1 border rounded-full shrink-0">
                  <button
                    type="button"
                    onClick={() => setQty(key, item.qty - 1)}
                    className="size-7 grid place-items-center hover:bg-background rounded-full"
                  >
                    <Minus className="size-3" />
                  </button>
                  <span className="text-xs font-semibold w-5 text-center">{item.qty}</span>
                  <button
                    type="button"
                    onClick={() => setQty(key, item.qty + 1)}
                    className="size-7 grid place-items-center hover:bg-background rounded-full"
                  >
                    <Plus className="size-3" />
                  </button>
                </div>
                <span className="font-bold w-16 text-right shrink-0">
                  ${(unit * item.qty).toFixed(2)}
                </span>
                <button
                  type="button"
                  onClick={() => remove(key)}
                  className="text-muted-foreground hover:text-destructive shrink-0"
                >
                  <Trash2 className="size-4" />
                </button>
              </div>
            );
          })}
        </div>
        <div className="border-t pt-4">
          {applied ? (
            <div className="flex items-center justify-between text-sm">
              <span className="inline-flex items-center gap-1.5 font-medium text-brand">
                <Tag className="size-4" /> {applied.code}
              </span>
              <button
                type="button"
                onClick={() => {
                  setApplied(null);
                  setCode("");
                }}
                className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-destructive"
              >
                <X className="size-3.5" /> Remove
              </button>
            </div>
          ) : (
            <div className="flex gap-2">
              <Input
                value={code}
                onChange={(e) => setCode(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    applyCode();
                  }
                }}
                placeholder="Promo code"
                className="flex-1 min-w-0 uppercase"
              />
              <Button
                type="button"
                variant="outline"
                onClick={applyCode}
                disabled={checking || !code.trim()}
                className="shrink-0"
              >
                {checking ? "…" : "Apply"}
              </Button>
            </div>
          )}
        </div>
        <div className="border-t pt-4 space-y-2 text-sm">
          <div className="flex justify-between">
            <span>Subtotal</span>
            <span>${subtotal.toFixed(2)}</span>
          </div>
          {discount > 0 && (
            <div className="flex justify-between text-brand">
              <span>Discount{applied ? ` (${applied.code})` : ""}</span>
              <span>−${discount.toFixed(2)}</span>
            </div>
          )}
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
