import { writeFile, mkdir } from 'node:fs/promises';
import { dirname } from 'node:path';
import { CommentExporter } from '../core/ports.js';
import { ScrapingResult } from '../core/types.js';

export class JsonExporter implements CommentExporter {
  readonly format = 'json' as const;

  public async export(result: ScrapingResult, outputPath?: string): Promise<string> {
    const formatted = JSON.stringify(result, null, 2);

    if (outputPath) {
      await mkdir(dirname(outputPath), { recursive: true });
      await writeFile(outputPath, formatted, 'utf-8');
    }

    return formatted;
  }
}
