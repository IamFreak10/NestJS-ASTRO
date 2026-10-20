import {
  BadRequestException,
  ForbiddenException,
  Inject,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { and, desc, eq } from 'drizzle-orm';
import type { MySql2Database } from 'drizzle-orm/mysql2';
import { DRIZZLE_DB } from '../database/database.tokens.js';
import * as schema from '../database/schema/index.js';
import type { AuthenticatedUser } from '../auth/auth.interface.js';
import type { CreateCommentDto } from './dto/create-comment.dto.js';
import type { UpdateCommentDto } from './dto/update-comment.dto.js';
import type {
  CommentResponseItem,
  DeleteCommentResponse,
} from './comments.interface.js';

@Injectable()
export class CommentsService {
  constructor(
    @Inject(DRIZZLE_DB)
    private readonly db: MySql2Database<typeof schema>,
  ) {}

  /**
   * Add a new comment to a complaint with privacy & role validation
   */
  async create(
    complaintId: number,
    dto: CreateCommentDto,
    user: AuthenticatedUser,
  ): Promise<CommentResponseItem> {
    const text = (dto.message || dto.content || '').trim();
    if (!text) {
      throw new BadRequestException('Comment message cannot be empty');
    }

    // 1. Verify target complaint exists
    const [complaint] = await this.db
      .select({
        id: schema.complaints.id,
        authorId: schema.complaints.authorId,
        visibility: schema.complaints.visibility,
      })
      .from(schema.complaints)
      .where(eq(schema.complaints.id, complaintId))
      .limit(1);

    if (!complaint) {
      throw new NotFoundException(`Complaint #${complaintId} not found`);
    }

    // 2. IDOR Protection: Check access on confidential grievances
    if (complaint.visibility === 'private') {
      const isOwner = user.id === complaint.authorId;
      const isStaffOrAdmin = user.role === 'staff' || user.role === 'admin';
      if (!isOwner && !isStaffOrAdmin) {
        throw new ForbiddenException(
          'You do not have permission to comment on this confidential grievance',
        );
      }
    }

    // 3. Regular students cannot post internal departmental notes
    const isInternalNote =
      user.role === 'staff' || user.role === 'admin'
        ? (dto.isInternalNote ?? false)
        : false;

    // 4. Insert into database
    const [insertResult] = await this.db
      .insert(schema.complaintComments)
      .values({
        complaintId,
        authorId: user.id,
        message: text,
        isInternalNote,
      });

    return {
      id: insertResult.insertId,
      complaintId,
      authorId: user.id,
      authorName: user.name,
      authorImage: user.image ?? null,
      authorDepartment: user.department ?? null,
      authorRole: user.role,
      message: text,
      isInternalNote,
      createdAt: new Date(),
    };
  }

  /**
   * Get all comments for a complaint, respecting privacy and internal notes
   */
  async findByComplaintId(
    complaintId: number,
    currentUser?: AuthenticatedUser,
  ): Promise<CommentResponseItem[]> {
    // 1. Verify complaint exists and viewer has access
    const [complaint] = await this.db
      .select({
        id: schema.complaints.id,
        authorId: schema.complaints.authorId,
        visibility: schema.complaints.visibility,
      })
      .from(schema.complaints)
      .where(eq(schema.complaints.id, complaintId))
      .limit(1);

    if (!complaint) {
      throw new NotFoundException(`Complaint #${complaintId} not found`);
    }

    if (complaint.visibility === 'private') {
      if (!currentUser) {
        throw new UnauthorizedException(
          'Authentication required to view comments for this confidential grievance',
        );
      }
      const isOwner = currentUser.id === complaint.authorId;
      const isStaffOrAdmin =
        currentUser.role === 'staff' || currentUser.role === 'admin';
      if (!isOwner && !isStaffOrAdmin) {
        throw new ForbiddenException(
          'You do not have permission to view comments for this confidential grievance',
        );
      }
    }

    // 2. Fetch comments joined with author profile
    const isStaffOrAdmin =
      currentUser?.role === 'staff' || currentUser?.role === 'admin';

    const conditions = [eq(schema.complaintComments.complaintId, complaintId)];
    if (!isStaffOrAdmin) {
      conditions.push(eq(schema.complaintComments.isInternalNote, false));
    }

    const rows = await this.db
      .select({
        id: schema.complaintComments.id,
        complaintId: schema.complaintComments.complaintId,
        message: schema.complaintComments.message,
        statusChangeTo: schema.complaintComments.statusChangeTo,
        isInternalNote: schema.complaintComments.isInternalNote,
        createdAt: schema.complaintComments.createdAt,
        authorId: schema.user.id,
        authorName: schema.user.name,
        authorImage: schema.user.image,
        authorDepartment: schema.user.department,
        authorRole: schema.user.role,
      })
      .from(schema.complaintComments)
      .leftJoin(schema.user, eq(schema.complaintComments.authorId, schema.user.id))
      .where(and(...conditions))
      .orderBy(schema.complaintComments.createdAt);

    return rows.map((r) => ({
      id: r.id,
      complaintId: r.complaintId,
      authorId: r.authorId ?? '',
      authorName: r.authorName ?? 'Student',
      authorImage: r.authorImage ?? null,
      authorDepartment: r.authorDepartment ?? null,
      authorRole: r.authorRole ?? 'student',
      message: r.message,
      statusChangeTo: r.statusChangeTo,
      isInternalNote: r.isInternalNote,
      createdAt: r.createdAt,
    }));
  }

  /**
   * Find single comment by ID
   */
  async findById(
    id: number,
    currentUser?: AuthenticatedUser,
  ): Promise<CommentResponseItem> {
    const [row] = await this.db
      .select({
        id: schema.complaintComments.id,
        complaintId: schema.complaintComments.complaintId,
        message: schema.complaintComments.message,
        statusChangeTo: schema.complaintComments.statusChangeTo,
        isInternalNote: schema.complaintComments.isInternalNote,
        createdAt: schema.complaintComments.createdAt,
        authorId: schema.user.id,
        authorName: schema.user.name,
        authorImage: schema.user.image,
        authorDepartment: schema.user.department,
        authorRole: schema.user.role,
      })
      .from(schema.complaintComments)
      .leftJoin(schema.user, eq(schema.complaintComments.authorId, schema.user.id))
      .where(eq(schema.complaintComments.id, id))
      .limit(1);

    if (!row) {
      throw new NotFoundException(`Comment #${id} not found`);
    }

    if (row.isInternalNote) {
      const isStaffOrAdmin =
        currentUser?.role === 'staff' || currentUser?.role === 'admin';
      if (!isStaffOrAdmin) {
        throw new ForbiddenException(
          'Internal department notes can only be viewed by staff or administrators',
        );
      }
    }

    return {
      id: row.id,
      complaintId: row.complaintId,
      authorId: row.authorId ?? '',
      authorName: row.authorName ?? 'Student',
      authorImage: row.authorImage ?? null,
      authorDepartment: row.authorDepartment ?? null,
      authorRole: row.authorRole ?? 'student',
      message: row.message,
      statusChangeTo: row.statusChangeTo,
      isInternalNote: row.isInternalNote,
      createdAt: row.createdAt,
    };
  }

  /**
   * Update comment message (Author or Admin only)
   */
  async update(
    id: number,
    dto: UpdateCommentDto,
    currentUser: AuthenticatedUser,
  ): Promise<CommentResponseItem> {
    const text = (dto.message || dto.content || '').trim();
    if (!text) {
      throw new BadRequestException('Comment message cannot be empty');
    }

    const [comment] = await this.db
      .select()
      .from(schema.complaintComments)
      .where(eq(schema.complaintComments.id, id))
      .limit(1);

    if (!comment) {
      throw new NotFoundException(`Comment #${id} not found`);
    }

    // Ownership check: only author or admin may modify comment
    const isAuthor = comment.authorId === currentUser.id;
    const isAdmin = currentUser.role === 'admin';
    if (!isAuthor && !isAdmin) {
      throw new ForbiddenException('You can only edit your own comments');
    }

    await this.db
      .update(schema.complaintComments)
      .set({ message: text })
      .where(eq(schema.complaintComments.id, id));

    return this.findById(id, currentUser);
  }

  /**
   * Delete comment (Author, Staff, or Admin)
   */
  async delete(
    id: number,
    currentUser: AuthenticatedUser,
  ): Promise<DeleteCommentResponse> {
    const [comment] = await this.db
      .select()
      .from(schema.complaintComments)
      .where(eq(schema.complaintComments.id, id))
      .limit(1);

    if (!comment) {
      throw new NotFoundException(`Comment #${id} not found`);
    }

    // Permission check: author, staff, or admin may delete
    const isAuthor = comment.authorId === currentUser.id;
    const isStaffOrAdmin =
      currentUser.role === 'staff' || currentUser.role === 'admin';
    if (!isAuthor && !isStaffOrAdmin) {
      throw new ForbiddenException(
        'You do not have permission to delete this comment',
      );
    }

    await this.db
      .delete(schema.complaintComments)
      .where(eq(schema.complaintComments.id, id));

    return {
      success: true,
      message: 'Comment deleted successfully',
      id,
    };
  }
}

