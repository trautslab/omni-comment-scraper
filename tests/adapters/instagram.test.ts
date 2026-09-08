import test from 'node:test';
import assert from 'node:assert/strict';
import { InstagramAdapter } from '../../src/adapters/instagram.adapter.js';

test('InstagramAdapter canHandle validates Instagram reel and post URLs', () => {
  const adapter = new InstagramAdapter();
  assert.equal(adapter.canHandle('https://www.instagram.com/reels/DVw27-9jGJe/'), true);
  assert.equal(adapter.canHandle('https://www.instagram.com/p/C_abc123/'), true);
  assert.equal(adapter.canHandle('https://instagram.com/reel/DVw27-9jGJe'), true);
  assert.equal(adapter.canHandle('https://youtube.com/watch?v=123'), false);
});

test('InstagramAdapter extractPostId extracts correct shortcode', () => {
  const adapter = new InstagramAdapter();
  assert.equal(adapter.extractPostId('https://www.instagram.com/reels/DVw27-9jGJe/'), 'DVw27-9jGJe');
  assert.equal(adapter.extractPostId('https://instagram.com/p/ABC123xyz/?utm_source=ig'), 'ABC123xyz');
});

test('InstagramAdapter extracts real metadata from Ticketmaster Reel', async () => {
  const adapter = new InstagramAdapter();
  const url = 'https://www.instagram.com/reels/DVw27-9jGJe/';
  
  const result = await adapter.scrapeComments(url);
  assert.equal(result.metadata.id, 'DVw27-9jGJe');
  assert.equal(result.metadata.platform, 'instagram');
  assert.equal(result.metadata.author.username, 'arturo_velazquez_java');
  assert.ok(result.metadata.engagement.likesCount >= 40000);
  assert.ok(result.metadata.engagement.commentsCount >= 500);
  assert.match(result.metadata.caption, /Ticketmaster/);
  assert.equal(result.requiresAuthForComments, true);
});
