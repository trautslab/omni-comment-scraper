import test from 'node:test';
import assert from 'node:assert/strict';
import { ExpertCommentMiner } from '../../src/core/expert-comment-miner.js';
import { Comment } from '../../src/core/types.js';

test('ExpertCommentMiner filters noise and identifies high-value technical comments', () => {
  const sampleComments: Comment[] = [
    {
      id: 'c-1',
      platform: 'instagram',
      postId: 'post-1',
      author: { username: 'fan1' },
      text: 'Crack!! 🔥🔥 Buen video hermano',
      timestamp: '2026-03-11T10:00:00Z'
    },
    {
      id: 'c-2',
      platform: 'instagram',
      postId: 'post-1',
      author: { username: 'dev_ops_ninja' },
      text: 'Nosotros en producción usamos Envoy con Redis para el global rate limiting distribuido. Sin embargo, con reCAPTCHA v3 tuvimos muchos falsos positivos en usuarios detrás de VPN corporativa.',
      timestamp: '2026-03-11T11:00:00Z'
    },
    {
      id: 'c-3',
      platform: 'instagram',
      postId: 'post-1',
      author: { username: 'sec_engineer' },
      text: 'Ojo con el SMS OTP: sufrimos un ataque de SIM swapping coordinado el año pasado. Para compras críticas migramos a WebAuthn y FIDO2.',
      timestamp: '2026-03-11T12:00:00Z'
    },
    {
      id: 'c-4',
      platform: 'instagram',
      postId: 'post-1',
      author: { username: 'user_short' },
      text: 'saludos',
      timestamp: '2026-03-11T13:00:00Z'
    }
  ];

  const report = ExpertCommentMiner.analyzeComments(sampleComments);

  assert.equal(report.totalAnalyzed, 4);
  assert.equal(report.highSignalCount, 2);
  assert.equal(report.noisePercentage, 50);

  // Check top comments
  assert.equal(report.topExpertComments.length, 2);
  assert.ok(report.topExpertComments[0].technicalDepthScore >= 60);

  // Check detected tools
  const tools = report.discoveredTools.map(t => t.name);
  assert.ok(tools.includes('ENVOY'));
  assert.ok(tools.includes('REDIS'));
  assert.ok(tools.includes('WEBAUTHN') || tools.includes('FIDO2'));

  // Check derived study topics
  assert.ok(report.recommendedStudyTopics.length >= 2);

  // Check markdown appendix
  assert.match(report.markdownAppendix, /Minería de Inteligencia Comunitaria/);
  assert.match(report.markdownAppendix, /ENVOY/);
});
