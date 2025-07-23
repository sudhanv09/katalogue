PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_library` (
	`id` text(12) PRIMARY KEY NOT NULL,
	`title` text,
	`author` text,
	`description` text,
	`status` text DEFAULT 'to-read',
	`cover_path` text,
	`progress` integer,
	`dir` text
);
--> statement-breakpoint
INSERT INTO `__new_library`("id", "title", "author", "description", "status", "cover_path", "progress", "dir") SELECT "id", "title", "author", "description", "status", "cover_path", "progress", "dir" FROM `library`;--> statement-breakpoint
DROP TABLE `library`;--> statement-breakpoint
ALTER TABLE `__new_library` RENAME TO `library`;--> statement-breakpoint
PRAGMA foreign_keys=ON;