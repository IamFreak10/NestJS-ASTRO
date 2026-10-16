import { Injectable } from '@nestjs/common';
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

  findAll() {
    return this.tickets;
  }
  findOne(id: number) {
    return this.tickets.find((ticket) => ticket.id === id);
  }
}
