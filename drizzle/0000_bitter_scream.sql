CREATE TABLE `admins` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`username` text NOT NULL,
	`password_hash` text NOT NULL,
	`created_at` text DEFAULT (datetime('now'))
);
--> statement-breakpoint
CREATE UNIQUE INDEX `admins_username_unique` ON `admins` (`username`);--> statement-breakpoint
CREATE TABLE `bible_study` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`week` text NOT NULL,
	`date` text NOT NULL,
	`topic` text NOT NULL,
	`passage` text DEFAULT '',
	`zoom_url` text DEFAULT '',
	`leader` text DEFAULT '',
	`notes` text DEFAULT '',
	`created_at` text DEFAULT (datetime('now'))
);
--> statement-breakpoint
CREATE TABLE `care_messages` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` text DEFAULT '匿名',
	`contact` text DEFAULT '',
	`category` text NOT NULL,
	`content` text NOT NULL,
	`status` text DEFAULT 'new',
	`created_at` text DEFAULT (datetime('now'))
);
--> statement-breakpoint
CREATE TABLE `media` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`post_id` integer NOT NULL,
	`kind` text NOT NULL,
	`url` text NOT NULL,
	`caption` text DEFAULT '',
	`sort` integer DEFAULT 0
);
--> statement-breakpoint
CREATE TABLE `membership` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` text DEFAULT '',
	`contact` text DEFAULT '',
	`intent` text DEFAULT '',
	`message` text DEFAULT '',
	`status` text DEFAULT 'new',
	`created_at` text DEFAULT (datetime('now'))
);
--> statement-breakpoint
CREATE TABLE `posts` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`column_slug` text NOT NULL,
	`title` text NOT NULL,
	`date` text NOT NULL,
	`content` text DEFAULT '',
	`cover` text DEFAULT '',
	`created_at` text DEFAULT (datetime('now'))
);
