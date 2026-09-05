import { BaseAdapter } from './base.adapter.js';
import { Platform, PostMetadata, Comment, ScrapeOptions, ScrapingResult } from '../core/types.js';
import { CommentNormalizer } from '../core/normalizer.js';

export class InstagramAdapter extends BaseAdapter {
  readonly platform: Platform = 'instagram';

  public canHandle(url: string): boolean {
    return /https?:\/\/(www\.)?instagram\.com\/(p|reel|reels)\/([A-Za-z0-9_-]+)/i.test(url);
  }

  public extractPostId(url: string): string {
    const match = url.match(/(?:p|reel|reels)\/([A-Za-z0-9_-]+)/i);
    if (!match) {
      throw new Error(`Invalid Instagram post/reel URL: ${url}`);
    }
    return match[1];
  }

  public async extractMetadata(url: string, options?: ScrapeOptions): Promise<PostMetadata> {
    const shortcode = this.extractPostId(url);
    const targetUrl = `https://www.instagram.com/reels/${shortcode}/`;

    // Use OpenGraph crawler User-Agent to ensure Instagram returns complete SSR metadata
    const html = await this.fetchWithTimeout(
      targetUrl,
      {
        'User-Agent': 'facebookexternalhit/1.1 (+http://www.facebook.com/externalhit_uatext.php)',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8'
      },
      options?.timeoutMs ?? 10000
    );

    // 1. Extract og:title
    const titleMatch = html.match(/<meta[^>]+property=["']og:title["'][^>]+content=["']([\s\S]*?)["']/i)
      || html.match(/<meta[^>]+content=["']([\s\S]*?)["'][^>]+property=["']og:title["']/i);
    const rawTitle = titleMatch ? this.decodeHtmlEntities(titleMatch[1]) : '';

    // 2. Extract og:description (contains likes, comments count and caption)
    const descMatch = html.match(/<meta[^>]+property=["']og:description["'][^>]+content=["']([\s\S]*?)["']/i)
      || html.match(/<meta[^>]+content=["']([\s\S]*?)["'][^>]+property=["']og:description["']/i)
      || html.match(/<meta[^>]+name=["']description["'][^>]+content=["']([\s\S]*?)["']/i);
    const rawDescription = descMatch ? this.decodeHtmlEntities(descMatch[1]) : '';

    // Parse engagement from description (e.g. "47K likes, 501 comments - arturo_velazquez_java on March 11, 2026: \"...\"")
    let likesCount = 0;
    let commentsCount = 0;
    let authorUsername = '';
    let authorDisplayName = '';
    let caption = '';

    const metricsMatch = rawDescription.match(/([0-9.,]+[KkMm]?)\s+likes?,\s+([0-9.,]+[KkMm]?)\s+comments?\s*-\s*([a-zA-Z0-9_.]+)\s+on/i);
    if (metricsMatch) {
      likesCount = this.parseMetricNumber(metricsMatch[1]);
      commentsCount = this.parseMetricNumber(metricsMatch[2]);
      authorUsername = metricsMatch[3];
    }

    // Extract caption text after the author header
    const captionMatch = rawDescription.match(/:\s*"([\s\S]*?)"\.?\s*$/);
    if (captionMatch) {
      caption = captionMatch[1];
    } else {
      caption = rawDescription;
    }

    // Author display name
    const authorHeaderMatch = rawTitle.match(/^(.*?)\s+(?:on Instagram|\(@|•)/i);
    if (authorHeaderMatch) {
      authorDisplayName = authorHeaderMatch[1].trim();
    } else if (authorUsername) {
      authorDisplayName = authorUsername;
    }

    // Media image
    const imageMatch = html.match(/<meta[^>]+property=["']og:image["'][^>]+content=["']([\s\S]*?)["']/i);
    const mediaUrl = imageMatch ? this.decodeHtmlEntities(imageMatch[1]) : undefined;

    return {
      id: shortcode,
      platform: 'instagram',
      url: `https://www.instagram.com/reels/${shortcode}/`,
      author: {
        username: authorUsername || 'unknown_user',
        displayName: authorDisplayName || authorUsername || 'Instagram Creator',
        profileUrl: authorUsername ? `https://www.instagram.com/${authorUsername}/` : undefined
      },
      caption: caption || 'Instagram post content',
      engagement: {
        likesCount,
        commentsCount
      },
      mediaUrls: mediaUrl ? [mediaUrl] : []
    };
  }

  public async scrapeComments(url: string, options?: ScrapeOptions): Promise<ScrapingResult> {
    const startTime = Date.now();
    const metadata = await this.extractMetadata(url, options);
    const shortcode = metadata.id;

    const sessionId = options?.credentials?.sessionId || process.env.INSTAGRAM_SESSION_ID;
    const comments: Comment[] = [];
    let requiresAuthForComments = false;
    let authNotice: string | undefined;

    if (sessionId) {
      try {
        const commentsData = await this.fetchCommentsViaGraphql(shortcode, sessionId, options?.limit ?? 50);
        comments.push(...commentsData);
      } catch (error) {
        authNotice = `Authenticated fetch encountered an error: ${(error as Error).message}`;
      }
    } else {
      requiresAuthForComments = true;
      authNotice = 'Instagram requires an active session (sessionid cookie) to query comment threads via GraphQL. Metadata was extracted publicly.';
    }

    return {
      metadata,
      comments,
      totalScraped: comments.length,
      hasMore: metadata.engagement.commentsCount ? metadata.engagement.commentsCount > comments.length : false,
      requiresAuthForComments,
      authNotice,
      durationMs: Date.now() - startTime
    };
  }

  private async fetchCommentsViaGraphql(shortcode: string, sessionId: string, limit: number): Promise<Comment[]> {
    const queryUrl = `https://www.instagram.com/graphql/query/?query_hash=bc3296d1ce80a24b1b6e40b1e72903f5&variables=${encodeURIComponent(
      JSON.stringify({ shortcode, first: limit })
    )}`;

    const responseText = await this.fetchWithTimeout(queryUrl, {
      'Cookie': `sessionid=${sessionId};`,
      'X-IG-App-ID': '936619743392459',
      'Referer': `https://www.instagram.com/reels/${shortcode}/`
    });

    const parsed = JSON.parse(responseText);
    const edges = parsed?.data?.shortcode_media?.edge_media_to_parent_comment?.edges || [];

    return edges.map((edge: any) => {
      const node = edge.node;
      return CommentNormalizer.normalizeComment({
        id: node.id || String(Math.random()),
        platform: 'instagram',
        postId: shortcode,
        author: {
          id: node.owner?.id,
          username: node.owner?.username || 'anonymous',
          avatarUrl: node.owner?.profile_pic_url
        },
        rawText: node.text || '',
        timestamp: node.created_at ? node.created_at * 1000 : new Date().toISOString(),
        likesCount: node.edge_liked_by?.count ?? 0,
        replyCount: node.edge_threaded_comments?.count ?? 0,
        raw: node
      });
    });
  }

  private parseMetricNumber(raw: string): number {
    if (!raw) return 0;
    const clean = raw.trim().toUpperCase().replace(/,/g, '');
    if (clean.endsWith('K')) {
      return Math.round(parseFloat(clean.slice(0, -1)) * 1000);
    }
    if (clean.endsWith('M')) {
      return Math.round(parseFloat(clean.slice(0, -1)) * 1000000);
    }
    return parseInt(clean, 10) || 0;
  }

  private decodeHtmlEntities(str: string): string {
    return str
      .replace(/&#x([0-9a-fA-F]+);/g, (_, code) => {
        try {
          return String.fromCodePoint(parseInt(code, 16));
        } catch {
          return '';
        }
      })
      .replace(/&#([0-9]+);/g, (_, code) => {
        try {
          return String.fromCodePoint(parseInt(code, 10));
        } catch {
          return '';
        }
      })
      .replace(/&quot;/g, '"')
      .replace(/&amp;/g, '&')
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .replace(/&apos;/g, "'");
  }
}
