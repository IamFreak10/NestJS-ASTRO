import {
  mysqlTable,
  int,
  varchar,
  text,
  boolean,
  timestamp,
  index,
} from 'drizzle-orm/mysql-core';
import type { InferSelectModel, InferInsertModel } from 'drizzle-orm';
import { complaints, complaintStatusEnum } from './complaints.schema.js';
import { user } from './auth.schema.js';

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
    statusChangeTo: complaintStatusEnum,
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

