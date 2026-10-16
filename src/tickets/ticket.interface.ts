export interface Ticket {
  id: number;
  subject: string;
  priority: 'low' | 'medium' | 'high';
  status: 'open' | 'closed';
  createdAt: string;
}
