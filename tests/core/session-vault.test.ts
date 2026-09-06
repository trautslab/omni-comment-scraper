import test from 'node:test';
import assert from 'node:assert/strict';
import { SessionVault } from '../../src/core/session-vault.js';
import { resolve } from 'node:path';
import { rmSync, existsSync } from 'node:fs';

const testVaultPath = resolve(process.cwd(), '.sessions', 'test_vault.json');

test('SessionVault parses cookie strings and saves sessions', async () => {
  if (existsSync(testVaultPath)) rmSync(testVaultPath);

  const vault = new SessionVault(testVaultPath);
  const rawCookies = 'sessionid=ig_test_12345; ds_user_id=987654321; csrftoken=abc123xyz;';

  const saved = await vault.saveSession('instagram', {
    rawCookieString: rawCookies
  });

  assert.equal(saved.platform, 'instagram');
  assert.equal(saved.status, 'active');
  assert.equal(saved.cookies?.['sessionid'], 'ig_test_12345');
  assert.equal(saved.cookies?.['ds_user_id'], '987654321');
  assert.equal(saved.username, 'ig_user_987654321');

  // Verify retrieval
  const retrieved = vault.getSession('instagram');
  assert.equal(retrieved?.cookies?.['sessionid'], 'ig_test_12345');
  assert.equal(vault.getCookie('instagram', 'csrftoken'), 'abc123xyz');

  // Verify listing
  const list = vault.listSessions();
  assert.equal(list.instagram.status, 'active');
  assert.equal(list.instagram.cookieCount, 3);
  assert.equal(list.tiktok.status, 'missing');

  // Cleanup
  if (existsSync(testVaultPath)) rmSync(testVaultPath);
});

test('SessionVault removeSession deletes stored session', async () => {
  if (existsSync(testVaultPath)) rmSync(testVaultPath);

  const vault = new SessionVault(testVaultPath);
  await vault.saveSession('tiktok', {
    cookies: { ttwid: 'tt_1234' },
    username: 'creator_tt'
  });

  assert.equal(vault.getSession('tiktok')?.username, 'creator_tt');
  const removed = vault.removeSession('tiktok');
  assert.equal(removed, true);
  assert.equal(vault.getSession('tiktok'), undefined);

  if (existsSync(testVaultPath)) rmSync(testVaultPath);
});
