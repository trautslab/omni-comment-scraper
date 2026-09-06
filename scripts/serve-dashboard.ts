#!/usr/bin/env node
/**
 * 📡 TrautsLab Omni-Scraper & Knowledge Lab Mission Control
 * Servidor HTTP con API REST y Server-Sent Events (SSE).
 */

import { createServer, IncomingMessage, ServerResponse } from 'node:http';
import { readFileSync, existsSync, watchFile, unwatchFile, writeFileSync, mkdirSync } from 'node:fs';
import { resolve, join } from 'node:path';
import { exec } from 'node:child_process';
import {
  createDefaultRegistry,
  SessionVault,
  KnowledgeSynthesizer,
  ExpertCommentMiner,
  CommentNormalizer,
  Platform
} from '../src/index.js';

const PORT = Number(process.env.PORT) || 3333;
const htmlPath = resolve(process.cwd(), 'observability', 'index.html');
const eventsPath = resolve(process.cwd(), '.agents', 'telemetry', 'events.jsonl');

const vault = new SessionVault();
const registry = createDefaultRegistry();

// Connected SSE clients
const sseClients = new Set<ServerResponse>();

function readAllEvents(): Array<Record<string, unknown>> {
  if (!existsSync(eventsPath)) {
    return [];
  }
  const content = readFileSync(eventsPath, 'utf-8').trim();
  if (!content) return [];

  return content
    .split('\n')
    .filter((l) => l.trim().length > 0)
    .map((l, idx) => {
      try {
        const parsed = JSON.parse(l);
        return { id: idx, ...parsed };
      } catch {
        return null;
      }
    })
    .filter(Boolean) as Array<Record<string, unknown>>;
}

export function emitTelemetryEvent(type: string, message: string, metadata: Record<string, unknown> = {}): void {
  try {
    const dir = resolve(process.cwd(), '.agents', 'telemetry');
    if (!existsSync(dir)) mkdirSync(dir, { recursive: true });

    const event = {
      timestamp: new Date().toISOString(),
      type,
      message,
      metadata
    };
    const line = JSON.stringify(event) + '\n';
    writeFileSync(eventsPath, line, { flag: 'a' });
  } catch {
    // optional logging
  }
}

// Watch events.jsonl for real-time SSE broadcast
if (existsSync(eventsPath)) {
  watchFile(eventsPath, { interval: 250 }, () => {
    const events = readAllEvents();
    const payload = `data: ${JSON.stringify(events)}\n\n`;
    for (const client of sseClients) {
      try {
        client.write(payload);
      } catch {
        sseClients.delete(client);
      }
    }
  });
}

function parseJsonBody<T = any>(req: IncomingMessage): Promise<T> {
  return new Promise((resolve, reject) => {
    let data = '';
    req.on('data', (chunk) => {
      data += chunk;
      if (data.length > 5 * 1024 * 1024) {
        reject(new Error('Payload too large'));
      }
    });
    req.on('end', () => {
      if (!data) return resolve({} as T);
      try {
        resolve(JSON.parse(data));
      } catch (e) {
        reject(new Error('Invalid JSON format'));
      }
    });
    req.on('error', reject);
  });
}

