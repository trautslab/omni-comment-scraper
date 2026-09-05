#!/usr/bin/env node
import { createDefaultRegistry } from '../index.js';
import { JsonExporter } from '../exporters/json.exporter.js';
import { CsvExporter } from '../exporters/csv.exporter.js';

async function main() {
  const args = process.argv.slice(2);

  if (args.length === 0 || args.includes('--help') || args.includes('-h')) {
    console.log(`
🚀 Omni-Platform Social Comment Scraper (AI-SDLC Standard)

Uso:
  node src/cli/index.ts --url <URL> [opciones]

Opciones:
  --url <URL>        URL del post, video, reel o canal (Instagram, YouTube, TikTok, Telegram, Facebook)
  --limit <N>        Límite máximo de comentarios a procesar (default: 50)
  --format <formato> Formato de exportación: 'json' o 'csv' (default: json)
  --output <path>    Ruta del archivo de salida (ej: ./data/comments.json)
  --session <token>  Cookie de sesión (ej: sessionid de Instagram)

Ejemplos:
  node src/cli/index.ts --url https://www.instagram.com/reels/DVw27-9jGJe/
  node src/cli/index.ts --url https://www.youtube.com/watch?v=dQw4w9WgXcQ --limit 100 --format csv
  node src/cli/index.ts --url https://t.me/durov/123
`);
    process.exit(0);
  }

  const urlIndex = args.indexOf('--url');
  if (urlIndex === -1 || !args[urlIndex + 1]) {
    console.error('❌ Error: El parámetro --url es obligatorio.');
    process.exit(1);
  }
  const url = args[urlIndex + 1];

  const limitIndex = args.indexOf('--limit');
  const limit = limitIndex !== -1 ? parseInt(args[limitIndex + 1], 10) : 50;

  const formatIndex = args.indexOf('--format');
  const format = formatIndex !== -1 ? args[formatIndex + 1].toLowerCase() : 'json';

  const outputIndex = args.indexOf('--output');
  const outputPath = outputIndex !== -1 ? args[outputIndex + 1] : undefined;

  const sessionIndex = args.indexOf('--session');
  const sessionId = sessionIndex !== -1 ? args[sessionIndex + 1] : process.env.INSTAGRAM_SESSION_ID;

  console.log(`\n🔍 [Scraper] Resolviendo plataforma para: ${url}`);
  const registry = createDefaultRegistry();

  try {
    const adapter = registry.getAdapterForUrl(url);
    console.log(`🎯 Plataforma detectada: [${adapter.platform.toUpperCase()}]`);

    console.log('⏳ Extrayendo metadatos y comentarios...');
    const result = await adapter.scrapeComments(url, {
      limit,
      credentials: { sessionId }
    });

    console.log('\n📋 --- Metadatos del Post ---');
    console.log(`- Plataforma: ${result.metadata.platform}`);
    console.log(`- Autor: ${result.metadata.author.displayName} (@${result.metadata.author.username})`);
    console.log(`- Likes: ${result.metadata.engagement.likesCount?.toLocaleString() ?? 0}`);
    console.log(`- Comentarios registrados: ${result.metadata.engagement.commentsCount?.toLocaleString() ?? 0}`);
    console.log(`- Texto: ${result.metadata.caption.slice(0, 140)}...`);

    if (result.authNotice) {
      console.log(`\nℹ️ [Aviso de Acceso]: ${result.authNotice}`);
    }

    console.log(`\n💬 Comentarios extraídos en este ciclo: ${result.comments.length}`);

    const exporter = format === 'csv' ? new CsvExporter() : new JsonExporter();
    const exportedOutput = await exporter.export(result, outputPath);

    if (outputPath) {
      console.log(`💾 Exportación guardada exitosamente en: ${outputPath}`);
    } else if (result.comments.length > 0) {
      console.log('\n--- Vista previa de comentarios ---');
      console.log(exportedOutput.slice(0, 1000));
    }
  } catch (error) {
    console.error(`\n❌ Error durante el scraping: ${(error as Error).message}`);
    process.exit(1);
  }
}

main();
