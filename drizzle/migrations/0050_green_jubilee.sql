ALTER TABLE `promotions` ADD `discount_type` text DEFAULT 'percent' NOT NULL;--> statement-breakpoint
ALTER TABLE `promotions` ADD `discount_amount` real;