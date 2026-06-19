import { sqliteTable, text, integer, real, blob } from "drizzle-orm/sqlite-core";

const uuid = () => crypto.randomUUID();
const nowIso = () => new Date().toISOString();

// ---------- Application tables ----------
// Column names are snake_case to match the frontend types in src/lib/types.ts,
// so query results can flow straight to the UI without remapping.

export const categories = sqliteTable("categories", {
  id: text("id").primaryKey().$defaultFn(uuid),
  name: text("name").notNull(),
  slug: text("slug").notNull().unique(),
  image_url: text("image_url"),
  // Self-reference for parent/child hierarchy; null = top-level category.
  parent_id: text("parent_id"),
  created_at: text("created_at").notNull().$defaultFn(nowIso),
});

export const hero_slides = sqliteTable("hero_slides", {
  id: text("id").primaryKey().$defaultFn(uuid),
  eyebrow: text("eyebrow"),
  title_top: text("title_top"),
  title_accent: text("title_accent"),
  title_bottom: text("title_bottom"),
  body: text("body"),
  image_url: text("image_url"),
  cta_label: text("cta_label"),
  cta_link: text("cta_link").notNull().default("/shop"),
  sort_order: integer("sort_order").notNull().default(0),
  active: integer("active", { mode: "boolean" }).notNull().default(true),
  created_at: text("created_at").notNull().$defaultFn(nowIso),
});

export const products = sqliteTable("products", {
  id: text("id").primaryKey().$defaultFn(uuid),
  title: text("title").notNull(),
  description: text("description"),
  price: real("price").notNull().default(0),
  sale_price: real("sale_price"),
  category_id: text("category_id").references(() => categories.id, { onDelete: "set null" }),
  stock: integer("stock").notNull().default(0),
  status: text("status").notNull().default("published"),
  image_url: text("image_url"),
  badge: text("badge"),
  rating: real("rating").default(4.5),
  weight: text("weight"),
  // "simple" | "variable". A variable product is a container: its own price and
  // stock are ignored and the purchasable options live in product_variations.
  type: text("type").notNull().default("simple"),
  created_at: text("created_at").notNull().$defaultFn(nowIso),
  updated_at: text("updated_at").notNull().$defaultFn(nowIso),
});

export const product_variations = sqliteTable("product_variations", {
  id: text("id").primaryKey().$defaultFn(uuid),
  product_id: text("product_id")
    .notNull()
    .references(() => products.id, { onDelete: "cascade" }),
  // Variation label — the weight, e.g. "250g", "1kg".
  weight: text("weight").notNull(),
  price: real("price").notNull().default(0),
  sale_price: real("sale_price"),
  stock: integer("stock").notNull().default(0),
  sort_order: integer("sort_order").notNull().default(0),
  created_at: text("created_at").notNull().$defaultFn(nowIso),
});

export const media = sqliteTable("media", {
  id: text("id").primaryKey().$defaultFn(uuid),
  key: text("key").notNull().unique(),
  url: text("url").notNull(),
  filename: text("filename").notNull(),
  content_type: text("content_type"),
  size: integer("size").notNull().default(0),
  // Image bytes live in D1 (no R2). Kept nullable so the column adds cleanly via ALTER.
  data: blob("data", { mode: "buffer" }),
  created_at: text("created_at").notNull().$defaultFn(nowIso),
});

export const orders = sqliteTable("orders", {
  id: text("id").primaryKey().$defaultFn(uuid),
  user_id: text("user_id").notNull(),
  // Customer contact + delivery captured at checkout. Nullable so the columns
  // add cleanly via ALTER to pre-existing rows.
  customer_name: text("customer_name"),
  customer_email: text("customer_email"),
  address: text("address"),
  city: text("city"),
  postal_code: text("postal_code"),
  // JSON array of line items, stored as text (parsed/stringified in the app layer).
  items: text("items").notNull().default("[]"),
  status: text("status").notNull().default("pending"),
  total: real("total").notNull(),
  created_at: text("created_at").notNull().$defaultFn(nowIso),
});

export const store_settings = sqliteTable("store_settings", {
  id: text("id").primaryKey().$defaultFn(uuid),
  banner_text: text("banner_text"),
  global_discount_pct: real("global_discount_pct").default(0),
  free_shipping_threshold: real("free_shipping_threshold").default(30),
  updated_at: text("updated_at").notNull().$defaultFn(nowIso),
});

// ---------- better-auth tables ----------
// Shapes follow better-auth's drizzle (sqlite) conventions, including the
// `admin` plugin fields (user.role/banned/..., session.impersonatedBy).

export const user = sqliteTable("user", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  emailVerified: integer("email_verified", { mode: "boolean" }).notNull().default(false),
  image: text("image"),
  role: text("role"),
  banned: integer("banned", { mode: "boolean" }),
  banReason: text("ban_reason"),
  banExpires: integer("ban_expires", { mode: "timestamp" }),
  createdAt: integer("created_at", { mode: "timestamp" }).notNull(),
  updatedAt: integer("updated_at", { mode: "timestamp" }).notNull(),
});

export const session = sqliteTable("session", {
  id: text("id").primaryKey(),
  expiresAt: integer("expires_at", { mode: "timestamp" }).notNull(),
  token: text("token").notNull().unique(),
  createdAt: integer("created_at", { mode: "timestamp" }).notNull(),
  updatedAt: integer("updated_at", { mode: "timestamp" }).notNull(),
  ipAddress: text("ip_address"),
  userAgent: text("user_agent"),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  impersonatedBy: text("impersonated_by"),
});

export const account = sqliteTable("account", {
  id: text("id").primaryKey(),
  accountId: text("account_id").notNull(),
  providerId: text("provider_id").notNull(),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  accessToken: text("access_token"),
  refreshToken: text("refresh_token"),
  idToken: text("id_token"),
  accessTokenExpiresAt: integer("access_token_expires_at", { mode: "timestamp" }),
  refreshTokenExpiresAt: integer("refresh_token_expires_at", { mode: "timestamp" }),
  scope: text("scope"),
  password: text("password"),
  createdAt: integer("created_at", { mode: "timestamp" }).notNull(),
  updatedAt: integer("updated_at", { mode: "timestamp" }).notNull(),
});

export const verification = sqliteTable("verification", {
  id: text("id").primaryKey(),
  identifier: text("identifier").notNull(),
  value: text("value").notNull(),
  expiresAt: integer("expires_at", { mode: "timestamp" }).notNull(),
  createdAt: integer("created_at", { mode: "timestamp" }).notNull(),
  updatedAt: integer("updated_at", { mode: "timestamp" }).notNull(),
});
