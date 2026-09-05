import { PlatformAdapter } from './ports.js';
import { Platform } from './types.js';

export class AdapterRegistry {
  private adapters: Map<Platform, PlatformAdapter> = new Map();

  public register(adapter: PlatformAdapter): void {
    this.adapters.set(adapter.platform, adapter);
  }

  public getAdapterForUrl(url: string): PlatformAdapter {
    for (const adapter of this.adapters.values()) {
      if (adapter.canHandle(url)) {
        return adapter;
      }
    }
    throw new Error(`No platform adapter registered that can handle URL: "${url}"`);
  }

  public getAdapter(platform: Platform): PlatformAdapter {
    const adapter = this.adapters.get(platform);
    if (!adapter) {
      throw new Error(`No adapter found for platform: ${platform}`);
    }
    return adapter;
  }

  public listRegisteredPlatforms(): Platform[] {
    return Array.from(this.adapters.keys());
  }
}
