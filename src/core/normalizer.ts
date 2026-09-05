import { Comment, Author, Platform } from './types.js';

export class CommentNormalizer {
  public static cleanText(rawText: string): string {
    if (!rawText) return '';
    return rawText
      .replace(/\r\n/g, '\n')
      .replace(/\r/g, '\n')
      .split('\n')
      .map(line => line.replace(/[ \t]+/g, ' ').trim())
      .join('\n')
      .trim();
  }

  public static extractHashtags(text: string): string[] {
    if (!text) return [];
    const matches = text.match(/#[a-zA-Z0-9_\u00c0-\u00ff]+/g);
    return matches ? Array.from(new Set(matches.map(h => h.substring(1).toLowerCase()))) : [];
  }

  public static extractMentions(text: string): string[] {
    if (!text) return [];
    const matches = text.match(/@[a-zA-Z0-9_.]+/g);
    return matches ? Array.from(new Set(matches.map(m => m.substring(1).toLowerCase()))) : [];
  }

  public static detectSentiment(text: string): 'positive' | 'neutral' | 'negative' {
    const lower = text.toLowerCase();
    const positiveWords = [
      'bueno', 'excelente', 'genial', 'crack', 'top', 'gracias', 'increíble',
      'buena', 'clarísimo', 'maestro', 'gran', 'brillante', 'buenísimo',
      'good', 'great', 'awesome', 'thanks', 'love', 'helpful', 'best', 'fire'
    ];
    const negativeWords = [
      'malo', 'horrible', 'pésimo', 'falso', 'estafa', 'mentira', 'error',
      'basura', 'inútil', 'fake', 'bad', 'worst', 'scam', 'hate', 'terrible'
    ];

    let score = 0;
    for (const w of positiveWords) {
      if (lower.includes(w)) score++;
    }
    for (const w of negativeWords) {
      if (lower.includes(w)) score--;
    }

    if (score > 0) return 'positive';
    if (score < 0) return 'negative';
    return 'neutral';
  }

  public static parseDateToIso(dateInput?: string | number | Date): string {
    if (!dateInput) return new Date().toISOString();
    try {
      if (typeof dateInput === 'number') {
        const ms = dateInput < 10000000000 ? dateInput * 1000 : dateInput;
        return new Date(ms).toISOString();
      }
      const parsed = new Date(dateInput);
      if (!isNaN(parsed.getTime())) {
        return parsed.toISOString();
      }
    } catch {
      // fallback
    }
    return new Date().toISOString();
  }

  public static normalizeComment(params: {
    id: string;
    platform: Platform;
    postId: string;
    author: Author;
    rawText: string;
    timestamp?: string | number | Date;
    likesCount?: number;
    replyCount?: number;
    parentCommentId?: string;
    raw?: Record<string, unknown>;
  }): Comment {
    const cleanedText = this.cleanText(params.rawText);
    return {
      id: params.id,
      platform: params.platform,
      postId: params.postId,
      author: {
        id: params.author.id,
        username: params.author.username.replace(/^@/, '').trim(),
        displayName: params.author.displayName || params.author.username.replace(/^@/, '').trim(),
        avatarUrl: params.author.avatarUrl,
        profileUrl: params.author.profileUrl,
        isVerified: Boolean(params.author.isVerified)
      },
      text: cleanedText,
      timestamp: this.parseDateToIso(params.timestamp),
      likesCount: Math.max(0, params.likesCount ?? 0),
      replyCount: Math.max(0, params.replyCount ?? 0),
      parentCommentId: params.parentCommentId,
      sentiment: this.detectSentiment(cleanedText),
      hashtags: this.extractHashtags(cleanedText),
      mentions: this.extractMentions(cleanedText),
      raw: params.raw
    };
  }
}
