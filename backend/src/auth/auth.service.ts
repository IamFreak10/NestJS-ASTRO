import {
  ForbiddenException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { eq } from 'drizzle-orm';
import type { MySql2Database } from 'drizzle-orm/mysql2';
import { BETTER_AUTH, type BetterAuthInstance } from './auth.config.js';
import { DRIZZLE_DB } from '../database/database.tokens.js';
import * as schema from '../database/schema/index.js';
import type {
  AuthenticatedUser,
  BetterAuthSession,
  UserRole,
} from './auth.interface.js';
import { fromNodeHeaders } from 'better-auth/node';

@Injectable()
export class AuthService {
  constructor(
    @Inject(BETTER_AUTH) private readonly auth: BetterAuthInstance,
    @Inject(DRIZZLE_DB)
    private readonly db: MySql2Database<typeof schema>,
  ) {}

  /**
   * Resolve active session and user from raw node request headers.
   */
  async getSession(
    headers: Record<string, string | string[] | undefined>,
  ): Promise<BetterAuthSession | null> {
    const webHeaders = fromNodeHeaders(headers);
    const sessionData = await this.auth.api.getSession({ headers: webHeaders });

    if (!sessionData?.user || !sessionData?.session) {
      return null;
    }

    return sessionData as unknown as BetterAuthSession;
  }

  /**
   * IDOR Defense: Assert that the requesting user owns the resource or has administrative privilege.
   */
  assertOwnership(
    resourceOwnerId: string,
    currentUser: AuthenticatedUser,
    action: string = 'modify',
  ): void {
    if (currentUser.role === 'admin') {
      return; // Admins possess global moderation authority
    }

    if (currentUser.id !== resourceOwnerId) {
      throw new ForbiddenException(
        `You do not have permission to ${action} this resource`,
      );
    }
  }

  /**
   * Assert staff or admin authority (e.g. for complaint triage or internal notes).
   */
  assertStaffOrAdmin(currentUser: AuthenticatedUser): void {
    if (currentUser.role !== 'staff' && currentUser.role !== 'admin') {
      throw new ForbiddenException(
        'Staff or administrator privileges required for this operation',
      );
    }
  }

  /**
   * Safely retrieve a user profile by ID without leaking sensitive credentials.
   */
  async getUserById(userId: string): Promise<AuthenticatedUser> {
    const [foundUser] = await this.db
      .select({
        id: schema.user.id,
        name: schema.user.name,
        email: schema.user.email,
        emailVerified: schema.user.emailVerified,
        image: schema.user.image,
        role: schema.user.role,
        studentId: schema.user.studentId,
        department: schema.user.department,
        createdAt: schema.user.createdAt,
        updatedAt: schema.user.updatedAt,
      })
      .from(schema.user)
      .where(eq(schema.user.id, userId))
      .limit(1);

    if (!foundUser) {
      throw new NotFoundException(`User with ID '${userId}' not found`);
    }

    return foundUser as AuthenticatedUser;
  }

  /**
   * Administrative role assignment (strictly guarded: caller must be admin).
   */
  async updateUserRole(
    targetUserId: string,
    newRole: UserRole,
    adminUser: AuthenticatedUser,
  ): Promise<AuthenticatedUser> {
    if (adminUser.role !== 'admin') {
      throw new ForbiddenException('Only administrators can update user roles');
    }

    await this.db
      .update(schema.user)
      .set({ role: newRole })
      .where(eq(schema.user.id, targetUserId));

    return this.getUserById(targetUserId);
  }
}
