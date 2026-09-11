import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
  listSocialPosts,
  createSocialPost,
  updateSocialPost,
  deleteSocialPost,
  publishSocialPostNow,
} from "@/data/social-posts";
import { useProducts, useProductImages, useAllVariations } from "@/hooks/use-products";
import { groupVariations, priceRangeText } from "@/lib/variants";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Plus,
  Pencil,
  Trash2,
  ImageIcon,
  Loader2,
  Send,
  Check,
  ChevronsUpDown,
} from "lucide-react";
import { toast } from "sonner";
import type { Product, ProductVariation } from "@/lib/types";

export const Route = createFileRoute("/admin/social-posts")({ component: SocialPostsAdmin });

const ALL_PLATFORMS = ["facebook", "instagram", "telegram", "tiktok"] as const;

type SocialPost = Awaited<ReturnType<typeof listSocialPosts>>[number];

const emptyForm = {
  id: "",
  product_id: "",
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

function ProductPicker({
  products,
  variationsByProduct,
  selectedId,
  onSelect,
}: {
  products: Product[];
  variationsByProduct: Map<string, ProductVariation[]>;
  selectedId: string;
  onSelect: (product: Product) => void;
}) {
  const [open, setOpen] = useState(false);
  const selected = products.find((p) => p.id === selectedId);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          type="button"
          variant="outline"
          role="combobox"
          className="w-full justify-between font-normal"
        >
          {selected ? (
            <span className="flex items-center gap-2 min-w-0">
              <span className="size-6 rounded bg-muted overflow-hidden shrink-0">
                {selected.image_url && (
                  <img src={selected.image_url} alt="" className="w-full h-full object-cover" />
                )}
              </span>
              <span className="truncate">{selected.title}</span>
            </span>
          ) : (
            <span className="text-muted-foreground">Search products…</span>
          )}
          <ChevronsUpDown className="size-4 opacity-50 shrink-0" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[--radix-popover-trigger-width] p-0">
        <Command
          filter={(value, search) => (value.toLowerCase().includes(search.toLowerCase()) ? 1 : 0)}
        >
          <CommandInput placeholder="Search products by name…" />
          <CommandList>
            <CommandEmpty>No products found.</CommandEmpty>
            <CommandGroup>
              {products.map((p) => (
                <CommandItem
                  key={p.id}
                  value={p.title}
                  onSelect={() => {
                    onSelect(p);
                    setOpen(false);
                  }}
                >
                  <Check className={p.id === selectedId ? "opacity-100" : "opacity-0"} />
                  <span className="size-8 rounded bg-muted overflow-hidden shrink-0">
                    {p.image_url && (
                      <img src={p.image_url} alt="" className="w-full h-full object-cover" />
                    )}
                  </span>
                  <span className="flex-1 min-w-0">
                    <span className="block truncate">{p.title}</span>
                    <span className="block text-xs text-muted-foreground">
                      {priceRangeText(p, variationsByProduct.get(p.id) ?? [])}
                    </span>
                  </span>
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}

function ProductPhotoPicker({
  productId,
  mainImageUrl,
  selected,
  onChange,
}: {
  productId: string;
  mainImageUrl: string | null;
  selected: string[];
  onChange: (urls: string[]) => void;
}) {
  const { data: gallery = [], isLoading } = useProductImages(productId);
  const photos = useMemo(() => {
    const urls = [mainImageUrl, ...gallery.map((g) => g.url)].filter((u): u is string => !!u);
    return [...new Set(urls)];
  }, [mainImageUrl, gallery]);

  const toggle = (url: string) =>
    onChange(selected.includes(url) ? selected.filter((u) => u !== url) : [...selected, url]);

  if (isLoading) {
    return <Loader2 className="size-5 animate-spin text-muted-foreground" />;
  }
  if (photos.length === 0) {
    return <p className="text-sm text-muted-foreground">This product has no photos.</p>;
  }

  return (
    <div className="grid grid-cols-5 gap-2">
      {photos.map((url) => {
        const checked = selected.includes(url);
        return (
          <button
            key={url}
            type="button"
            onClick={() => toggle(url)}
            className={`relative aspect-square rounded-lg overflow-hidden border-2 ${
              checked ? "border-brand" : "border-transparent"
            }`}
          >
            <img src={url} alt="" className="w-full h-full object-cover" />
            <span
              className={`absolute top-1 right-1 size-5 rounded-full grid place-items-center ${
                checked ? "bg-brand text-brand-foreground" : "bg-background/70 text-transparent"
              }`}
            >
              <Check className="size-3.5" />
            </span>
          </button>
        );
      })}
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
  const { data: allProducts = [] } = useProducts({ all: true });
  const products = useMemo(
    () => allProducts.filter((p) => p.status === "published"),
    [allProducts],
  );
  const { data: allVariations = [] } = useAllVariations();
  const variationsByProduct = useMemo(() => groupVariations(allVariations), [allVariations]);

  const [open, setOpen] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [publishing, setPublishing] = useState<string | null>(null);
  const editing = !!form.id;

  const refresh = () => qc.invalidateQueries({ queryKey: ["social_posts"] });

  const openNew = () => {
    const d = new Date(Date.now() + 60 * 60 * 1000);
    d.setMinutes(0, 0, 0);
    setForm({ ...emptyForm, scheduled_at: isoToLocalInput(d.toISOString()) });
    setOpen(true);
  };

  const openEdit = (p: SocialPost) => {
    setForm({
      id: p.id,
      product_id: p.product_id ?? "",
      topic: p.topic,
      brief: p.brief ?? "",
      scheduled_at: isoToLocalInput(p.scheduled_at),
      platforms: parseJsonArray(p.platforms),
      image_urls: parseJsonArray(p.image_urls),
    });
    setOpen(true);
  };

  const selectProduct = (product: Product) =>
    setForm((f) => ({
      ...f,
      product_id: product.id,
      topic: product.title,
      // The post's actual copy — description, tabs, price — is built from the
      // live product at publish time, not typed or generated here. This field
      // is only for anything extra that isn't already on the product page.
      brief: "",
      // Re-picking a product resets the photo selection to its own photos.
      image_urls: [product.image_url].filter((u): u is string => !!u),
    }));

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      product_id: form.product_id,
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

  const selectedProduct = products.find((p) => p.id === form.product_id);

  return (
    <div className="space-y-6 max-w-5xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display font-bold text-3xl">Social Posts</h1>
          <p className="text-muted-foreground mt-1">
            Pick a product from the catalog — the post uses its real name, description, tabs, and
            price exactly as written, and publishes automatically every hour.
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
              <Label>Product</Label>
              <ProductPicker
                products={products}
                variationsByProduct={variationsByProduct}
                selectedId={form.product_id}
                onSelect={selectProduct}
              />
            </div>

            {form.product_id && (
              <>
                <div>
                  <Label>Extra note (optional)</Label>
                  <p className="text-xs text-muted-foreground">
                    The post uses the product's real name, description, tabs, and price exactly as
                    written on its product page — nothing is rewritten. Add a line here only for
                    something not already on that page, like a promo or a restock note.
                  </p>
                  <Textarea
                    value={form.brief}
                    onChange={(e) => setForm({ ...form, brief: e.target.value })}
                    placeholder="e.g. Restocked this week — limited quantity"
                    rows={2}
                  />
                </div>

                <div>
                  <Label>Photos</Label>
                  <p className="text-xs text-muted-foreground -mt-1 mb-2">
                    Choose which of this product's photos to post. Instagram and TikTok need at
                    least one.
                  </p>
                  <ProductPhotoPicker
                    productId={form.product_id}
                    mainImageUrl={selectedProduct?.image_url ?? null}
                    selected={form.image_urls}
                    onChange={(image_urls) => setForm((f) => ({ ...f, image_urls }))}
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

                <Button type="submit" className="w-full">
                  {editing ? "Save changes" : "Schedule post"}
                </Button>
              </>
            )}
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
