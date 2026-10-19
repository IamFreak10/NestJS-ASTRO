import { relations } from 'drizzle-orm';
import { user, session, account } from './auth.schema.js';
import { complaints } from './complaints.schema.js';
import { complaintUpvotes } from './upvotes.schema.js';
import { complaintComments } from './comments.schema.js';

export const userRelations = relations(user, ({ many }) => ({
  complaints: many(complaints, { relationName: 'authorComplaints' }),
  assignedComplaints: many(complaints, {
    relationName: 'staffAssignedComplaints',
  }),
  upvotes: many(complaintUpvotes),
  comments: many(complaintComments),
  sessions: many(session),
  accounts: many(account),
}));

export const complaintsRelations = relations(complaints, ({ one, many }) => ({
  author: one(user, {
    fields: [complaints.authorId],
    references: [user.id],
    relationName: 'authorComplaints',
  }),
  assignedStaff: one(user, {
    fields: [complaints.assignedStaffId],
    references: [user.id],
    relationName: 'staffAssignedComplaints',
  }),
  upvotes: many(complaintUpvotes),
  comments: many(complaintComments),
}));

export const complaintUpvotesRelations = relations(
  complaintUpvotes,
  ({ one }) => ({
    complaint: one(complaints, {
      fields: [complaintUpvotes.complaintId],
      references: [complaints.id],
    }),
    user: one(user, {
      fields: [complaintUpvotes.userId],
      references: [user.id],
    }),
  }),
);

export const complaintCommentsRelations = relations(
  complaintComments,
  ({ one }) => ({
    complaint: one(complaints, {
      fields: [complaintComments.complaintId],
      references: [complaints.id],
    }),
    author: one(user, {
      fields: [complaintComments.authorId],
      references: [user.id],
    }),
  }),
);

