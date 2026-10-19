import { describe, it, expect, beforeEach, vi } from 'vitest';
import {
  BadRequestException,
  ForbiddenException,
  UnauthorizedException,
} from '@nestjs/common';
import { ComplaintsService } from './complaints.service.js';
import type { AuthenticatedUser } from '../auth/auth.interface.js';

describe('ComplaintsService', () => {
  let service: ComplaintsService;
  let mockDb: any;

  const mockStudent1: AuthenticatedUser = {
    id: 'student-1',
    name: 'Rahim Khan',
    email: 'rahim@kcku.edu',
    emailVerified: true,
    image: null,
    role: 'student',
    studentId: 'KCKU-2024-001',
    department: 'CSE',
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const mockStudent2: AuthenticatedUser = {
    id: 'student-2',
    name: 'Karim Ali',
    email: 'karim@kcku.edu',
    emailVerified: true,
    image: null,
    role: 'student',
    studentId: 'KCKU-2024-002',
    department: 'EEE',
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const mockStaff: AuthenticatedUser = {
    id: 'staff-1',
    name: 'Warden Motaleb',
    email: 'motaleb@kcku.edu',
    emailVerified: true,
    image: null,
    role: 'staff',
    studentId: null,
    department: 'Hostel Committee',
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  beforeEach(() => {
    mockDb = {
      select: vi.fn(),
      insert: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
      transaction: vi.fn(),
    };
    service = new ComplaintsService(mockDb);
  });

  describe('create', () => {
    it('should insert a complaint and set authorId', async () => {
      mockDb.insert.mockReturnValue({
        values: vi.fn().mockResolvedValue([{ insertId: 10 }]),
      });

      const sampleCreated = {
        id: 10,
        title: 'Broken fan in Room 302',
        description: 'Room 302 fan is not spinning since morning',
        category: 'facilities',
        visibility: 'public',
        isAnonymous: false,
        priority: 'medium',
        status: 'submitted',
        upvotesCount: 0,
        resolutionNote: null,
        resolvedAt: null,
        createdAt: new Date(),
        updatedAt: new Date(),
        author: {
          id: mockStudent1.id,
          name: mockStudent1.name,
          department: mockStudent1.department,
        },
        hasUpvoted: false,
        comments: [],
      };

      vi.spyOn(service, 'findById').mockResolvedValue(sampleCreated as any);

      const result = await service.create(
        {
          title: 'Broken fan in Room 302',
          description: 'Room 302 fan is not spinning since morning',
          category: 'facilities',
          visibility: 'public',
          isAnonymous: false,
        },
        mockStudent1,
      );

      expect(result.id).toBe(10);
      expect(mockDb.insert).toHaveBeenCalled();
    });

    it('should default safety_bullying complaints to private visibility', async () => {
      let insertedValues: any;
      mockDb.insert.mockReturnValue({
        values: vi.fn().mockImplementation((val) => {
          insertedValues = val;
          return Promise.resolve([{ insertId: 11 }]);
        }),
      });

      vi.spyOn(service, 'findById').mockResolvedValue({ id: 11 } as any);

      await service.create(
        {
          title: 'Ragging incident near north hostel',
          description: 'Seniors gathering outside hall 2 asking for personal items',
          category: 'safety_bullying',
          isAnonymous: true,
        },
        mockStudent1,
      );

      expect(insertedValues.visibility).toBe('private');
      expect(insertedValues.isAnonymous).toBe(true);
    });
  });

  describe('Privacy Gate (findPublic & findById)', () => {
    it('should mask author identity when isAnonymous is true in public feed', async () => {
      const mockRawRows = [
        {
          id: 1,
          title: 'Dirty dining hall tables',
          description: 'Tables in central cafeteria are not cleaned',
          category: 'hostel_canteen',
          visibility: 'public',
          isAnonymous: true, // Anonymous!
          priority: 'medium',
          status: 'submitted',
          upvotesCount: 5,
          resolutionNote: null,
          resolvedAt: null,
          createdAt: new Date(),
          updatedAt: new Date(),
          authorId: 'student-1',
          authorName: 'Rahim Khan',
          authorDepartment: 'CSE',
        },
        {
          id: 2,
          title: 'Bus route 4 delayed daily',
          description: 'Bus 4 arrives 30 mins late to town center',
          category: 'transport',
          visibility: 'public',
          isAnonymous: false, // Non-anonymous
          priority: 'high',
          status: 'in_progress',
          upvotesCount: 12,
          resolutionNote: null,
          resolvedAt: null,
          createdAt: new Date(),
          updatedAt: new Date(),
          authorId: 'student-2',
          authorName: 'Karim Ali',
          authorDepartment: 'EEE',
        },
      ];

      // Setup chain for select().from().leftJoin().where().orderBy().limit().offset()
      mockDb.select.mockReturnValueOnce({
        from: vi.fn().mockReturnValue({
          leftJoin: vi.fn().mockReturnValue({
            where: vi.fn().mockReturnValue({
              orderBy: vi.fn().mockReturnValue({
                limit: vi.fn().mockReturnValue({
                  offset: vi.fn().mockResolvedValue(mockRawRows),
                }),
              }),
            }),
          }),
        }),
      });

      // Total count query
      mockDb.select.mockReturnValueOnce({
        from: vi.fn().mockReturnValue({
          where: vi.fn().mockResolvedValue([{ count: 2 }]),
        }),
      });

      const res = await service.findPublic({});
      expect(res.items.length).toBe(2);

      // Verify Anonymous masking on item 1
      expect(res.items[0].author.name).toBe('Anonymous Student 🕶️');
      expect(res.items[0].author.id).toBeNull();

      // Verify Non-anonymous author on item 2
      expect(res.items[1].author.name).toBe('Karim Ali');
      expect(res.items[1].author.id).toBe('student-2');
    });

    it('should throw UnauthorizedException if unauthenticated visitor requests private complaint', async () => {
      mockDb.select.mockReturnValue({
        from: vi.fn().mockReturnValue({
          leftJoin: vi.fn().mockReturnValue({
            where: vi.fn().mockReturnValue({
              limit: vi.fn().mockResolvedValue([
                {
                  id: 99,
                  authorId: 'student-1',
                  visibility: 'private', // Private grievance
                  isAnonymous: true,
                },
              ]),
            }),
          }),
        }),
      });

      await expect(service.findById(99, undefined)).rejects.toThrow(
        UnauthorizedException,
      );
    });

    it('should throw ForbiddenException if another student attempts to view private grievance (IDOR protection)', async () => {
      mockDb.select.mockReturnValue({
        from: vi.fn().mockReturnValue({
          leftJoin: vi.fn().mockReturnValue({
            where: vi.fn().mockReturnValue({
              limit: vi.fn().mockResolvedValue([
                {
                  id: 99,
                  authorId: 'student-1',
                  visibility: 'private',
                  isAnonymous: true,
                },
              ]),
            }),
          }),
        }),
      });

      // Student 2 tries to access Student 1's private report
      await expect(service.findById(99, mockStudent2)).rejects.toThrow(
        ForbiddenException,
      );
    });

    it('should allow proctor/staff to view private grievance', async () => {
      mockDb.select
        // 1. Complaint select
        .mockReturnValueOnce({
          from: vi.fn().mockReturnValue({
            leftJoin: vi.fn().mockReturnValue({
              where: vi.fn().mockReturnValue({
                limit: vi.fn().mockResolvedValue([
                  {
                    id: 99,
                    authorId: 'student-1',
                    visibility: 'private',
                    isAnonymous: true,
                    title: 'Harassment report',
                    description: 'Confidential message',
                    category: 'safety_bullying',
                    priority: 'urgent',
                    status: 'under_review',
                    upvotesCount: 0,
                    resolutionNote: null,
                    resolvedAt: null,
                    createdAt: new Date(),
                    updatedAt: new Date(),
                    userName: 'Rahim Khan',
                    userDepartment: 'CSE',
                  },
                ]),
              }),
            }),
          }),
        })
        // 2. Upvote check
        .mockReturnValueOnce({
          from: vi.fn().mockReturnValue({
            where: vi.fn().mockReturnValue({
              limit: vi.fn().mockResolvedValue([]),
            }),
          }),
        })
        // 3. Comments query
        .mockReturnValueOnce({
          from: vi.fn().mockReturnValue({
            leftJoin: vi.fn().mockReturnValue({
              where: vi.fn().mockReturnValue({
                orderBy: vi.fn().mockResolvedValue([]),
              }),
            }),
          }),
        });

      const result = await service.findById(99, mockStaff);
      expect(result.id).toBe(99);
      expect(result.visibility).toBe('private');
    });
  });

  describe('toggleUpvote', () => {
    it('should throw BadRequestException when trying to upvote private complaint', async () => {
      mockDb.transaction.mockImplementation(async (callback: any) => {
        const tx = {
          select: vi.fn().mockReturnValue({
            from: vi.fn().mockReturnValue({
              where: vi.fn().mockReturnValue({
                limit: vi.fn().mockResolvedValue([
                  { id: 10, visibility: 'private', upvotesCount: 0 },
                ]),
              }),
            }),
          }),
        };
        return callback(tx);
      });

      await expect(
        service.toggleUpvote(10, mockStudent1.id),
      ).rejects.toThrow(BadRequestException);
    });

    it('should increment upvotes and return upvoted: true when user votes for first time', async () => {
      mockDb.transaction.mockImplementation(async (callback: any) => {
        const tx = {
          select: vi
            .fn()
            .mockReturnValueOnce({
              from: vi.fn().mockReturnValue({
                where: vi.fn().mockReturnValue({
                  limit: vi.fn().mockResolvedValue([
                    { id: 5, visibility: 'public', upvotesCount: 3 },
                  ]),
                }),
              }),
            })
            .mockReturnValueOnce({
              from: vi.fn().mockReturnValue({
                where: vi.fn().mockReturnValue({
                  limit: vi.fn().mockResolvedValue([]), // No existing vote
                }),
              }),
            }),
          insert: vi.fn().mockReturnValue({
            values: vi.fn().mockResolvedValue([{ insertId: 1 }]),
          }),
          update: vi.fn().mockReturnValue({
            set: vi.fn().mockReturnValue({
              where: vi.fn().mockResolvedValue([{ affectedRows: 1 }]),
            }),
          }),
        };
        return callback(tx);
      });

      const res = await service.toggleUpvote(5, mockStudent1.id);
      expect(res).toEqual({
        upvoted: true,
        upvotesCount: 4,
        complaintId: 5,
      });
    });

    it('should decrement upvotes and return upvoted: false when user toggles vote off', async () => {
      mockDb.transaction.mockImplementation(async (callback: any) => {
        const tx = {
          select: vi
            .fn()
            .mockReturnValueOnce({
              from: vi.fn().mockReturnValue({
                where: vi.fn().mockReturnValue({
                  limit: vi.fn().mockResolvedValue([
                    { id: 5, visibility: 'public', upvotesCount: 4 },
                  ]),
                }),
              }),
            })
            .mockReturnValueOnce({
              from: vi.fn().mockReturnValue({
                where: vi.fn().mockReturnValue({
                  limit: vi.fn().mockResolvedValue([{ id: 101, complaintId: 5, userId: mockStudent1.id }]),
                }),
              }),
            }),
          delete: vi.fn().mockReturnValue({
            where: vi.fn().mockResolvedValue([{ affectedRows: 1 }]),
          }),
          update: vi.fn().mockReturnValue({
            set: vi.fn().mockReturnValue({
              where: vi.fn().mockResolvedValue([{ affectedRows: 1 }]),
            }),
          }),
        };
        return callback(tx);
      });

      const res = await service.toggleUpvote(5, mockStudent1.id);
      expect(res).toEqual({
        upvoted: false,
        upvotesCount: 3,
        complaintId: 5,
      });
    });
  });

  describe('updateStatus', () => {
    it('should throw ForbiddenException if student attempts to change complaint status', async () => {
      await expect(
        service.updateStatus(1, { status: 'resolved' }, mockStudent1),
      ).rejects.toThrow(ForbiddenException);
    });

    it('should update status and record resolution note when staff updates', async () => {
      mockDb.select.mockReturnValue({
        from: vi.fn().mockReturnValue({
          where: vi.fn().mockReturnValue({
            limit: vi.fn().mockResolvedValue([
              { id: 1, status: 'in_progress', resolutionNote: null, resolvedAt: null },
            ]),
          }),
        }),
      });

      mockDb.update.mockReturnValue({
        set: vi.fn().mockReturnValue({
          where: vi.fn().mockResolvedValue([{ affectedRows: 1 }]),
        }),
      });

      mockDb.insert.mockReturnValue({
        values: vi.fn().mockResolvedValue([{ insertId: 2 }]),
      });

      vi.spyOn(service, 'findById').mockResolvedValue({
        id: 1,
        status: 'resolved',
        resolutionNote: 'Hall 3 water filter replaced & cleaned',
      } as any);

      const res = await service.updateStatus(
        1,
        {
          status: 'resolved',
          resolutionNote: 'Hall 3 water filter replaced & cleaned',
          commentMessage: 'Official verification complete',
        },
        mockStaff,
      );

      expect(res.status).toBe('resolved');
      expect(mockDb.update).toHaveBeenCalled();
      expect(mockDb.insert).toHaveBeenCalled();
    });
  });
});
