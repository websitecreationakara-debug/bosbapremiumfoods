import { createServerFn } from "@tanstack/react-start";
import { and, desc, eq } from "drizzle-orm";
import { getDb } from "@/db";
import { reviews, products, product_variations, orders } from "@/db/schema";
import { getSessionUser, requireUser, requireManager } from "./_auth";

type OrderItem = { id: string; title: string; qty: number };

// Recompute a product's cached rating average + review count from its approved
// reviews. Called after any moderation change so the storefront aggregates stay
// in sync without computing them on every read.
async function recomputeProductRating(productId: string) {
  const db = getDb();
  const rows = await db
    .select({ rating: reviews.rating })
    .from(reviews)
    .where(and(eq(reviews.product_id, productId), eq(reviews.status, "approved")));
  const count = rows.length;
  const avg = count ? Math.round((rows.reduce((s, r) => s + r.rating, 0) / count) * 10) / 10 : null;
  await db
    .update(products)
    .set({ rating: avg, review_count: count })
    .where(eq(products.id, productId));
}

// Every line-item id (product or variation) the user has ever bought, excluding
// cancelled orders. Used to prove a verified purchase.
async function purchasedItemIds(userId: string): Promise<Set<string>> {
  const rows = await getDb()
    .select({ items: orders.items, status: orders.status })
    .from(orders)
    .where(eq(orders.user_id, userId));
  const ids = new Set<string>();
  for (const r of rows) {
    if (r.status === "cancelled") continue;
    const items = JSON.parse(r.items || "[]") as OrderItem[];
    for (const it of items) if (it.id) ids.add(it.id);
  }
  return ids;
}

// True if the user bought this product directly or via one of its variations.
async function hasPurchased(userId: string, productId: string): Promise<boolean> {
  const [bought, variationRows] = await Promise.all([
    purchasedItemIds(userId),
    getDb()
      .select({ id: product_variations.id })
      .from(product_variations)
      .where(eq(product_variations.product_id, productId)),
  ]);
  if (bought.has(productId)) return true;
  return variationRows.some((v) => bought.has(v.id));
}

// Public: approved reviews for a product, newest first.
export const listReviews = createServerFn({ method: "GET" })
  .inputValidator((d: { productId: string }) => d)
  .handler(async ({ data }) => {
    return getDb()
      .select()
      .from(reviews)
      .where(and(eq(reviews.product_id, data.productId), eq(reviews.status, "approved")))
      .orderBy(desc(reviews.created_at));
  });

type Eligibility = {
  eligible: boolean;
  reason: "ok" | "not-logged-in" | "not-purchased" | "already-reviewed";
  existingStatus?: string;
};

// Whether the current user may submit a review for this product, and why not.
export const canReviewProduct = createServerFn({ method: "GET" })
  .inputValidator((d: { productId: string }) => d)
  .handler(async ({ data }): Promise<Eligibility> => {
    const user = await getSessionUser();
    if (!user) return { eligible: false, reason: "not-logged-in" };

    const [existing] = await getDb()
      .select({ status: reviews.status })
      .from(reviews)
      .where(and(eq(reviews.product_id, data.productId), eq(reviews.user_id, user.id)));
    if (existing)
      return { eligible: false, reason: "already-reviewed", existingStatus: existing.status };

    if (!(await hasPurchased(user.id, data.productId)))
      return { eligible: false, reason: "not-purchased" };
    return { eligible: true, reason: "ok" };
  });

export const createReview = createServerFn({ method: "POST" })
  .inputValidator(
    (d: { productId: string; rating: number; title: string | null; body: string }) => d,
  )
  .handler(async ({ data }) => {
    const user = await requireUser();
    const db = getDb();

    const rating = Math.round(Number(data.rating));
    if (!Number.isFinite(rating) || rating < 1 || rating > 5)
      throw new Error("Rating must be between 1 and 5.");
    const body = data.body?.trim();
    if (!body) throw new Error("Please write a few words about the product.");

    // SECURITY: re-verify the purchase server-side — never trust that the client
    // only showed the form to eligible buyers.
    if (!(await hasPurchased(user.id, data.productId)))
      throw new Error("Only verified buyers can review this product.");

    const [existing] = await db
      .select({ id: reviews.id })
      .from(reviews)
      .where(and(eq(reviews.product_id, data.productId), eq(reviews.user_id, user.id)));
    if (existing) throw new Error("You have already reviewed this product.");

    await db.insert(reviews).values({
      product_id: data.productId,
      user_id: user.id,
      author_name: user.name?.trim() || user.email,
      rating,
      title: data.title?.trim() || null,
      body: body.slice(0, 2000),
      status: "pending",
    });
    return { ok: true };
  });

// ---------- Admin moderation ----------

export const listAllReviews = createServerFn({ method: "GET" })
  .inputValidator((d: { status?: string } | undefined) => d ?? {})
  .handler(async ({ data }) => {
    await requireManager();
    const db = getDb();
    const where =
      data.status && data.status !== "all" ? eq(reviews.status, data.status) : undefined;
    const rows = await db
      .select({
        id: reviews.id,
        product_id: reviews.product_id,
        product_title: products.title,
        author_name: reviews.author_name,
        rating: reviews.rating,
        title: reviews.title,
        body: reviews.body,
        status: reviews.status,
        created_at: reviews.created_at,
      })
      .from(reviews)
      .leftJoin(products, eq(reviews.product_id, products.id))
      .where(where)
      .orderBy(desc(reviews.created_at));
    return rows;
  });

export const setReviewStatus = createServerFn({ method: "POST" })
  .inputValidator((d: { id: string; status: "pending" | "approved" | "rejected" }) => d)
  .handler(async ({ data }) => {
    await requireManager();
    const db = getDb();
    const [row] = await db
      .update(reviews)
      .set({ status: data.status })
      .where(eq(reviews.id, data.id))
      .returning({ product_id: reviews.product_id });
    if (row) await recomputeProductRating(row.product_id);
    return { ok: true };
  });

export const deleteReview = createServerFn({ method: "POST" })
  .inputValidator((d: { id: string }) => d)
  .handler(async ({ data }) => {
    await requireManager();
    const db = getDb();
    const [row] = await db
      .delete(reviews)
      .where(eq(reviews.id, data.id))
      .returning({ product_id: reviews.product_id });
    if (row) await recomputeProductRating(row.product_id);
    return { ok: true };
  });

// Pending count for the admin nav badge.
export const countPendingReviews = createServerFn({ method: "GET" }).handler(async () => {
  await requireManager();
  const rows = await getDb()
    .select({ id: reviews.id })
    .from(reviews)
    .where(eq(reviews.status, "pending"));
  return rows.length;
});
