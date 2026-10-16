import { Injectable, NotFoundException } from '@nestjs/common';
import { Ticket } from './ticket.interface.js';

@Injectable()
export class TicketsService {
  private readonly tickets: Ticket[] = [
    {
      id: 1,
      subject: 'Ticket 1',
      priority: 'low',
      status: 'open',
      createdAt: '2023-01-01T00:00:00.000Z',
    },
    {
      id: 2,
      subject: 'Ticket 2',
      priority: 'medium',
      status: 'closed',
      createdAt: '2023-01-02T00:00:00.000Z',
    },
    {
      id: 3,
      subject: 'Ticket 3',
      priority: 'high',
      status: 'open',
      createdAt: '2023-01-03T00:00:00.000Z',
    },
  ];

  findAll(status?: Ticket['status'], priority?: Ticket['priority']) {
    let tickets = this.tickets;
    if(status) {
      tickets = tickets.filter((ticket) => ticket.status === status);
    }
    if(priority) {
      tickets = tickets.filter((ticket) => ticket.priority === priority);
    }
    return tickets;
  }
  findOne(id: number) {
    const ticket = this.tickets.find((ticket) => ticket.id === id);
    if (!ticket) {
      throw new NotFoundException(`Ticket with ID  ${id} not found`);
    }
    return ticket;
  }
}
