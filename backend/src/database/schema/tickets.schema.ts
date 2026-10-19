import {
  mysqlTable,
  int,
  varchar,
  text,
  mysqlEnum,
  timestamp,
  index,
} from 'drizzle-orm/mysql-core';
import type { InferSelectModel, InferInsertModel } from 'drizzle-orm';

export const tickets = mysqlTable(
  'tickets',
  {
    id: int('id').autoincrement().primaryKey(),
    subject: varchar('subject', { length: 255 }).notNull(),
    description: text('description'),
    priority: mysqlEnum('priority', ['low', 'medium', 'high'])
      .notNull()
      .default('low'),
    status: mysqlEnum('status', ['open', 'closed']).notNull().default('open'),
    createdAt: timestamp('created_at').defaultNow().notNull(),
  },
  (table) => [
    index('tickets_status_idx').on(table.status),
    index('tickets_priority_idx').on(table.priority),
    index('tickets_status_priority_idx').on(table.status, table.priority),
  ],
);

export type Ticket = InferSelectModel<typeof tickets>;
export type NewTicket = InferInsertModel<typeof tickets>;

