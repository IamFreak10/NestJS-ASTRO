export type ComplaintCategory =
  | 'facilities'
  | 'hostel_canteen'
  | 'transport'
  | 'academics'
  | 'safety_bullying'
  | 'administration';

export type ComplaintVisibility = 'public' | 'private';
export type ComplaintPriority = 'low' | 'medium' | 'high' | 'urgent';
export type ComplaintStatus =
  | 'submitted'
  | 'under_review'
  | 'in_progress'
  | 'resolved'
  | 'rejected';

export interface ComplaintAuthor {
  id: string | null;
  name: string;
  department: string | null;
}

export interface Complaint {
  id: number;
  title: string;
  description: string;
  category: ComplaintCategory;
  visibility: ComplaintVisibility;
  isAnonymous: boolean;
  priority: ComplaintPriority;
  status: ComplaintStatus;
  upvotesCount: number;
  resolutionNote: string | null;
  resolvedAt: string | null;
  createdAt: string;
  updatedAt: string;
  author: ComplaintAuthor;
  hasUpvoted?: boolean;
}

