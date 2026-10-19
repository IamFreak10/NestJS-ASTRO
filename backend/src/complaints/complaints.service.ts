import {
  BadRequestException,
  ForbiddenException,
  Inject,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { and, desc, eq, like, sql } from 'drizzle-orm';
import type { MySql2Database } from 'drizzle-orm/mysql2';
import { DRIZZLE_DB } from '../database/database.tokens.js';
import * as schema from '../database/schema/index.js';
import type { AuthenticatedUser } from '../auth/auth.interface.js';
import type {
  ComplaintAuthorView,
  ComplaintResponseItem,
  UpvoteResult,
} from './complaints.interface.js';
import type { CreateComplaintDto } from './dto/create-complaint.dto.js';
import type { FilterComplaintsQueryDto } from './dto/filter-complaints.dto.js';
import type { UpdateComplaintStatusDto } from './dto/update-complaint-status.dto.js';
import type { AddCommentDto } from './dto/add-comment.dto.js';

@Injectable()
export class ComplaintsService {
  constructor(
    @Inject(DRIZZLE_DB)
    private readonly db: MySql2Database<typeof schema>,
  ) {}

  /**
   * File a new complaint with privacy options (public/private and anonymous toggle)
   */
  async create(
    dto: CreateComplaintDto,
    author: AuthenticatedUser,
  ): Promise<ComplaintResponseItem> {
    // Sensitive safety/bullying issues default to private vault if not explicitly chosen
    let visibility = dto.visibility ?? 'public';
    if (dto.category === 'safety_bullying' && !dto.visibility) {
      visibility = 'private';
    }

    const [insertResult] = await this.db.insert(schema.complaints).values({
      authorId: author.id,
      title: dto.title,
      description: dto.description,
      category: dto.category,
      visibility,
      isAnonymous: dto.isAnonymous ?? false,
      priority: dto.priority ?? 'medium',
      status: 'submitted',
      upvotesCount: 0,
    });

    const newId = insertResult.insertId;
    return this.findById(newId, author);
  }

  /**
   * Public Campus Notice Board feed with category filtering, search, pagination, and anonymous masking
   */
  async findPublic(
    filters: FilterComplaintsQueryDto,
    currentUserId?: string,
  ): Promise<{ items: ComplaintResponseItem[]; total: number; page: number; limit: number }> {
    const page = filters.page ?? 1;
    const limit = filters.limit ?? 20;
    const offset = (page - 1) * limit;

    const conditions = [eq(schema.complaints.visibility, 'public')];

    if (filters.category) {
      conditions.push(eq(schema.complaints.category, filters.category));
    }
    if (filters.status) {
      conditions.push(eq(schema.complaints.status, filters.status));
    }
    if (filters.priority) {
      conditions.push(eq(schema.complaints.priority, filters.priority));
    }
    if (filters.search && filters.search.trim() !== '') {
      conditions.push(like(schema.complaints.title, `%${filters.search.trim()}%`));
    }

    const whereClause = and(...conditions);

    // Query rows joined with author details
    const rows = await this.db
      .select({
        id: schema.complaints.id,
        title: schema.complaints.title,
        description: schema.complaints.description,
        category: schema.complaints.category,
        visibility: schema.complaints.visibility,
        isAnonymous: schema.complaints.isAnonymous,
        priority: schema.complaints.priority,
        status: schema.complaints.status,
        upvotesCount: schema.complaints.upvotesCount,
        resolutionNote: schema.complaints.resolutionNote,
        resolvedAt: schema.complaints.resolvedAt,
        createdAt: schema.complaints.createdAt,
        updatedAt: schema.complaints.updatedAt,
        authorId: schema.user.id,
        authorName: schema.user.name,
        authorDepartment: schema.user.department,
      })
      .from(schema.complaints)
      .leftJoin(schema.user, eq(schema.complaints.authorId, schema.user.id))
      .where(whereClause)
      .orderBy(desc(schema.complaints.upvotesCount), desc(schema.complaints.createdAt))
      .limit(limit)
      .offset(offset);

    // Check upvoted status if current user is logged in
    let upvotedComplaintIds = new Set<number>();
    if (currentUserId && rows.length > 0) {
      const ids = rows.map((r) => r.id);
      const userUpvotes = await this.db
        .select({ complaintId: schema.complaintUpvotes.complaintId })
        .from(schema.complaintUpvotes)
        .where(
          and(
            eq(schema.complaintUpvotes.userId, currentUserId),
            sql`${schema.complaintUpvotes.complaintId} IN (${sql.raw(ids.join(','))})`,
          ),
        );
      upvotedComplaintIds = new Set(userUpvotes.map((u) => u.complaintId));
    }

    // Format output and apply Privacy Gate
    const items: ComplaintResponseItem[] = rows.map((row) => {
      const isMasked = row.isAnonymous;
      const author: ComplaintAuthorView = {
        id: isMasked ? null : (row.authorId ?? null),
        name: isMasked ? 'Anonymous Student 🕶️' : (row.authorName ?? 'Unknown Student'),
        department: row.authorDepartment ?? null,
      };

      return {
        id: row.id,
        title: row.title,
        description: row.description,
        category: row.category,
        visibility: row.visibility,
        isAnonymous: row.isAnonymous,
        priority: row.priority,
        status: row.status,
        upvotesCount: row.upvotesCount,
        resolutionNote: row.resolutionNote,
        resolvedAt: row.resolvedAt,
        createdAt: row.createdAt,
        updatedAt: row.updatedAt,
        author,
        hasUpvoted: currentUserId ? upvotedComplaintIds.has(row.id) : false,
      };
    });

    // Total count query
    const [countRow] = await this.db
      .select({ count: sql<number>`count(*)` })
      .from(schema.complaints)
      .where(whereClause);

    const total = Number(countRow?.count ?? 0);

    return { items, total, page, limit };
  }

  /**
   * My Complaints dashboard for the logged-in student (both public and private grievances)
   */
  async findMyComplaints(authorId: string): Promise<ComplaintResponseItem[]> {
    const rows = await this.db
      .select({
        id: schema.complaints.id,
        title: schema.complaints.title,
        description: schema.complaints.description,
        category: schema.complaints.category,
        visibility: schema.complaints.visibility,
        isAnonymous: schema.complaints.isAnonymous,
        priority: schema.complaints.priority,
        status: schema.complaints.status,
        upvotesCount: schema.complaints.upvotesCount,
        resolutionNote: schema.complaints.resolutionNote,
        resolvedAt: schema.complaints.resolvedAt,
        createdAt: schema.complaints.createdAt,
        updatedAt: schema.complaints.updatedAt,
        authorId: schema.user.id,
        authorName: schema.user.name,
        authorDepartment: schema.user.department,
      })
      .from(schema.complaints)
      .leftJoin(schema.user, eq(schema.complaints.authorId, schema.user.id))
      .where(eq(schema.complaints.authorId, authorId))
      .orderBy(desc(schema.complaints.createdAt));

    // The author always sees their own real details
    return rows.map((row) => ({
      id: row.id,
      title: row.title,
      description: row.description,
      category: row.category,
      visibility: row.visibility,
      isAnonymous: row.isAnonymous,
      priority: row.priority,
      status: row.status,
      upvotesCount: row.upvotesCount,
      resolutionNote: row.resolutionNote,
      resolvedAt: row.resolvedAt,
      createdAt: row.createdAt,
      updatedAt: row.updatedAt,
      author: {
        id: row.authorId ?? null,
        name: row.authorName ?? 'Student',
        department: row.authorDepartment ?? null,
      },
    }));
  }

  /**
   * Find single complaint by ID with IDOR protection & Privacy Gate
   */
  async findById(
    id: number,
    currentUser?: AuthenticatedUser,
  ): Promise<ComplaintResponseItem & { comments: Array<{ id: number; authorName: string; message: string; createdAt: Date; isInternalNote: boolean }> }> {
    const [row] = await this.db
      .select({
        id: schema.complaints.id,
        authorId: schema.complaints.authorId,
        title: schema.complaints.title,
        description: schema.complaints.description,
        category: schema.complaints.category,
        visibility: schema.complaints.visibility,
        isAnonymous: schema.complaints.isAnonymous,
        priority: schema.complaints.priority,
        status: schema.complaints.status,
        upvotesCount: schema.complaints.upvotesCount,
        resolutionNote: schema.complaints.resolutionNote,
        resolvedAt: schema.complaints.resolvedAt,
        createdAt: schema.complaints.createdAt,
        updatedAt: schema.complaints.updatedAt,
        userName: schema.user.name,
        userDepartment: schema.user.department,
      })
      .from(schema.complaints)
      .leftJoin(schema.user, eq(schema.complaints.authorId, schema.user.id))
      .where(eq(schema.complaints.id, id))
      .limit(1);

    if (!row) {
      throw new NotFoundException(`Complaint #${id} not found`);
    }

    // IDOR Protection: Private complaints are only accessible to author or staff/admin
    if (row.visibility === 'private') {
      if (!currentUser) {
        throw new UnauthorizedException('Authentication required to view this confidential grievance');
      }
      const isOwner = currentUser.id === row.authorId;
      const isStaffOrAdmin = currentUser.role === 'staff' || currentUser.role === 'admin';
      if (!isOwner && !isStaffOrAdmin) {
        throw new ForbiddenException('You do not have permission to view this confidential grievance');
      }
    }

    // Privacy Gate: Mask anonymous author if viewer is not the author or an admin
    const canSeeIdentity =
      !row.isAnonymous ||
      currentUser?.id === row.authorId ||
      currentUser?.role === 'admin';

    const author: ComplaintAuthorView = {
      id: canSeeIdentity ? row.authorId : null,
      name: canSeeIdentity ? (row.userName ?? 'Student') : 'Anonymous Student 🕶️',
      department: row.userDepartment ?? null,
    };

    // Check if current user has upvoted
    let hasUpvoted = false;
    if (currentUser) {
      const [upvote] = await this.db
        .select()
        .from(schema.complaintUpvotes)
        .where(
          and(
            eq(schema.complaintUpvotes.complaintId, id),
            eq(schema.complaintUpvotes.userId, currentUser.id),
          ),
        )
        .limit(1);
      hasUpvoted = !!upvote;
    }

    // Fetch comments
    const isStaffOrAdmin = currentUser?.role === 'staff' || currentUser?.role === 'admin';
    const commentsQuery = this.db
      .select({
        id: schema.complaintComments.id,
        message: schema.complaintComments.message,
        isInternalNote: schema.complaintComments.isInternalNote,
        createdAt: schema.complaintComments.createdAt,
        authorName: schema.user.name,
      })
      .from(schema.complaintComments)
      .leftJoin(schema.user, eq(schema.complaintComments.authorId, schema.user.id))
      .where(
        isStaffOrAdmin
          ? eq(schema.complaintComments.complaintId, id)
          : and(
              eq(schema.complaintComments.complaintId, id),
              eq(schema.complaintComments.isInternalNote, false),
            ),
      )
      .orderBy(schema.complaintComments.createdAt);

    const commentsRows = await commentsQuery;

    return {
      id: row.id,
      title: row.title,
      description: row.description,
      category: row.category,
      visibility: row.visibility,
      isAnonymous: row.isAnonymous,
      priority: row.priority,
      status: row.status,
      upvotesCount: row.upvotesCount,
      resolutionNote: row.resolutionNote,
      resolvedAt: row.resolvedAt,
      createdAt: row.createdAt,
      updatedAt: row.updatedAt,
      author,
      hasUpvoted,
      comments: commentsRows.map((c) => ({
        id: c.id,
        authorName: c.authorName ?? 'Staff',
        message: c.message,
        createdAt: c.createdAt,
        isInternalNote: c.isInternalNote,
      })),
    };
  }

  /**
   * Atomic Upvote Toggle: "+1 Me Too" button functionality
   */
  async toggleUpvote(complaintId: number, userId: string): Promise<UpvoteResult> {
    return await this.db.transaction(async (tx) => {
      // 1. Verify complaint exists and is public
      const [complaint] = await tx
        .select()
        .from(schema.complaints)
        .where(eq(schema.complaints.id, complaintId))
        .limit(1);

      if (!complaint) {
        throw new NotFoundException(`Complaint #${complaintId} not found`);
      }

      if (complaint.visibility === 'private') {
        throw new BadRequestException('Cannot upvote confidential private grievances');
      }

      // 2. Check existing vote
      const [existingVote] = await tx
        .select()
        .from(schema.complaintUpvotes)
        .where(
          and(
            eq(schema.complaintUpvotes.complaintId, complaintId),
            eq(schema.complaintUpvotes.userId, userId),
          ),
        )
        .limit(1);

      if (existingVote) {
        // Remove vote (toggle off)
        await tx
          .delete(schema.complaintUpvotes)
          .where(eq(schema.complaintUpvotes.id, existingVote.id));

        const newCount = Math.max(0, complaint.upvotesCount - 1);
        await tx
          .update(schema.complaints)
          .set({ upvotesCount: newCount })
          .where(eq(schema.complaints.id, complaintId));

        return { upvoted: false, upvotesCount: newCount, complaintId };
      } else {
        // Add vote (toggle on)
        await tx.insert(schema.complaintUpvotes).values({
          complaintId,
          userId,
        });

        const newCount = complaint.upvotesCount + 1;
        await tx
          .update(schema.complaints)
          .set({ upvotesCount: newCount })
          .where(eq(schema.complaints.id, complaintId));

        return { upvoted: true, upvotesCount: newCount, complaintId };
      }
    });
  }

  /**
   * Staff/Admin Resolution & Status update
   */
  async updateStatus(
    id: number,
    dto: UpdateComplaintStatusDto,
    staffUser: AuthenticatedUser,
  ): Promise<ComplaintResponseItem> {
    if (staffUser.role !== 'staff' && staffUser.role !== 'admin') {
      throw new ForbiddenException('Staff or administrator privileges required to update complaint status');
    }

    const [complaint] = await this.db
      .select()
      .from(schema.complaints)
      .where(eq(schema.complaints.id, id))
      .limit(1);

    if (!complaint) {
      throw new NotFoundException(`Complaint #${id} not found`);
    }

    const resolvedAt = dto.status === 'resolved' ? new Date() : null;

    await this.db
      .update(schema.complaints)
      .set({
        status: dto.status,
        resolutionNote: dto.resolutionNote ?? complaint.resolutionNote,
        assignedStaffId: dto.assignedStaffId ?? staffUser.id,
        resolvedAt: resolvedAt ?? complaint.resolvedAt,
      })
      .where(eq(schema.complaints.id, id));

    // If staff added a comment message, record it on the timeline
    if (dto.commentMessage && dto.commentMessage.trim() !== '') {
      await this.db.insert(schema.complaintComments).values({
        complaintId: id,
        authorId: staffUser.id,
        message: dto.commentMessage.trim(),
        statusChangeTo: dto.status,
        isInternalNote: dto.isInternalNote ?? false,
      });
    }

    return this.findById(id, staffUser);
  }

  /**
   * Add a timeline discussion comment
   */
  async addComment(
    complaintId: number,
    dto: AddCommentDto,
    user: AuthenticatedUser,
  ): Promise<{ id: number; message: string; createdAt: Date }> {
    // Check complaint access
    const complaint = await this.findById(complaintId, user);

    // Students cannot post internal notes
    const isInternalNote =
      user.role === 'staff' || user.role === 'admin'
        ? (dto.isInternalNote ?? false)
        : false;

    const [res] = await this.db.insert(schema.complaintComments).values({
      complaintId: complaint.id,
      authorId: user.id,
      message: dto.message,
      isInternalNote,
    });

    return {
      id: res.insertId,
      message: dto.message,
      createdAt: new Date(),
    };
  }
}

