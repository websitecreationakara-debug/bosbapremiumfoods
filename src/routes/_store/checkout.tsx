import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useCart } from "@/hooks/use-cart";
import { useAuth } from "@/hooks/use-auth";
import { useStoreSettings } from "@/hooks/use-products";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export const Route = createFileRoute("/_store/checkout")({
  component: Checkout,
});

function Checkout() {
  const { items, subtotal, clear } = useCart();
  const { user } = useAuth();
  const { data: settings } = useStoreSettings();
  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState(false);

  const threshold = Number(settings?.free_shipping_threshold ?? 30);
  const shipping = subtotal >= threshold || subtotal === 0 ? 0 : 4.99;
  const total = subtotal + shipping;

  const placeOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      navigate({ to: "/auth" });
      return;
    }
    if (items.length === 0) return;
    setSubmitting(true);
    const { error } = await supabase.from("orders").insert({
      user_id: user.id,
      total,
      status: "pending",
      items: items.map((i) => ({ id: i.product.id, title: i.product.title, qty: i.qty, price: i.product.sale_price ?? i.product.price })),
    });
    setSubmitting(false);
    if (error) {
      toast.error(error.message);
      return;
    }
    toast.success("Order placed! Thanks for shopping.");
    clear();
    navigate({ to: "/" });
  };

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-3xl px-6 py-20 text-center">
        <h1 className="font-display font-bold text-3xl">Your cart is empty</h1>
        <Button asChild className="mt-6 rounded-full"><Link to="/shop">Continue shopping</Link></Button>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl px-6 py-12 grid lg:grid-cols-[1fr_400px] gap-10">
      <form onSubmit={placeOrder} className="space-y-6">
        <h1 className="font-display font-bold text-3xl">Checkout</h1>

        <section className="space-y-4 bg-card border rounded-2xl p-6">
          <h2 className="font-display font-bold text-lg">Delivery Details</h2>
          <div className="grid sm:grid-cols-2 gap-4">
            <div><Label>Full name</Label><Input required defaultValue={user?.user_metadata?.full_name ?? ""} /></div>
            <div><Label>Email</Label><Input required type="email" defaultValue={user?.email ?? ""} /></div>
            <div className="sm:col-span-2"><Label>Address</Label><Input required placeholder="123 Garden Lane" /></div>
            <div><Label>City</Label><Input required /></div>
            <div><Label>Postal code</Label><Input required /></div>
          </div>
        </section>

        <section className="space-y-4 bg-card border rounded-2xl p-6">
          <h2 className="font-display font-bold text-lg">Payment</h2>
          <p className="text-sm text-muted-foreground">Demo checkout — no real payment is processed.</p>
        </section>

        <Button type="submit" disabled={submitting} size="lg" className="w-full rounded-full">
          {submitting ? "Placing order..." : `Place order — $${total.toFixed(2)}`}
        </Button>
      </form>

      <aside className="bg-card border rounded-2xl p-6 h-fit sticky top-28 space-y-4">
        <h2 className="font-display font-bold text-lg">Order Summary</h2>
        <div className="space-y-2 max-h-72 overflow-y-auto">
          {items.map(({ product, qty }) => (
            <div key={product.id} className="flex justify-between text-sm">
              <span className="truncate pr-2">{product.title} × {qty}</span>
              <span className="font-bold">${((product.sale_price ?? product.price) * qty).toFixed(2)}</span>
            </div>
          ))}
        </div>
        <div className="border-t pt-4 space-y-2 text-sm">
          <div className="flex justify-between"><span>Subtotal</span><span>${subtotal.toFixed(2)}</span></div>
          <div className="flex justify-between"><span>Shipping</span><span>{shipping === 0 ? "Free" : `$${shipping.toFixed(2)}`}</span></div>
          <div className="flex justify-between font-display font-bold text-lg pt-2 border-t"><span>Total</span><span>${total.toFixed(2)}</span></div>
        </div>
      </aside>
    </div>
  );
}
