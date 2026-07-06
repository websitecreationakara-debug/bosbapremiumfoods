# BOSBA Premium Foods — Website Handbook

A guide to what the website does and how to use it — for store staff, and for anyone who will work on the code.

- **Live site:** https://bosbapremiumfoods.com (also www.bosbapremiumfoods.com)
- **Admin panel:** https://bosbapremiumfoods.com/admin (sign-in required, role-gated)
- **What it is:** an online store for premium Japanese food (sashimi-grade fish, shellfish, roe, uni), with delivery in Phnom Penh.

---

## 1. The storefront (what customers see)

| Page      | URL               | What it does                                                                        |
| --------- | ----------------- | ----------------------------------------------------------------------------------- |
| Home      | `/`               | Hero banners, featured categories and products                                      |
| Shop      | `/shop`           | Full catalog with category filter, search, and sorting (featured, price, top rated) |
| Product   | `/product/<name>` | Photos, price, description, variations, stock, star ratings, add to cart            |
| Offers    | `/offers`         | Current promotions and discounted products                                          |
| Wishlist  | `/wishlist`       | Saved products (heart icon)                                                         |
| Checkout  | `/checkout`       | Delivery details + order placement                                                  |
| Pay       | `/pay/<order-id>` | KHQR payment step after placing an order                                            |
| Thank you | `/thank-you`      | Order confirmation                                                                  |
| My orders | `/orders`         | Customer's order history and status                                                 |
| Account   | `/account`        | Profile edit, change password                                                       |
| Addresses | `/addresses`      | Saved delivery addresses                                                            |

Key behaviors:

- **Languages:** English, Khmer, Japanese — switcher in the header.
- **Variable products:** some products (e.g. different cuts/weights) have variations, each with its own price, stock, and photo.
- **Star ratings:** signed-in customers can rate any product 1–5 stars on its page (tap a star; tap again later to change it). The average shows in the product header. No text reviews — stars only.
- **Free delivery threshold:** orders over the configured amount (see Admin → Settings) get free chilled delivery; shown as a banner site-wide.
- **Stock rules:** a product with no stock number is always available; stock `0` shows "out of stock" and can't be ordered.
- **Payment:** KHQR via PPCBank. ⚠️ Currently in **mock mode** — no real money moves until the PPCBank merchant credentials are configured as Worker secrets. In mock mode the /pay screen simulates a successful payment.
- **PWA:** the site can be installed to a phone's home screen (works on the live HTTPS site only).

### Customer accounts

- Sign-up / sign-in at `/auth` with **email + one-time code (OTP)** — the code is emailed via Resend. Google sign-in is available when configured.
- Password sign-in works after the email is verified; forgotten passwords are reset by email.
- Sign-in forms are protected by Google reCAPTCHA v3 (invisible).

---

## 2. Roles — who can do what

| Role         | Access                                                                                          |
| ------------ | ----------------------------------------------------------------------------------------------- |
| _(customer)_ | Storefront only: shop, orders, account                                                          |
| `sales`      | Admin panel: **view and manage orders** only                                                    |
| `marketing`  | Admin panel: products, categories, media, marketing (offers + promo codes); can **view** orders |
| `admin`      | Everything, including users, settings, and banners                                              |

Roles are assigned in **Admin → Users**. Every admin action is enforced on the server, not just hidden in the UI.

---

## 3. Admin panel guide (`/admin`)

| Page       | Who                                | What you do there                                                                                                                                                                                    |
| ---------- | ---------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Dashboard  | all admin roles                    | Overview: pending orders, quick stats                                                                                                                                                                |
| Products   | admin, marketing                   | Create/edit products: title, price, sale price, category, stock, weight, pcs/box, badge, photos, drag-to-reorder. For **variable** products, manage variations (each with its own price/stock/image) |
| Categories | admin, marketing                   | Create/edit/reorder categories                                                                                                                                                                       |
| Banners    | admin                              | Home page hero slides                                                                                                                                                                                |
| Orders     | admin, sales (marketing view-only) | See incoming orders, update status, download PDF invoice. A **chime sounds** when a new order arrives while the page is open                                                                         |
| Marketing  | admin, marketing                   | Promotions/offers (discount % across chosen products, shown on `/offers`) and **promo codes** for checkout                                                                                           |
| Media      | admin, marketing                   | Image library. Uploads are stored in the database (D1) — keep each image **under 1 MB**; compress before uploading                                                                                   |
| Users      | admin                              | See all users, assign roles (`sales`, `marketing`, `admin`), ban accounts                                                                                                                            |
| Settings   | admin                              | Store settings, e.g. the free-shipping threshold                                                                                                                                                     |

Notes for daily use:

