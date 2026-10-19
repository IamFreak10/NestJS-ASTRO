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

export interface ComplaintAuthorView {
  id: string | null;
  name: string;
  department: string | null;
}

export interface ComplaintResponseItem {
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
  resolvedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
  author: ComplaintAuthorView;
  hasUpvoted?: boolean;
}

export interface UpvoteResult {
  upvoted: boolean;
  upvotesCount: number;
  complaintId: number;
}