const server = createServer(async (req, res) => {
  // CORS Headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    res.writeHead(204);
    return res.end();
  }

  const url = new URL(req.url || '/', `http://localhost:${PORT}`);
  const pathname = url.pathname;

  // 1. Static HTML dashboard
  if (pathname === '/' || pathname === '/index.html') {
    if (!existsSync(htmlPath)) {
      res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
      return res.end('Dashboard HTML no encontrado');
    }
    const html = readFileSync(htmlPath, 'utf-8');
    res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
    return res.end(html);
  }

  // 2. Telemetry API
  if (pathname === '/api/telemetry' && req.method === 'GET') {
    const events = readAllEvents();
    res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
    return res.end(JSON.stringify(events));
  }

  if (pathname === '/api/telemetry/stream' && req.method === 'GET') {
    res.writeHead(200, {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache, no-transform',
      'Connection': 'keep-alive'
    });

    const initialEvents = readAllEvents();
    res.write(`data: ${JSON.stringify(initialEvents)}\n\n`);
    sseClients.add(res);

    req.on('close', () => {
      sseClients.delete(res);
    });
    return;
  }

  // 3. Session Vault API
  if (pathname === '/api/sessions' && req.method === 'GET') {
    const sessions = vault.listSessions();
    res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
    return res.end(JSON.stringify(sessions));
  }

  if (pathname === '/api/sessions/save' && req.method === 'POST') {
    try {
      const body = await parseJsonBody<{
        platform: Platform;
        rawCookieString?: string;
        username?: string;
        apiKey?: string;
      }>(req);

      if (!body.platform) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        return res.end(JSON.stringify({ error: 'Plataforma requerida' }));
      }

      const saved = await vault.saveSession(body.platform, {
        rawCookieString: body.rawCookieString,
        username: body.username,
        apiKey: body.apiKey
      });

      emitTelemetryEvent('SESSION_UPDATED', `Credenciales actualizadas para ${body.platform.toUpperCase()}`, {
        platform: body.platform,
        hasCookies: Boolean(body.rawCookieString),
        hasApiKey: Boolean(body.apiKey)
      });

      res.writeHead(200, { 'Content-Type': 'application/json' });
      return res.end(JSON.stringify({ success: true, session: saved }));
    } catch (err) {
      res.writeHead(500, { 'Content-Type': 'application/json' });
      return res.end(JSON.stringify({ error: (err as Error).message }));
    }
  }

  if (pathname === '/api/sessions/verify' && req.method === 'POST') {
    try {
      const body = await parseJsonBody<{ platform: Platform }>(req);
      const verifyResult = await vault.verifySession(body.platform);

      emitTelemetryEvent('SESSION_VERIFIED', `Health check de sesión para ${body.platform.toUpperCase()}`, {
        platform: body.platform,
        valid: verifyResult.valid,
        message: verifyResult.message
      });

      res.writeHead(200, { 'Content-Type': 'application/json' });
      return res.end(JSON.stringify(verifyResult));
    } catch (err) {
      res.writeHead(500, { 'Content-Type': 'application/json' });
      return res.end(JSON.stringify({ error: (err as Error).message }));
    }
  }

  if (pathname === '/api/sessions/launch-login' && req.method === 'POST') {
    try {
      const body = await parseJsonBody<{ platform: Platform }>(req);
      const platform = body.platform;

      let targetUrl = 'https://www.instagram.com/accounts/login/';
      if (platform === 'tiktok') targetUrl = 'https://www.tiktok.com/login';
      if (platform === 'facebook') targetUrl = 'https://www.facebook.com/login';

      // Open system default browser with the login page
      exec(`open "${targetUrl}"`);

      emitTelemetryEvent('BROWSER_LOGIN_LAUNCHED', `Ventana interactiva de login abierta para ${platform.toUpperCase()}`, {
        platform,
        targetUrl
      });

      res.writeHead(200, { 'Content-Type': 'application/json' });
      return res.end(JSON.stringify({
        success: true,
        message: `Se ha abierto el navegador para iniciar sesión en ${platform.toUpperCase()}. Una vez autenticado, copia tus cookies o usa el botón "Pegar Cookies".`,
        url: targetUrl
      }));
    } catch (err) {
      res.writeHead(500, { 'Content-Type': 'application/json' });
      return res.end(JSON.stringify({ error: (err as Error).message }));
    }
  }

  // 4. Scraping API
  if (pathname === '/api/scrape' && req.method === 'POST') {
    try {
      const body = await parseJsonBody<{ url: string; limit?: number }>(req);
      if (!body.url) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        return res.end(JSON.stringify({ error: 'URL requerida' }));
      }

      emitTelemetryEvent('SCRAPE_STARTED', `Iniciando extracción para ${body.url}`, {
        url: body.url,
        limit: body.limit ?? 50
      });

      const adapter = registry.getAdapterForUrl(body.url);
      const result = await adapter.scrapeComments(body.url, { limit: body.limit ?? 50 });

      emitTelemetryEvent('SCRAPE_COMPLETED', `Extracción finalizada para [${adapter.platform.toUpperCase()}]`, {
        platform: adapter.platform,
        postId: result.metadata.id,
        likes: result.metadata.engagement.likesCount,
        comments: result.comments.length,
        durationMs: result.durationMs
      });

      res.writeHead(200, { 'Content-Type': 'application/json' });
      return res.end(JSON.stringify(result));
    } catch (err) {
      res.writeHead(500, { 'Content-Type': 'application/json' });
      return res.end(JSON.stringify({ error: (err as Error).message }));
    }
  }

  // 5. Knowledge Synthesis API (NotebookLM generator)
  if (pathname === '/api/knowledge/synthesize' && req.method === 'POST') {
    try {
      const body = await parseJsonBody<{ metadata: any; comments?: any[] }>(req);
      if (!body.metadata) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        return res.end(JSON.stringify({ error: 'Metadatos del post requeridos' }));
      }

      const bundle = KnowledgeSynthesizer.synthesize(body.metadata, body.comments || []);

      emitTelemetryEvent('KNOWLEDGE_SYNTHESIZED', `Pack de NotebookLM generado para "${bundle.topic}"`, {
        topic: bundle.topic,
        coreClaimsCount: bundle.coreClaims.length,
        factChecksCount: bundle.factChecks.length,
        studyQuestionsCount: bundle.studyQuestions.length
      });

      res.writeHead(200, { 'Content-Type': 'application/json' });
      return res.end(JSON.stringify(bundle));
    } catch (err) {
      res.writeHead(500, { 'Content-Type': 'application/json' });
      return res.end(JSON.stringify({ error: (err as Error).message }));
    }
  }

  // 6. Expert Comments Mining API
  if (pathname === '/api/comments/mine' && req.method === 'POST') {
    try {
      const body = await parseJsonBody<{ comments: any[] }>(req);
      const report = ExpertCommentMiner.analyzeComments(body.comments || []);

      emitTelemetryEvent('COMMENTS_MINED', `Minería de expertos: ${report.highSignalCount} comentarios técnicos detectados`, {
        total: report.totalAnalyzed,
        highSignal: report.highSignalCount,
        noisePercentage: report.noisePercentage,
        discoveredTools: report.discoveredTools.map(t => t.name)
      });

      res.writeHead(200, { 'Content-Type': 'application/json' });
      return res.end(JSON.stringify(report));
    } catch (err) {
      res.writeHead(500, { 'Content-Type': 'application/json' });
      return res.end(JSON.stringify({ error: (err as Error).message }));
    }
  }

  res.writeHead(404, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify({ error: 'Ruta no encontrada' }));
});

server.listen(PORT, () => {
  console.log(`\n⚡ [TrautsLab Omni-Scraper & Knowledge Lab] Servidor activo:`);
  console.log(`   👉 Dashboard: http://localhost:${PORT}`);
  console.log(`   👉 SSE Stream: http://localhost:${PORT}/api/telemetry/stream\n`);
});

process.on('SIGINT', () => {
  unwatchFile(eventsPath);
  process.exit(0);
});
