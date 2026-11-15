import type { Rating, Spot, SpotOutlook, WaveSlot } from './types';

/**
 * Replaceable data source. A real provider may only be added after its licence
 * permits commercial redistribution (e.g. Open-Meteo terms must be reviewed first).
 */
export interface WaveProvider {
  readonly id: string;
  readonly isDemo: boolean;
  getMorningOutlook(spot: Spot, targetDate: string, shopId: string): Promise<SpotOutlook>;
}

export function fnv1a(input: string): number {
  let h = 0x811c9dc5;
  for (let i = 0; i < input.length; i++) {
    h ^= input.charCodeAt(i);
    h = Math.imul(h, 0x01000193);
  }
  return h >>> 0;
}

export function mulberry32(seed: number): () => number {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const WIND_DIRS = ['北', '北東', '東', '南東', '南', '南西', '西', '北西'];
const SLOT_TIMES = ['05:00', '06:00', '07:00', '08:00', '09:00'];

const SUMMARY: Record<Rating, string> = {
  1: '小さめ。のんびり練習向きのイメージ（サンプル）',
  2: 'ひざ〜ももサイズのイメージ。スクール向き（サンプル）',
  3: 'ほどよいサイズ感のイメージ（サンプル）',
  4: 'しっかりめのサイズ感のイメージ（サンプル）',
  5: '大きめ。上級者向けのイメージ（サンプル）',
};

const round1 = (n: number) => Math.round(n * 10) / 10;

function rate(heightM: number, windMs: number): Rating {
  let score = heightM < 0.5 ? 1 : heightM < 0.8 ? 2 : heightM < 1.2 ? 3 : heightM < 1.6 ? 4 : 5;
  if (windMs > 7 && score > 1) score -= 1;
  return score as Rating;
}

/** Deterministic pseudo-random sample data. Same (shop, spot, date) ⇒ identical output. Never real data. */
export class DemoWaveProvider implements WaveProvider {
  readonly id = 'demo-generator';
  readonly isDemo = true;

  async getMorningOutlook(spot: Spot, targetDate: string, shopId: string): Promise<SpotOutlook> {
    const rand = mulberry32(fnv1a(`${shopId}:${spot.id}:${targetDate}`));
    const base = 0.3 + rand() * 1.4;
    const period = 6 + Math.floor(rand() * 7);
    const dirIndex = Math.floor(rand() * WIND_DIRS.length);
    const windBase = 1 + rand() * 6;

    const slots: WaveSlot[] = SLOT_TIMES.map((time, i) => {
      const heightM = round1(Math.max(0.2, base + (rand() - 0.5) * 0.3 - i * 0.02));
      const windMs = round1(Math.max(0, windBase + i * 0.6 + (rand() - 0.5)));
      return {
        time,
        heightM,
        periodS: period,
        windDir: WIND_DIRS[(dirIndex + (i >= 3 ? 1 : 0)) % WIND_DIRS.length]!,
        windMs,
        rating: rate(heightM, windMs),
      };
    });

    const best = Math.max(...slots.map((s) => s.rating)) as Rating;
    return { spotId: spot.id, spotName: spot.name, slots, summary: SUMMARY[best] };
  }
}

export function createWaveProvider(kind: string): WaveProvider {
  if (kind === 'demo') return new DemoWaveProvider();
  throw new Error(
    `Wave provider "${kind}" is not configured. Only "demo" is available until a licensed data source and verified pipeline are added.`,
  );
}
