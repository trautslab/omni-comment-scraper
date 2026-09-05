export type Platform =
  | 'instagram'
  | 'facebook'
  | 'youtube'
  | 'tiktok'
  | 'telegram'
  | 'generic';

export interface Author {
  id?: string;
  username: string;
  displayName?: string;
  avatarUrl?: string;
  profileUrl?: string;
  isVerified?: boolean;
}

export interface Comment {
  id: string;
  platform: Platform;
  postId: string;
  author: Author;
  text: string;
  timestamp: string; // ISO 8601
  likesCount?: number;
  replyCount?: number;
  parentCommentId?: string;
  sentiment?: 'positive' | 'neutral' | 'negative';
  hashtags?: string[];
  mentions?: string[];
  raw?: Record<string, unknown>;
}

export interface PostEngagement {
  likesCount?: number;
  commentsCount?: number;
  sharesCount?: number;
  viewsCount?: number;
}

export interface PostMetadata {
  id: string;
  platform: Platform;
  url: string;
  author: Author;
  caption: string;
  publishedAt?: string;
  engagement: PostEngagement;
  mediaUrls?: string[];
  raw?: Record<string, unknown>;
}

export interface ScrapeOptions {
  limit?: number;
  timeoutMs?: number;
  credentials?: {
    sessionId?: string;
    csrfToken?: string;
    apiKey?: string;
    cookies?: string;
  };
  filterReplies?: boolean;
  extractSentiment?: boolean;
}

export interface ScrapingResult {
  metadata: PostMetadata;
  comments: Comment[];
  totalScraped: number;
  cursor?: string;
  hasMore: boolean;
  requiresAuthForComments?: boolean;
  authNotice?: string;
  durationMs: number;
}
