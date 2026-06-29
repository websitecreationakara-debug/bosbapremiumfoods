import { useEffect, useRef, useState } from "react";
import { Download, X, Share } from "lucide-react";
import { Button } from "@/components/ui/button";

// The `beforeinstallprompt` event isn't in the standard DOM lib types.
type BeforeInstallPromptEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
};

const DISMISS_KEY = "bosba:install-dismissed";
// Re-offer after a while rather than never showing again.
const DISMISS_DAYS = 14;
// Small delay so the popup doesn't slam the customer the instant the page loads.
const SHOW_DELAY_MS = 1500;

const isStandalone = () =>
  window.matchMedia("(display-mode: standalone)").matches ||
  // iOS Safari exposes this non-standard flag instead of display-mode.
  (navigator as { standalone?: boolean }).standalone === true;

const recentlyDismissed = () => {
  const at = Number(localStorage.getItem(DISMISS_KEY) || 0);
  return Date.now() - at < DISMISS_DAYS * 86400000;
};

export function InstallPrompt() {
  const [deferred, setDeferred] = useState<BeforeInstallPromptEvent | null>(null);
  const [iosHint, setIosHint] = useState(false);
  const [visible, setVisible] = useState(false);
  const shownRef = useRef(false);

  useEffect(() => {
    if (isStandalone() || recentlyDismissed()) return;

    // Reveal the popup once (after a short delay), whichever signal arrives first.
    const reveal = () => {
      if (shownRef.current) return;
      shownRef.current = true;
      setTimeout(() => setVisible(true), SHOW_DELAY_MS);
    };

    const w = window as typeof window & { __bipEvent?: BeforeInstallPromptEvent | null };

    // The install event may have already fired before hydration — it's stashed
    // on window by the capture script in __root. Pick it up if it's there...
    const adopt = () => {
      if (w.__bipEvent) {
        setDeferred(w.__bipEvent);
        reveal();
      }
    };
    adopt();

    // ...and listen for it firing later (or being re-captured).
    window.addEventListener("bip-available", adopt);
    const onPrompt = (e: Event) => {
      e.preventDefault();
      setDeferred(e as BeforeInstallPromptEvent);
      reveal();
    };
    window.addEventListener("beforeinstallprompt", onPrompt);

    const onInstalled = () => {
      setVisible(false);
      setDeferred(null);
    };
    window.addEventListener("appinstalled", onInstalled);
    window.addEventListener("bip-installed", onInstalled);

    // iOS Safari never fires beforeinstallprompt — the only path is the manual
    // Share → Add to Home Screen, so we show a short instruction instead.
    const ua = navigator.userAgent;
    const isIos = /iphone|ipad|ipod/i.test(ua);
    const isSafari = /safari/i.test(ua) && !/crios|fxios|edgios/i.test(ua);
    if (isIos && isSafari) {
      setIosHint(true);
      reveal();
    }

    return () => {
      window.removeEventListener("bip-available", adopt);
      window.removeEventListener("beforeinstallprompt", onPrompt);
      window.removeEventListener("appinstalled", onInstalled);
      window.removeEventListener("bip-installed", onInstalled);
    };
  }, []);

  if (!visible) return null;

  const dismiss = () => {
    localStorage.setItem(DISMISS_KEY, String(Date.now()));
    setVisible(false);
  };

  const install = async () => {
    if (!deferred) return;
    await deferred.prompt();
    await deferred.userChoice;
    setDeferred(null);
    setVisible(false);
  };

  return (
    <div
      className="fixed inset-0 z-[60] grid place-items-center bg-black/50 p-4 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-label="Install the BOSBA Premium Foods app"
      onClick={dismiss}
    >
      <div
        className="relative w-full max-w-sm rounded-3xl border bg-card p-6 text-center shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={dismiss}
          aria-label="Close"
          className="absolute right-3 top-3 grid size-8 place-items-center rounded-full text-muted-foreground hover:bg-muted"
        >
          <X className="size-4" />
        </button>

        <img
          src="/icons/icon-192.png"
          alt="BOSBA Premium Foods"
          className="mx-auto size-20 rounded-2xl object-contain shadow-sm"
        />
        <h2 className="mt-4 font-display text-xl font-semibold tracking-tight">
          Install the BOSBA Premium Foods App
        </h2>

        {iosHint ? (
          <>
            <p className="mt-2 text-sm text-muted-foreground">
              Add us to your home screen for faster checkout and one-tap access.
            </p>
            <p className="mt-4 flex items-center justify-center gap-1.5 rounded-xl bg-muted px-3 py-2.5 text-sm font-medium">
              Tap <Share className="inline size-4" /> Share, then “Add to Home Screen”
            </p>
            <Button onClick={dismiss} variant="outline" className="mt-4 w-full rounded-full">
              Got it
            </Button>
          </>
        ) : (
          <>
            <p className="mt-2 text-sm text-muted-foreground">
              Get faster checkout and one-tap access, right from your home screen.
            </p>
            <Button onClick={install} className="mt-5 w-full rounded-full gap-2">
              <Download className="size-4" /> Install
            </Button>
            <button
              onClick={dismiss}
              className="mt-3 w-full text-sm text-muted-foreground hover:text-foreground"
            >
              Not now
            </button>
          </>
        )}
      </div>
    </div>
  );
}
