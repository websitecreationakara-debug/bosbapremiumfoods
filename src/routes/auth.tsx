import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { useAuth } from "@/hooks/use-auth";
import { toast } from "sonner";
import { ArrowLeft } from "lucide-react";

export const Route = createFileRoute("/auth")({
  component: AuthPage,
});

function AuthPage() {
  const { user, signIn, signUp, signInWithGoogle, verifyEmailOtp, resendOtp } = useAuth();
  const navigate = useNavigate();
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [step, setStep] = useState<"form" | "verify">("form");
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ email: "", password: "", fullName: "", agree: false });
  const [code, setCode] = useState("");
  const [pendingEmail, setPendingEmail] = useState("");

  useEffect(() => {
    if (user) navigate({ to: "/" });
  }, [user, navigate]);

  const passwordStrength = (() => {
    const p = form.password;
    let s = 0;
    if (p.length >= 8) s++;
    if (/[A-Z]/.test(p)) s++;
    if (/[0-9]/.test(p)) s++;
    if (/[^A-Za-z0-9]/.test(p)) s++;
    return s;
  })();

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    if (mode === "signin") {
      const { error } = await signIn(form.email, form.password);
      if (error) {
        // Unverified accounts can't sign in yet — better-auth re-sends a code; go verify.
        if (/verif/i.test(error)) {
          setPendingEmail(form.email);
          setStep("verify");
          toast.message("Verify your email — we sent a 6-digit code.");
        } else {
          toast.error(error);
        }
      } else toast.success("Welcome back!");
    } else {
      if (!form.agree) {
        toast.error("Please agree to the Terms & Privacy.");
        setLoading(false);
        return;
      }
      if (form.password.length < 8) {
        toast.error("Password must be at least 8 characters.");
        setLoading(false);
        return;
      }
      const { error } = await signUp(form.email, form.password, form.fullName);
      if (error) toast.error(error);
      else {
        setPendingEmail(form.email);
        setStep("verify");
        toast.success(`We sent a 6-digit code to ${form.email}.`);
      }
    }
    setLoading(false);
  };

  const verify = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await verifyEmailOtp(pendingEmail, code.trim());
    if (error) {
      toast.error(error);
      setLoading(false);
      return;
    }
    // verify-email confirms the address but doesn't create a session — sign in to land them in.
    const signInRes = await signIn(pendingEmail, form.password);
    if (signInRes.error) {
      toast.success("Email verified! Please sign in.");
      setStep("form");
      setMode("signin");
    } else {
      toast.success("Email verified!");
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen grid md:grid-cols-2 bg-background">
      <div className="hidden md:block relative overflow-hidden bg-brand">
        <img
          src="https://images.unsplash.com/photo-1488459716781-31db52582fe9?w=1200&q=80"
          alt=""
          className="absolute inset-0 w-full h-full object-cover opacity-70"
        />
        <div className="absolute inset-0 bg-gradient-to-tr from-brand to-transparent" />
        <div className="relative z-10 p-16 h-full flex flex-col">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-brand-foreground font-display font-bold text-2xl"
          >
            <div className="size-10 rounded-xl bg-accent text-accent-foreground grid place-items-center">
              B
            </div>
            BOSBA Premium Foods
          </Link>
          <div className="mt-auto">
            <h2 className="font-display font-bold text-5xl text-brand-foreground leading-tight">
              Fresh produce, <span className="italic text-accent">delivered.</span>
            </h2>
            <p className="text-brand-foreground/70 mt-4 max-w-sm">
              Join thousands of households getting weekly organic groceries from local farms.
            </p>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-center p-6 md:p-12">
        <div className="w-full max-w-md space-y-6">
          <Link
            to="/"
            className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="size-4" /> Back to shop
          </Link>

          {step === "verify" ? (
            <div className="space-y-6">
              <div>
                <h1 className="font-display font-bold text-3xl">Verify your email</h1>
                <p className="text-muted-foreground mt-2 text-sm">
                  Enter the 6-digit code we sent to{" "}
                  <span className="font-medium text-foreground">{pendingEmail}</span>.
                </p>
              </div>
              <form onSubmit={verify} className="space-y-4">
                <div>
                  <Label htmlFor="code">Verification code</Label>
                  <Input
                    id="code"
                    inputMode="numeric"
                    autoComplete="one-time-code"
                    maxLength={6}
                    required
                    value={code}
                    onChange={(e) => setCode(e.target.value.replace(/\D/g, ""))}
                    className="text-center text-2xl tracking-[0.5em] font-bold"
                  />
                </div>
                <Button
                  type="submit"
                  disabled={loading || code.length < 6}
                  size="lg"
                  className="w-full rounded-full font-bold"
                >
                  {loading ? "Verifying..." : "Verify email"}
                </Button>
              </form>
              <div className="flex items-center justify-between text-sm">
                <button
                  type="button"
                  onClick={async () => {
                    const { error } = await resendOtp(pendingEmail);
                    if (error) toast.error(error);
                    else toast.success("Code resent.");
                  }}
                  className="text-brand font-medium hover:underline"
                >
                  Resend code
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setStep("form");
                    setCode("");
                  }}
                  className="text-muted-foreground hover:text-foreground"
                >
                  Use a different email
                </button>
              </div>
            </div>
          ) : (
            <>
              <div>
            <h1 className="font-display font-bold text-3xl">
              {mode === "signin" ? "Sign in to your account" : "Create your account"}
            </h1>
            <p className="text-muted-foreground mt-2 text-sm">
              {mode === "signin"
                ? "Continue your fresh grocery journey."
                : "Start shopping in seconds."}
            </p>
          </div>

          <Button
            type="button"
            variant="outline"
            size="lg"
            disabled={loading}
            onClick={async () => {
              setLoading(true);
              const { error } = await signInWithGoogle();
              if (error) {
                toast.error(error);
                setLoading(false);
              }
              // On success the browser redirects to Google, so no need to reset loading.
            }}
            className="w-full rounded-full font-bold gap-2"
          >
            <svg className="size-5" viewBox="0 0 24 24" aria-hidden="true">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84A11 11 0 0 0 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.1a6.6 6.6 0 0 1 0-4.2V7.06H2.18a11 11 0 0 0 0 9.88l3.66-2.84z"
              />
              <path
                fill="#EA4335"
                d="M12 4.75c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 1.46 14.97.5 12 .5A11 11 0 0 0 2.18 7.06l3.66 2.84C6.71 7.3 9.14 5.37 12 5.37z"
              />
            </svg>
            Continue with Google
          </Button>

          <div className="flex items-center gap-3 text-xs text-muted-foreground">
            <div className="h-px flex-1 bg-border" />
            or
            <div className="h-px flex-1 bg-border" />
          </div>

          <form onSubmit={submit} className="space-y-4">
            {mode === "signup" && (
              <div>
                <Label htmlFor="name">Full name</Label>
                <Input
                  id="name"
                  required
                  value={form.fullName}
                  onChange={(e) => setForm((f) => ({ ...f, fullName: e.target.value }))}
                />
              </div>
            )}
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                required
                value={form.email}
                onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
              />
            </div>
            <div>
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                required
                value={form.password}
                onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))}
              />
              {mode === "signup" && form.password && (
                <div className="mt-2 flex gap-1">
                  {[0, 1, 2, 3].map((i) => (
                    <div
                      key={i}
                      className={`h-1 flex-1 rounded-full ${i < passwordStrength ? (passwordStrength <= 2 ? "bg-destructive" : passwordStrength === 3 ? "bg-warning" : "bg-success") : "bg-muted"}`}
                    />
                  ))}
                </div>
              )}
            </div>

            {mode === "signin" ? (
              <div className="flex items-center justify-between text-sm">
                <label className="flex items-center gap-2">
                  <Checkbox /> Remember me
                </label>
                <a href="#" className="text-brand font-medium hover:underline">
                  Forgot password?
                </a>
              </div>
            ) : (
              <label className="flex items-start gap-2 text-sm">
                <Checkbox
                  checked={form.agree}
                  onCheckedChange={(c) => setForm((f) => ({ ...f, agree: c === true }))}
                  className="mt-0.5"
                />
                <span className="text-muted-foreground">
                  I agree to the{" "}
                  <a href="#" className="text-brand underline">
                    Terms
                  </a>{" "}
                  and{" "}
                  <a href="#" className="text-brand underline">
                    Privacy Policy
                  </a>
                  .
                </span>
              </label>
            )}

            <Button
              type="submit"
              disabled={loading}
              size="lg"
              className="w-full rounded-full font-bold"
            >
              {loading ? "Please wait..." : mode === "signin" ? "Sign In" : "Create Account"}
            </Button>
          </form>

          <p className="text-sm text-center text-muted-foreground">
            {mode === "signin" ? (
              <>
                Don't have an account?{" "}
                <button
                  onClick={() => setMode("signup")}
                  className="text-brand font-bold hover:underline"
                >
                  Sign up
                </button>
              </>
            ) : (
              <>
                Already have one?{" "}
                <button
                  onClick={() => setMode("signin")}
                  className="text-brand font-bold hover:underline"
                >
                  Sign in
                </button>
              </>
            )}
          </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
