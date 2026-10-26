-- ==============================================================================
-- 🏛️ University of Barishal (বরিশাল বিশ্ববিদ্যালয় / BU) — CampusFix
-- 📦 Complete One-Click cPanel phpMyAdmin SQL Dump
-- Includes Table Schemas (DDL) + Core Seed Data (DML) with Real Avatars
-- ==============================================================================

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- ------------------------------------------------------------------------------
-- 1. Table: user
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `user` (
  `id` varchar(36) NOT NULL,
  `name` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `email_verified` tinyint(1) NOT NULL DEFAULT 0,
  `image` text DEFAULT NULL,
  `role` enum('student','staff','admin') NOT NULL DEFAULT 'student',
  `student_id` varchar(50) DEFAULT NULL,
  `department` varchar(100) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `user_email_unique` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ------------------------------------------------------------------------------
-- 2. Table: session
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `session` (
  `id` varchar(36) NOT NULL,
  `user_id` varchar(36) NOT NULL,
  `token` varchar(255) NOT NULL,
  `expires_at` timestamp NOT NULL,
  `ip_address` varchar(45) DEFAULT NULL,
  `user_agent` text DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `session_token_unique` (`token`),
  KEY `session_user_idx` (`user_id`),
  CONSTRAINT `session_user_id_fk` FOREIGN KEY (`user_id`) REFERENCES `user` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ------------------------------------------------------------------------------
-- 3. Table: account
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `account` (
  `id` varchar(36) NOT NULL,
  `user_id` varchar(36) NOT NULL,
  `account_id` varchar(255) NOT NULL,
  `provider_id` varchar(255) NOT NULL,
  `access_token` text DEFAULT NULL,
  `refresh_token` text DEFAULT NULL,
  `id_token` text DEFAULT NULL,
  `access_token_expires_at` timestamp NULL DEFAULT NULL,
  `refresh_token_expires_at` timestamp NULL DEFAULT NULL,
  `scope` text DEFAULT NULL,
  `password` text DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `account_user_idx` (`user_id`),
  CONSTRAINT `account_user_id_fk` FOREIGN KEY (`user_id`) REFERENCES `user` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ------------------------------------------------------------------------------
-- 4. Table: verification
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `verification` (
  `id` varchar(36) NOT NULL,
  `identifier` varchar(255) NOT NULL,
  `value` varchar(255) NOT NULL,
  `expires_at` timestamp NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ------------------------------------------------------------------------------
-- 5. Table: complaints
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `complaints` (
  `id` int NOT NULL AUTO_INCREMENT,
  `author_id` varchar(36) NOT NULL,
  `title` varchar(255) NOT NULL,
  `description` text NOT NULL,
  `category` enum('facilities','hostel_canteen','transport','academics','safety_bullying','administration') NOT NULL,
  `visibility` enum('public','private') NOT NULL DEFAULT 'public',
  `is_anonymous` tinyint(1) NOT NULL DEFAULT 0,
  `priority` enum('low','medium','high','urgent') NOT NULL DEFAULT 'medium',
  `status` enum('submitted','under_review','in_progress','resolved','rejected') NOT NULL DEFAULT 'submitted',
  `assigned_staff_id` varchar(36) DEFAULT NULL,
  `resolution_note` text DEFAULT NULL,
  `upvotes_count` int NOT NULL DEFAULT 0,
  `resolved_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `complaints_category_idx` (`category`),
  KEY `complaints_visibility_idx` (`visibility`),
  KEY `complaints_status_idx` (`status`),
  KEY `complaints_priority_idx` (`priority`),
  KEY `complaints_author_idx` (`author_id`),
  KEY `complaints_category_status_idx` (`category`, `status`),
  CONSTRAINT `complaints_author_id_fk` FOREIGN KEY (`author_id`) REFERENCES `user` (`id`) ON DELETE CASCADE,
  CONSTRAINT `complaints_assigned_staff_id_fk` FOREIGN KEY (`assigned_staff_id`) REFERENCES `user` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ------------------------------------------------------------------------------
-- 6. Table: complaint_upvotes
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `complaint_upvotes` (
  `id` int NOT NULL AUTO_INCREMENT,
  `complaint_id` int NOT NULL,
  `user_id` varchar(36) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `unique_complaint_user_vote` (`complaint_id`, `user_id`),
  KEY `upvotes_complaint_idx` (`complaint_id`),
  KEY `upvotes_user_idx` (`user_id`),
  CONSTRAINT `upvotes_complaint_id_fk` FOREIGN KEY (`complaint_id`) REFERENCES `complaints` (`id`) ON DELETE CASCADE,
  CONSTRAINT `upvotes_user_id_fk` FOREIGN KEY (`user_id`) REFERENCES `user` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ------------------------------------------------------------------------------
-- 7. Table: complaint_comments
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `complaint_comments` (
  `id` int NOT NULL AUTO_INCREMENT,
  `complaint_id` int NOT NULL,
  `author_id` varchar(36) NOT NULL,
  `message` text NOT NULL,
  `status_change_to` enum('submitted','under_review','in_progress','resolved','rejected') DEFAULT NULL,
  `is_internal_note` tinyint(1) NOT NULL DEFAULT 0,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `comment_complaint_idx` (`complaint_id`),
  KEY `comment_author_idx` (`author_id`),
  CONSTRAINT `comments_complaint_id_fk` FOREIGN KEY (`complaint_id`) REFERENCES `complaints` (`id`) ON DELETE CASCADE,
  CONSTRAINT `comments_author_id_fk` FOREIGN KEY (`author_id`) REFERENCES `user` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ==============================================================================
-- 🌟 SEED DATA INSERTIONS
-- ==============================================================================

-- 1. Insert Core Users with Profile Avatars
INSERT INTO `user` (`id`, `name`, `email`, `email_verified`, `image`, `role`, `student_id`, `department`, `created_at`, `updated_at`)
VALUES
  ('usr_admin_proctor', 'Dr. Rafiqul Islam (Chief Proctor)', 'proctor@kcku.edu', 1, 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=256&h=256&q=80', 'admin', NULL, 'Proctor Office & Student Welfare', NOW(), NOW()),
  ('usr_staff_tech', 'Kamal Uddin (Senior Maintenance Tech)', 'technician@kcku.edu', 1, 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=256&h=256&q=80', 'staff', NULL, 'Campus Electrical & Plumbing Cell', NOW(), NOW()),
  ('usr_staff_transport', 'Jashim Uddin (Transport Dispatcher)', 'transport@kcku.edu', 1, 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=256&h=256&q=80', 'staff', NULL, 'University Bus Directorate', NOW(), NOW()),
  ('usr_student_tanvir', 'Tanvir Hossain', 'student@kcku.edu', 1, 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=256&h=256&q=80', 'student', 'BU-2023-0101', 'Computer Science & Engineering', NOW(), NOW()),
  ('usr_student_anika', 'Anika Rahman', 'anika@kcku.edu', 1, 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=256&h=256&q=80', 'student', 'BU-2023-0205', 'Business Administration', NOW(), NOW()),
  ('usr_student_mahmud', 'Mahmudul Hasan', 'mahmud@kcku.edu', 1, 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=256&h=256&q=80', 'student', 'BU-2024-0312', 'Electrical & Electronic Engineering', NOW(), NOW())
ON DUPLICATE KEY UPDATE
  `image` = VALUES(`image`),
  `name` = VALUES(`name`),
  `department` = VALUES(`department`),
  `updated_at` = NOW();

-- 2. Insert Credentials Accounts (Better Auth Scrypt Hashes)
-- Passwords:
--   proctor@kcku.edu    -> admin123
--   technician@kcku.edu -> tech1234
--   transport@kcku.edu  -> transport123
--   student@kcku.edu    -> student123
--   anika@kcku.edu      -> student123
--   mahmud@kcku.edu     -> student123
INSERT INTO `account` (`id`, `user_id`, `account_id`, `provider_id`, `password`, `created_at`, `updated_at`)
VALUES
  ('acc_usr_admin_proctor', 'usr_admin_proctor', 'usr_admin_proctor', 'credential', 'f18b20767855553c243a3cb64581fcee:967bbeb7e2dcf0628581ba9665b76d28eec704473685a5f167693a0528c34cd5557596f979bdeec977567869f12aa61fc376737ebdd13d7e30e23848d10a9598', NOW(), NOW()),
  ('acc_usr_staff_tech', 'usr_staff_tech', 'usr_staff_tech', 'credential', 'bb98dde5664dc850c6044815e4dfd1ca:ce11499a980682c59d1a1dc89a9584ee220f1a64378d530ad400789424cfaebf996740f75e654ade5bed5614eedf6d5b60240e53cc8a1ad1945e652d9d12c70a', NOW(), NOW()),
  ('acc_usr_staff_transport', 'usr_staff_transport', 'usr_staff_transport', 'credential', 'be50d86226de87d7ea6da504042aca61:3554574b6a4f3b1c238e28603046c0d403dab03a13dfb439911f6cd4fb56dbf291240da4805fa8a7a7901734e1c5e12015b32ee553bae5fd4f3b454d9c411d89', NOW(), NOW()),
  ('acc_usr_student_tanvir', 'usr_student_tanvir', 'usr_student_tanvir', 'credential', 'c1d8cc5b53fa4f3ca70b645235eac4bb:82bce0ce6a225e82ab54a0b229101e943d6840b51a581c11052d523948d2e733ac79e333c6a894d05c89300b183c94e7764a62f40604fcc5731eadebce17b86b', NOW(), NOW()),
  ('acc_usr_student_anika', 'usr_student_anika', 'usr_student_anika', 'credential', 'c1d8cc5b53fa4f3ca70b645235eac4bb:82bce0ce6a225e82ab54a0b229101e943d6840b51a581c11052d523948d2e733ac79e333c6a894d05c89300b183c94e7764a62f40604fcc5731eadebce17b86b', NOW(), NOW()),
  ('acc_usr_student_mahmud', 'usr_student_mahmud', 'usr_student_mahmud', 'credential', 'c1d8cc5b53fa4f3ca70b645235eac4bb:82bce0ce6a225e82ab54a0b229101e943d6840b51a581c11052d523948d2e733ac79e333c6a894d05c89300b183c94e7764a62f40604fcc5731eadebce17b86b', NOW(), NOW())
ON DUPLICATE KEY UPDATE
  `account_id` = VALUES(`account_id`),
  `password` = VALUES(`password`),
  `updated_at` = NOW();

-- 3. Insert Campus Complaints
INSERT IGNORE INTO `complaints` (`id`, `author_id`, `title`, `description`, `category`, `visibility`, `is_anonymous`, `priority`, `status`, `assigned_staff_id`, `resolution_note`, `upvotes_count`, `resolved_at`, `created_at`, `updated_at`)
VALUES
  (101, 'usr_student_tanvir', '🏢 Hall 3 (South Wing) 4th Floor Water Filter Leaking & Low Pressure', 'The central drinking water purifier on the 4th floor has been leaking continuously since Tuesday morning. Low water pressure is forcing 120+ residents to carry buckets down to the 2nd floor.', 'facilities', 'public', 0, 'urgent', 'in_progress', 'usr_staff_tech', NULL, 47, NULL, DATE_SUB(NOW(), INTERVAL 5 HOUR), NOW()),
  (102, 'usr_student_anika', '🛏️ Central Canteen Lunch Hygiene & Cold Food Complaint', 'Several resident students reported undercooked chicken and cold rice served during lunch on Monday. Water cups on dining tables were not properly sanitized. Requesting urgent food safety inspection.', 'hostel_canteen', 'public', 1, 'high', 'under_review', 'usr_admin_proctor', NULL, 89, NULL, DATE_SUB(NOW(), INTERVAL 14 HOUR), NOW()),
  (103, 'usr_student_anika', '🚌 Route 4 Campus Bus Overcrowding & Morning Delay (8:15 AM)', 'Route 4 bus from Chawkbazar to campus arrives 25 minutes late consistently, causing students to miss 9:00 AM lab attendance. The bus is dangerously overloaded with students standing on footboards.', 'transport', 'public', 0, 'medium', 'resolved', 'usr_staff_transport', 'Transport Directorate dispatched Bus #14 as an additional backup shuttle at 8:20 AM. Bus route schedule adjusted and driver counselled.', 63, DATE_SUB(NOW(), INTERVAL 1 DAY), DATE_SUB(NOW(), INTERVAL 2 DAY), DATE_SUB(NOW(), INTERVAL 1 DAY)),
  (104, 'usr_student_mahmud', '📚 Central Library 3rd Floor Wi-Fi Router Disconnecting Frequently', 'The access point "BU-STUDENT-LIB-03" drops connection every 10-15 minutes, interrupting digital resource access for midterm research students. Signal strength fluctuates severely.', 'academics', 'public', 0, 'medium', 'in_progress', 'usr_staff_tech', NULL, 38, NULL, DATE_SUB(NOW(), INTERVAL 18 HOUR), NOW()),
  (105, 'usr_student_tanvir', '🛡️ Streetlight Outage & Ragging Patrol Request at North Boundary Gate', 'Two high-pressure sodium street lamps near the botanical garden walkway have been dead for a week. Freshers reported intimidation attempts around 9:30 PM. Urgent mobile proctor patrol needed.', 'safety_bullying', 'public', 1, 'urgent', 'resolved', 'usr_admin_proctor', 'Proctorial Mobile Patrol Post #2 stationed at North Gate from 8:00 PM to 1:00 AM daily. Electrical maintenance installed two new 100W LED floodlights on Oct 19.', 114, DATE_SUB(NOW(), INTERVAL 12 HOUR), DATE_SUB(NOW(), INTERVAL 3 DAY), DATE_SUB(NOW(), INTERVAL 12 HOUR)),
  (106, 'usr_student_mahmud', '📑 Semester 5 Grade Sheet Discrepancy Correction Desk Delay', 'The exam controller office counter #3 is only open for 45 minutes a day, creating an unruly queue of 80+ students trying to resolve course credit mismatches before registration deadline.', 'administration', 'public', 0, 'low', 'submitted', NULL, NULL, 29, NULL, DATE_SUB(NOW(), INTERVAL 8 HOUR), NOW()),
  (107, 'usr_student_tanvir', '🔒 Confidential Whistleblower: Late Night Dorm Intimidation in Hall 2 Room 314', 'Non-resident senior students entered Room 314 at 1:30 AM demanding juniors to perform menial tasks. Requesting confidential proctorial inspection without revealing complainant details.', 'safety_bullying', 'private', 1, 'urgent', 'under_review', 'usr_admin_proctor', NULL, 0, NULL, DATE_SUB(NOW(), INTERVAL 4 HOUR), NOW());

-- 4. Insert Sample Upvotes
INSERT IGNORE INTO `complaint_upvotes` (`complaint_id`, `user_id`, `created_at`)
VALUES
  (101, 'usr_student_anika', NOW()),
  (101, 'usr_student_mahmud', NOW()),
  (102, 'usr_student_tanvir', NOW()),
  (103, 'usr_student_tanvir', NOW()),
  (104, 'usr_student_anika', NOW()),
  (105, 'usr_student_mahmud', NOW());

-- 5. Insert Sample Activity & Technician Timeline Comments
INSERT IGNORE INTO `complaint_comments` (`complaint_id`, `author_id`, `message`, `status_change_to`, `is_internal_note`, `created_at`)
VALUES
  (101, 'usr_staff_tech', 'Inspected 4th floor plumbing line. Identified damaged joint gasket. Replacement parts dispatched from Central Store.', 'in_progress', 0, DATE_SUB(NOW(), INTERVAL 2 HOUR)),
  (102, 'usr_admin_proctor', 'Complaint routed to Food Safety & Dining Hall Committee. Surprise inspection scheduled for Tuesday.', 'under_review', 0, DATE_SUB(NOW(), INTERVAL 6 HOUR)),
  (103, 'usr_staff_transport', 'Bus #14 added as permanent morning relief shuttle starting today at 8:20 AM.', 'resolved', 0, DATE_SUB(NOW(), INTERVAL 1 DAY)),
  (104, 'usr_staff_tech', 'IT Network Team rebooted access point switch and reconfigured 5GHz channel bandwidth.', 'in_progress', 0, DATE_SUB(NOW(), INTERVAL 3 HOUR)),
  (105, 'usr_admin_proctor', 'Proctorial Night Patrol Post #2 established. LED floodlights functional.', 'resolved', 0, DATE_SUB(NOW(), INTERVAL 12 HOUR));

SET FOREIGN_KEY_CHECKS = 1;

