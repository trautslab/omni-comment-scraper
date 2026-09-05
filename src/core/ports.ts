import { Platform, PostMetadata, Comment, ScrapeOptions, ScrapingResult } from './types.js';

export interface PlatformAdapter {
  readonly platform: Platform;
  canHandle(url: string): boolean;
  extractPostId(url: string): string;
  extractMetadata(url: string, options?: ScrapeOptions): Promise<PostMetadata>;
  scrapeComments(url: string, options?: ScrapeOptions): Promise<ScrapingResult>;
}

export interface CommentExporter {
  readonly format: 'json' | 'csv' | 'jsonl';
  export(result: ScrapingResult, outputPath?: string): Promise<string>;
}

export interface RateLimiterPort {
  acquire(platform: Platform): Promise<void>;
  release(platform: Platform): void;
}
