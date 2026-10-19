import { describe, it, expect, beforeEach, vi } from 'vitest';
import { AuthController } from './auth.controller.js';
import type { AuthenticatedUser, UserRole } from './auth.interface.js';
import type { UpdateRoleDto } from './dto/update-role.dto.js';

describe('AuthController', () => {
  let controller: AuthController;
  let mockAuth: any;
  let mockAuthService: any;

  const mockAdmin: AuthenticatedUser = {
    id: 'user-admin-1',
    name: 'Administrator',
    email: 'admin@kauwarchor.edu',
    emailVerified: true,
    image: null,
    role: 'admin',
    studentId: null,
    department: 'Admin',
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const mockStudent: AuthenticatedUser = {
    id: 'user-student-1',
    name: 'Student Rahim',
    email: 'rahim@kauwarchor.edu',
    emailVerified: true,
    image: null,
    role: 'student',
    studentId: 'KCKU-2026-001',
    department: 'CSE',
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  beforeEach(() => {
    mockAuth = {
      handler: vi.fn(),
      api: {
        getSession: vi.fn(),
      },
    };
    mockAuthService = {
      updateUserRole: vi.fn(),
      getUserById: vi.fn(),
    };
    controller = new AuthController(mockAuth, mockAuthService);
  });

  describe('getMe', () => {
    it('should return current authenticated user profile', () => {
      const result = controller.getMe(mockStudent);
      expect(result).toEqual(mockStudent);
    });
  });

  describe('updateUserRole', () => {
    it('should invoke authService.updateUserRole with correct parameters', async () => {
      const dto: UpdateRoleDto = { role: 'staff' as UserRole };
      const updatedUser: AuthenticatedUser = {
        ...mockStudent,
        role: 'staff',
      };
      mockAuthService.updateUserRole.mockResolvedValue(updatedUser);

      const result = await controller.updateUserRole(
        'user-student-1',
        dto,
        mockAdmin,
      );

      expect(mockAuthService.updateUserRole).toHaveBeenCalledWith(
        'user-student-1',
        'staff',
        mockAdmin,
      );
      expect(result).toEqual(updatedUser);
    });
  });
});

