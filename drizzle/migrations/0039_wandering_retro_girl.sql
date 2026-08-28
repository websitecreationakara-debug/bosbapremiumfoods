CREATE TABLE `nav_items` (
	`id` text PRIMARY KEY NOT NULL,
	`label` text NOT NULL,
	`type` text DEFAULT 'mega' NOT NULL,
	`direct_url` text,
	`accent` integer DEFAULT false NOT NULL,
	`sort_order` integer DEFAULT 0 NOT NULL,
	`active` integer DEFAULT true NOT NULL,
	`created_at` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `nav_links` (
	`id` text PRIMARY KEY NOT NULL,
	`nav_section_id` text NOT NULL,
	`label` text NOT NULL,
	`sub_label` text,
	`collection_id` text,
	`custom_url` text,
	`sort_order` integer DEFAULT 0 NOT NULL,
	`active` integer DEFAULT true NOT NULL,
	`created_at` text NOT NULL,
	FOREIGN KEY (`nav_section_id`) REFERENCES `nav_sections`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`collection_id`) REFERENCES `collections`(`id`) ON UPDATE no action ON DELETE set null
);
--> statement-breakpoint
CREATE TABLE `nav_sections` (
	`id` text PRIMARY KEY NOT NULL,
	`nav_item_id` text NOT NULL,
	`title` text,
	`image_url` text,
	`cta_label` text,
	`cta_link` text,
	`sort_order` integer DEFAULT 0 NOT NULL,
	`active` integer DEFAULT true NOT NULL,
	`created_at` text NOT NULL,
	FOREIGN KEY (`nav_item_id`) REFERENCES `nav_items`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
ALTER TABLE `collections` DROP COLUMN `nav_group`;--> statement-breakpoint
ALTER TABLE `collections` DROP COLUMN `nav_column`;