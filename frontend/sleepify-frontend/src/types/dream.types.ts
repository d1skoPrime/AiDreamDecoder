/**
 * Dream and Analysis Type Definitions
 * Matches the Prisma schema on the backend
 */

export interface DreamAnalysis {
  id: string;
  dreamId: string;
  summary: string;
  interpretation: string;
  emotions: string[];
  createdAt: string;
}

export interface Dream {
  id: string;
  title: string;
  content: string;
  date: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
  analysis?: DreamAnalysis;
}

export interface CreateDreamRequest {
  title: string;
  content: string;
  emotions: string[];
}

export interface CreateDreamResponse extends Dream {
  analysis: DreamAnalysis;
}

export interface UserLimitStatus {
  tier: 'FREE' | 'BASIC' | 'PREMIUM' | 'ADMIN';
  requestsRemaining: number | 'unlimited';
  monthlyLimit: number | 'unlimited';
  nextResetDate: string | null;
  daysUntilReset?: number;
}