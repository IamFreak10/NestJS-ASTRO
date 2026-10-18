import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Ticket } from './ticket.interface.js';
import { CreateTicketDto } from './dto/create-ticket.dto.js';
import { UpdateTicketDto } from './dto/update-ticket-dto.js';

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
      status: 'closed',
      createdAt: '2023-01-03T00:00:00.000Z',
    },
  ];
  private nextTicketId = 4;

  findAll(status?: Ticket['status'], priority?: Ticket['priority']) {
    let tickets = this.tickets;
    if (status) {
      tickets = tickets.filter((ticket) => ticket.status === status);
    }
    if (priority) {
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

  create(createTicketDto: CreateTicketDto) {
    const ticket: Ticket = {
      id: this.nextTicketId++,
      subject: createTicketDto.subject,
      priority: createTicketDto.priority,
      status: 'open',
      createdAt: new Date().toISOString(),
    };
    this.tickets.push(ticket);
    return ticket;
  }
  update(id: number, updateTicketDto: UpdateTicketDto) {
    const ticket = this.findOne(id);
    if (ticket.status === 'closed') {
      throw new BadRequestException('Ticket is closed');
    }
    Object.assign(ticket, updateTicketDto);
    return ticket;
  }

  closeTicket(id: number) {
    const ticket = this.findOne(id);
    if (ticket.status === 'closed') {
      throw new BadRequestException('Ticket is already closed');
    }
    ticket.status = 'closed';
    return ticket;
  }
}
