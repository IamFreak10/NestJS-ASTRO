CREATE TABLE `account` (
	`id` varchar(36) NOT NULL,
	`user_id` varchar(36) NOT NULL,
	`account_id` varchar(255) NOT NULL,
	`provider_id` varchar(255) NOT NULL,
	`access_token` text,
	`refresh_token` text,
	`id_token` text,
	`access_token_expires_at` timestamp,
	`refresh_token_expires_at` timestamp,
	`scope` text,
	`password` text,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `account_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `session` (
	`id` varchar(36) NOT NULL,
	`user_id` varchar(36) NOT NULL,
	`token` varchar(255) NOT NULL,
	`expires_at` timestamp NOT NULL,
	`ip_address` varchar(45),
	`user_agent` text,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `session_id` PRIMARY KEY(`id`),
	CONSTRAINT `session_token_unique` UNIQUE(`token`)
);
--> statement-breakpoint
CREATE TABLE `user` (
	`id` varchar(36) NOT NULL,
	`name` varchar(255) NOT NULL,
	`email` varchar(255) NOT NULL,
	`email_verified` boolean NOT NULL DEFAULT false,
	`image` text,
	`role` enum('student','staff','admin') NOT NULL DEFAULT 'student',
	`student_id` varchar(50),
	`department` varchar(100),
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `user_id` PRIMARY KEY(`id`),
	CONSTRAINT `user_email_unique` UNIQUE(`email`)
);
--> statement-breakpoint
CREATE TABLE `verification` (
	`id` varchar(36) NOT NULL,
	`identifier` varchar(255) NOT NULL,
	`value` varchar(255) NOT NULL,
	`expires_at` timestamp NOT NULL,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `verification_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `complaints` (
	`id` int AUTO_INCREMENT NOT NULL,
	`author_id` varchar(36) NOT NULL,
	`title` varchar(255) NOT NULL,
	`description` text NOT NULL,
	`category` enum('facilities','hostel_canteen','transport','academics','safety_bullying','administration') NOT NULL,
	`visibility` enum('public','private') NOT NULL DEFAULT 'public',
	`is_anonymous` boolean NOT NULL DEFAULT false,
	`priority` enum('low','medium','high','urgent') NOT NULL DEFAULT 'medium',
	`status` enum('submitted','under_review','in_progress','resolved','rejected') NOT NULL DEFAULT 'submitted',
	`assigned_staff_id` varchar(36),
	`resolution_note` text,
	`upvotes_count` int NOT NULL DEFAULT 0,
	`resolved_at` timestamp,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `complaints_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `complaint_upvotes` (
	`id` int AUTO_INCREMENT NOT NULL,
	`complaint_id` int NOT NULL,
	`user_id` varchar(36) NOT NULL,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `complaint_upvotes_id` PRIMARY KEY(`id`),
	CONSTRAINT `unique_complaint_user_vote` UNIQUE(`complaint_id`,`user_id`)
);
--> statement-breakpoint
CREATE TABLE `complaint_comments` (
	`id` int AUTO_INCREMENT NOT NULL,
	`complaint_id` int NOT NULL,
	`author_id` varchar(36) NOT NULL,
	`message` text NOT NULL,
	`status` enum('submitted','under_review','in_progress','resolved','rejected') NOT NULL DEFAULT 'submitted',
	`is_internal_note` boolean NOT NULL DEFAULT false,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `complaint_comments_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
ALTER TABLE `account` ADD CONSTRAINT `account_user_id_user_id_fk` FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `session` ADD CONSTRAINT `session_user_id_user_id_fk` FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `complaints` ADD CONSTRAINT `complaints_author_id_user_id_fk` FOREIGN KEY (`author_id`) REFERENCES `user`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `complaints` ADD CONSTRAINT `complaints_assigned_staff_id_user_id_fk` FOREIGN KEY (`assigned_staff_id`) REFERENCES `user`(`id`) ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `complaint_upvotes` ADD CONSTRAINT `complaint_upvotes_complaint_id_complaints_id_fk` FOREIGN KEY (`complaint_id`) REFERENCES `complaints`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `complaint_upvotes` ADD CONSTRAINT `complaint_upvotes_user_id_user_id_fk` FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `complaint_comments` ADD CONSTRAINT `complaint_comments_complaint_id_complaints_id_fk` FOREIGN KEY (`complaint_id`) REFERENCES `complaints`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `complaint_comments` ADD CONSTRAINT `complaint_comments_author_id_user_id_fk` FOREIGN KEY (`author_id`) REFERENCES `user`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX `complaints_category_idx` ON `complaints` (`category`);--> statement-breakpoint
CREATE INDEX `complaints_visibility_idx` ON `complaints` (`visibility`);--> statement-breakpoint
CREATE INDEX `complaints_status_idx` ON `complaints` (`status`);--> statement-breakpoint
CREATE INDEX `complaints_priority_idx` ON `complaints` (`priority`);--> statement-breakpoint
CREATE INDEX `complaints_author_idx` ON `complaints` (`author_id`);--> statement-breakpoint
CREATE INDEX `complaints_category_status_idx` ON `complaints` (`category`,`status`);--> statement-breakpoint
CREATE INDEX `upvote_complaint_idx` ON `complaint_upvotes` (`complaint_id`);--> statement-breakpoint
CREATE INDEX `comment_complaint_idx` ON `complaint_comments` (`complaint_id`);--> statement-breakpoint
CREATE INDEX `comment_author_idx` ON `complaint_comments` (`author_id`);