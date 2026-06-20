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
  }
}
