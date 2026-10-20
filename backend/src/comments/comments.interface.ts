export interface CommentResponseItem {
  id: number;
  complaintId: number;
  authorId: string;
  authorName: string;
  authorImage: string | null;
  authorDepartment?: string | null;
  authorRole?: string;
  message: string;
  statusChangeTo?: string | null;
  isInternalNote: boolean;
  createdAt: Date;
}

export interface DeleteCommentResponse {
  success: boolean;
  message: string;
  id: number;
}

