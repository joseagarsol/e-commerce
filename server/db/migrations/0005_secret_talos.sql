CREATE TABLE `orders` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL,
	`email` text NOT NULL,
	`name` text NOT NULL,
	`last_name` text NOT NULL,
	`address` text NOT NULL,
	`postal_code` text NOT NULL,
	`city` text NOT NULL,
	`province` text NOT NULL,
	`shipping_method` text NOT NULL,
	`shipping_price` real NOT NULL,
	`payment_method` text NOT NULL,
	`status` text DEFAULT 'paid' NOT NULL,
	`total` real NOT NULL,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action
);
