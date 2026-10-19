import type {
  Ticket,
  CreateTicketPayload,
  UpdateTicketPayload,
  TicketStatus,
  TicketPriority,
} from '../types/ticket.js';

const API_BASE_URL =
  import.meta.env.PUBLIC_API_URL || 'http://localhost:3000/api';

interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string | string[];
}

export async function fetchTickets(
  status?: TicketStatus | 'all',
  priority?: TicketPriority | 'all',
): Promise<Ticket[]> {
  const query = new URLSearchParams();
  if (status && status !== 'all') {
    query.append('status', status);
  }
  if (priority && priority !== 'all') {
    query.append('priority', priority);
  }

  const queryString = query.toString();
  const url = `${API_BASE_URL}/tickets${queryString ? `?${queryString}` : ''}`;

  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(`Failed to fetch tickets: ${res.statusText}`);
  }

  const json: ApiResponse<Ticket[]> = await res.json();
  return json.data;
}

export async function fetchTicketById(id: number): Promise<Ticket> {
  const res = await fetch(`${API_BASE_URL}/tickets/${id}`);
  if (!res.ok) {
    throw new Error(`Failed to fetch ticket #${id}`);
  }
  const json: ApiResponse<Ticket> = await res.json();
  return json.data;
}

export async function createTicket(
  payload: CreateTicketPayload,
): Promise<Ticket> {
  const res = await fetch(`${API_BASE_URL}/tickets`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  const json: ApiResponse<Ticket> = await res.json();
  if (!res.ok) {
    const errorMsg = Array.isArray(json.message)
      ? json.message.join(', ')
      : json.message || 'Failed to create ticket';
    throw new Error(errorMsg);
  }

  return json.data;
}

export async function updateTicket(
  id: number,
  payload: UpdateTicketPayload,
): Promise<Ticket> {
  const res = await fetch(`${API_BASE_URL}/tickets/${id}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  const json: ApiResponse<Ticket> = await res.json();
  if (!res.ok) {
    const errorMsg = Array.isArray(json.message)
      ? json.message.join(', ')
      : json.message || 'Failed to update ticket';
    throw new Error(errorMsg);
  }

  return json.data;
}

export async function closeTicket(
  id: number,
  staffKey = 'helpdesk-staff-secret',
): Promise<Ticket> {
  const res = await fetch(`${API_BASE_URL}/tickets/${id}/close`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      'staff-key': staffKey,
    },
  });

  const json: ApiResponse<Ticket> = await res.json();
  if (!res.ok) {
    const errorMsg = Array.isArray(json.message)
      ? json.message.join(', ')
      : json.message || 'Failed to close ticket. Please verify your Staff Key.';
    throw new Error(errorMsg);
  }

  return json.data;
}

