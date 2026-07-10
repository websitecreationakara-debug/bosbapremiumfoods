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
    // Labels which site a Telegram/email alert came from, so one bot/inbox can
    // serve multiple stores. Defaults to the BOSBA name — see src/lib/notify.ts.
    SITE_NAME?: string;
    // Comma-separated SHA-256 signing fingerprints for the Play Store TWA app,
    // served at /.well-known/assetlinks.json. From Play App Signing.
    ANDROID_CERT_SHA256?: string;
    // Google reCAPTCHA v3 server secret. When unset, the captcha plugin is not
    // registered (see src/lib/auth.ts). Pair with VITE_RECAPTCHA_SITE_KEY.
    RECAPTCHA_SECRET_KEY?: string;
  }
}

interface ImportMetaEnv {
  // Public reCAPTCHA v3 site key, inlined into the client bundle at build time.
  readonly VITE_RECAPTCHA_SITE_KEY?: string;
}
