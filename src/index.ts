import { AdapterRegistry } from './core/registry.js';
import { InstagramAdapter } from './adapters/instagram.adapter.js';
import { YouTubeAdapter } from './adapters/youtube.adapter.js';
import { TikTokAdapter } from './adapters/tiktok.adapter.js';
import { TelegramAdapter } from './adapters/telegram.adapter.js';
import { FacebookAdapter } from './adapters/facebook.adapter.js';
import { JsonExporter } from './exporters/json.exporter.js';
import { CsvExporter } from './exporters/csv.exporter.js';

export * from './core/types.js';
export * from './core/ports.js';
export * from './core/normalizer.js';
export * from './core/registry.js';
export * from './core/session-vault.js';
export * from './core/knowledge-synthesizer.js';
export * from './core/expert-comment-miner.js';
export * from './adapters/base.adapter.js';
export * from './adapters/instagram.adapter.js';
export * from './adapters/youtube.adapter.js';
export * from './adapters/tiktok.adapter.js';
export * from './adapters/telegram.adapter.js';
export * from './adapters/facebook.adapter.js';
export * from './exporters/json.exporter.js';
export * from './exporters/csv.exporter.js';

export function createDefaultRegistry(): AdapterRegistry {
  const registry = new AdapterRegistry();
  registry.register(new InstagramAdapter());
  registry.register(new YouTubeAdapter());
  registry.register(new TikTokAdapter());
  registry.register(new TelegramAdapter());
  registry.register(new FacebookAdapter());
  return registry;
}

export async function scrapeUrl(url: string, options?: import('./core/types.js').ScrapeOptions) {
  const registry = createDefaultRegistry();
  const adapter = registry.getAdapterForUrl(url);
  return await adapter.scrapeComments(url, options);
}
