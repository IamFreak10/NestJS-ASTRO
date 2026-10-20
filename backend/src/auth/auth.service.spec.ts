import { describe, it, expect, beforeEach, vi } from 'vitest';
import { ForbiddenException, NotFoundException } from '@nestjs/common';
import { AuthService } from './auth.service.js';
import type { AuthenticatedUser, UserRole } from './auth.interface.js';

describe('AuthService', () => {
  let service: AuthService;
  let mockAuth: any;
  let mockDb: any;

  const studentUser: AuthenticatedUser = {
    id: 'user-student-1',
    name: 'Rahim Uddin',
    email: 'rahim@kauwarchor.edu',
    emailVerified: true,
    image: null,
    role: 'student',
    studentId: 'BU-2026-001',
    department: 'CSE',
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const staffUser: AuthenticatedUser = {
    id: 'user-staff-1',
    name: 'Prof. Motaleb',
    email: 'motaleb@kauwarchor.edu',
    emailVerified: true,
    image: null,
    role: 'staff',
    studentId: null,
    department: 'EEE',
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const adminUser: AuthenticatedUser = {
    id: 'user-admin-1',
    name: 'VC Sir',
    email: 'admin@kauwarchor.edu',
    emailVerified: true,
    image: null,
    role: 'admin',
    studentId: null,
    department: 'Administration',
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  beforeEach(() => {
    mockAuth = {
      api: {
        getSession: vi.fn(),
      },
    };
    mockDb = {
      select: vi.fn(),
      update: vi.fn(),
    };
    service = new AuthService(mockAuth, mockDb);
  });

  describe('assertOwnership (IDOR Prevention)', () => {
    it('should allow resource owner to proceed', () => {
      expect(() => {
        service.assertOwnership('user-student-1', studentUser, 'edit');
      }).not.toThrow();
    });

    it('should allow administrator to bypass ownership check for moderation', () => {
      expect(() => {
        service.assertOwnership('user-student-1', adminUser, 'delete');
      }).not.toThrow();
    });

    it('should throw ForbiddenException if student attempts to modify someone else resource', () => {
      expect(() => {
        service.assertOwnership('user-student-2', studentUser, 'edit');
      }).toThrow(ForbiddenException);
    });

    it('should throw ForbiddenException if staff attempts to modify a resource they do not own', () => {
      expect(() => {
        service.assertOwnership('user-student-2', staffUser, 'edit');
      }).toThrow(ForbiddenException);
    });
  });

  describe('assertStaffOrAdmin', () => {
    it('should allow staff members', () => {
      expect(() => {
        service.assertStaffOrAdmin(staffUser);
      }).not.toThrow();
    });

    it('should allow administrators', () => {
      expect(() => {
        service.assertStaffOrAdmin(adminUser);
      }).not.toThrow();
    });

    it('should reject students with ForbiddenException', () => {
      expect(() => {
        service.assertStaffOrAdmin(studentUser);
      }).toThrow(ForbiddenException);
    });
  });

  describe('getUserById', () => {
    it('should return user if user exists', async () => {
      mockDb.select.mockReturnValue({
        from: vi.fn().mockReturnValue({
          where: vi.fn().mockReturnValue({
            limit: vi.fn().mockResolvedValue([studentUser]),
          }),
        }),
      });

      const result = await service.getUserById('user-student-1');
      expect(result).toEqual(studentUser);
    });

    it('should throw NotFoundException if user does not exist', async () => {
      mockDb.select.mockReturnValue({
        from: vi.fn().mockReturnValue({
          where: vi.fn().mockReturnValue({
            limit: vi.fn().mockResolvedValue([]),
          }),
        }),
      });

      await expect(service.getUserById('non-existent')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('updateUserRole', () => {
    it('should reject role update if caller is a student', async () => {
      await expect(
        service.updateUserRole('user-student-1', 'staff', studentUser),
      ).rejects.toThrow(ForbiddenException);
    });

    it('should reject role update if caller is a staff member', async () => {
      await expect(
        service.updateUserRole('user-student-1', 'admin', staffUser),
      ).rejects.toThrow(ForbiddenException);
    });

    it('should update role when caller is an administrator', async () => {
      const updatedUser: AuthenticatedUser = {
        ...studentUser,
        role: 'staff' as UserRole,
      };

      mockDb.update.mockReturnValue({
        set: vi.fn().mockReturnValue({
          where: vi.fn().mockResolvedValue([{ affectedRows: 1 }]),
        }),
      });

      vi.spyOn(service, 'getUserById').mockResolvedValue(updatedUser);

      const result = await service.updateUserRole(
        'user-student-1',
        'staff',
        adminUser,
      );
      expect(result.role).toBe('staff');
    });
  });

  describe('getSession', () => {
    it('should return null when getSession returns empty data', async () => {
      mockAuth.api.getSession.mockResolvedValue(null);

      const result = await service.getSession({});
      expect(result).toBeNull();
    });

    it('should return session and user when session exists', async () => {
      const mockSession = {
        user: studentUser,
        session: {
          id: 'sess-1',
          userId: studentUser.id,
          token: 'token-123',
          expiresAt: new Date(Date.now() + 100000),
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      };

      mockAuth.api.getSession.mockResolvedValue(mockSession);

      const result = await service.getSession({
        cookie: 'better-auth.session_token=token-123',
      });
      expect(result).toEqual(mockSession);
    });
  });
});

