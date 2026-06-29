import type { D1Database } from "@cloudflare/workers-types";

// Typed bindings/vars available on the Cloudflare Worker env (wrangler.jsonc + .env).
declare module "cloudflare:workers" {
  interface Env {
    DB: D1Database;
    BETTER_AUTH_SECRET: string;
    BETTER_AUTH_URL?: string;
    RESEND_API_KEY: string;
    RESEND_FROM?: string;
    ADMIN_NOTIFY_EMAIL?: string;
    TELEGRAM_BOT_TOKEN?: string;
    TELEGRAM_CHAT_ID?: string;
    TELEGRAM_TOPIC_ID?: string;
    // KHQR payment gateway (PPCBank). Absent in mock mode — see src/lib/payment.ts.
    PPCBANK_BASE_URL?: string;
    PPCBANK_MERCHANT_ID?: string;
    PPCBANK_API_KEY?: string;
    // Comma-separated SHA-256 signing fingerprints for the Play Store TWA app,
    // served at /.well-known/assetlinks.json. From Play App Signing.
    ANDROID_CERT_SHA256?: string;
  }
}
