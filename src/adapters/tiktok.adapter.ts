import { BaseAdapter } from './base.adapter.js';
import { Platform, PostMetadata, Comment, ScrapeOptions, ScrapingResult } from '../core/types.js';
import { CommentNormalizer } from '../core/normalizer.js';

export class TikTokAdapter extends BaseAdapter {
  readonly platform: Platform = 'tiktok';

  public canHandle(url: string): boolean {
    return /https?:\/\/(www\.)?tiktok\.com\/@([a-zA-Z0-9_.-]+)\/video\/([0-9]+)/i.test(url)
      || /https?:\/\/vm\.tiktok\.com\/([a-zA-Z0-9]+)/i.test(url);
  }

  public extractPostId(url: string): string {
    const match = url.match(/video\/([0-9]+)/i);
    if (match) return match[1];

    const shortMatch = url.match(/vm\.tiktok\.com\/([a-zA-Z0-9]+)/i);
    if (shortMatch) return shortMatch[1];

    throw new Error(`Invalid TikTok URL: ${url}`);
  }

  public async extractMetadata(url: string, options?: ScrapeOptions): Promise<PostMetadata> {
    const videoId = this.extractPostId(url);
    const html = await this.fetchWithTimeout(url, {}, options?.timeoutMs ?? 10000);

    const titleMatch = html.match(/<meta\s+property=["']og:title["']\s+content=["'](.*?)["']/i)
      || html.match(/<title>(.*?)<\/title>/i);
    const title = titleMatch ? titleMatch[1] : 'TikTok Video';

    const descMatch = html.match(/<meta\s+property=["']og:description["']\s+content=["'](.*?)["']/i);
    const caption = descMatch ? descMatch[1] : '';

    const authorMatch = url.match(/@([a-zA-Z0-9_.-]+)/i);
    const username = authorMatch ? authorMatch[1] : 'tiktok_user';

    return {
      id: videoId,
      platform: 'tiktok',
      url,
      author: {
        username,
        displayName: title.split('|')[0]?.trim() || username,
        profileUrl: `https://www.tiktok.com/@${username}`
      },
      caption,
      engagement: {
        likesCount: 0,
        commentsCount: 0
      }
    };
  }

  public async scrapeComments(url: string, options?: ScrapeOptions): Promise<ScrapingResult> {
    const startTime = Date.now();
    const metadata = await this.extractMetadata(url, options);

    return {
      metadata,
      comments: [],
      totalScraped: 0,
      hasMore: false,
      requiresAuthForComments: true,
      authNotice: 'TikTok comments extraction requires dynamic mobile API tokens or session cookies in high-volume mode.',
      durationMs: Date.now() - startTime
    };
  }
}
