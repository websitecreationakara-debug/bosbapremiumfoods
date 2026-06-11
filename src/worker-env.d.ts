import type { D1Database, R2Bucket } from "@cloudflare/workers-types";

// Typed bindings/vars available on the Cloudflare Worker env (wrangler.jsonc + .env).
declare module "cloudflare:workers" {
  interface Env {
    DB: D1Database;
    MEDIA: R2Bucket;
    BETTER_AUTH_SECRET: string;
    BETTER_AUTH_URL?: string;
    RESEND_API_KEY: string;
    RESEND_FROM?: string;
  }
}
