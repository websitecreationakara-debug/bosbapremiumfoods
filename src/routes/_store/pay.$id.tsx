import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { startPayment, claimPaid } from "@/data/payments";
import { Button } from "@/components/ui/button";
import { Loader2, ShieldCheck, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/_store/pay/$id")({ component: PayScreen });

type Charge = { status: string; amount: number; qrImageUrl: string | null };

function PayScreen() {
  const { id } = Route.useParams();
  const navigate = useNavigate();
  const [charge, setCharge] = useState<Charge | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [confirming, setConfirming] = useState(false);
  const [done, setDone] = useState(false);

  useEffect(() => {
    let cancelled = false;
    startPayment({ data: { orderId: id } })
      .then((r) => {
        if (cancelled) return;
        // Already claimed or verified (e.g. the customer reloaded) — the
        // thank-you page owns the "verifying → preparing" progression.
        if (r.status !== "unpaid") {
          navigate({ to: "/thank-you" });
          return;
        }
        setCharge(r);
      })
      .catch(
        (e) => !cancelled && setError(e instanceof Error ? e.message : "Couldn't load payment"),
      );
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const confirmPaid = async () => {
    setConfirming(true);
    try {
      await claimPaid({ data: { orderId: id } });
      setDone(true);
      setTimeout(() => navigate({ to: "/thank-you" }), 1200);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Something went wrong — please try again");
      setConfirming(false);
    }
  };

  if (error) {
    return (
      <div className="mx-auto max-w-md px-6 py-20 text-center">
        <h1 className="font-display font-semibold text-2xl">Payment unavailable</h1>
        <p className="mt-2 text-muted-foreground">{error}</p>
        <Button asChild variant="outline" className="mt-6 rounded-full">
          <Link to="/shop">Back to shop</Link>
        </Button>
      </div>
    );
  }

  if (done) {
    return (
      <div className="mx-auto max-w-md px-6 py-20 text-center">
        <CheckCircle2 className="mx-auto h-16 w-16 text-brand" />
        <h1 className="mt-6 font-display font-semibold text-2xl">Thank you!</h1>
        <p className="mt-2 text-muted-foreground">
          We&rsquo;re verifying your payment — taking you to your order…
        </p>
      </div>
    );
  }

  if (!charge) {
    return (
      <div className="mx-auto max-w-md px-6 py-32 text-center">
        <Loader2 className="mx-auto h-8 w-8 animate-spin text-muted-foreground" />
        <p className="mt-4 text-sm text-muted-foreground">Preparing your payment…</p>
      </div>
    );
  }

  // QR not configured in admin Settings — don't dead-end the order.
  if (!charge.qrImageUrl) {
    return (
      <div className="mx-auto max-w-md px-6 py-20 text-center">
        <h1 className="font-display font-semibold text-2xl">Online payment unavailable</h1>
        <p className="mt-2 text-muted-foreground">
          KHQR payment isn&rsquo;t set up right now. Your order is saved — please contact us to
          arrange payment, or order again with Cash on Delivery.
        </p>
        <Button asChild variant="outline" className="mt-6 rounded-full">
          <Link to="/shop">Back to shop</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-md px-6 py-12 text-center">
      <h1 className="font-display font-semibold tracking-tight text-2xl">Scan to pay</h1>
      <p className="mt-2 text-sm text-muted-foreground">
        Open your banking app, scan the KHQR below, and pay the exact amount shown.
      </p>

      <div className="mt-8 rounded-3xl bg-card border p-6 shadow-sm">
        <div className="flex items-center justify-center gap-2 text-xs font-bold uppercase tracking-widest text-brand">
          <span>KHQR</span>
        </div>
        <div className="mt-4 flex justify-center">
          <div className="rounded-2xl bg-white p-4">
            <img
              src={charge.qrImageUrl}
              alt="KHQR payment code"
              className="size-52 object-contain"
            />
          </div>
        </div>
        <div className="mt-5 font-display font-bold text-3xl">${charge.amount.toFixed(2)}</div>
        <div className="mt-1 text-xs text-muted-foreground">
          Order #{id.slice(0, 8).toUpperCase()}
        </div>
      </div>

      <ol className="mt-6 space-y-1.5 text-left text-sm text-muted-foreground list-decimal list-inside">
        <li>Open any banking app and scan the QR code.</li>
        <li>
          Enter the exact amount:{" "}
          <span className="font-bold text-foreground">${charge.amount.toFixed(2)}</span>
        </li>
        <li>Complete the payment, then tap the button below.</li>
      </ol>

      <Button
        onClick={confirmPaid}
        disabled={confirming}
        size="lg"
        className="mt-6 w-full rounded-full"
      >
        {confirming ? "Confirming…" : `I have paid $${charge.amount.toFixed(2)}`}
      </Button>

      <p className="mt-6 flex items-center justify-center gap-1.5 text-xs text-muted-foreground">
        <ShieldCheck className="size-3.5" /> Our team verifies every payment before preparing your
        order.
      </p>
    </div>
  );
}
