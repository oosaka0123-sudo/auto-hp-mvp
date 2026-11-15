import siteJson from '../../config/site.json';
import shopJson from '../../config/shops/sample-surf.json';
import newsJson from '../data/news.json';
import type { DailyWaveFile, ShopConfig } from './types';

export const site = siteJson;
export const shop = shopJson as ShopConfig;

export interface NewsItem {
  slug: string;
  date: string;
  tag: string;
  title: string;
  body: string[];
}

export const news = ([...newsJson] as NewsItem[]).sort((a, b) => b.date.localeCompare(a.date));

const waveModules = import.meta.glob<DailyWaveFile>('../data/waves/*.json', { eager: true, import: 'default' });

/** Generated DEMO files, newest target date first. */
export const waveDays: DailyWaveFile[] = Object.values(waveModules).sort((a, b) =>
  b.targetDate.localeCompare(a.targetDate),
);

/** Prefix a root-relative path with the configured base (for GitHub Pages sub-paths). */
export function href(path: string): string {
  const base = import.meta.env.BASE_URL.replace(/\/$/, '');
  return base + (path.startsWith('/') ? path : `/${path}`);
}

export function inquiryHref(): string | null {
  if (site.inquiry.formUrl) return site.inquiry.formUrl;
  if (site.inquiry.email) return `mailto:${site.inquiry.email}?subject=${encodeURIComponent('AUTO SITE お問い合わせ')}`;
  return null;
}

export const yen = (n: number) => `¥${n.toLocaleString('ja-JP')}`;

export function formatDateJa(date: string): string {
  const [y, m, d] = date.split('-').map(Number);
  const wd = '日月火水木金土'[new Date(Date.UTC(y!, m! - 1, d!)).getUTCDay()];
  return `${y}年${m}月${d}日（${wd}）`;
}
