CREATE TABLE `history` (
	`id` text(12) PRIMARY KEY NOT NULL,
	`read` text DEFAULT (CURRENT_TIMESTAMP),
	`library_id` text(12) NOT NULL,
	FOREIGN KEY (`library_id`) REFERENCES `library`(`id`) ON UPDATE no action ON DELETE no action
);
