import test from 'node:test';
import assert from 'node:assert/strict';
import { TikTokAdapter } from '../../src/adapters/tiktok.adapter.js';

test('TikTokAdapter validates standard and vm.tiktok URLs', () => {
  const adapter = new TikTokAdapter();
  assert.equal(adapter.canHandle('https://www.tiktok.com/@charlidamelio/video/7000000000000000000'), true);
  assert.equal(adapter.canHandle('https://vm.tiktok.com/ZM8abc123/'), true);
  assert.equal(adapter.canHandle('https://facebook.com/reel/123'), false);
});

test('TikTokAdapter extracts video ID', () => {
  const adapter = new TikTokAdapter();
  assert.equal(adapter.extractPostId('https://www.tiktok.com/@charlidamelio/video/7000000000000000000'), '7000000000000000000');
  assert.equal(adapter.extractPostId('https://vm.tiktok.com/ZM8abc123/'), 'ZM8abc123');
});
