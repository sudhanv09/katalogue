CREATE TABLE `library` (
	`id` text(12) PRIMARY KEY NOT NULL,
	`title` text,
	`author` text,
	`description` text,
	`status` text,
	`progress` integer,
	`dir` text
);
