import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { listAllReviews, setReviewStatus, deleteReview } from "@/data/reviews";
import { Button } from "@/components/ui/button";
import { Stars } from "@/components/star-rating";
import { Check, X, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/admin/reviews")({ component: AdminReviews });

const FILTERS = ["pending", "approved", "rejected", "all"] as const;
type Filter = (typeof FILTERS)[number];

const STATUS_STYLES: Record<string, string> = {
  pending: "bg-amber-100 text-amber-700 dark:bg-amber-500/15 dark:text-amber-400",
  approved: "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-400",
  rejected: "bg-rose-100 text-rose-700 dark:bg-rose-500/15 dark:text-rose-400",
};

function AdminReviews() {
  const qc = useQueryClient();
  const [filter, setFilter] = useState<Filter>("pending");

  const { data: reviews = [], isLoading } = useQuery({
    queryKey: ["admin-reviews", filter],
    queryFn: () => listAllReviews({ data: { status: filter } }),
  });

  const refresh = () => {
    qc.invalidateQueries({ queryKey: ["admin-reviews"] });
    qc.invalidateQueries({ queryKey: ["reviews-pending-count"] });
    // Storefront aggregates change when a review is approved/rejected/deleted.
    qc.invalidateQueries({ queryKey: ["products"] });
    qc.invalidateQueries({ queryKey: ["product"] });
    qc.invalidateQueries({ queryKey: ["reviews"] });
  };

  const moderate = async (id: string, status: "approved" | "rejected") => {
    try {
      await setReviewStatus({ data: { id, status } });
      toast.success(status === "approved" ? "Review approved" : "Review rejected");
      refresh();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to update review");
    }
  };

  const remove = async (id: string) => {
    if (!confirm("Delete this review permanently?")) return;
    try {
      await deleteReview({ data: { id } });
      toast.success("Review deleted");
      refresh();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to delete review");
    }
  };

  return (
    <div className="max-w-4xl">
      <h1 className="font-display font-bold text-2xl mb-1">Reviews</h1>
      <p className="text-muted-foreground text-sm mb-6">
        Approve customer reviews to publish them. Only approved reviews appear on the store and
        count toward a product's rating.
      </p>

      <div className="flex gap-2 mb-6">
        {FILTERS.map((f) => (
          <button
            key={f}
            type="button"
            onClick={() => setFilter(f)}
            className={cn(
              "rounded-full px-4 py-1.5 text-sm font-medium capitalize transition-colors",
              filter === f ? "bg-foreground text-background" : "bg-muted hover:bg-muted/70",
            )}
          >
            {f}
          </button>
        ))}
      </div>

      {isLoading ? (
        <p className="text-muted-foreground text-sm">Loading…</p>
      ) : reviews.length === 0 ? (
        <p className="text-muted-foreground text-sm">
          No {filter === "all" ? "" : filter} reviews.
        </p>
      ) : (
        <div className="space-y-4">
          {reviews.map((r) => (
            <div key={r.id} className="rounded-2xl border bg-card p-5">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2 min-w-0">
                  <span className="font-semibold truncate">
                    {r.product_title ?? "(deleted product)"}
                  </span>
                  <span
                    className={cn(
                      "rounded-full px-2 py-0.5 text-xs font-semibold capitalize",
                      STATUS_STYLES[r.status] ?? "bg-muted text-muted-foreground",
                    )}
                  >
                    {r.status}
                  </span>
                </div>
                <time className="text-xs text-muted-foreground">
                  {new Date(r.created_at).toLocaleDateString(undefined, {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  })}
                </time>
              </div>

              <div className="flex items-center gap-2 mt-3">
                <Stars value={r.rating} size="sm" />
                <span className="text-sm text-muted-foreground">by {r.author_name}</span>
              </div>

              {r.title && <h3 className="font-semibold mt-2">{r.title}</h3>}
              <p className="text-sm text-muted-foreground mt-1.5 leading-relaxed whitespace-pre-line">
                {r.body}
              </p>

              <div className="flex flex-wrap gap-2 mt-4 border-t pt-4">
                {r.status !== "approved" && (
                  <Button
                    size="sm"
                    className="rounded-full"
                    onClick={() => moderate(r.id, "approved")}
                  >
                    <Check className="size-4 mr-1.5" /> Approve
                  </Button>
                )}
                {r.status !== "rejected" && (
                  <Button
                    size="sm"
                    variant="outline"
                    className="rounded-full"
                    onClick={() => moderate(r.id, "rejected")}
                  >
                    <X className="size-4 mr-1.5" /> Reject
                  </Button>
                )}
                <Button
                  size="sm"
                  variant="ghost"
                  className="rounded-full text-destructive hover:text-destructive"
                  onClick={() => remove(r.id)}
                >
                  <Trash2 className="size-4 mr-1.5" /> Delete
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
