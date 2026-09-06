import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { Platform } from './types.js';

export interface SessionData {
  platform: Platform;
  status: 'active' | 'expired' | 'missing';
  username?: string;
  cookies?: Record<string, string>;
  rawCookieString?: string;
  apiKey?: string;
  lastVerified?: string;
  expiresAt?: string;
  metadata?: Record<string, unknown>;
}

export interface SessionSummary {
  platform: Platform;
  status: 'active' | 'expired' | 'missing';
  username?: string;
  cookieCount: number;
  lastVerified?: string;
  hasApiKey: boolean;
}

export class SessionVault {
  private vaultPath: string;
  private memoryVault: Map<Platform, SessionData> = new Map();

  constructor(customPath?: string) {
    this.vaultPath = customPath || resolve(process.cwd(), '.sessions', 'vault.json');
    this.loadFromDisk();
  }

  private loadFromDisk(): void {
    if (!existsSync(this.vaultPath)) {
      return;
    }
    try {
      const content = readFileSync(this.vaultPath, 'utf-8');
      const data: Record<string, SessionData> = JSON.parse(content);
      for (const [platform, session] of Object.entries(data)) {
        this.memoryVault.set(platform as Platform, session);
      }
    } catch {
      // ignore corrupt file and start fresh
    }
  }

  private saveToDisk(): void {
    const dir = dirname(this.vaultPath);
    if (!existsSync(dir)) {
      mkdirSync(dir, { recursive: true });
    }
    const data: Record<string, SessionData> = {};
    for (const [platform, session] of this.memoryVault.entries()) {
      data[platform] = session;
    }
    writeFileSync(this.vaultPath, JSON.stringify(data, null, 2), 'utf-8');
  }

  public async saveSession(platform: Platform, input: {
    rawCookieString?: string;
    cookies?: Record<string, string>;
    username?: string;
    apiKey?: string;
    status?: 'active' | 'expired' | 'missing';
  }): Promise<SessionData> {
    const parsedCookies = input.cookies || (input.rawCookieString ? this.parseCookieString(input.rawCookieString) : {});
    
    // Extract common session IDs
    let username = input.username;
    if (platform === 'instagram' && parsedCookies['ds_user_id']) {
      username = username || `ig_user_${parsedCookies['ds_user_id']}`;
    }

    const session: SessionData = {
      platform,
      status: input.status || 'active',
      username,
      cookies: parsedCookies,
      rawCookieString: input.rawCookieString,
      apiKey: input.apiKey,
      lastVerified: new Date().toISOString()
    };

    this.memoryVault.set(platform, session);
    this.saveToDisk();
    return session;
  }

  public getSession(platform: Platform): SessionData | undefined {
    return this.memoryVault.get(platform);
  }

  public getCookie(platform: Platform, cookieName: string): string | undefined {
    const session = this.memoryVault.get(platform);
    if (!session || !session.cookies) return undefined;
    return session.cookies[cookieName];
  }

  public listSessions(): Record<Platform, SessionSummary> {
    const platforms: Platform[] = ['instagram', 'tiktok', 'facebook', 'youtube', 'telegram', 'generic'];
    const result: Partial<Record<Platform, SessionSummary>> = {};

    for (const p of platforms) {
      const s = this.memoryVault.get(p);
      if (s && (s.cookies || s.apiKey)) {
        result[p] = {
          platform: p,
          status: s.status,
          username: s.username,
          cookieCount: s.cookies ? Object.keys(s.cookies).length : 0,
          lastVerified: s.lastVerified,
          hasApiKey: Boolean(s.apiKey)
        };
      } else {
        result[p] = {
          platform: p,
          status: 'missing',
          cookieCount: 0,
          hasApiKey: false
        };
      }
    }

    return result as Record<Platform, SessionSummary>;
  }

  public async verifySession(platform: Platform): Promise<{ valid: boolean; message: string; username?: string }> {
    const session = this.memoryVault.get(platform);
    if (!session || (!session.cookies && !session.apiKey)) {
      return { valid: false, message: 'No se encontraron credenciales o cookies configuradas para esta plataforma.' };
    }

    if (platform === 'instagram') {
      const sessionId = session.cookies?.['sessionid'] || (session.rawCookieString?.match(/sessionid=([^;]+)/)?.[1]);
      if (!sessionId) {
        return { valid: false, message: 'Falta la cookie "sessionid" esencial de Instagram.' };
      }

      try {
        const res = await fetch('https://www.instagram.com/api/v1/users/web_profile_info/?username=instagram', {
          headers: {
            'Cookie': `sessionid=${sessionId};`,
            'X-IG-App-ID': '936619743392459',
            'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)'
          }
        });

        if (res.status === 200) {
          session.status = 'active';
          session.lastVerified = new Date().toISOString();
          this.saveToDisk();
          return { valid: true, message: 'Sesión activa y confirmada contra Instagram GraphQL.', username: session.username };
        } else {
          session.status = 'expired';
          this.saveToDisk();
          return { valid: false, message: `Sesión expirada o rechazada por Meta (HTTP ${res.status}).` };
        }
      } catch (err) {
        return { valid: false, message: `Error de conexión: ${(err as Error).message}` };
      }
    }

    // Default response for other platforms
    return { valid: true, message: 'Credenciales registradas localmente en la bóveda.', username: session.username };
  }

  public removeSession(platform: Platform): boolean {
    const deleted = this.memoryVault.delete(platform);
    if (deleted) {
      this.saveToDisk();
    }
    return deleted;
  }

  public parseCookieString(cookieString: string): Record<string, string> {
    const cookies: Record<string, string> = {};
    if (!cookieString) return cookies;

    const parts = cookieString.split(';');
    for (const part of parts) {
      const trimmed = part.trim();
      const eqIdx = trimmed.indexOf('=');
      if (eqIdx !== -1) {
        const key = trimmed.slice(0, eqIdx).trim();
        const val = trimmed.slice(eqIdx + 1).trim();
        if (key) {
          cookies[key] = val;
        }
      }
    }
    return cookies;
  }
}
