import test from 'node:test';
import assert from 'node:assert/strict';
import { TelegramAdapter } from '../../src/adapters/telegram.adapter.js';

test('TelegramAdapter validates Telegram post URLs', () => {
  const adapter = new TelegramAdapter();
  assert.equal(adapter.canHandle('https://t.me/telegram_channel/1234'), true);
  assert.equal(adapter.canHandle('https://t.me/durov/42'), true);
  assert.equal(adapter.canHandle('https://youtube.com/watch?v=123'), false);
});

test('TelegramAdapter extracts channel and message ID', () => {
  const adapter = new TelegramAdapter();
  assert.equal(adapter.extractPostId('https://t.me/durov/42'), 'durov/42');
});
