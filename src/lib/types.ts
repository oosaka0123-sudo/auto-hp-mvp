export interface Spot {
  id: string;
  name: string;
}

export type ProductIcon = 'board' | 'wetsuit' | 'fin' | 'wax';

export interface ShopConfig {
  schemaVersion: 1;
  id: string;
  name: string;
  isFictional: boolean;
  tagline: string;
  area: string;
  hours: string;
  school: {
    lead: string;
    courses: { id: string; name: string; level: string; duration: string; price: string; includes: string[] }[];
    notes: string[];
  };
  services: { name: string; price: string; description: string }[];
  products: { icon: ProductIcon; category: string; name: string; price: string; note: string }[];
  events: { name: string; schedule: string; description: string }[];
  access: { address: string; transport: string[]; parking: string; note: string };
  spots: Spot[];
  waveProvider: string;
  retentionDays: number;
}

export type Rating = 1 | 2 | 3 | 4 | 5;

export interface WaveSlot {
  /** Local time label, e.g. "06:00" (JST). */
  time: string;
  heightM: number;
  periodS: number;
  windDir: string;
  windMs: number;
  rating: Rating;
}

export interface SpotOutlook {
  spotId: string;
  spotName: string;
  slots: WaveSlot[];
  summary: string;
}

/** One generated file per target date. Contains no timestamps so reruns are byte-identical. */
export interface DailyWaveFile {
  schemaVersion: 1;
  demo: true;
  source: string;
  shopId: string;
  targetDate: string;
  spots: SpotOutlook[];
  disclaimer: string;
}
