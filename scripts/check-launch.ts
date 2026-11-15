/**
 * Pre-publication gate. Intentionally fails until the human-owned launch inputs exist.
 * Not part of `npm run ci`; run it before any public deployment.
 */
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

const site = JSON.parse(readFileSync(fileURLToPath(new URL('../config/site.json', import.meta.url)), 'utf8'));
const problems: string[] = [];

if (!site.inquiry.email && !site.inquiry.formUrl) {
  problems.push('config/site.json: inquiry.email or inquiry.formUrl must be set (otherwise there is no CTA).');
}
if (site.inquiry.email && !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(site.inquiry.email)) {
  problems.push('config/site.json: inquiry.email is not a valid address.');
}
if (site.inquiry.formUrl && !/^https:\/\//.test(site.inquiry.formUrl)) {
  problems.push('config/site.json: inquiry.formUrl must be https.');
}
const siteUrl = process.env.SITE_URL || '';
if (!siteUrl || siteUrl.includes('example.com')) {
  problems.push('SITE_URL env var must be set to the real public origin (used for canonical/OG URLs).');
}

if (problems.length) {
  console.error('check:launch — NOT ready to publish:\n' + problems.map((p) => `  - ${p}`).join('\n'));
  process.exit(1);
}
console.log('check:launch: OK');
