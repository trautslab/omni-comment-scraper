import { PlatformAdapter } from '../core/ports.js';
import { Platform, PostMetadata, ScrapeOptions, ScrapingResult } from '../core/types.js';

export abstract class BaseAdapter implements PlatformAdapter {
  abstract readonly platform: Platform;

  abstract canHandle(url: string): boolean;
  abstract extractPostId(url: string): string;
  abstract extractMetadata(url: string, options?: ScrapeOptions): Promise<PostMetadata>;
  abstract scrapeComments(url: string, options?: ScrapeOptions): Promise<ScrapingResult>;

  protected async fetchWithTimeout(url: string, headers: Record<string, string> = {}, timeoutMs: number = 10000): Promise<string> {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), timeoutMs);

    try {
      const response = await fetch(url, {
        signal: controller.signal,
        headers: {
          'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36',
          'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
          'Accept-Language': 'en-US,en;q=0.9,es;q=0.8',
          ...headers
        }
      });

      if (!response.ok && response.status !== 401) {
        throw new Error(`HTTP Error ${response.status}: ${response.statusText}`);
      }

      return await response.text();
    } finally {
      clearTimeout(timeout);
    }
  }
}
