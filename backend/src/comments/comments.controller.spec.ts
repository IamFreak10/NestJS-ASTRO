import { describe, it, expect, beforeEach, vi } from 'vitest';
import {
  CommentsController,
  ComplaintCommentsController,
} from './comments.controller.js';
import type { AuthenticatedUser } from '../auth/auth.interface.js';

describe('CommentsControllers', () => {
  let commentsController: CommentsController;
  let complaintCommentsController: ComplaintCommentsController;
  let mockCommentsService: any;

  const mockUser: AuthenticatedUser = {
    id: 'user-std-1',
    name: 'Tanvir Hossain',
    email: 'tanvir@kcku.edu',
    emailVerified: true,
    image: null,
    role: 'student',
    studentId: 'BU-2023-0101',
    department: 'CSE',
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  beforeEach(() => {
    mockCommentsService = {
      create: vi.fn(),
      findByComplaintId: vi.fn(),
      findById: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
    };
    commentsController = new CommentsController(mockCommentsService);
    complaintCommentsController = new ComplaintCommentsController(mockCommentsService);
  });

  describe('CommentsController', () => {
    it('should forward update to commentsService.update', async () => {
      mockCommentsService.update.mockResolvedValue({
        id: 1,
        message: 'Updated comment text',
      });

      const res = await commentsController.update(
        1,
        { message: 'Updated comment text' },
        mockUser,
      );

      expect(mockCommentsService.update).toHaveBeenCalledWith(
        1,
        { message: 'Updated comment text' },
        mockUser,
      );
      expect(res.id).toBe(1);
    });

    it('should forward delete to commentsService.delete', async () => {
      mockCommentsService.delete.mockResolvedValue({
        success: true,
        message: 'Comment deleted successfully',
        id: 1,
      });

      const res = await commentsController.delete(1, mockUser);
      expect(mockCommentsService.delete).toHaveBeenCalledWith(1, mockUser);
      expect(res.success).toBe(true);
    });
  });

  describe('ComplaintCommentsController', () => {
    it('should forward list comments to commentsService.findByComplaintId', async () => {
      mockCommentsService.findByComplaintId.mockResolvedValue([]);

      const res = await complaintCommentsController.findByComplaintId(101, mockUser);
      expect(mockCommentsService.findByComplaintId).toHaveBeenCalledWith(101, mockUser);
      expect(Array.isArray(res)).toBe(true);
    });

    it('should forward add comment to commentsService.create', async () => {
      const dto = { message: 'Inspection completed' };
      mockCommentsService.create.mockResolvedValue({
        id: 99,
        complaintId: 101,
        message: 'Inspection completed',
      });

      const res = await complaintCommentsController.create(101, dto, mockUser);
      expect(mockCommentsService.create).toHaveBeenCalledWith(101, dto, mockUser);
      expect(res.id).toBe(99);
    });
  });
});

