import { describe, it, expect, beforeEach, vi } from 'vitest';
import {
  BadRequestException,
  ForbiddenException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { CommentsService } from './comments.service.js';
import type { AuthenticatedUser } from '../auth/auth.interface.js';

describe('CommentsService', () => {
  let service: CommentsService;
  let mockDb: any;

  const mockStudent1: AuthenticatedUser = {
    id: 'student-1',
    name: 'Tanvir Hossain',
    email: 'tanvir@kcku.edu',
    emailVerified: true,
    image: 'https://example.com/tanvir.jpg',
    role: 'student',
    studentId: 'BU-2023-0101',
    department: 'CSE',
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const mockStudent2: AuthenticatedUser = {
    id: 'student-2',
    name: 'Anika Rahman',
    email: 'anika@kcku.edu',
    emailVerified: true,
    image: 'https://example.com/anika.jpg',
    role: 'student',
    studentId: 'BU-2023-0205',
    department: 'BBA',
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const mockStaff: AuthenticatedUser = {
    id: 'staff-1',
    name: 'Kamal Uddin',
    email: 'kamal@kcku.edu',
    emailVerified: true,
    image: 'https://example.com/kamal.jpg',
    role: 'staff',
    studentId: null,
    department: 'Maintenance',
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const mockAdmin: AuthenticatedUser = {
    id: 'admin-1',
    name: 'Dr. Rafiqul Islam',
    email: 'proctor@kcku.edu',
    emailVerified: true,
    image: 'https://example.com/proctor.jpg',
    role: 'admin',
    studentId: null,
    department: 'Proctor Office',
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  beforeEach(() => {
    mockDb = {
      select: vi.fn(),
      insert: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
    };
    service = new CommentsService(mockDb);
  });

  describe('create', () => {
    it('should throw BadRequestException if message is empty', async () => {
      await expect(
        service.create(1, { message: '   ' }, mockStudent1),
      ).rejects.toThrow(BadRequestException);
    });

    it('should throw NotFoundException if complaint does not exist', async () => {
      mockDb.select.mockReturnValue({
        from: vi.fn().mockReturnValue({
          where: vi.fn().mockReturnValue({
            limit: vi.fn().mockResolvedValue([]),
          }),
        }),
      });

      await expect(
        service.create(999, { message: 'Hello' }, mockStudent1),
      ).rejects.toThrow(NotFoundException);
    });

    it('should throw ForbiddenException if another student comments on private complaint (IDOR)', async () => {
      mockDb.select.mockReturnValue({
        from: vi.fn().mockReturnValue({
          where: vi.fn().mockReturnValue({
            limit: vi.fn().mockResolvedValue([
              { id: 10, authorId: 'student-owner', visibility: 'private' },
            ]),
          }),
        }),
      });

      await expect(
        service.create(10, { message: 'Sneaking in' }, mockStudent1),
      ).rejects.toThrow(ForbiddenException);
    });

    it('should insert comment successfully and force isInternalNote to false for students', async () => {
      mockDb.select.mockReturnValue({
        from: vi.fn().mockReturnValue({
          where: vi.fn().mockReturnValue({
            limit: vi.fn().mockResolvedValue([
              { id: 1, authorId: mockStudent1.id, visibility: 'public' },
            ]),
          }),
        }),
      });

      const insertValuesSpy = vi.fn().mockResolvedValue([{ insertId: 55 }]);
      mockDb.insert.mockReturnValue({ values: insertValuesSpy });

      const res = await service.create(
        1,
        { message: 'Water leaking has increased', isInternalNote: true },
        mockStudent1,
      );

      expect(insertValuesSpy).toHaveBeenCalledWith(
        expect.objectContaining({
          complaintId: 1,
          authorId: mockStudent1.id,
          message: 'Water leaking has increased',
          isInternalNote: false, // Student cannot set internal note
        }),
      );
      expect(res.id).toBe(55);
      expect(res.authorName).toBe('Tanvir Hossain');
      expect(res.authorImage).toBe('https://example.com/tanvir.jpg');
    });

    it('should allow staff to create internal departmental note', async () => {
      mockDb.select.mockReturnValue({
        from: vi.fn().mockReturnValue({
          where: vi.fn().mockReturnValue({
            limit: vi.fn().mockResolvedValue([
              { id: 1, authorId: 'student-1', visibility: 'public' },
            ]),
          }),
        }),
      });

      const insertValuesSpy = vi.fn().mockResolvedValue([{ insertId: 56 }]);
      mockDb.insert.mockReturnValue({ values: insertValuesSpy });

      const res = await service.create(
        1,
        { message: 'Gasket requisition sent to central warehouse', isInternalNote: true },
        mockStaff,
      );

      expect(insertValuesSpy).toHaveBeenCalledWith(
        expect.objectContaining({
          complaintId: 1,
          authorId: mockStaff.id,
          message: 'Gasket requisition sent to central warehouse',
          isInternalNote: true,
        }),
      );
      expect(res.isInternalNote).toBe(true);
    });
  });

  describe('findByComplaintId', () => {
    it('should throw UnauthorizedException if anonymous visitor requests private complaint comments', async () => {
      mockDb.select.mockReturnValue({
        from: vi.fn().mockReturnValue({
          where: vi.fn().mockReturnValue({
            limit: vi.fn().mockResolvedValue([
              { id: 5, authorId: 'owner-id', visibility: 'private' },
            ]),
          }),
        }),
      });

      await expect(service.findByComplaintId(5, undefined)).rejects.toThrow(
        UnauthorizedException,
      );
    });

    it('should filter out internal notes for regular student viewers', async () => {
      // 1. Complaint exists
      mockDb.select.mockReturnValueOnce({
        from: vi.fn().mockReturnValue({
          where: vi.fn().mockReturnValue({
            limit: vi.fn().mockResolvedValue([
              { id: 1, authorId: mockStudent1.id, visibility: 'public' },
            ]),
          }),
        }),
      });

      // 2. Comments query
      const mockRows = [
        {
          id: 1,
          complaintId: 1,
          message: 'Public student note',
          statusChangeTo: null,
          isInternalNote: false,
          createdAt: new Date(),
          authorId: mockStudent1.id,
          authorName: mockStudent1.name,
          authorImage: mockStudent1.image,
          authorDepartment: mockStudent1.department,
          authorRole: 'student',
        },
      ];

      mockDb.select.mockReturnValueOnce({
        from: vi.fn().mockReturnValue({
          leftJoin: vi.fn().mockReturnValue({
            where: vi.fn().mockReturnValue({
              orderBy: vi.fn().mockResolvedValue(mockRows),
            }),
          }),
        }),
      });

      const comments = await service.findByComplaintId(1, mockStudent1);
      expect(comments.length).toBe(1);
      expect(comments[0].message).toBe('Public student note');
      expect(comments[0].authorImage).toBe('https://example.com/tanvir.jpg');
    });
  });

  describe('update', () => {
    it('should throw BadRequestException if update message is empty', async () => {
      await expect(
        service.update(10, { message: '' }, mockStudent1),
      ).rejects.toThrow(BadRequestException);
    });

    it('should throw NotFoundException if comment does not exist', async () => {
      mockDb.select.mockReturnValue({
        from: vi.fn().mockReturnValue({
          where: vi.fn().mockReturnValue({
            limit: vi.fn().mockResolvedValue([]),
          }),
        }),
      });

      await expect(
        service.update(999, { message: 'Valid text' }, mockStudent1),
      ).rejects.toThrow(NotFoundException);
    });

    it('should throw ForbiddenException if another student attempts to edit comment', async () => {
      mockDb.select.mockReturnValue({
        from: vi.fn().mockReturnValue({
          where: vi.fn().mockReturnValue({
            limit: vi.fn().mockResolvedValue([
              { id: 12, authorId: 'student-original', message: 'Original' },
            ]),
          }),
        }),
      });

      await expect(
        service.update(12, { message: 'Hacked message' }, mockStudent2),
      ).rejects.toThrow(ForbiddenException);
    });

    it('should allow original author to update their comment', async () => {
      mockDb.select.mockReturnValueOnce({
        from: vi.fn().mockReturnValue({
          where: vi.fn().mockReturnValue({
            limit: vi.fn().mockResolvedValue([
              { id: 12, authorId: mockStudent1.id, message: 'Original' },
            ]),
          }),
        }),
      });

      const updateSetSpy = vi.fn().mockReturnValue({
        where: vi.fn().mockResolvedValue([{ affectedRows: 1 }]),
      });
      mockDb.update.mockReturnValue({ set: updateSetSpy });

      // Mock findById for return value
      vi.spyOn(service, 'findById').mockResolvedValue({
        id: 12,
        complaintId: 1,
        authorId: mockStudent1.id,
        authorName: mockStudent1.name,
        authorImage: mockStudent1.image ?? null,
        message: 'Updated text content',
        isInternalNote: false,
        createdAt: new Date(),
      });

      const res = await service.update(
        12,
        { message: 'Updated text content' },
        mockStudent1,
      );

      expect(updateSetSpy).toHaveBeenCalledWith({ message: 'Updated text content' });
      expect(res.message).toBe('Updated text content');
    });

    it('should allow admin to edit any comment for moderation', async () => {
      mockDb.select.mockReturnValueOnce({
        from: vi.fn().mockReturnValue({
          where: vi.fn().mockReturnValue({
            limit: vi.fn().mockResolvedValue([
              { id: 12, authorId: 'student-other', message: 'Inappropriate content' },
            ]),
          }),
        }),
      });

      const updateSetSpy = vi.fn().mockReturnValue({
        where: vi.fn().mockResolvedValue([{ affectedRows: 1 }]),
      });
      mockDb.update.mockReturnValue({ set: updateSetSpy });

      vi.spyOn(service, 'findById').mockResolvedValue({
        id: 12,
        complaintId: 1,
        authorId: 'student-other',
        authorName: 'Other Student',
        authorImage: null,
        message: '[Comment moderated by administration]',
        isInternalNote: false,
        createdAt: new Date(),
      });

      const res = await service.update(
        12,
        { message: '[Comment moderated by administration]' },
        mockAdmin,
      );

      expect(res.message).toBe('[Comment moderated by administration]');
    });
  });

  describe('delete', () => {
    it('should throw NotFoundException if comment to delete does not exist', async () => {
      mockDb.select.mockReturnValue({
        from: vi.fn().mockReturnValue({
          where: vi.fn().mockReturnValue({
            limit: vi.fn().mockResolvedValue([]),
          }),
        }),
      });

      await expect(service.delete(888, mockStudent1)).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should throw ForbiddenException if another student attempts to delete comment', async () => {
      mockDb.select.mockReturnValue({
        from: vi.fn().mockReturnValue({
          where: vi.fn().mockReturnValue({
            limit: vi.fn().mockResolvedValue([
              { id: 20, authorId: 'student-original' },
            ]),
          }),
        }),
      });

      await expect(service.delete(20, mockStudent2)).rejects.toThrow(
        ForbiddenException,
      );
    });

    it('should allow original author to delete their own comment', async () => {
      mockDb.select.mockReturnValue({
        from: vi.fn().mockReturnValue({
          where: vi.fn().mockReturnValue({
            limit: vi.fn().mockResolvedValue([
              { id: 20, authorId: mockStudent1.id },
            ]),
          }),
        }),
      });

      const deleteWhereSpy = vi.fn().mockResolvedValue([{ affectedRows: 1 }]);
      mockDb.delete.mockReturnValue({ where: deleteWhereSpy });

      const res = await service.delete(20, mockStudent1);
      expect(deleteWhereSpy).toHaveBeenCalled();
      expect(res.success).toBe(true);
      expect(res.id).toBe(20);
    });

    it('should allow staff or admin to delete an inappropriate comment', async () => {
      mockDb.select.mockReturnValue({
        from: vi.fn().mockReturnValue({
          where: vi.fn().mockReturnValue({
            limit: vi.fn().mockResolvedValue([
              { id: 20, authorId: 'student-original' },
            ]),
          }),
        }),
      });

      const deleteWhereSpy = vi.fn().mockResolvedValue([{ affectedRows: 1 }]);
      mockDb.delete.mockReturnValue({ where: deleteWhereSpy });

      const res = await service.delete(20, mockStaff);
      expect(res.success).toBe(true);
    });
  });
});

