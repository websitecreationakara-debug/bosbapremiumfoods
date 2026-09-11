import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getSocialConnections, saveSocialConnections } from "@/data/social-connections";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CheckCircle2, Circle } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/admin/social-connections")({
  component: SocialConnectionsAdmin,
});

const empty = {
  fb_page_id: "",
  fb_page_access_token: "",
  ig_user_id: "",
  telegram_bot_token: "",
  telegram_channel_id: "",
  tiktok_access_token: "",
  tiktok_privacy: "SELF_ONLY",
};

function ConnectionStatus({ connected }: { connected: boolean }) {
  return connected ? (
    <span className="inline-flex items-center gap-1 text-xs font-medium text-success">
      <CheckCircle2 className="size-3.5" /> Connected
    </span>
  ) : (
    <span className="inline-flex items-center gap-1 text-xs font-medium text-muted-foreground">
      <Circle className="size-3.5" /> Not connected
    </span>
  );
}

function SocialConnectionsAdmin() {
  const qc = useQueryClient();
  const { data } = useQuery({
    queryKey: ["social_connections"],
    queryFn: () => getSocialConnections(),
  });
  const [form, setForm] = useState(empty);

  useEffect(() => {
    if (data)
      setForm({
        fb_page_id: data.fb_page_id ?? "",
        fb_page_access_token: data.fb_page_access_token ?? "",
        ig_user_id: data.ig_user_id ?? "",
        telegram_bot_token: data.telegram_bot_token ?? "",
        telegram_channel_id: data.telegram_channel_id ?? "",
        tiktok_access_token: data.tiktok_access_token ?? "",
        tiktok_privacy: data.tiktok_privacy ?? "SELF_ONLY",
      });
  }, [data]);

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await saveSocialConnections({
        data: {
          fb_page_id: form.fb_page_id.trim() || null,
          fb_page_access_token: form.fb_page_access_token.trim() || null,
          ig_user_id: form.ig_user_id.trim() || null,
          telegram_bot_token: form.telegram_bot_token.trim() || null,
          telegram_channel_id: form.telegram_channel_id.trim() || null,
          tiktok_access_token: form.tiktok_access_token.trim() || null,
          tiktok_privacy: form.tiktok_privacy,
        },
      });
    } catch (err) {
      return toast.error(err instanceof Error ? err.message : "Failed to save");
    }
    toast.success("Connections saved");
    qc.invalidateQueries({ queryKey: ["social_connections"] });
  };

  const fbConnected = !!(form.fb_page_id && form.fb_page_access_token);
  const igConnected = !!(form.ig_user_id && form.fb_page_access_token);
  const tgConnected = !!(form.telegram_bot_token && form.telegram_channel_id);
  const ttConnected = !!form.tiktok_access_token;

  return (
    <div className="max-w-2xl space-y-6">
      <div>
        <h1 className="font-display font-bold text-3xl">Social Connections</h1>
        <p className="text-muted-foreground mt-1">
          Connect each platform here yourself — once saved, Social Posts can publish to it. No
          developer needed.
        </p>
      </div>

      <form onSubmit={save} className="space-y-6">
        <section className="bg-card border rounded-2xl p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-display font-bold">Facebook &amp; Instagram</h2>
            <div className="flex gap-3">
              <ConnectionStatus connected={fbConnected} />
              <ConnectionStatus connected={igConnected} />
            </div>
          </div>
          <p className="text-xs text-muted-foreground">
            Create an app at{" "}
            <a
              href="https://developers.facebook.com/apps"
              target="_blank"
              rel="noreferrer"
              className="underline"
            >
              developers.facebook.com/apps
            </a>
            , generate a Page access token with the <code>pages_manage_posts</code>,{" "}
            <code>pages_read_engagement</code>, <code>instagram_basic</code>, and{" "}
            <code>instagram_content_publish</code> permissions. The same token is used for both
            platforms below.
          </p>
          <div>
            <Label>Facebook Page ID</Label>
            <Input
              value={form.fb_page_id}
              onChange={(e) => setForm({ ...form, fb_page_id: e.target.value })}
              placeholder="e.g. 123456789012345"
            />
          </div>
          <div>
            <Label>Facebook Page Access Token</Label>
            <Input
              type="password"
              value={form.fb_page_access_token}
              onChange={(e) => setForm({ ...form, fb_page_access_token: e.target.value })}
              placeholder="EAAG..."
            />
          </div>
          <div>
            <Label>Instagram Business Account ID</Label>
            <p className="text-xs text-muted-foreground -mt-1">
              The Instagram account must be a Business/Creator account linked to the Facebook Page
              above. Find it by opening{" "}
              <code className="break-all">
                graph.facebook.com/&#123;page-id&#125;?fields=instagram_business_account&amp;access_token=&#123;token&#125;
              </code>{" "}
              in a browser.
            </p>
            <Input
              value={form.ig_user_id}
              onChange={(e) => setForm({ ...form, ig_user_id: e.target.value })}
              placeholder="e.g. 17841400000000000"
            />
          </div>
        </section>

        <section className="bg-card border rounded-2xl p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-display font-bold">Telegram</h2>
            <ConnectionStatus connected={tgConnected} />
          </div>
          <p className="text-xs text-muted-foreground">
            Message <code>@BotFather</code> on Telegram to create a bot and get its token, then add
            the bot as an admin of your channel.
          </p>
          <div>
            <Label>Bot Token</Label>
            <Input
              type="password"
              value={form.telegram_bot_token}
              onChange={(e) => setForm({ ...form, telegram_bot_token: e.target.value })}
              placeholder="123456:ABC-DEF..."
            />
          </div>
          <div>
            <Label>Channel ID</Label>
            <p className="text-xs text-muted-foreground -mt-1">
              Either <code>@yourchannelname</code> (if public) or the numeric ID (starts with{" "}
              <code>-100</code>).
            </p>
            <Input
              value={form.telegram_channel_id}
              onChange={(e) => setForm({ ...form, telegram_channel_id: e.target.value })}
              placeholder="@bosbapremiumfoods"
            />
          </div>
        </section>

        <section className="bg-card border rounded-2xl p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-display font-bold">TikTok</h2>
            <ConnectionStatus connected={ttConnected} />
          </div>
          <p className="text-xs text-muted-foreground">
            Requires a TikTok developer app with the Content Posting API product, approved by
            TikTok. Until the app is approved, posts publish as private (only visible to you).
          </p>
          <div>
            <Label>Access Token</Label>
            <Input
              type="password"
              value={form.tiktok_access_token}
              onChange={(e) => setForm({ ...form, tiktok_access_token: e.target.value })}
              placeholder="act..."
            />
          </div>
          <div>
            <Label>Post visibility</Label>
            <Select
              value={form.tiktok_privacy}
              onValueChange={(v) => setForm({ ...form, tiktok_privacy: v })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="SELF_ONLY">Private (only me) — use until approved</SelectItem>
                <SelectItem value="PUBLIC_TO_EVERYONE">
                  Public — after TikTok approves the app
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
        </section>

        <Button type="submit" className="w-full">
          Save connections
        </Button>
      </form>
    </div>
  );
}
