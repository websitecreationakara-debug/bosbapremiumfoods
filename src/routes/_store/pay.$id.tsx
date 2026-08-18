import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { QRCodeSVG } from "qrcode.react";
import { startPayment, checkPayment, mockPay } from "@/data/payments";
import { Button } from "@/components/ui/button";
import { Loader2, ShieldCheck, CheckCircle2, Smartphone, AlertTriangle } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/_store/pay/$id")({
  component: PayScreen,
});

type Charge = {
  status: "unpaid" | "paid";
  amount: number;
  mock: boolean;
  qrString?: string;
  ref?: string;
  expiresAt?: string;
};

function PayScreen() {
  const { id } = Route.useParams();
  const navigate = useNavigate();
  const [charge, setCharge] = useState<Charge | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [paid, setPaid] = useState(false);
  const [confirming, setConfirming] = useState(false);
  const [secondsLeft, setSecondsLeft] = useState<number | null>(null);
  const [quotaExceeded, setQuotaExceeded] = useState(false);
  const [expired, setExpired] = useState(false);
  const [regenerating, setRegenerating] = useState(false);
  const goneToThankYou = useRef(false);

  const waiting = !!charge && charge.status === "unpaid";

  const finish = () => {
    if (goneToThankYou.current) return;
    goneToThankYou.current = true;
    setPaid(true);
    setTimeout(() => navigate({ to: "/thank-you" }), 1200);
  };

  const fetchCharge = () =>
    startPayment({ data: { orderId: id } }).then((r) => {
      if (r.status === "paid") {
        finish();
        return;
      }
      setExpired(false);
      setCharge(r as Charge);
    });

  // Create (or re-fetch the already-issued) charge and render its KHQR.
  useEffect(() => {
    let cancelled = false;
    fetchCharge().catch(
      (e) => !cancelled && setError(e instanceof Error ? e.message : "Couldn't start payment"),
    );
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  // Live countdown to the QR's expiration. Once it hits zero, the code just
  // goes dead — no silent auto-swap. A stale, abandoned /pay tab shouldn't
  // keep generating new codes and polling forever; the customer has to
  // explicitly ask for a new one (button below), same as this stops the
  // payment-confirmation polling below.
  useEffect(() => {
    if (!charge?.expiresAt || paid) {
      setSecondsLeft(null);
      return;
    }
    const expiresAtMs = new Date(charge.expiresAt).getTime();
    const tick = () => {
      const left = Math.max(0, Math.round((expiresAtMs - Date.now()) / 1000));
      setSecondsLeft(left);
      if (left === 0) setExpired(true);
    };
    tick();
    const t = setInterval(tick, 1000);
    return () => clearInterval(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [charge?.expiresAt, paid]);

  const regenerate = async () => {
    setRegenerating(true);
    try {
      await fetchCharge();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Couldn't generate a new code");
    } finally {
      setRegenerating(false);
    }
  };

  // Poll for confirmation while waiting. In real mode checkPayment asks Bakong
  // (check_transaction_by_md5); in mock mode the "I've paid" button drives it.
  // Stops once the code expires — an expired, un-scannable QR can't have been
  // paid against, and there's no point spending further quota checking it.
  useEffect(() => {
    if (!waiting || paid || expired) return;
    let stop = false;
    const tick = async () => {
      try {
        const r = await checkPayment({ data: { orderId: id } });
        if (r.status === "paid" && !stop) finish();
      } catch (e) {
        // A quota-exhausted Bakong account can't confirm payment at all —
        // surface that plainly instead of spinning "Waiting for payment…"
        // forever, and stop burning further requests against it.
        if (e instanceof Error && e.message.includes("quota exceeded") && !stop) {
          setQuotaExceeded(true);
          clearInterval(t);
        }
        // otherwise transient — keep polling
      }
    };
    tick();
    // Bakong's personal-account Open API caps at 100 requests/day — at the
    // old 3s interval, a single order's 3-minute wait alone burned ~60 of
    // them. 10s keeps one checkout under 20 requests, leaving room for
    // several orders/day instead of one.
    const t = setInterval(tick, 10000);
    return () => {
      stop = true;
      clearInterval(t);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [waiting, paid, expired, id]);

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
        <p className="mt-4 text-sm text-muted-foreground">Preparing your payment…</p>
      </div>
    );
  }

  const mm = secondsLeft != null ? Math.floor(secondsLeft / 60) : null;
  const ss = secondsLeft != null ? secondsLeft % 60 : null;

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
          <div className="relative rounded-2xl bg-white p-4">
            <QRCodeSVG
              value={charge.qrString ?? ""}
              size={208}
              marginSize={1}
              className={expired ? "opacity-20" : undefined}
            />
            {expired && (
              <div className="absolute inset-0 grid place-items-center">
                <span className="rounded-full bg-foreground px-4 py-1.5 text-xs font-bold uppercase tracking-wide text-background">
                  Expired
                </span>
              </div>
            )}
          </div>
        </div>
        <div className="mt-5 font-display font-bold text-3xl">${charge.amount.toFixed(2)}</div>
        <div className="mt-1 text-xs text-muted-foreground">
          Order #{id.slice(0, 8).toUpperCase()}
        </div>
        {secondsLeft != null && !expired && (
          <div className="mt-3 text-xs text-muted-foreground">
            Expires in {mm}:{String(ss).padStart(2, "0")}
          </div>
        )}
      </div>

      {expired ? (
        <div className="mt-6 rounded-2xl border border-dashed border-border bg-muted p-5 text-left">
          <p className="text-sm font-semibold">This code has expired</p>
          <p className="mt-1 text-xs text-muted-foreground">
            It&rsquo;s no longer scannable. Generate a new one to continue paying.
          </p>
          <Button
            onClick={regenerate}
            disabled={regenerating}
            className="mt-3 w-full rounded-full"
          >
            {regenerating ? "Generating…" : "Generate new code"}
          </Button>
        </div>
      ) : quotaExceeded ? (
        <div className="mt-6 rounded-2xl border border-dashed border-destructive/60 bg-destructive/10 p-5 text-left">
          <p className="flex items-center gap-2 text-sm font-semibold text-destructive">
            <AlertTriangle className="size-4" /> Can&rsquo;t confirm payment right now
          </p>
          <p className="mt-1 text-xs text-muted-foreground">
            The payment gateway has hit its daily limit for checking transactions. If you&rsquo;ve
            already paid, your order is still reserved — contact us and we&rsquo;ll confirm it
            manually, or check back once the limit resets.
          </p>
        </div>
      ) : (
        <div className="mt-6 flex items-center justify-center gap-2 text-sm text-muted-foreground">
          <Loader2 className="size-4 animate-spin" />
          Waiting for payment…
        </div>
      )}

      {charge.mock && (
        <div className="mt-8 rounded-2xl border border-dashed border-warning/60 bg-warning/10 p-5 text-left">
          <p className="flex items-center gap-2 text-sm font-semibold">
            <Smartphone className="size-4" /> Test mode
          </p>
          <p className="mt-1 text-xs text-muted-foreground">
            The Bakong gateway isn&rsquo;t connected yet, so this QR isn&rsquo;t chargeable. Use
            the button below to simulate a successful payment.
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
