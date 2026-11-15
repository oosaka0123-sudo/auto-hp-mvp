import type { DailyWaveFile, ShopConfig, SpotOutlook } from './types';
import { createWaveProvider } from './wave-provider';

export const DEMO_DISCLAIMER =
  'DEMO：これは架空の店舗向けに自動生成したサンプルデータです。実際の観測値・予報ではありません。海に入る判断には使わないでください。';

const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;
const JST_OFFSET_MS = 9 * 60 * 60 * 1000;
const DAY_MS = 24 * 60 * 60 * 1000;

export function isValidDate(date: string): boolean {
  if (!DATE_RE.test(date)) return false;
  return new Date(`${date}T00:00:00Z`).toISOString().slice(0, 10) === date;
}

/** Calendar date in Asia/Tokyo, shifted by `addDays`. */
export function jstDateString(now: Date, addDays = 0): string {
  return new Date(now.getTime() + JST_OFFSET_MS + addDays * DAY_MS).toISOString().slice(0, 10);
}

export function addDays(date: string, days: number): string {
  return new Date(Date.parse(`${date}T00:00:00Z`) + days * DAY_MS).toISOString().slice(0, 10);
}

export async function buildDailyWaveFile(shop: ShopConfig, targetDate: string): Promise<DailyWaveFile> {
  if (!isValidDate(targetDate)) throw new Error(`Invalid target date: ${targetDate}`);
  const provider = createWaveProvider(shop.waveProvider);
  if (!provider.isDemo) throw new Error('Non-demo providers are not permitted in this MVP.');

  const spots: SpotOutlook[] = [];
  for (const spot of shop.spots) {
    spots.push(await provider.getMorningOutlook(spot, targetDate, shop.id));
  }
  return {
    schemaVersion: 1,
    demo: true,
    source: provider.id,
    shopId: shop.id,
    targetDate,
    spots,
    disclaimer: DEMO_DISCLAIMER,
  };
}

export function serialize(file: DailyWaveFile): string {
  return JSON.stringify(file, null, 2) + '\n';
}

/** File names (YYYY-MM-DD.json) older than the retention window relative to targetDate. */
export function filesToPrune(existing: string[], targetDate: string, retentionDays: number): string[] {
  const cutoff = addDays(targetDate, -retentionDays);
  return existing.filter((name) => {
    const date = name.replace(/\.json$/, '');
    return isValidDate(date) && date < cutoff;
  });
}
