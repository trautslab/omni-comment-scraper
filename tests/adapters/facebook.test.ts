import test from 'node:test';
import assert from 'node:assert/strict';
import { FacebookAdapter } from '../../src/adapters/facebook.adapter.js';

test('FacebookAdapter canHandle matches Facebook URLs', () => {
  const adapter = new FacebookAdapter();
  assert.equal(adapter.canHandle('https://www.facebook.com/reel/1234567890'), true);
  assert.equal(adapter.canHandle('https://facebook.com/posts/99887766'), true);
  assert.equal(adapter.canHandle('https://instagram.com/p/abc'), false);
});

test('FacebookAdapter extracts post or reel ID', () => {
  const adapter = new FacebookAdapter();
  assert.equal(adapter.extractPostId('https://www.facebook.com/reel/1234567890'), '1234567890');
  assert.equal(adapter.extractPostId('https://www.facebook.com/posts/99887766'), '99887766');
});
