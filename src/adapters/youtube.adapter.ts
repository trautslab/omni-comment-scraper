import { BaseAdapter } from './base.adapter.js';
import { Platform, PostMetadata, Comment, ScrapeOptions, ScrapingResult } from '../core/types.js';
import { CommentNormalizer } from '../core/normalizer.js';

export class YouTubeAdapter extends BaseAdapter {
  readonly platform: Platform = 'youtube';

  public canHandle(url: string): boolean {
    return /(?:youtube\.com\/(?:watch\?v=|shorts\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/i.test(url);
  }

  public extractPostId(url: string): string {
    const match = url.match(/(?:youtube\.com\/(?:watch\?v=|shorts\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/i);
    if (!match) {
      throw new Error(`Invalid YouTube video/short URL: ${url}`);
    }
    return match[1];
  }

  public async extractMetadata(url: string, options?: ScrapeOptions): Promise<PostMetadata> {
    const videoId = this.extractPostId(url);
    const targetUrl = `https://www.youtube.com/watch?v=${videoId}`;

    const html = await this.fetchWithTimeout(targetUrl, {}, options?.timeoutMs ?? 10000);

    // Extract title
    const titleMatch = html.match(/<meta\s+name=["']title["']\s+content=["'](.*?)["']/i)
      || html.match(/<title>(.*?) - YouTube<\/title>/i);
    const title = titleMatch ? titleMatch[1] : 'YouTube Video';

    // Extract author
    const authorMatch = html.match(/<link\s+itemprop=["']name["']\s+content=["'](.*?)["']/i)
      || html.match(/"author":"(.*?)"/i);
    const author = authorMatch ? authorMatch[1] : 'YouTube Creator';

    // Extract description
    const descMatch = html.match(/<meta\s+name=["']description["']\s+content=["'](.*?)["']/i);
    const caption = descMatch ? descMatch[1] : '';

    return {
      id: videoId,
      platform: 'youtube',
      url: targetUrl,
      author: {
        username: author.toLowerCase().replace(/\s+/g, '_'),
        displayName: author,
        profileUrl: `https://www.youtube.com/results?search_query=${encodeURIComponent(author)}`
      },
      caption,
      engagement: {
        likesCount: 0,
        commentsCount: 0
      },
      mediaUrls: [`https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`]
    };
  }

  public async scrapeComments(url: string, options?: ScrapeOptions): Promise<ScrapingResult> {
    const startTime = Date.now();
    const metadata = await this.extractMetadata(url, options);
    const videoId = metadata.id;
    const comments: Comment[] = [];

    const apiKey = options?.credentials?.apiKey || process.env.YOUTUBE_API_KEY;

    if (apiKey) {
      try {
        const apiUrl = `https://www.googleapis.com/youtube/v3/commentThreads?part=snippet&videoId=${videoId}&maxResults=${options?.limit ?? 50}&key=${apiKey}`;
        const responseText = await this.fetchWithTimeout(apiUrl);
        const parsed = JSON.parse(responseText);

        for (const item of parsed.items || []) {
          const top = item.snippet?.topLevelComment?.snippet;
          if (top) {
            comments.push(
              CommentNormalizer.normalizeComment({
                id: item.id,
                platform: 'youtube',
                postId: videoId,
                author: {
                  displayName: top.authorDisplayName,
                  username: top.authorDisplayName.replace(/\s+/g, '_'),
                  avatarUrl: top.authorProfileImageUrl,
                  profileUrl: top.authorChannelUrl
                },
                rawText: top.textDisplay || top.textOriginal || '',
                timestamp: top.publishedAt,
                likesCount: top.likeCount,
                replyCount: item.snippet?.totalReplyCount,
                raw: item
              })
            );
          }
        }
      } catch (err) {
        // Fallback error notice
      }
    }

    return {
      metadata,
      comments,
      totalScraped: comments.length,
      hasMore: false,
      requiresAuthForComments: !apiKey,
      authNotice: apiKey
        ? undefined
        : 'YouTube API key not configured. Provide YOUTUBE_API_KEY for high-quota automated comment extraction.',
      durationMs: Date.now() - startTime
    };
  }
}
