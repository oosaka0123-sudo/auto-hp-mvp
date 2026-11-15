/**
 * Post-build checks on dist/: SEO basics, no dead internal links or placeholder anchors,
 * DEMO labelling on demo pages, and no fabricated-trust or live-data wording.
 */
import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs';
import { join, relative, sep } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('..', import.meta.url));
const dist = join(root, 'dist');
const base = (process.env.BASE_PATH || '/').replace(/\/$/, '');

if (!existsSync(dist)) {
  console.error('dist/ not found. Run `npm run build` first.');
  process.exit(1);
}

function walk(dir: string): string[] {
  return readdirSync(dir).flatMap((name) => {
    const p = join(dir, name);
    return statSync(p).isDirectory() ? walk(p) : [p];
  });
}

const BANNED: [RegExp, string][] = [
  [/お客様の声|利用者の声|testimonial/i, 'testimonial section (none exist yet)'],
  [/★★★★★|5つ星/, 'star-rating claim'],
  [/live\s*(cam|forecast|wave|data)/i, 'live-data claim'],
  [/ライブカメラ|リアルタイム(配信|更新|観測)|現在の波/, 'real-time claim'],
  [/導入実績|導入店舗数|満足度\s*\d/, 'unverified track-record claim'],
  [/SEO(で)?(上位|1位)?保証|集客(を)?保証|必ず(売上|集客)/, 'unapproved guarantee'],
];

const files = walk(dist);
const pages = files.filter((f) => f.endsWith('.html'));
const errors: string[] = [];

for (const file of pages) {
  const rel = relative(dist, file).split(sep).join('/');
  const html = readFileSync(file, 'utf8');
  const text = html.replace(/<script[\s\S]*?<\/script>/g, '').replace(/<[^>]+>/g, ' ');

  if (!/<html[^>]*\blang="ja"/.test(html)) errors.push(`${rel}: missing <html lang="ja">`);
  if (!/<title>[^<]{5,}<\/title>/.test(html)) errors.push(`${rel}: missing/short <title>`);
  if (!/<meta name="description" content="[^"]{20,}"/.test(html)) errors.push(`${rel}: missing meta description`);
  if (!/<meta name="viewport"/.test(html)) errors.push(`${rel}: missing viewport meta`);
  if (/href="(#?)"/.test(html)) errors.push(`${rel}: empty or "#" href (dead CTA)`);

  if (rel.startsWith('demo/') && !text.includes('DEMO')) errors.push(`${rel}: demo page lacks DEMO label`);

  for (const [re, label] of BANNED) {
    if (re.test(text)) errors.push(`${rel}: banned wording — ${label}`);
  }

  for (const [, href] of html.matchAll(/href="([^"]+)"/g)) {
    if (!href || /^(https?:|mailto:|tel:|#|data:)/.test(href) || href.startsWith('//')) continue;
    if (!href.startsWith('/')) {
      errors.push(`${rel}: relative internal link ${href}`);
      continue;
    }
    let path = href.split('#')[0]!.split('?')[0]!;
    if (base && path.startsWith(base)) path = path.slice(base.length) || '/';
    const target = path.endsWith('/') ? join(dist, path, 'index.html') : join(dist, path);
    if (!existsSync(target)) errors.push(`${rel}: broken internal link ${href}`);
  }
}

for (const required of ['index.html', '404.html', 'favicon.svg', 'demo/sample-surf/index.html', 'demo/sample-surf/news/index.html']) {
  if (!existsSync(join(dist, required))) errors.push(`missing ${required}`);
}

const demoHome = join(dist, 'demo/sample-surf/index.html');
if (existsSync(demoHome)) {
  const html = readFileSync(demoHome, 'utf8');
  for (const id of ['waves', 'school', 'shop', 'news', 'access', 'contact']) {
    if (!html.includes(`id="${id}"`)) errors.push(`demo/sample-surf/index.html: missing section #${id}`);
  }
  // The sample inquiry form must stay inert: no action target, and its controls disabled.
  if (/<form[^>]*\baction=/.test(html)) errors.push('demo/sample-surf/index.html: demo form must not have an action');
  if (/<form/.test(html) && !/<fieldset[^>]*\bdisabled/.test(html)) errors.push('demo/sample-surf/index.html: demo form fieldset must be disabled');
}

if (errors.length) {
  console.error(`verify-dist: ${errors.length} problem(s)\n` + errors.map((e) => `  - ${e}`).join('\n'));
  process.exit(1);
}
console.log(`verify-dist: OK (${pages.length} pages)`);
