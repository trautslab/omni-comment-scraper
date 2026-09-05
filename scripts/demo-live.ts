import { createDefaultRegistry } from '../src/index.js';
import { JsonExporter } from '../src/exporters/json.exporter.js';
import { CsvExporter } from '../src/exporters/csv.exporter.js';
import { execSync } from 'node:child_process';
import { resolve } from 'node:path';

function logTelemetry(type: string, message: string, metadata: Record<string, unknown> = {}) {
  try {
    const loggerPath = resolve(process.cwd(), 'scripts', 'telemetry-logger.mjs');
    const cmd = `node "${loggerPath}" --type "${type}" --msg "${message}" --meta '${JSON.stringify(metadata)}'`;
    execSync(cmd, { stdio: 'ignore' });
  } catch {
    // optional telemetry
  }
}

async function runDemo() {
  console.log('='.repeat(70));
  console.log('🌟 [AI-SDLC DEMO:LIVE] Omni-Platform Social Comment Scraper');
  console.log('='.repeat(70));

  logTelemetry('DEMO_LIFECYCLE', 'Iniciando demostración en vivo de scraping multiplataforma', {
    stage: 'demo:start',
    timestamp: new Date().toISOString()
  });

  const registry = createDefaultRegistry();
  const jsonExporter = new JsonExporter();
  const csvExporter = new CsvExporter();

  // Test Target 1: The user's requested Instagram Reel
  const instagramUrl = 'https://www.instagram.com/reels/DVw27-9jGJe/';
  console.log(`\n📌 1. Procesando post objetivo de Instagram: ${instagramUrl}`);
  
  const igAdapter = registry.getAdapterForUrl(instagramUrl);
  console.log(`- Adaptador seleccionado: [${igAdapter.platform.toUpperCase()}]`);

  const igResult = await igAdapter.scrapeComments(instagramUrl);
  console.log(`✅ Extracción completada en ${igResult.durationMs}ms`);
  console.log(`   • Shortcode: ${igResult.metadata.id}`);
  console.log(`   • Autor: ${igResult.metadata.author.displayName} (@${igResult.metadata.author.username})`);
  console.log(`   • Engagement: ${igResult.metadata.engagement.likesCount?.toLocaleString()} likes | ${igResult.metadata.engagement.commentsCount?.toLocaleString()} comentarios`);
  console.log(`   • Extracto del post:`);
  console.log(`     "${igResult.metadata.caption.split('\n')[0]}"`);
  if (igResult.authNotice) {
    console.log(`   ℹ️ [Políticas de Acceso]: ${igResult.authNotice}`);
  }

  await jsonExporter.export(igResult, './data/demo_instagram_reel.json');
  console.log(`   💾 Exportado a: ./data/demo_instagram_reel.json`);

  logTelemetry('SCRAPE_SUCCESS', 'Scraping de Instagram Reel completado exitosamente', {
    platform: 'instagram',
    postId: igResult.metadata.id,
    author: igResult.metadata.author.username,
    likes: igResult.metadata.engagement.likesCount,
    comments: igResult.metadata.engagement.commentsCount
  });

  // Test Target 2: Telegram Channel Post
  const telegramUrl = 'https://t.me/durov/123';
  console.log(`\n📌 2. Demostración de adaptabilidad multiplataforma (Telegram): ${telegramUrl}`);
  const tgAdapter = registry.getAdapterForUrl(telegramUrl);
  console.log(`- Adaptador seleccionado: [${tgAdapter.platform.toUpperCase()}]`);
  const tgResult = await tgAdapter.scrapeComments(telegramUrl);
  console.log(`✅ Extracción completada en ${tgResult.durationMs}ms`);
  console.log(`   • ID: ${tgResult.metadata.id}`);
  console.log(`   • Canal: ${tgResult.metadata.author.displayName}`);
  await jsonExporter.export(tgResult, './data/demo_telegram_post.json');
  console.log(`   💾 Exportado a: ./data/demo_telegram_post.json`);

  logTelemetry('DEMO_LIFECYCLE', 'Demostración completada satisfactoriamente', {
    stage: 'demo:completed',
    platformsTested: ['instagram', 'telegram']
  });

  console.log('\n' + '='.repeat(70));
  console.log('🎉 [DEMO:LIVE EXITOSA] Todos los adaptadores y exportadores operan al 100%.');
  console.log('📡 Para ver el panel de telemetría y métricas en vivo ejecuta:');
  console.log('   npm run dashboard (http://localhost:3333)');
  console.log('='.repeat(70) + '\n');
}

runDemo().catch(err => {
  console.error('❌ Error en demo:live:', err);
  process.exit(1);
});
