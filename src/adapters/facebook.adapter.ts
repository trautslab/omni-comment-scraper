import { BaseAdapter } from './base.adapter.js';
import { Platform, PostMetadata, Comment, ScrapeOptions, ScrapingResult } from '../core/types.js';
import { CommentNormalizer } from '../core/normalizer.js';

export class FacebookAdapter extends BaseAdapter {
  readonly platform: Platform = 'facebook';

  public canHandle(url: string): boolean {
    return /https?:\/\/(www\.|m\.|web\.)?facebook\.com\//i.test(url);
  }

  public extractPostId(url: string): string {
    const reelMatch = url.match(/reel\/([0-9]+)/i);
    if (reelMatch) return reelMatch[1];

    const postMatch = url.match(/posts\/([0-9]+)/i);
    if (postMatch) return postMatch[1];

    const idMatch = url.match(/[?&]id=([0-9]+)/i);
    if (idMatch) return idMatch[1];

    return 'fb_post_' + Buffer.from(url).toString('base64url').slice(0, 12);
  }

  public async extractMetadata(url: string, options?: ScrapeOptions): Promise<PostMetadata> {
    const postId = this.extractPostId(url);
    const html = await this.fetchWithTimeout(url, {}, options?.timeoutMs ?? 10000);

    const titleMatch = html.match(/<meta\s+property=["']og:title["']\s+content=["'](.*?)["']/i);
    const title = titleMatch ? titleMatch[1] : 'Facebook Post';

    const descMatch = html.match(/<meta\s+property=["']og:description["']\s+content=["'](.*?)["']/i);
    const caption = descMatch ? descMatch[1] : '';

    return {
      id: postId,
      platform: 'facebook',
      url,
      author: {
        username: 'facebook_page',
        displayName: title.split('|')[0]?.trim() || 'Facebook User',
        profileUrl: url
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
      authNotice: 'Facebook comments scraping requires authenticated cookies (c_user, xs) or Meta Graph API Page Access Token.',
      durationMs: Date.now() - startTime
    };
  }
}
