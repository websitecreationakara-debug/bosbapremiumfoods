CREATE TABLE `social_connections` (
	`id` text PRIMARY KEY DEFAULT 'default' NOT NULL,
	`fb_page_id` text,
	`fb_page_access_token` text,
	`ig_user_id` text,
	`telegram_bot_token` text,
	`telegram_channel_id` text,
	`tiktok_access_token` text,
	`tiktok_privacy` text DEFAULT 'SELF_ONLY' NOT NULL,
	`updated_at` text NOT NULL
);
