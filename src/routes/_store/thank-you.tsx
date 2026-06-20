import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";

type LastOrder = {
  id: string;
  total: number;
  items: { id: string; title: string; qty: number; price: number }[];
  customer_name: string;
};

export const Route = createFileRoute("/_store/thank-you")({ component: ThankYou });

function ThankYou() {
  const [order, setOrder] = useState<LastOrder | null>(null);

  useEffect(() => {
    try {
      const raw = sessionStorage.getItem("bosba:last-order");
      if (raw) setOrder(JSON.parse(raw) as LastOrder);
    } catch {
      // ignore — show the generic thank-you below
    }
  }, []);

  return (
    <div className="mx-auto max-w-2xl px-6 py-16 text-center">
      <CheckCircle2 className="mx-auto h-16 w-16 text-primary" />
      <h1 className="mt-6 font-display font-bold text-3xl">
        Thank you{order?.customer_name ? `, ${order.customer_name}` : ""}!
      </h1>
      <p className="mt-3 text-muted-foreground">
        Your order has been placed. We&rsquo;ll send a confirmation to your email shortly.
      </p>

      {order && (
        <div className="mt-8 bg-card border rounded-2xl p-6 text-left space-y-4">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Order reference</span>
            <span className="font-mono">#{order.id.slice(0, 8).toUpperCase()}</span>
          </div>
          <div className="border-t pt-4 space-y-2">
            {order.items.map((it, i) => (
              <div key={it.id ?? i} className="flex justify-between text-sm">
                <span className="truncate pr-2">
                  <span className="font-medium">{it.title}</span>
                  <span className="text-muted-foreground"> × {it.qty}</span>
                </span>
                <span className="font-bold">${(it.price * it.qty).toFixed(2)}</span>
              </div>
            ))}
          </div>
          <div className="border-t pt-4 flex justify-between font-display font-bold text-lg">
            <span>Total</span>
            <span>${Number(order.total).toFixed(2)}</span>
          </div>
        </div>
      )}

      <Button asChild size="lg" className="mt-8 rounded-full">
        <Link to="/shop">Continue shopping</Link>
      </Button>
    </div>
  );
}
