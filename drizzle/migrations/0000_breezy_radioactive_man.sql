-- Add new columns to existing users table
ALTER TABLE `users` ADD COLUMN `name` text DEFAULT '';
--> statement-breakpoint
ALTER TABLE `users` ADD COLUMN `email` text DEFAULT '';
--> statement-breakpoint
ALTER TABLE `users` ADD COLUMN `bio` text DEFAULT '';
--> statement-breakpoint
ALTER TABLE `users` ADD COLUMN `location` text DEFAULT '';
--> statement-breakpoint
ALTER TABLE `users` ADD COLUMN `website` text DEFAULT '';
--> statement-breakpoint
ALTER TABLE `users` ADD COLUMN `language` text DEFAULT 'en';
--> statement-breakpoint
ALTER TABLE `users` ADD COLUMN `timezone` text DEFAULT 'America/Los_Angeles';
--> statement-breakpoint
ALTER TABLE `users` ADD COLUMN `email_notifications` integer DEFAULT 1;
--> statement-breakpoint
ALTER TABLE `users` ADD COLUMN `push_notifications` integer DEFAULT 0;
--> statement-breakpoint
ALTER TABLE `users` ADD COLUMN `marketing_emails` integer DEFAULT 0;
--> statement-breakpoint
ALTER TABLE `users` ADD COLUMN `theme` text DEFAULT 'system';
--> statement-breakpoint
ALTER TABLE `users` ADD COLUMN `display_density` text DEFAULT 'comfortable';
--> statement-breakpoint
ALTER TABLE `users` ADD COLUMN `dashboard_layout` text DEFAULT 'grid';
--> statement-breakpoint
ALTER TABLE `users` ADD COLUMN `sidebar_collapsed` integer DEFAULT 0;
--> statement-breakpoint
ALTER TABLE `users` ADD COLUMN `enable_animations` integer DEFAULT 1;
--> statement-breakpoint
ALTER TABLE `users` ADD COLUMN `enable_sounds` integer DEFAULT 0;
--> statement-breakpoint
ALTER TABLE `users` ADD COLUMN `auto_save` integer DEFAULT 1;
--> statement-breakpoint
ALTER TABLE `users` ADD COLUMN `created_at` text;
--> statement-breakpoint
ALTER TABLE `users` ADD COLUMN `updated_at` text;
--> statement-breakpoint
ALTER TABLE `users` ADD COLUMN `last_password_change` text;
--> statement-breakpoint
-- Update existing users with current timestamp
UPDATE `users` SET `created_at` = datetime('now') WHERE `created_at` IS NULL;
--> statement-breakpoint
UPDATE `users` SET `updated_at` = datetime('now') WHERE `updated_at` IS NULL;
--> statement-breakpoint
UPDATE `users` SET `last_password_change` = datetime('now') WHERE `last_password_change` IS NULL;