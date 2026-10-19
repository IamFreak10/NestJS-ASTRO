import { describe, it, expect, beforeEach, vi } from 'vitest';
import { UnauthorizedException, ForbiddenException } from '@nestjs/common';
import { AuthGuard } from './auth.guard.js';
import { StaffGuard } from './staff.guard.js';
import { AdminGuard } from './admin.guard.js';
import { OptionalAuthGuard } from './optional-auth.guard.js';
import type { AuthenticatedUser, RequestWithUser } from '../auth.interface.js';

describe('Auth Guards Suite (Simplified)', () => {
  let mockAuth: any;

  const mockUser: AuthenticatedUser = {
    id: 'user-std-100',
    name: 'Kashem Ali',
    email: 'kashem@kauwarchor.edu',
    emailVerified: true,
    image: null,
    role: 'student',
    studentId: 'KCKU-2026-042',
    department: 'CSE',
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const mockStaffUser: AuthenticatedUser = {
    ...mockUser,
    id: 'user-staff-100',
    role: 'staff',
  };

  const mockAdminUser: AuthenticatedUser = {
    ...mockUser,
    id: 'user-admin-100',
    role: 'admin',
  };

  const mockSession = {
    id: 'sess-100',
    userId: mockUser.id,
    token: 'tok-100',
    expiresAt: new Date(Date.now() + 86400000),
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  beforeEach(() => {
    mockAuth = {
      api: {
        getSession: vi.fn(),
      },
    };
  });

  const createMockContext = (
    requestObj: Partial<RequestWithUser> = {},
  ): { context: any; req: RequestWithUser } => {
    const req = { headers: {}, ...requestObj } as RequestWithUser;
    const context: any = {
      switchToHttp: () => ({
        getRequest: () => req,
      }),
    };
    return { context, req };
  };

  describe('AuthGuard', () => {
    let guard: AuthGuard;

    beforeEach(() => {
      guard = new AuthGuard(mockAuth);
    });

    it('should throw UnauthorizedException when no valid session exists', async () => {
      mockAuth.api.getSession.mockResolvedValue(null);
      const { context } = createMockContext();

      await expect(guard.canActivate(context)).rejects.toThrow(
        UnauthorizedException,
      );
    });

    it('should attach user and session to request and return true on valid session', async () => {
      mockAuth.api.getSession.mockResolvedValue({
        user: mockUser,
        session: mockSession,
      });

      const { context, req } = createMockContext({
        headers: { cookie: 'better-auth.session_token=valid-tok' },
      });

      const result = await guard.canActivate(context);
      expect(result).toBe(true);
      expect(req.user).toEqual(mockUser);
      expect(req.session).toEqual(mockSession);
    });
  });

  describe('StaffGuard', () => {
    let guard: StaffGuard;

    beforeEach(() => {
      guard = new StaffGuard();
    });

    it('should throw ForbiddenException when user is a student', () => {
      const { context } = createMockContext({ user: mockUser });
      expect(() => guard.canActivate(context)).toThrow(ForbiddenException);
    });

    it('should allow access when user is staff', () => {
      const { context } = createMockContext({ user: mockStaffUser });
      expect(guard.canActivate(context)).toBe(true);
    });

    it('should allow access when user is admin', () => {
      const { context } = createMockContext({ user: mockAdminUser });
      expect(guard.canActivate(context)).toBe(true);
    });
  });

  describe('AdminGuard', () => {
    let guard: AdminGuard;

    beforeEach(() => {
      guard = new AdminGuard();
    });

    it('should throw ForbiddenException when user is student or staff', () => {
      const ctxStudent = createMockContext({ user: mockUser });
      expect(() => guard.canActivate(ctxStudent.context)).toThrow(ForbiddenException);

      const ctxStaff = createMockContext({ user: mockStaffUser });
      expect(() => guard.canActivate(ctxStaff.context)).toThrow(ForbiddenException);
    });

    it('should allow access when user is admin', () => {
      const { context } = createMockContext({ user: mockAdminUser });
      expect(guard.canActivate(context)).toBe(true);
    });
  });

  describe('OptionalAuthGuard', () => {
    let guard: OptionalAuthGuard;

    beforeEach(() => {
      guard = new OptionalAuthGuard(mockAuth);
    });

    it('should allow anonymous visitors without setting user', async () => {
      mockAuth.api.getSession.mockResolvedValue(null);
      const { context, req } = createMockContext({ headers: {} });

      const result = await guard.canActivate(context);
      expect(result).toBe(true);
      expect(req.user).toBeUndefined();
    });

    it('should attach user if valid session exists', async () => {
      mockAuth.api.getSession.mockResolvedValue({
        user: mockUser,
        session: mockSession,
      });
      const { context, req } = createMockContext({
        headers: { authorization: 'Bearer token-123' },
      });

      const result = await guard.canActivate(context);
      expect(result).toBe(true);
      expect(req.user).toEqual(mockUser);
    });
  });
});
