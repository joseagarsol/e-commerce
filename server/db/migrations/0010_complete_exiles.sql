PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_products` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`slug` text NOT NULL,
	`description` text NOT NULL,
	`price` real NOT NULL,
	`images` text NOT NULL,
	`stock` integer DEFAULT 0 NOT NULL,
	`available_sizes` text,
	`stock_by_size` text,
	`collection_id` text,
	FOREIGN KEY (`collection_id`) REFERENCES `collections`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
INSERT INTO `__new_products`("id", "name", "slug", "description", "price", "images", "stock", "available_sizes", "stock_by_size", "collection_id") SELECT "id", "name", "slug", "description", "price", "images", "stock", "available_sizes", "stock_by_size", "collection_id" FROM `products`;--> statement-breakpoint
DROP TABLE `products`;--> statement-breakpoint
ALTER TABLE `__new_products` RENAME TO `products`;--> statement-breakpoint
PRAGMA foreign_keys=ON;--> statement-breakpoint
CREATE UNIQUE INDEX `products_slug_unique` ON `products` (`slug`);