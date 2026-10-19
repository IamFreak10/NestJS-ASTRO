import {
  mysqlTable,
  int,
  varchar,
  timestamp,
  unique,
  index,
} from 'drizzle-orm/mysql-core';
import type { InferSelectModel, InferInsertModel } from 'drizzle-orm';
import { complaints } from './complaints.schema.js';
import { user } from './auth.schema.js';

export const complaintUpvotes = mysqlTable(
  'complaint_upvotes',
  {
    id: int('id').autoincrement().primaryKey(),
    complaintId: int('complaint_id')
      .notNull()
      .references(() => complaints.id, { onDelete: 'cascade' }),
    userId: varchar('user_id', { length: 36 })
      .notNull()
      .references(() => user.id, { onDelete: 'cascade' }),
    createdAt: timestamp('created_at').notNull().defaultNow(),
  },
  (table) => [
    unique('unique_complaint_user_vote').on(table.complaintId, table.userId),
    index('upvote_complaint_idx').on(table.complaintId),
  ],
);

export type ComplaintUpvote = InferSelectModel<typeof complaintUpvotes>;
export type NewComplaintUpvote = InferInsertModel<typeof complaintUpvotes>;

