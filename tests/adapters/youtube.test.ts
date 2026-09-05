import test from 'node:test';
import assert from 'node:assert/strict';
import { YouTubeAdapter } from '../../src/adapters/youtube.adapter.js';

test('YouTubeAdapter validates video and short URLs', () => {
  const adapter = new YouTubeAdapter();
  assert.equal(adapter.canHandle('https://www.youtube.com/watch?v=dQw4w9WgXcQ'), true);
  assert.equal(adapter.canHandle('https://youtu.be/dQw4w9WgXcQ'), true);
  assert.equal(adapter.canHandle('https://www.youtube.com/shorts/dQw4w9WgXcQ'), true);
  assert.equal(adapter.canHandle('https://instagram.com/reels/123'), false);
});

test('YouTubeAdapter extracts video ID correctly', () => {
  const adapter = new YouTubeAdapter();
  assert.equal(adapter.extractPostId('https://www.youtube.com/watch?v=dQw4w9WgXcQ'), 'dQw4w9WgXcQ');
  assert.equal(adapter.extractPostId('https://youtu.be/dQw4w9WgXcQ?t=10'), 'dQw4w9WgXcQ');
});
