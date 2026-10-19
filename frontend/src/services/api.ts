import type {
  Complaint,
  ComplaintCategory,
  ComplaintStatus,
} from '../types/complaint.js';

const API_BASE_URL =
  import.meta.env.PUBLIC_API_URL || 'http://localhost:3000/api';

interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string | string[];
}

export interface CreateComplaintPayload {
  title: string;
  description: string;
  category: ComplaintCategory;
  visibility?: 'public' | 'private';
  isAnonymous?: boolean;
  priority?: 'low' | 'medium' | 'high' | 'urgent';
}

/**
 * Fetch public complaints feed with optional category, status, and search filters
 */
export async function fetchPublicComplaints(
  category?: ComplaintCategory | 'all',
  status?: ComplaintStatus | 'all',
  search?: string,
): Promise<{ items: Complaint[]; total: number }> {
  const query = new URLSearchParams();
  if (category && category !== 'all') {
    query.append('category', category);
  }
  if (status && status !== 'all') {
    query.append('status', status);
  }
  if (search && search.trim() !== '') {
    query.append('search', search.trim());
  }

  const queryString = query.toString();
  const url = `${API_BASE_URL}/complaints/public${queryString ? `?${queryString}` : ''}`;

  const res = await fetch(url, { credentials: 'include' });
  if (!res.ok) {
    throw new Error(`Failed to load complaints: ${res.statusText}`);
  }

  const json: ApiResponse<{ items: Complaint[]; total: number }> = await res.json();
  return json.data;
}

/**
 * Fetch complaints created by the logged-in student (dashboard)
 */
export async function fetchMyComplaints(): Promise<Complaint[]> {
  const res = await fetch(`${API_BASE_URL}/complaints/my`, {
    credentials: 'include',
  });
  if (!res.ok) {
    throw new Error(`Failed to load personal complaints: ${res.statusText}`);
  }
  const json: ApiResponse<Complaint[]> = await res.json();
  return json.data;
}

/**
 * Submit a new complaint or sealed grievance
 */
export async function createComplaint(
  payload: CreateComplaintPayload,
): Promise<Complaint> {
  const res = await fetch(`${API_BASE_URL}/complaints`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify(payload),
  });

  const json: ApiResponse<Complaint> = await res.json();
  if (!res.ok) {
    const errorMsg = Array.isArray(json.message)
      ? json.message.join(', ')
      : json.message || 'Failed to file complaint';
    throw new Error(errorMsg);
  }

  return json.data;
}

/**
 * Toggle "+1 Me Too" upvote on a complaint
 */
export async function toggleUpvote(
  complaintId: number,
): Promise<{ upvoted: boolean; upvotesCount: number }> {
  const res = await fetch(`${API_BASE_URL}/complaints/${complaintId}/upvote`, {
    method: 'POST',
    credentials: 'include',
  });

  const json: ApiResponse<{ upvoted: boolean; upvotesCount: number }> =
    await res.json();
  if (!res.ok) {
    throw new Error(
      (json.message as string) || 'Authentication required to upvote',
    );
  }

  return json.data;
}

/**
 * Get current session user
 */
export async function getMe(): Promise<any> {
  try {
    const res = await fetch(`${API_BASE_URL}/auth/me`, {
      credentials: 'include',
    });
    if (!res.ok) return null;
    const json = await res.json();
    return json.data;
  } catch {
    return null;
  }
}