- Product images: upload to **Media** first or directly from the product form; served from `/media/...` URLs.
- Deleting a promotion automatically un-links its products; prices return to normal.
- A product's "rating" field can be set manually, but once customers rate it, the customer average overwrites it.

---

## 4. Developer guide

### Stack

- **TypeScript + React 19**, TanStack Start (server functions) + TanStack Router (file-based) + TanStack Query
- **Vite 7**, Tailwind CSS v4 (config lives in `src/styles.css` — there is no `tailwind.config`), shadcn/ui components in `src/components/ui`
- **Cloudflare Workers** runtime, **Cloudflare D1** (SQLite) via **Drizzle ORM**, **better-auth** for auth
- Package manager: **npm** (ignore the stale `bun.lock`)

### Layout

```
src/routes/        file-based routes: _store/ (storefront), admin/, auth.tsx
src/data/          server functions (all DB access; _auth.ts has the role guards)
src/db/            Drizzle schema.ts + getDb(); migrations in drizzle/migrations/
src/lib/           auth, i18n, payment (PPCBank KHQR), promotions, invoice PDF, utils
src/components/    UI components (shadcn/ui under ui/)
```

### First-time setup

```bash
npm install
# create .env with the vars listed below
npm run db:migrate:local     # build the local database
npm run db:seed:local        # optional: seed sample data
npm run dev                  # http://localhost:8080
```

- **Port 8080 is intentional** (`strictPort`) — Google OAuth's redirect URI must match. Don't change it.
- Dev runs **inside workerd** (Cloudflare's runtime) via `@cloudflare/vite-plugin`, so server functions get a real local D1 binding. It is not a plain Node server.
- Without a `RESEND_API_KEY`, sign-in OTP codes are **printed to the dev-server console** instead of emailed.

### Environment variables

Set in `.env` for local dev; as Worker secrets (`npx wrangler secret put NAME`) for production.

| Variable                                                               | Purpose                               |
| ---------------------------------------------------------------------- | ------------------------------------- |
| `BETTER_AUTH_URL`, `BETTER_AUTH_SECRET`, `BETTER_AUTH_TRUSTED_ORIGINS` | Auth core                             |
| `RESEND_API_KEY`, `RESEND_FROM`                                        | OTP / reset emails                    |
| `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`                             | Google sign-in (optional)             |
| `RECAPTCHA_SECRET_KEY` (+ site key in build env)                       | reCAPTCHA v3                          |
| `PPCBANK_BASE_URL` + merchant credentials                              | KHQR payments — **unset = mock mode** |

The D1 `DB` binding comes from `wrangler.jsonc`, not env vars.

### Everyday commands

```bash
npm run dev                        # dev server on :8080
npx tsc --noEmit -p tsconfig.json  # typecheck
npm run lint                       # eslint
npm run format                     # prettier
npm run build                      # production build
```

### Database changes

1. Edit `src/db/schema.ts`
2. `npm run db:generate` → creates a migration in `drizzle/migrations/`
3. `npm run db:migrate:local` → apply locally, test
4. `npm run db:migrate:remote` → apply to **production** (see Deploying)

⚠️ `npm run db:push` overwrites the **production** `categories` and `products` tables from local data. Destructive — only with explicit intent. `db:pull` copies prod catalog down to local.

### Deploying to production

```bash
npm run backup             # 1. export prod DB first (safety)
npm run db:migrate:remote  # 2. only if there are new migrations
npm run deploy             # 3. build + wrangler deploy
```

Deploys go to the Cloudflare Worker serving bosbapremiumfoods.com. Schema migrations are additive-first: migrate **before** deploying code that needs the new tables.

### Backups

- `npm run backup` exports the remote D1 to `backups/d1-backup-<timestamp>.sql` (gitignored).
- A Windows Scheduled Task ("BOSBA D1 Backup") runs this daily at 2 PM on the owner's machine.
- ⚠️ Backup dumps contain **password hashes and OAuth tokens** — never commit or share them.

### Gotchas

- Don't add Vite plugins to `vite.config.ts` (tanstackStart, react, tailwind, tsconfig-paths are already included by `@lovable.dev/vite-tanstack-config`); duplicates break the build.
- `src/routeTree.gen.ts` is generated — never hand-edit.
- Server-only modules use the `*.server.ts` suffix; ESLint blocks importing them from client code.
- Never commit: `backups/`, `d1-backup-*.sql`, `d1-restore-*.sql`, `.dev.vars`, `.env*`, `.wrangler/`.
- The `supabase/` directory is dead legacy from the original scaffold — the app runs on D1.
- For non-trivial changes: work on a feature branch and open a PR — don't commit to `main`.
