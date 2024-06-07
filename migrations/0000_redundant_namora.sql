CREATE TABLE `analytics` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`title` text(256) NOT NULL,
	`value` text(256) NOT NULL,
	`change` text(256) NOT NULL
);
--> statement-breakpoint
CREATE TABLE `mails` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` text(256) NOT NULL,
	`email` text(256) NOT NULL,
	`subject` text(256) NOT NULL,
	`text` text NOT NULL,
	`date` text NOT NULL,
	`read` integer NOT NULL,
	`labels` blob
);
--> statement-breakpoint
CREATE TABLE `repositories` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` text(256) NOT NULL,
	`link` text(256) NOT NULL,
	`organization` text(256) NOT NULL
);
--> statement-breakpoint
CREATE TABLE `sales` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`customer` text(256) NOT NULL,
	`email` text(256) NOT NULL,
	`amount` text(256) NOT NULL,
	`avatar` text(256) NOT NULL
);
--> statement-breakpoint
CREATE TABLE `transactions` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`customer` text(256) NOT NULL,
	`email` text(256) NOT NULL,
	`amount` text(256) NOT NULL
);
