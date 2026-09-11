CREATE TABLE `social_posts` (
	`id` text PRIMARY KEY NOT NULL,
	`topic` text NOT NULL,
	`brief` text,
	`image_urls` text DEFAULT '[]' NOT NULL,
	`platforms` text DEFAULT '[]' NOT NULL,
	`scheduled_at` text NOT NULL,
	`status` text DEFAULT 'scheduled' NOT NULL,
	`captions` text,
	`results` text,
	`published_at` text,
	`created_at` text NOT NULL
);
