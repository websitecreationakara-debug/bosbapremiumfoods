import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { QRCodeSVG } from "qrcode.react";
import { startPayment, checkPayment, mockPay } from "@/data/payments";
import { Button } from "@/components/ui/button";
import { Loader2, ShieldCheck, CheckCircle2, Smartphone } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/_store/pay/$id")({ component: PayScreen });

type Charge = {
  status: "unpaid" | "paid";
  amount: number;
  mock: boolean;
  qrString?: string;
  ref?: string;
};

function PayScreen() {
  const { id } = Route.useParams();
  const navigate = useNavigate();
  const [charge, setCharge] = useState<Charge | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [paid, setPaid] = useState(false);
  const [confirming, setConfirming] = useState(false);
  const goneToThankYou = useRef(false);

  const finish = () => {
    if (goneToThankYou.current) return;
    goneToThankYou.current = true;
    setPaid(true);
    setTimeout(() => navigate({ to: "/thank-you" }), 1200);
  };

  // Create the KHQR charge once on mount.
  useEffect(() => {
    let cancelled = false;
    startPayment({ data: { orderId: id } })
      .then((r) => {
        if (cancelled) return;
        setCharge(r as Charge);
        if (r.status === "paid") finish();
      })
      .catch((e) => !cancelled && setError(e instanceof Error ? e.message : "Couldn't start payment"));
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  // Poll for confirmation while unpaid — this is what the real gateway webhook
  // will trip; in mock mode the "I've paid" button does it instead.
  useEffect(() => {
    if (!charge || charge.status === "paid" || paid) return;
    const t = setInterval(async () => {
      try {
        const r = await checkPayment({ data: { orderId: id } });
        if (r.status === "paid") {
          clearInterval(t);
          finish();
        }
      } catch {
        // transient — keep polling
      }
    }, 3000);
    return () => clearInterval(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [charge, paid, id]);

  const simulate = async () => {
    setConfirming(true);
    try {
      await mockPay({ data: { orderId: id } });
      finish();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Payment failed");
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

  if (paid) {
    return (
      <div className="mx-auto max-w-md px-6 py-20 text-center">
        <CheckCircle2 className="mx-auto h-16 w-16 text-brand" />
        <h1 className="mt-6 font-display font-semibold text-2xl">Payment received!</h1>
        <p className="mt-2 text-muted-foreground">Taking you to your order…</p>
      </div>
    );
  }

  if (!charge) {
    return (
      <div className="mx-auto max-w-md px-6 py-32 text-center">
        <Loader2 className="mx-auto h-8 w-8 animate-spin text-muted-foreground" />
        <p className="mt-4 text-sm text-muted-foreground">Preparing your KHQR…</p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-md px-6 py-12 text-center">
      <h1 className="font-display font-semibold tracking-tight text-2xl">Scan to pay</h1>
      <p className="mt-2 text-sm text-muted-foreground">
        Open any banking app, scan the KHQR below, and confirm the payment.
      </p>

      <div className="mt-8 rounded-3xl bg-card border p-6 shadow-sm">
        <div className="flex items-center justify-center gap-2 text-xs font-bold uppercase tracking-widest text-brand">
          <span>KHQR</span>
        </div>
        <div className="mt-4 flex justify-center">
          <div className="rounded-2xl bg-white p-4">
            <QRCodeSVG value={charge.qrString ?? ""} size={208} marginSize={1} />
          </div>
        </div>
        <div className="mt-5 font-display font-bold text-3xl">${charge.amount.toFixed(2)}</div>
        <div className="mt-1 text-xs text-muted-foreground">
          Order #{id.slice(0, 8).toUpperCase()}
        </div>
      </div>

      <div className="mt-6 flex items-center justify-center gap-2 text-sm text-muted-foreground">
        <Loader2 className="size-4 animate-spin" />
        Waiting for payment…
      </div>

      {charge.mock && (
        <div className="mt-8 rounded-2xl border border-dashed border-warning/60 bg-warning/10 p-5 text-left">
          <p className="flex items-center gap-2 text-sm font-semibold">
            <Smartphone className="size-4" /> Test mode
          </p>
          <p className="mt-1 text-xs text-muted-foreground">
            The real PPCBank gateway isn&rsquo;t connected yet, so this QR isn&rsquo;t chargeable.
            Use the button below to simulate a successful payment.
          </p>
          <Button onClick={simulate} disabled={confirming} className="mt-3 w-full rounded-full">
            {confirming ? "Confirming…" : "Simulate successful payment"}
          </Button>
        </div>
      )}

      <p className="mt-8 flex items-center justify-center gap-1.5 text-xs text-muted-foreground">
        <ShieldCheck className="size-3.5" /> Your order is reserved until payment completes.
      </p>
    </div>
  );
}
