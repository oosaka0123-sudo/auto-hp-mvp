/**
 * Generates next-morning DEMO wave content for every configured shop.
 * Idempotent: the output depends only on (shop config, target date), so reruns
 * for the same date leave files byte-identical and never create duplicates.
 *
 *   npm run generate                      # target = tomorrow (JST)
 *   npm run generate -- --date 2026-12-01 # explicit target date
 */
import { existsSync, mkdirSync, readdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { buildDailyWaveFile, filesToPrune, isValidDate, jstDateString, serialize } from '../src/lib/generate';
import type { ShopConfig } from '../src/lib/types';

const root = fileURLToPath(new URL('..', import.meta.url));
const shopsDir = join(root, 'config', 'shops');
const outDir = join(root, 'src', 'data', 'waves');

function argValue(flag: string): string | undefined {
  const i = process.argv.indexOf(flag);
  return i >= 0 ? process.argv[i + 1] : undefined;
}

const targetDate = argValue('--date') ?? jstDateString(new Date(), 1);
if (!isValidDate(targetDate)) {
  console.error(`Invalid --date: ${targetDate}`);
  process.exit(1);
}

// The MVP ships one shop, so output files are keyed by date only. Multi-shop needs a per-shop directory.
const shopFiles = readdirSync(shopsDir).filter((f) => f.endsWith('.json'));
if (shopFiles.length !== 1) {
  console.error(`Expected exactly one shop config in ${shopsDir}, found ${shopFiles.length}.`);
  process.exit(1);
}
const shop = JSON.parse(readFileSync(join(shopsDir, shopFiles[0]!), 'utf8')) as ShopConfig;

mkdirSync(outDir, { recursive: true });
const outFile = join(outDir, `${targetDate}.json`);
const next = serialize(await buildDailyWaveFile(shop, targetDate));

let status: 'created' | 'unchanged' | 'updated';
if (!existsSync(outFile)) status = 'created';
else status = readFileSync(outFile, 'utf8') === next ? 'unchanged' : 'updated';
if (status !== 'unchanged') writeFileSync(outFile, next, 'utf8');

const pruned = filesToPrune(readdirSync(outDir), targetDate, shop.retentionDays);
for (const name of pruned) rmSync(join(outDir, name));

console.log(JSON.stringify({ shop: shop.id, targetDate, status, pruned }));
