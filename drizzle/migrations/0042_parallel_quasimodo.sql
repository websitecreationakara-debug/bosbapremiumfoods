CREATE TABLE `addon_collection_items` (
	`id` text PRIMARY KEY NOT NULL,
	`addon_collection_id` text NOT NULL,
	`addon_id` text NOT NULL,
	`sort_order` integer DEFAULT 0 NOT NULL,
	FOREIGN KEY (`addon_collection_id`) REFERENCES `addon_collections`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`addon_id`) REFERENCES `addons`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `addon_collections` (
	`id` text PRIMARY KEY NOT NULL,
	`title` text NOT NULL,
	`active` integer DEFAULT true NOT NULL,
	`sort_order` integer DEFAULT 0 NOT NULL,
	`created_at` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `addons` (
	`id` text PRIMARY KEY NOT NULL,
	`title` text NOT NULL,
	`description` text,
	`price` real DEFAULT 0 NOT NULL,
	`image_url` text,
	`stock` integer,
	`status` text DEFAULT 'published' NOT NULL,
	`sort_order` integer DEFAULT 0 NOT NULL,
	`created_at` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `product_addon_collections` (
	`id` text PRIMARY KEY NOT NULL,
	`product_id` text NOT NULL,
	`addon_collection_id` text NOT NULL,
	`sort_order` integer DEFAULT 0 NOT NULL,
	FOREIGN KEY (`product_id`) REFERENCES `products`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`addon_collection_id`) REFERENCES `addon_collections`(`id`) ON UPDATE no action ON DELETE cascade
);
