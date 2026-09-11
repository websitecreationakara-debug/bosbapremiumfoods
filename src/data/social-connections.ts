import { createServerFn } from "@tanstack/react-start";
import { eq } from "drizzle-orm";
import { getDb } from "@/db";
import { social_connections } from "@/db/schema";
import { requireAdmin } from "./_auth";

export type SocialConnectionsInput = {
  fb_page_id: string | null;
  fb_page_access_token: string | null;
  ig_user_id: string | null;
  telegram_bot_token: string | null;
  telegram_channel_id: string | null;
  tiktok_access_token: string | null;
  tiktok_privacy: string;
};

// Admin-only: these are live API credentials, not general store config.
export const getSocialConnections = createServerFn({ method: "GET" }).handler(async () => {
  await requireAdmin();
  const [row] = await getDb()
    .select()
    .from(social_connections)
    .where(eq(social_connections.id, "default"));
  return row ?? null;
});

export const saveSocialConnections = createServerFn({ method: "POST" })
  .inputValidator((d: SocialConnectionsInput) => d)
  .handler(async ({ data }) => {
    await requireAdmin();
    const now = new Date().toISOString();
    await getDb()
      .insert(social_connections)
      .values({ id: "default", ...data, updated_at: now })
      .onConflictDoUpdate({
        target: social_connections.id,
        set: { ...data, updated_at: now },
      });
    return { ok: true };
  });
