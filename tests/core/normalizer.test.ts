import test from 'node:test';
import assert from 'node:assert/strict';
import { CommentNormalizer } from '../../src/core/normalizer.js';

test('CommentNormalizer.cleanText removes redundant whitespace and normalizes CRLF', () => {
  const raw = '  Hola   mundo! \r\n\r\n Esto es   una prueba.  ';
  const cleaned = CommentNormalizer.cleanText(raw);
  assert.equal(cleaned, 'Hola mundo!\n\nEsto es una prueba.');
});

test('CommentNormalizer.extractHashtags extracts unique lowercase hashtags', () => {
  const text = 'Me encanta el #Scraping y la #Arquitectura, aguante el #SCRAPING';
  const hashtags = CommentNormalizer.extractHashtags(text);
  assert.deepEqual(hashtags, ['scraping', 'arquitectura']);
});

test('CommentNormalizer.extractMentions extracts unique mentions', () => {
  const text = 'Gran video de @arturo_velazquez_java y @trautslab con @Arturo_Velazquez_Java';
  const mentions = CommentNormalizer.extractMentions(text);
  assert.deepEqual(mentions, ['arturo_velazquez_java', 'trautslab']);
});

test('CommentNormalizer.detectSentiment detects positive and negative keywords', () => {
  assert.equal(CommentNormalizer.detectSentiment('Excelente explicación, muy buena arquitectura!'), 'positive');
  assert.equal(CommentNormalizer.detectSentiment('Horrible tutorial, una completa estafa y error'), 'negative');
  assert.equal(CommentNormalizer.detectSentiment('El servidor corre en el puerto 3333'), 'neutral');
});

test('CommentNormalizer.normalizeComment produces standard normalized structure', () => {
  const comment = CommentNormalizer.normalizeComment({
    id: 'c-123',
    platform: 'instagram',
    postId: 'post-99',
    author: {
      username: '@dev_tester',
      displayName: 'Dev Tester'
    },
    rawText: '¡Gran post! #tecnologia @arturo_velazquez_java',
    timestamp: '2026-03-11T12:00:00Z',
    likesCount: 15
  });

  assert.equal(comment.id, 'c-123');
  assert.equal(comment.platform, 'instagram');
  assert.equal(comment.author.username, 'dev_tester');
  assert.equal(comment.likesCount, 15);
  assert.deepEqual(comment.hashtags, ['tecnologia']);
  assert.deepEqual(comment.mentions, ['arturo_velazquez_java']);
  assert.equal(comment.sentiment, 'positive');
});
