import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { and, eq } from 'drizzle-orm';
import type { Ticket, NewTicket } from './ticket.interface.js';
import { CreateTicketDto } from './dto/create-ticket.dto.js';
import { UpdateTicketDto } from './dto/update-ticket-dto.js';
import { DRIZZLE_DB, type DrizzleDb } from '../database/database.tokens.js';
import { tickets } from '../database/schema/tickets.schema.js';

@Injectable()
export class TicketsService {
  constructor(@Inject(DRIZZLE_DB) private readonly db: DrizzleDb) {}

  async findAll(
    status?: Ticket['status'],
    priority?: Ticket['priority'],
  ): Promise<Ticket[]> {
    const conditions = [];
    if (status) {
      conditions.push(eq(tickets.status, status));
    }
    if (priority) {
      conditions.push(eq(tickets.priority, priority));
    }

    if (conditions.length > 0) {
      return await this.db
        .select()
        .from(tickets)
        .where(and(...conditions));
    }
    return await this.db.select().from(tickets);
  }

  async findOne(id: number): Promise<Ticket> {
    const results = await this.db
      .select()
      .from(tickets)
      .where(eq(tickets.id, id))
      .limit(1);

    const ticket = results[0];
    if (!ticket) {
      throw new NotFoundException(`Ticket with ID ${id} not found`);
    }
    return ticket;
  }

  async create(createTicketDto: CreateTicketDto): Promise<Ticket> {
    const insertResult = await this.db.insert(tickets).values({
      subject: createTicketDto.subject,
      description: createTicketDto.description,
      priority: createTicketDto.priority,
      status: 'open',
    });

    const insertId = insertResult[0].insertId;
    return await this.findOne(insertId);
  }

  async update(
    id: number,
    updateTicketDto: UpdateTicketDto,
  ): Promise<Ticket> {
    const ticket = await this.findOne(id);
    if (ticket.status === 'closed') {
      throw new BadRequestException('Ticket is closed');
    }

    const updateData: Partial<NewTicket> = {};
    if (updateTicketDto.subject !== undefined) {
      updateData.subject = updateTicketDto.subject;
    }
    if (updateTicketDto.description !== undefined) {
      updateData.description = updateTicketDto.description;
    }
    if (updateTicketDto.priority !== undefined) {
      updateData.priority = updateTicketDto.priority;
    }

    if (Object.keys(updateData).length > 0) {
      await this.db
        .update(tickets)
        .set(updateData)
        .where(eq(tickets.id, id));
    }

    return await this.findOne(id);
  }

  async closeTicket(id: number): Promise<Ticket> {
    const ticket = await this.findOne(id);
    if (ticket.status === 'closed') {
      throw new BadRequestException('Ticket is already closed');
    }

    await this.db
      .update(tickets)
      .set({ status: 'closed' })
      .where(eq(tickets.id, id));

    return await this.findOne(id);
  }
}
