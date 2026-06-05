import { betterAuth, type BetterAuthOptions } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { admin } from "better-auth/plugins";
import { tanstackStartCookies } from "better-auth/tanstack-start";
import { Resend } from "resend";
import { getDb, schema } from "@/db";

const env: Record<string, string | undefined> = (() => {
  if (typeof process !== "undefined" && typeof process.env !== "undefined") {
    return process.env as Record<string, string | undefined>;
  }
  if (
    typeof import.meta !== "undefined" &&
    typeof (import.meta as { env?: Record<string, string | undefined> }).env !== "undefined"
  ) {
    return (import.meta as { env?: Record<string, string | undefined> }).env!;
  }
  if (
    typeof globalThis !== "undefined" &&
    typeof (globalThis as { env?: Record<string, string | undefined> }).env !== "undefined"
  ) {
    return (globalThis as { env?: Record<string, string | undefined> }).env!;
  }
  return {} as Record<string, string | undefined>;
})();

let _auth: ReturnType<typeof betterAuth> | undefined;

export function getAuth() {
  if (_auth) return _auth;

  const resend = env.RESEND_API_KEY ? new Resend(env.RESEND_API_KEY) : null;
  const from = env.RESEND_FROM ?? "BOSBA Premium Foods <onboarding@resend.dev>";

  const sendMail = async (to: string, subject: string, url: string, intro: string) => {
    if (!resend) {
      // No key configured (e.g. local dev): surface the link instead of failing the request.
      console.log(`[auth-email] ${subject} -> ${to}\n${url}`);
      return;
    }
    try {
      await resend.emails.send({
        from,
        to,
        subject,
        html: `<p>${intro}</p><p><a href="${url}">${url}</a></p>`,
      });
    } catch (e) {
      console.error("[auth-email] send failed", e);
    }
  };

  const trustedOrigins = (env.BETTER_AUTH_TRUSTED_ORIGINS ?? "")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);

  _auth = betterAuth<BetterAuthOptions>({
    baseURL: env.BETTER_AUTH_URL,
    secret: env.BETTER_AUTH_SECRET,
    trustedOrigins,
    database: drizzleAdapter(getDb(), { provider: "sqlite", schema }),
    emailAndPassword: {
      enabled: true,
      // Don't block sign-in on verification (avoids lockout); we still send the email.
      requireEmailVerification: false,
      sendResetPassword: async ({ user, url }) => {
        await sendMail(user.email, "Reset your BOSBA password", url, "Reset your password:");
      },
    },
    emailVerification: {
      sendOnSignUp: true,
      sendVerificationEmail: async ({ user, url }) => {
        await sendMail(user.email, "Verify your BOSBA email", url, "Welcome! Verify your email:");
      },
    },
    socialProviders:
      env.GOOGLE_CLIENT_ID && env.GOOGLE_CLIENT_SECRET
        ? {
            google: {
              clientId: env.GOOGLE_CLIENT_ID,
              clientSecret: env.GOOGLE_CLIENT_SECRET,
            },
          }
        : undefined,
    plugins: [admin(), tanstackStartCookies()],
  });

  return _auth;
}
