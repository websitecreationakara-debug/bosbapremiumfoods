CREATE TABLE `reviews` (
	`id` text PRIMARY KEY NOT NULL,
	`product_id` text NOT NULL,
	`user_id` text NOT NULL,
	`order_id` text,
	`author_name` text NOT NULL,
	`rating` integer NOT NULL,
	`title` text,
	`body` text NOT NULL,
	`status` text DEFAULT 'pending' NOT NULL,
	`created_at` text NOT NULL,
	FOREIGN KEY (`product_id`) REFERENCES `products`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_products` (
	`id` text PRIMARY KEY NOT NULL,
	`title` text NOT NULL,
	`description` text,
	`price` real DEFAULT 0 NOT NULL,
	`sale_price` real,
	`category_id` text,
	`stock` integer,
	`status` text DEFAULT 'published' NOT NULL,
	`image_url` text,
	`badge` text,
	`rating` real,
	`review_count` integer DEFAULT 0 NOT NULL,
	`weight` text,
	`pcs` integer,
	`type` text DEFAULT 'simple' NOT NULL,
	`sort_order` integer DEFAULT 0 NOT NULL,
	`promotion_id` text,
	`created_at` text NOT NULL,
	`updated_at` text NOT NULL,
	FOREIGN KEY (`category_id`) REFERENCES `categories`(`id`) ON UPDATE no action ON DELETE set null,
	FOREIGN KEY (`promotion_id`) REFERENCES `promotions`(`id`) ON UPDATE no action ON DELETE set null
);
--> statement-breakpoint
INSERT INTO `__new_products`("id", "title", "description", "price", "sale_price", "category_id", "stock", "status", "image_url", "badge", "rating", "review_count", "weight", "pcs", "type", "sort_order", "promotion_id", "created_at", "updated_at") SELECT "id", "title", "description", "price", "sale_price", "category_id", "stock", "status", "image_url", "badge", NULL, 0, "weight", "pcs", "type", "sort_order", "promotion_id", "created_at", "updated_at" FROM `products`;--> statement-breakpoint
DROP TABLE `products`;--> statement-breakpoint
ALTER TABLE `__new_products` RENAME TO `products`;--> statement-breakpoint
PRAGMA foreign_keys=ON;