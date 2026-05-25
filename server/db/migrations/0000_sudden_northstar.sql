CREATE TABLE `products` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`description` text NOT NULL,
	`price` real NOT NULL,
	`images` text NOT NULL,
	`stock` integer DEFAULT 0 NOT NULL,
	`available_sizes` text,
	`stock_by_size` text
);
