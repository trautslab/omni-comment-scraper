import { BaseAdapter } from './base.adapter.js';
import { Platform, PostMetadata, Comment, ScrapeOptions, ScrapingResult } from '../core/types.js';
import { CommentNormalizer } from '../core/normalizer.js';

export class TelegramAdapter extends BaseAdapter {
  readonly platform: Platform = 'telegram';

  public canHandle(url: string): boolean {
    return /https?:\/\/t\.me\/([a-zA-Z0-9_]+)\/([0-9]+)/i.test(url);
  }

  public extractPostId(url: string): string {
    const match = url.match(/t\.me\/([a-zA-Z0-9_]+)\/([0-9]+)/i);
    if (!match) {
      throw new Error(`Invalid Telegram post URL: ${url}`);
    }
    return `${match[1]}/${match[2]}`;
  }

  public async extractMetadata(url: string, options?: ScrapeOptions): Promise<PostMetadata> {
    const [channel, messageId] = this.extractPostId(url).split('/');
    const previewUrl = `https://t.me/s/${channel}/${messageId}`;

    const html = await this.fetchWithTimeout(previewUrl, {}, options?.timeoutMs ?? 10000);

    // Extract title / channel name
    const titleMatch = html.match(/<meta\s+property=["']og:title["']\s+content=["'](.*?)["']/i);
    const channelTitle = titleMatch ? titleMatch[1] : channel;

    // Extract message description
    const descMatch = html.match(/<meta\s+property=["']og:description["']\s+content=["'](.*?)["']/i);
    const caption = descMatch ? descMatch[1] : '';

    return {
      id: `${channel}_${messageId}`,
      platform: 'telegram',
      url: `https://t.me/${channel}/${messageId}`,
      author: {
        username: channel,
        displayName: channelTitle,
        profileUrl: `https://t.me/${channel}`
      },
      caption,
      engagement: {
        viewsCount: 0,
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
      requiresAuthForComments: false,
      authNotice: 'Telegram public channel message parsed. Discussion comments require MTProto user session or Bot Token for discussion groups.',
      durationMs: Date.now() - startTime
    };
  }
}
