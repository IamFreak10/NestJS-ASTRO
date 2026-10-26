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
import { complaints } from './complaints.schema.js';
import { user } from './auth.schema.js';

export const commentStatusChangeEnum = mysqlEnum('status_change_to', [
  'submitted',
  'under_review',
  'in_progress',
  'resolved',
  'rejected',
]);

export const complaintComments = mysqlTable(
  'complaint_comments',
  {
    id: int('id').autoincrement().primaryKey(),
    complaintId: int('complaint_id')
      .notNull()
      .references(() => complaints.id, { onDelete: 'cascade' }),
    authorId: varchar('author_id', { length: 36 })
      .notNull()
      .references(() => user.id, { onDelete: 'cascade' }),
    message: text('message').notNull(),
    statusChangeTo: commentStatusChangeEnum,
    isInternalNote: boolean('is_internal_note').notNull().default(false),
    createdAt: timestamp('created_at').notNull().defaultNow(),
  },
  (table) => [
    index('comment_complaint_idx').on(table.complaintId),
    index('comment_author_idx').on(table.authorId),
  ],
);

export type ComplaintComment = InferSelectModel<typeof complaintComments>;
export type NewComplaintComment = InferInsertModel<typeof complaintComments>;

