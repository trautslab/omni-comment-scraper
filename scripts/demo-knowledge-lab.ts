import { createDefaultRegistry } from '../src/index.js';
import { KnowledgeSynthesizer } from '../src/core/knowledge-synthesizer.js';
import { ExpertCommentMiner } from '../src/core/expert-comment-miner.js';
import { writeFile, mkdir } from 'node:fs/promises';
import { resolve } from 'node:path';
import { execSync } from 'node:child_process';

function logTelemetry(type: string, message: string, metadata: Record<string, unknown> = {}) {
  try {
    const loggerPath = resolve(process.cwd(), 'scripts', 'telemetry-logger.mjs');
    const cmd = `node "${loggerPath}" --type "${type}" --msg "${message}" --meta '${JSON.stringify(metadata)}'`;
    execSync(cmd, { stdio: 'ignore' });
  } catch {
    // optional
  }
}

async function run() {
  console.log('='.repeat(75));
  console.log('🧠 [TRAUTSLAB KNOWLEDGE LAB] Demostración de Síntesis y Minería de Expertos');
  console.log('='.repeat(75));

  const instagramUrl = 'https://www.instagram.com/reels/DVw27-9jGJe/';
  console.log(`\n📌 1. Ingestando post real de Instagram: ${instagramUrl}`);
  
  const registry = createDefaultRegistry();
  const igAdapter = registry.getAdapterForUrl(instagramUrl);
  const result = await igAdapter.scrapeComments(instagramUrl);

  console.log(`✅ Metadatos extraídos:`);
  console.log(`   • Autor: ${result.metadata.author.displayName} (@${result.metadata.author.username})`);
  console.log(`   • Likes: ${result.metadata.engagement.likesCount?.toLocaleString()} | Comentarios: ${result.metadata.engagement.commentsCount?.toLocaleString()}`);

  // 2. Synthesize Knowledge & Fact-Checking (NotebookLM Pack)
  console.log(`\n🔬 2. Generando Pack de Conocimiento y Fact-Checking para NotebookLM...`);
  const bundle = KnowledgeSynthesizer.synthesize(result.metadata);

  console.log(`✅ Síntesis completada con éxito:`);
  console.log(`   • Tesis central: "${bundle.topic}"`);
  console.log(`   • Afirmaciones evaluadas: ${bundle.factChecks.length} items`);
  for (const fc of bundle.factChecks) {
    console.log(`     - [${fc.verdict}] ${fc.claim.slice(0, 70)}...`);
    console.log(`       Fuente: ${fc.verifiableSources[0]?.title}`);
  }
  console.log(`   • Mejoras SOTA identificadas: ${bundle.architecturalImprovements.length} propuestas`);
  for (const imp of bundle.architecturalImprovements) {
    console.log(`     💡 ${imp.component}: ${imp.sotaRecommendation}`);
  }

  // 3. Mine Expert Comments
  console.log(`\n👥 3. Ejecutando Minería de Comentarios Expertos e Inteligencia Comunitaria...`);
  const sampleExpertComments = [
    {
      id: 'c-1',
      platform: 'instagram' as const,
      postId: result.metadata.id,
      author: { username: 'cloud_architect_latam' },
      text: 'Excelente post Arturo. En nuestra arquitectura bancaria reemplazamos el rate limit en gateway por eBPF en el cluster de Linux y el throughput subió un 400%.',
      timestamp: '2026-03-11T14:00:00Z'
    },
    {
      id: 'c-2',
      platform: 'instagram' as const,
      postId: result.metadata.id,
      author: { username: 'sec_lead_pe' },
      text: 'Mucho cuidado con el SMS OTP para mitigación de reventa masiva. Hoy en día usan granjas de SIMs de bajo costo. FIDO2 / WebAuthn con llave biométrica es la única garantía real.',
      timestamp: '2026-03-11T14:30:00Z'
    },
    {
      id: 'c-3',
      platform: 'instagram' as const,
      postId: result.metadata.id,
      author: { username: 'fan_boy_99' },
      text: 'Crack!! 🔥🔥 gracias por el contenido',
      timestamp: '2026-03-11T15:00:00Z'
    },
    {
      id: 'c-4',
      platform: 'instagram' as const,
      postId: result.metadata.id,
      author: { username: 'infra_engineer' },
      text: 'Para la cola virtual con Redis Sorted Sets: tengan presente la sincronización si usan Redis Cluster con sharding de llaves. En Envoy con token bucket se puede desacoplar elegantemente.',
      timestamp: '2026-03-11T15:30:00Z'
    }
  ];

  const expertReport = ExpertCommentMiner.analyzeComments(sampleExpertComments);
  console.log(`✅ Minería de comentarios completada:`);
  console.log(`   • Comentarios analizados: ${expertReport.totalAnalyzed}`);
  console.log(`   • Comentarios de alta señal técnica: ${expertReport.highSignalCount} (${expertReport.noisePercentage}% ruido filtrado)`);
  console.log(`   • Tecnologías detectadas en los comentarios: ${expertReport.discoveredTools.map(t => t.name).join(', ')}`);
  console.log(`   • Temas de estudio sugeridos por la comunidad:`);
  expertReport.recommendedStudyTopics.forEach((topic, i) => console.log(`     ${i + 1}. ${topic}`));

  // 4. Save artifacts
  await mkdir('./data', { recursive: true });
  const finalMarkdown = bundle.markdownContent + '\n' + expertReport.markdownAppendix;
  await writeFile('./data/ticketmaster_notebooklm_pack.md', finalMarkdown, 'utf-8');
  await writeFile('./data/ticketmaster_expert_insights.json', JSON.stringify(expertReport, null, 2), 'utf-8');

  console.log(`\n💾 Artefactos guardados exitosamente:`);
  console.log(`   📄 NotebookLM Pack: ./data/ticketmaster_notebooklm_pack.md`);
  console.log(`   📊 Insights JSON: ./data/ticketmaster_expert_insights.json`);

  logTelemetry('KNOWLEDGE_LAB_DEMO', 'Demostración de Knowledge Lab y Minería completada con éxito', {
    topic: bundle.topic,
    factChecks: bundle.factChecks.length,
    highSignalComments: expertReport.highSignalCount,
    tools: expertReport.discoveredTools.map(t => t.name)
  });

  console.log('\n' + '='.repeat(75));
  console.log('🎉 [DEMO COMPLETADA] El motor de NotebookLM y Minería de Expertos está listo.');
  console.log('='.repeat(75) + '\n');
}

run().catch(err => {
  console.error('❌ Error en demo:', err);
  process.exit(1);
});
