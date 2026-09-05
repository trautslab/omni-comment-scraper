import { writeFile, mkdir } from 'node:fs/promises';
import { dirname } from 'node:path';
import { CommentExporter } from '../core/ports.js';
import { ScrapingResult } from '../core/types.js';

export class CsvExporter implements CommentExporter {
  readonly format = 'csv' as const;

  public async export(result: ScrapingResult, outputPath?: string): Promise<string> {
    const headers = ['id', 'platform', 'postId', 'authorUsername', 'authorDisplayName', 'text', 'timestamp', 'likesCount', 'replyCount', 'sentiment'];
    const rows = [headers.join(',')];

    for (const comment of result.comments) {
      const row = [
        this.escapeCsv(comment.id),
        this.escapeCsv(comment.platform),
        this.escapeCsv(comment.postId),
        this.escapeCsv(comment.author.username),
        this.escapeCsv(comment.author.displayName || ''),
        this.escapeCsv(comment.text),
        this.escapeCsv(comment.timestamp),
        String(comment.likesCount ?? 0),
        String(comment.replyCount ?? 0),
        this.escapeCsv(comment.sentiment || 'neutral')
      ];
      rows.push(row.join(','));
    }

    const output = rows.join('\n');

    if (outputPath) {
      await mkdir(dirname(outputPath), { recursive: true });
      await writeFile(outputPath, output, 'utf-8');
    }

    return output;
  }

  private escapeCsv(field: string): string {
    if (!field) return '""';
    const escaped = field.replace(/"/g, '""');
    return `"${escaped}"`;
  }
}
