import { defineConfig } from 'astro/config';

// SITE_URL / BASE_PATH are set per deployment target (see README).
// The example.com fallback is intentional: `npm run check:launch` fails until a real URL is set.
export default defineConfig({
  site: process.env.SITE_URL || 'https://example.com',
  base: process.env.BASE_PATH || '/',
  trailingSlash: 'always',
  build: { format: 'directory' },
});
