import {
  mysqlTable,
  int,
  varchar,
  text,
  boolean,
  timestamp,
  mysqlEnum,
  index,
} from 'drizzle-orm/mysql-core';
import type { InferSelectModel, InferInsertModel } from 'drizzle-orm';
import { user } from './auth.schema.js';

export const complaintCategoryEnum = mysqlEnum('category', [
  'facilities',
  'hostel_canteen',
  'transport',
  'academics',
  'safety_bullying',
  'administration',
]);

export const complaintVisibilityEnum = mysqlEnum('visibility', [
  'public',
  'private',
]);

export const complaintPriorityEnum = mysqlEnum('priority', [
  'low',
  'medium',
  'high',
  'urgent',
]);

export const complaintStatusEnum = mysqlEnum('status', [
  'submitted',
  'under_review',
  'in_progress',
  'resolved',
  'rejected',
]);

export const complaints = mysqlTable(
  'complaints',
  {
    id: int('id').autoincrement().primaryKey(),
    authorId: varchar('author_id', { length: 36 })
      .notNull()
      .references(() => user.id, { onDelete: 'cascade' }),
    title: varchar('title', { length: 255 }).notNull(),
    description: text('description').notNull(),
    category: complaintCategoryEnum.notNull(),
    visibility: complaintVisibilityEnum.notNull().default('public'),
    isAnonymous: boolean('is_anonymous').notNull().default(false),
    priority: complaintPriorityEnum.notNull().default('medium'),
    status: complaintStatusEnum.notNull().default('submitted'),
    assignedStaffId: varchar('assigned_staff_id', { length: 36 }).references(
      () => user.id,
      { onDelete: 'set null' },
    ),
    resolutionNote: text('resolution_note'),
    upvotesCount: int('upvotes_count').notNull().default(0),
    resolvedAt: timestamp('resolved_at'),
    createdAt: timestamp('created_at').notNull().defaultNow(),
    updatedAt: timestamp('updated_at').notNull().defaultNow().onUpdateNow(),
  },
  (table) => [
    index('complaints_category_idx').on(table.category),
    index('complaints_visibility_idx').on(table.visibility),
    index('complaints_status_idx').on(table.status),
    index('complaints_priority_idx').on(table.priority),
    index('complaints_author_idx').on(table.authorId),
    index('complaints_category_status_idx').on(table.category, table.status),
  ],
);

export type Complaint = InferSelectModel<typeof complaints>;
export type NewComplaint = InferInsertModel<typeof complaints>;

