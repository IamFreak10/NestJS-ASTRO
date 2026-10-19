import type { Request } from 'express';

export type UserRole = 'student' | 'staff' | 'admin';

export interface AuthenticatedUser {
  id: string;
  name: string;
  email: string;
  emailVerified: boolean;
  image?: string | null;
  role: UserRole;
  studentId?: string | null;
  department?: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface SessionData {
  id: string;
  userId: string;
  token: string;
  expiresAt: Date;
  ipAddress?: string | null;
  userAgent?: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface BetterAuthSession {
  user: AuthenticatedUser;
  session: SessionData;
}

export interface RequestWithUser extends Request {
  user?: AuthenticatedUser;
  session?: SessionData;
}

