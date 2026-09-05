import test from 'node:test';
import assert from 'node:assert/strict';
import { createDefaultRegistry } from '../../src/index.js';

test('AdapterRegistry resolves all supported platforms correctly', () => {
  const registry = createDefaultRegistry();

  const igAdapter = registry.getAdapterForUrl('https://www.instagram.com/reels/DVw27-9jGJe/');
  assert.equal(igAdapter.platform, 'instagram');

  const ytAdapter = registry.getAdapterForUrl('https://www.youtube.com/watch?v=dQw4w9WgXcQ');
  assert.equal(ytAdapter.platform, 'youtube');

  const tiktokAdapter = registry.getAdapterForUrl('https://www.tiktok.com/@creator/video/1234567890');
  assert.equal(tiktokAdapter.platform, 'tiktok');

  const tgAdapter = registry.getAdapterForUrl('https://t.me/telegram_channel/42');
  assert.equal(tgAdapter.platform, 'telegram');

  const fbAdapter = registry.getAdapterForUrl('https://www.facebook.com/reel/987654321');
  assert.equal(fbAdapter.platform, 'facebook');
});

test('AdapterRegistry throws error for unsupported platform URL', () => {
  const registry = createDefaultRegistry();
  assert.throws(() => {
    registry.getAdapterForUrl('https://unknown-social-network.org/post/1');
  }, /No platform adapter registered/);
});
