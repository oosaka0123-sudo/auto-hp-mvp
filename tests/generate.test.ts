import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { test } from 'node:test';
import { fileURLToPath } from 'node:url';
import {
  DEMO_DISCLAIMER,
  addDays,
  buildDailyWaveFile,
  filesToPrune,
  isValidDate,
  jstDateString,
  serialize,
} from '../src/lib/generate';
import type { ShopConfig } from '../src/lib/types';
import { createWaveProvider } from '../src/lib/wave-provider';

const shop = JSON.parse(
  readFileSync(fileURLToPath(new URL('../config/shops/sample-surf.json', import.meta.url)), 'utf8'),
) as ShopConfig;

test('same date produces byte-identical output (idempotent reruns)', async () => {
  const a = serialize(await buildDailyWaveFile(shop, '2026-12-01'));
  const b = serialize(await buildDailyWaveFile(shop, '2026-12-01'));
  assert.equal(a, b);
});

test('different dates produce different content', async () => {
  const a = serialize(await buildDailyWaveFile(shop, '2026-12-01'));
  const b = serialize(await buildDailyWaveFile(shop, '2026-12-02'));
  assert.notEqual(a, b);
});

test('output is explicitly DEMO and carries no timestamps', async () => {
  const file = await buildDailyWaveFile(shop, '2026-12-01');
  assert.equal(file.demo, true);
  assert.equal(file.source, 'demo-generator');
  assert.equal(file.disclaimer, DEMO_DISCLAIMER);
  assert.match(file.disclaimer, /DEMO/);
  assert.match(file.disclaimer, /実際の観測値・予報ではありません/);
  assert.doesNotMatch(serialize(file), /T\d{2}:\d{2}:\d{2}/);
});

test('values stay within plausible sample ranges', async () => {
  for (let i = 0; i < 60; i++) {
    const file = await buildDailyWaveFile(shop, addDays('2026-01-01', i));
    assert.equal(file.spots.length, shop.spots.length);
    for (const spot of file.spots) {
      assert.equal(spot.slots.length, 5);
      assert.match(spot.summary, /サンプル/);
      for (const s of spot.slots) {
        assert.ok(s.heightM >= 0.2 && s.heightM <= 2.2, `height ${s.heightM}`);
        assert.ok(s.periodS >= 6 && s.periodS <= 12, `period ${s.periodS}`);
        assert.ok(s.windMs >= 0 && s.windMs <= 12, `wind ${s.windMs}`);
        assert.ok(s.rating >= 1 && s.rating <= 5);
      }
    }
  }
});

test('JST date handling: 17:00 JST run targets the next JST morning', () => {
  // 2026-11-15 17:00 JST == 08:00 UTC
  const run = new Date('2026-11-15T08:00:00Z');
  assert.equal(jstDateString(run), '2026-11-15');
  assert.equal(jstDateString(run, 1), '2026-11-16');
  // Delayed run after JST midnight still uses the JST calendar.
  assert.equal(jstDateString(new Date('2026-11-15T15:30:00Z'), 1), '2026-11-17');
});

test('date validation rejects malformed and impossible dates', () => {
  assert.ok(isValidDate('2026-02-28'));
  assert.ok(!isValidDate('2026-02-30'));
  assert.ok(!isValidDate('2026-2-1'));
  assert.ok(!isValidDate('../etc'));
});

test('retention pruning only removes dated files older than the window', () => {
  const existing = ['2026-11-01.json', '2026-11-02.json', '2026-11-16.json', '.gitkeep', 'notes.json'];
  assert.deepEqual(filesToPrune(existing, '2026-11-16', 14), ['2026-11-01.json']);
});

test('non-demo providers are refused until licensed', () => {
  assert.throws(() => createWaveProvider('open-meteo'), /not configured/);
});
