import assert from 'node:assert/strict';
import { readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { test } from 'node:test';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('..', import.meta.url));
const readJson = (p: string) => JSON.parse(readFileSync(join(root, p), 'utf8'));

test('site plans match the unvalidated test offer in SPEC.md', () => {
  const site = readJson('config/site.json');
  const monitor = site.plans.find((p: { id: string }) => p.id === 'monitor');
  const regular = site.plans.find((p: { id: string }) => p.id === 'regular');
  assert.equal(monitor.priceJpyMonthly, 9800);
  assert.equal(monitor.slots, 3);
  assert.equal(regular.priceJpyMonthly, 19800);
  assert.equal(site.setupFeeJpy, 0);
  for (const p of site.plans) {
    assert.equal(p.taxIncluded, true);
    assert.ok(p.note.length > 0, 'each plan needs a conditions note');
  }
});

test('every shop config is fictional and uses the demo provider', () => {
  for (const name of readdirSync(join(root, 'config/shops'))) {
    const shop = readJson(`config/shops/${name}`);
    assert.equal(shop.isFictional, true, `${name} must be fictional in the MVP`);
    assert.equal(shop.waveProvider, 'demo');
    assert.ok(shop.spots.length > 0);
    assert.equal(new Set(shop.spots.map((s: { id: string }) => s.id)).size, shop.spots.length, 'spot ids unique');
  }
});

test('demo shop covers school, products, events, access and sample labels', () => {
  const shop = readJson('config/shops/sample-surf.json');
  assert.ok(shop.school.courses.length > 0, 'school courses');
  assert.equal(new Set(shop.school.courses.map((c: { id: string }) => c.id)).size, shop.school.courses.length);
  assert.ok(shop.products.length > 0, 'products');
  for (const p of shop.products) {
    assert.ok(['board', 'wetsuit', 'fin', 'wax'].includes(p.icon), `icon ${p.icon}`);
    assert.match(p.note, /サンプル/);
  }
  for (const e of shop.events) assert.match(e.description, /サンプル/);
  assert.match(shop.access.address, /架空|実在しない/);
  assert.match(shop.access.note, /実在の場所を示すものではありません/);
  // No real-looking phone numbers in the fictional shop.
  assert.doesNotMatch(JSON.stringify(shop), /0\d{1,4}-\d{1,4}-\d{3,4}/);
});

test('positioning is surf shops only (no generic coastal-business wording)', () => {
  const sources = [
    readFileSync(join(root, 'config/site.json'), 'utf8'),
    readFileSync(join(root, 'src/pages/index.astro'), 'utf8'),
  ].join('\n');
  assert.doesNotMatch(sources, /海辺の小さなお店|COASTAL STORES|coastal businesses/i);
});

test('demo news has unique slugs, valid dates and sample labels', () => {
  const news = readJson('src/data/news.json') as { slug: string; date: string; title: string }[];
  assert.equal(new Set(news.map((n) => n.slug)).size, news.length);
  for (const n of news) {
    assert.match(n.slug, /^[a-z0-9-]+$/);
    assert.match(n.date, /^\d{4}-\d{2}-\d{2}$/);
    assert.match(n.title, /サンプル/);
  }
});

test('repository contains no obvious secrets', () => {
  const pattern = /(sk-[A-Za-z0-9]{20,}|ghp_[A-Za-z0-9]{20,}|AKIA[0-9A-Z]{16}|-----BEGIN [A-Z ]*PRIVATE KEY-----)/;
  const scan = (dir: string): string[] =>
    readdirSync(join(root, dir), { withFileTypes: true }).flatMap((d) => {
      const rel = `${dir}/${d.name}`;
      if (d.isDirectory()) return scan(rel);
      return pattern.test(readFileSync(join(root, rel), 'utf8')) ? [rel] : [];
    });
  assert.deepEqual([...scan('src'), ...scan('config'), ...scan('scripts'), ...scan('.github')], []);
});
