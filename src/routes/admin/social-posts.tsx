import { createFileRoute } from "@tanstack/react-router";
import { useRef, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
  listSocialPosts,
  createSocialPost,
  updateSocialPost,
  deleteSocialPost,
  publishSocialPostNow,
} from "@/data/social-posts";
import { listMedia, uploadMedia } from "@/data/media";
import { compressImage } from "@/lib/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Plus, Pencil, Trash2, Upload, ImageIcon, Loader2, X, Send } from "lucide-react";
import { toast } from "sonner";
import type { Media } from "@/lib/types";

export const Route = createFileRoute("/admin/social-posts")({ component: SocialPostsAdmin });

const ALL_PLATFORMS = ["facebook", "instagram", "telegram", "tiktok"] as const;

type SocialPost = Awaited<ReturnType<typeof listSocialPosts>>[number];

const emptyForm = {
  id: "",
  topic: "",
  brief: "",
  scheduled_at: "",
  platforms: [] as string[],
  image_urls: [] as string[],
};

// datetime-local <-> ISO UTC. The input works in the browser's local time.
function isoToLocalInput(iso: string): string {
  const d = new Date(iso);
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

function parseJsonArray(value: string | null): string[] {
  try {
    const parsed = JSON.parse(value ?? "[]");
    return Array.isArray(parsed) ? parsed.filter((v: unknown) => typeof v === "string") : [];
  } catch {
    return [];
  }
}

function PostImagesField({
  urls,
  onChange,
  mediaItems,
  onUploaded,
}: {
  urls: string[];
  onChange: (urls: string[]) => void;
  mediaItems: Media[];
  onUploaded: () => void;
}) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [picker, setPicker] = useState(false);

  const onUpload = async (file: File | undefined) => {
    if (!file) return;
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append("file", await compressImage(file));
      const { url } = await uploadMedia({ data: fd });
      onChange([...urls, url]);
      onUploaded();
      toast.success("Image uploaded");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setUploading(false);
      if (fileRef.current) fileRef.current.value = "";
    }
  };

  return (
    <div className="space-y-2">
      <Label>Photos</Label>
      <p className="text-xs text-muted-foreground -mt-1">
        Instagram and TikTok are skipped when a post has no photo.
      </p>
      {urls.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {urls.map((url, i) => (
            <div key={`${url}-${i}`} className="size-16 rounded-lg border overflow-hidden relative">
              <img src={url} alt="" className="w-full h-full object-cover" />
              <button
                type="button"
                onClick={() => onChange(urls.filter((_, j) => j !== i))}
                className="absolute top-0.5 right-0.5 bg-background/80 rounded-full p-0.5"
                aria-label="Remove image"
              >
                <X className="size-3.5" />
              </button>
            </div>
          ))}
        </div>
      )}
      <div className="flex gap-2">
        <Button
          type="button"
          variant="outline"
          size="sm"
          disabled={uploading}
          onClick={() => fileRef.current?.click()}
        >
          {uploading ? (
            <Loader2 className="size-4 mr-1.5 animate-spin" />
          ) : (
            <Upload className="size-4 mr-1.5" />
          )}
          Upload
        </Button>
        <Button type="button" variant="outline" size="sm" onClick={() => setPicker((v) => !v)}>
          <ImageIcon className="size-4 mr-1.5" /> Media library
        </Button>
      </div>
      <input
        ref={fileRef}
        type="file"
        accept="image/*"
        hidden
        onChange={(e) => onUpload(e.target.files?.[0])}
      />
      {picker && (
        <div className="border rounded-lg p-2 max-h-44 overflow-y-auto">
          {mediaItems.length === 0 ? (
            <p className="text-xs text-muted-foreground p-2">
              No media yet — upload an image first.
            </p>
          ) : (
            <div className="grid grid-cols-5 gap-2">
              {mediaItems.map((m) => (
                <button
                  key={m.id}
                  type="button"
                  onClick={() => onChange([...urls, m.url])}
                  className="aspect-square rounded-md overflow-hidden border hover:ring-2 ring-brand"
                >
                  <img src={m.url} alt={m.filename} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const styles =
    status === "published"
      ? "bg-success/20 text-success"
      : status === "failed"
        ? "bg-destructive/20 text-destructive"
        : "bg-muted text-muted-foreground";
  return (
    <span className={`px-2 py-0.5 rounded text-xs font-bold uppercase ${styles}`}>{status}</span>
  );
}

function SocialPostsAdmin() {
  const qc = useQueryClient();
  const { data: posts = [] } = useQuery({
    queryKey: ["social_posts"],
    queryFn: () => listSocialPosts(),
  });
  const { data: mediaItems = [] } = useQuery({
    queryKey: ["media"],
    queryFn: () => listMedia() as Promise<Media[]>,
  });

  const [open, setOpen] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [publishing, setPublishing] = useState<string | null>(null);
  const editing = !!form.id;

  const refresh = () => qc.invalidateQueries({ queryKey: ["social_posts"] });

  const openNew = () => {
    // Default schedule: one hour from now, on the hour.
    const d = new Date(Date.now() + 60 * 60 * 1000);
    d.setMinutes(0, 0, 0);
    setForm({ ...emptyForm, scheduled_at: isoToLocalInput(d.toISOString()) });
    setOpen(true);
  };

  const openEdit = (p: SocialPost) => {
    setForm({
      id: p.id,
      topic: p.topic,
      brief: p.brief ?? "",
      scheduled_at: isoToLocalInput(p.scheduled_at),
      platforms: parseJsonArray(p.platforms),
      image_urls: parseJsonArray(p.image_urls),
    });
    setOpen(true);
  };

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      topic: form.topic,
      brief: form.brief || null,
      image_urls: form.image_urls,
      platforms: form.platforms,
      scheduled_at: new Date(form.scheduled_at).toISOString(),
    };
    try {
      if (editing) await updateSocialPost({ data: { id: form.id, ...payload } });
      else await createSocialPost({ data: payload });
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to save post");
      return;
    }
    toast.success(editing ? "Post updated" : "Post scheduled");
    refresh();
    setOpen(false);
  };

  const del = async (id: string) => {
    if (!confirm("Delete this post?")) return;
    try {
      await deleteSocialPost({ data: { id } });
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to delete");
      return;
    }
    toast.success("Deleted");
    refresh();
  };

  const postNow = async (p: SocialPost) => {
    if (!confirm(`Publish "${p.topic}" to social media right now?`)) return;
    setPublishing(p.id);
    try {
      const results = await publishSocialPostNow({ data: { id: p.id } });
      const lines = Object.entries(results).map(
        ([platform, r]) => `${r.ok ? "✅" : "❌"} ${platform}`,
      );
      const anyFail = Object.values(results).some((r) => !r.ok);
      (anyFail ? toast.warning : toast.success)(lines.join("  "), { duration: 8000 });
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Publish failed");
    } finally {
      setPublishing(null);
      refresh();
    }
  };

  const togglePlatform = (name: string, checked: boolean) =>
    setForm((f) => ({
      ...f,
      platforms: checked ? [...f.platforms, name] : f.platforms.filter((p) => p !== name),
    }));

  return (
    <div className="space-y-6 max-w-5xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display font-bold text-3xl">Social Posts</h1>
          <p className="text-muted-foreground mt-1">
            Scheduled posts publish automatically every hour — Claude writes the captions from your
            brief.
          </p>
        </div>
        <Button onClick={openNew} className="rounded-full">
          <Plus className="size-4 mr-1.5" /> New Post
        </Button>
      </div>

      <div className="bg-card border rounded-2xl divide-y">
        {posts.map((p) => {
          const images = parseJsonArray(p.image_urls);
          const platforms = parseJsonArray(p.platforms);
          const results = p.results
            ? (JSON.parse(p.results) as Record<string, { ok: boolean; detail: string }>)
            : null;
          return (
            <div key={p.id} className="px-5 py-3 space-y-1.5">
              <div className="flex items-center gap-4">
                <div className="size-14 rounded-lg bg-muted overflow-hidden shrink-0">
                  {images[0] ? (
                    <img src={images[0]} alt="" className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full grid place-items-center text-muted-foreground">
                      <ImageIcon className="size-5" />
                    </div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium truncate">{p.topic}</p>
                  <p className="text-xs text-muted-foreground">
                    {new Date(p.scheduled_at).toLocaleString()} ·{" "}
                    {platforms.length > 0 ? platforms.join(", ") : "all configured platforms"}
                  </p>
                </div>
                <StatusBadge status={p.status} />
                <div className="flex gap-1">
                  {p.status !== "published" && (
                    <Button
                      variant="ghost"
                      size="icon"
                      title="Post now"
                      disabled={publishing === p.id}
                      onClick={() => postNow(p)}
                    >
                      {publishing === p.id ? (
                        <Loader2 className="size-4 animate-spin" />
                      ) : (
                        <Send className="size-4" />
                      )}
                    </Button>
                  )}
                  {p.status !== "published" && (
                    <Button variant="ghost" size="icon" title="Edit" onClick={() => openEdit(p)}>
                      <Pencil className="size-4" />
                    </Button>
                  )}
                  <Button variant="ghost" size="icon" title="Delete" onClick={() => del(p.id)}>
                    <Trash2 className="size-4 text-destructive" />
                  </Button>
                </div>
              </div>
              {results && (
                <div className="text-xs text-muted-foreground pl-18 space-y-0.5">
                  {Object.entries(results).map(([platform, r]) =>
                    typeof r === "object" && r !== null && "ok" in r ? (
                      <p key={platform} className={r.ok ? "" : "text-destructive"}>
                        {r.ok ? "✅" : "❌"} {platform}: {r.detail}
                      </p>
                    ) : (
                      <p key={platform} className="text-destructive">
                        ❌ {String(r)}
                      </p>
                    ),
                  )}
                </div>
              )}
            </div>
          );
        })}
        {posts.length === 0 && (
          <p className="px-5 py-8 text-center text-muted-foreground text-sm">
            No posts yet — schedule your first one.
          </p>
        )}
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editing ? "Edit Post" : "New Post"}</DialogTitle>
          </DialogHeader>
          <form onSubmit={save} className="space-y-4">
            <div>
              <Label>Topic</Label>
              <Input
                value={form.topic}
                onChange={(e) => setForm({ ...form, topic: e.target.value })}
                placeholder="New arrival: Hokkaido scallops"
                required
              />
            </div>
            <div>
              <Label>Brief</Label>
              <p className="text-xs text-muted-foreground">
                Rough notes are fine — Claude writes the captions. Paste finished copy to use it
                as-is.
              </p>
              <Textarea
                value={form.brief}
                onChange={(e) => setForm({ ...form, brief: e.target.value })}
                placeholder="Fresh sashimi-grade scallops, limited stock, free delivery over $50..."
                rows={4}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Publish time</Label>
                <Input
                  type="datetime-local"
                  value={form.scheduled_at}
                  onChange={(e) => setForm({ ...form, scheduled_at: e.target.value })}
                  required
                />
              </div>
              <div>
                <Label>Platforms</Label>
                <p className="text-xs text-muted-foreground">None checked = all configured.</p>
                <div className="flex flex-wrap gap-x-4 gap-y-2 pt-1.5">
                  {ALL_PLATFORMS.map((name) => (
                    <label key={name} className="flex items-center gap-1.5 text-sm capitalize">
                      <Checkbox
                        checked={form.platforms.includes(name)}
                        onCheckedChange={(v) => togglePlatform(name, v === true)}
                      />
                      {name}
                    </label>
                  ))}
                </div>
              </div>
            </div>

            <PostImagesField
              urls={form.image_urls}
              onChange={(image_urls) => setForm((f) => ({ ...f, image_urls }))}
              mediaItems={mediaItems}
              onUploaded={() => qc.invalidateQueries({ queryKey: ["media"] })}
            />

            <Button type="submit" className="w-full">
              {editing ? "Save changes" : "Schedule post"}
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
