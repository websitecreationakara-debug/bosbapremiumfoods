import { createStart, createMiddleware, createCsrfMiddleware } from "@tanstack/react-start";
import { getRequest } from "@tanstack/react-start/server";
import { eq } from "drizzle-orm";

import { renderErrorPage } from "./lib/error-page";
import { getAuth } from "./lib/auth";
import { getDb } from "./db";
import { media, products, categories, orders } from "./db/schema";
import { slugify } from "./lib/utils";
import { verifyCallback } from "./lib/payment";
import { markOrderPaid } from "./data/orders";

const SITE = "https://bosbapremiumfoods.com";

const errorMiddleware = createMiddleware().server(async ({ next }) => {
  try {
    return await next();
  } catch (error) {
    if (error != null && typeof error === "object" && "statusCode" in error) {
      throw error;
    }
    console.error(error);
    return new Response(renderErrorPage(), {
      status: 500,
      headers: { "content-type": "text/html; charset=utf-8" },
    });
  }
});

// better-auth owns every /api/auth/* route; short-circuit those to its handler.
const authMiddleware = createMiddleware().server(async ({ next }) => {
  const request = getRequest();
  if (new URL(request.url).pathname.startsWith("/api/auth")) {
    return getAuth().handler(request);
  }
  return next();
});

// Serve uploaded media stored as BLOBs in D1, same-origin under /media/<key>.
const mediaMiddleware = createMiddleware().server(async ({ next }) => {
  const request = getRequest();
  const { pathname } = new URL(request.url);
  if (!pathname.startsWith("/media/")) return next();

  const key = decodeURIComponent(pathname.slice("/media/".length));
  const [row] = await getDb().select().from(media).where(eq(media.key, key));
  if (!row?.data) return new Response("Not found", { status: 404 });

  return new Response(row.data, {
    headers: {
      "content-type": row.content_type ?? "application/octet-stream",
      "cache-control": "public, max-age=31536000, immutable",
    },
  });
});

// PPCBank posts here when a KHQR payment settles. We verify the signature, match
// the gateway reference back to our order, and flip it to paid (which notifies the
// store). In mock mode there is no real gateway, so this endpoint is inert — the
// /pay screen confirms via the mockPay server fn instead.
const paymentMiddleware = createMiddleware().server(async ({ next }) => {
  const request = getRequest();
  if (new URL(request.url).pathname !== "/api/payment/callback") return next();

  if (!(await verifyCallback(request.clone()))) {
    return new Response("Invalid signature", { status: 401 });
  }

  // TODO(PPCBank): map their callback payload's fields to ref + paid status per
  // the integration guide. This assumes a JSON body { ref, status }.
  const body = (await request.json().catch(() => null)) as {
    ref?: string;
    status?: string;
  } | null;
  if (!body?.ref || body.status !== "paid") {
    return new Response("Ignored", { status: 200 });
  }

  const [order] = await getDb().select().from(orders).where(eq(orders.payment_ref, body.ref));
  if (!order) return new Response("Order not found", { status: 404 });
  await markOrderPaid(order.id, body.ref);
  return new Response("OK", { status: 200 });
});

// Dynamic sitemap built from published products + categories so search engines
// always see current URLs. Cached for an hour at the edge.
const sitemapMiddleware = createMiddleware().server(async ({ next }) => {
  const request = getRequest();
  if (new URL(request.url).pathname !== "/sitemap.xml") return next();

  const db = getDb();
  const [prods, cats] = await Promise.all([
    db
      .select({ id: products.id, title: products.title, updated_at: products.updated_at })
      .from(products)
      .where(eq(products.status, "published")),
    db.select({ slug: categories.slug }).from(categories),
  ]);

  const staticUrls = [
    { loc: `${SITE}/`, priority: "1.0" },
    { loc: `${SITE}/shop`, priority: "0.9" },
  ];
  const catUrls = cats.map((c) => ({
    loc: `${SITE}/shop?category=${encodeURIComponent(c.slug)}`,
    priority: "0.7",
  }));
  const prodUrls = prods.map((p) => ({
    loc: `${SITE}/product/${slugify(p.title) || p.id}`,
    lastmod: p.updated_at ? new Date(p.updated_at).toISOString().slice(0, 10) : undefined,
    priority: "0.8",
  }));

  const body = [...staticUrls, ...catUrls, ...prodUrls]
    .map(
      (u) =>
        `  <url><loc>${u.loc}</loc>${
          "lastmod" in u && u.lastmod ? `<lastmod>${u.lastmod}</lastmod>` : ""
        }<priority>${u.priority}</priority></url>`,
    )
    .join("\n");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${body}\n</urlset>`;
  return new Response(xml, {
    headers: {
      "content-type": "application/xml; charset=utf-8",
      "cache-control": "public, max-age=3600",
    },
  });
});

// Server functions are same-origin RPC endpoints; reject cross-site requests.
const csrfMiddleware = createCsrfMiddleware({
  filter: (ctx) => ctx.handlerType === "serverFn",
});

export const startInstance = createStart(() => ({
  requestMiddleware: [
    errorMiddleware,
    csrfMiddleware,
    authMiddleware,
    mediaMiddleware,
    paymentMiddleware,
    sitemapMiddleware,
  ],
}));
