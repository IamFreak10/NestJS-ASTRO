import { describe, it, expect, beforeEach, vi } from 'vitest';
import { ComplaintsController } from './complaints.controller.js';
import type { AuthenticatedUser } from '../auth/auth.interface.js';

describe('ComplaintsController', () => {
  let controller: ComplaintsController;
  let mockService: any;

  const mockUser: AuthenticatedUser = {
    id: 'user-std-1',
    name: 'Tamim Iqbal',
    email: 'tamim@kcku.edu',
    emailVerified: true,
    image: null,
    role: 'student',
    studentId: 'KCKU-2024-007',
    department: 'CSE',
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  beforeEach(() => {
    mockService = {
      create: vi.fn(),
      findPublic: vi.fn(),
      findMyComplaints: vi.fn(),
      findById: vi.fn(),
      toggleUpvote: vi.fn(),
      updateStatus: vi.fn(),
      addComment: vi.fn(),
    };
    controller = new ComplaintsController(mockService);
  });

  describe('create', () => {
    it('should forward create request to complaintsService', async () => {
      const dto = {
        title: 'Broken projector in lab 3',
        description: 'HDMI port loose and flickering red colors',
        category: 'facilities' as const,
      };
      mockService.create.mockResolvedValue({ id: 1, ...dto });

      const res = await controller.create(dto, mockUser);
      expect(mockService.create).toHaveBeenCalledWith(dto, mockUser);
      expect(res.id).toBe(1);
    });
  });

  describe('findPublic', () => {
    it('should pass query filters and current user id to findPublic', async () => {
      const query = { category: 'transport' as const, page: 1, limit: 10 };
      mockService.findPublic.mockResolvedValue({ items: [], total: 0, page: 1, limit: 10 });

      await controller.findPublic(query, mockUser);
      expect(mockService.findPublic).toHaveBeenCalledWith(query, mockUser.id);
    });
  });

  describe('toggleUpvote', () => {
    it('should pass complaint ID and user ID to toggleUpvote', async () => {
      mockService.toggleUpvote.mockResolvedValue({ upvoted: true, upvotesCount: 1, complaintId: 4 });

      const res = await controller.toggleUpvote(4, mockUser);
      expect(mockService.toggleUpvote).toHaveBeenCalledWith(4, mockUser.id);
      expect(res.upvoted).toBe(true);
    });
  });
});

