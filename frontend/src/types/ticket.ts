export type TicketPriority = 'low' | 'medium' | 'high';
export type TicketStatus = 'open' | 'closed';

export interface Ticket {
  id: number;
  subject: string;
  description: string | null;
  priority: TicketPriority;
  status: TicketStatus;
  createdAt: string;
}

export interface CreateTicketPayload {
  subject: string;
  description: string;
  priority: TicketPriority;
}

export interface UpdateTicketPayload {
  subject?: string;
  description?: string;
  priority?: TicketPriority;
}

