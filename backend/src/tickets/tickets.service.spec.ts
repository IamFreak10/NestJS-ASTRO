import { describe, it, expect, beforeEach, vi } from 'vitest';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { TicketsService } from './tickets.service.js';
import type { DrizzleDb } from '../database/database.tokens.js';
import type { Ticket } from './ticket.interface.js';

describe('TicketsService', () => {
  let service: TicketsService;
  let mockDb: any;

  const sampleTicket: Ticket = {
    id: 1,
    subject: 'Issue with payment',
    description: 'Cannot process card',
    priority: 'high',
    status: 'open',
    createdAt: new Date('2026-01-01T00:00:00.000Z'),
  };

  beforeEach(() => {
    mockDb = {
      select: vi.fn(),
      insert: vi.fn(),
      update: vi.fn(),
    };
    service = new TicketsService(mockDb as unknown as DrizzleDb);
  });

  describe('findAll', () => {
    it('should return all tickets when no filters provided', async () => {
      mockDb.select.mockReturnValue({
        from: vi.fn().mockResolvedValue([sampleTicket]),
      });

      const result = await service.findAll();
      expect(result).toEqual([sampleTicket]);
    });

    it('should apply where clause when filters are provided', async () => {
      const mockWhere = vi.fn().mockResolvedValue([sampleTicket]);
      mockDb.select.mockReturnValue({
        from: vi.fn().mockReturnValue({
          where: mockWhere,
        }),
      });

      const result = await service.findAll('open', 'high');
      expect(result).toEqual([sampleTicket]);
      expect(mockWhere).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('should return the ticket when it exists', async () => {
      mockDb.select.mockReturnValue({
        from: vi.fn().mockReturnValue({
          where: vi.fn().mockReturnValue({
            limit: vi.fn().mockResolvedValue([sampleTicket]),
          }),
        }),
      });

      const result = await service.findOne(1);
      expect(result).toEqual(sampleTicket);
    });

    it('should throw NotFoundException when ticket does not exist', async () => {
      mockDb.select.mockReturnValue({
        from: vi.fn().mockReturnValue({
          where: vi.fn().mockReturnValue({
            limit: vi.fn().mockResolvedValue([]),
          }),
        }),
      });

      await expect(service.findOne(999)).rejects.toThrow(NotFoundException);
    });
  });

  describe('create', () => {
    it('should insert and return the newly created ticket', async () => {
      mockDb.insert.mockReturnValue({
        values: vi.fn().mockResolvedValue([{ insertId: 2 }]),
      });

      const createdTicket: Ticket = {
        ...sampleTicket,
        id: 2,
        subject: 'New Ticket',
      };

      vi.spyOn(service, 'findOne').mockResolvedValue(createdTicket);

      const result = await service.create({
        subject: 'New Ticket',
        description: 'New Description',
        priority: 'high',
      });

      expect(result).toEqual(createdTicket);
      expect(mockDb.insert).toHaveBeenCalled();
    });
  });

  describe('update', () => {
    it('should throw BadRequestException if ticket is already closed', async () => {
      const closedTicket: Ticket = { ...sampleTicket, status: 'closed' };
      vi.spyOn(service, 'findOne').mockResolvedValue(closedTicket);

      await expect(
        service.update(1, { subject: 'Updated title' }),
      ).rejects.toThrow(BadRequestException);
    });

    it('should update and return the ticket if ticket is open', async () => {
      vi.spyOn(service, 'findOne').mockResolvedValue(sampleTicket);
      const mockWhere = vi.fn().mockResolvedValue({});
      mockDb.update.mockReturnValue({
        set: vi.fn().mockReturnValue({
          where: mockWhere,
        }),
      });

      const result = await service.update(1, { subject: 'Updated title' });
      expect(result).toEqual(sampleTicket);
      expect(mockDb.update).toHaveBeenCalled();
    });
  });

  describe('closeTicket', () => {
    it('should throw BadRequestException if ticket is already closed', async () => {
      const closedTicket: Ticket = { ...sampleTicket, status: 'closed' };
      vi.spyOn(service, 'findOne').mockResolvedValue(closedTicket);

      await expect(service.closeTicket(1)).rejects.toThrow(
        BadRequestException,
      );
    });

    it('should update status to closed and return ticket', async () => {
      vi.spyOn(service, 'findOne').mockResolvedValue(sampleTicket);
      const mockWhere = vi.fn().mockResolvedValue({});
      mockDb.update.mockReturnValue({
        set: vi.fn().mockReturnValue({
          where: mockWhere,
        }),
      });

      const result = await service.closeTicket(1);
      expect(result).toEqual(sampleTicket);
      expect(mockDb.update).toHaveBeenCalled();
    });
  });
});

