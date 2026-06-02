CREATE TABLE `collections` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`description` text
);
--> statement-breakpoint
ALTER TABLE `products` ADD `collection_id` text REFERENCES collections(id);