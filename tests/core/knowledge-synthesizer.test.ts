import test from 'node:test';
import assert from 'node:assert/strict';
import { KnowledgeSynthesizer } from '../../src/core/knowledge-synthesizer.js';
import { PostMetadata } from '../../src/core/types.js';

test('KnowledgeSynthesizer extracts core claims, fact-checks and generates NotebookLM bundle', () => {
  const metadata: PostMetadata = {
    id: 'DVw27-9jGJe',
    platform: 'instagram',
    url: 'https://www.instagram.com/reels/DVw27-9jGJe/',
    author: {
      username: 'arturo_velazquez_java',
      displayName: 'Arturo Velazquez'
    },
    caption: 'En 2022, Ticketmaster colapsó en tiempo real. Solución: Rate Limiting en API Gateway (HTTP 429), reCAPTCHA v3, Redis Sorted Sets para colas virtuales, Device Fingerprinting y OTP.',
    engagement: {
      likesCount: 47000,
      commentsCount: 501
    }
  };

  const bundle = KnowledgeSynthesizer.synthesize(metadata);

  assert.equal(bundle.author, 'Arturo Velazquez');
  assert.equal(bundle.sourceUrl, 'https://www.instagram.com/reels/DVw27-9jGJe/');
  assert.match(bundle.topic, /Mitigación de Bots/);
  assert.ok(bundle.coreClaims.length >= 3);

  // Check fact-checking matrix
  const rateLimitCheck = bundle.factChecks.find(f => f.claim.includes('Rate Limiting'));
  assert.ok(rateLimitCheck);
  assert.equal(rateLimitCheck.verdict, 'VERIFIED');
  assert.ok(rateLimitCheck.verifiableSources.some(s => s.title.includes('RFC 6585')));

  // Check SOTA improvements
  assert.ok(bundle.architecturalImprovements.length >= 2);
  assert.ok(bundle.architecturalImprovements.some(i => i.sotaRecommendation.includes('eBPF')));

  // Check study questions
  assert.ok(bundle.studyQuestions.length >= 2);

  // Check markdown output
  assert.match(bundle.markdownContent, /# 📚 NotebookLM Source Pack/);
  assert.match(bundle.markdownContent, /RFC 6585/);
});
