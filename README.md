# auto-hp-mvp — AUTO SITE

Auto-updating website subscription MVP **for surf shops only** (shops with schools/rentals included; not generic coastal businesses). See [SPEC.md](SPEC.md).

- `/` — AUTO SITE landing page (value proposition, example, test pricing, FAQ, inquiry CTA)
- `/demo/sample-surf/` — **fictional** SAMPLE SURF demo shop: next-morning DEMO wave section, surf-school courses + inquiry CTA, rental/repair, product highlights, news & events, illustrated (fictional) access map, and a non-functional sample inquiry form (`<fieldset disabled>`, no `action`). Mobile has a sticky bottom CTA bar.
- `/demo/sample-surf/news/` — news list/detail
- `/404.html` — not-found page

Everything under `/demo/` is labelled DEMO, marked `noindex`, and uses generated sample numbers.
**No live, observed or forecast wave data is used anywhere.**

## Stack

Astro 5 (static output) + TypeScript, hand-written CSS and inline SVG. No database, login, payments, paid APIs, video or web fonts.

## Commands

| Command | What it does |
| --- | --- |
| `npm install` | Install dependencies (commit the generated `package-lock.json`, then switch CI to `npm ci`) |
| `npm run dev` | Local dev server |
| `npm run generate` | Generate next-morning (JST) DEMO wave file into `src/data/waves/` |
| `npm run generate -- --date YYYY-MM-DD` | Generate for an explicit date |
| `npm run check` | `astro check` + type-check scripts/tests |
| `npm test` | Generator determinism/idempotency, JST date logic, config and secret checks |
| `npm run build` | Static build to `dist/` |
| `npm run verify` | Post-build checks: SEO meta, dead/broken links, DEMO labels, banned claims |
| `npm run ci` | All of the above in order |
| `npm run check:launch` | Pre-publication gate — **fails until inquiry contact and `SITE_URL` are set** |

## Configuration

- `config/site.json` — brand copy, plans (JPY 9,800 monitor ×3 slots / JPY 19,800 regular, tax included, setup JPY 0 — *unvalidated test offers*), inquiry contact.
  - `inquiry.email` / `inquiry.formUrl` are intentionally empty. While empty, the CTA renders "準備中" instead of a dead link.
- `config/shops/sample-surf.json` — fictional shop: `school` (courses/notes), `services`, `products` (icon: `board`/`wetsuit`/`fin`/`wax`), `events` (recurring, so they never go stale), `access` (fictional address), `spots`, `waveProvider: "demo"`, `retentionDays`. No phone numbers — tests reject phone-like strings.
- `src/data/news.json` — sample news posts.

## Daily DEMO generation

`src/lib/wave-provider.ts` defines a `WaveProvider` interface. The only implementation is `DemoWaveProvider`, a seeded PRNG keyed on `shopId:spotId:date`, so:

- reruns for the same date are byte-identical (no timestamps in output) → no duplicates;
- old files beyond `retentionDays` are pruned deterministically.

`createWaveProvider()` throws for anything other than `"demo"`. Adding a real provider requires a licensed source whose terms allow commercial redistribution (do **not** assume Open-Meteo or similar permits this without reviewing its licence) and a verified pipeline.

### Scheduler

`.github/workflows/daily-demo.yml` runs at `0 8 * * *` UTC (≈17:00 JST) and on manual dispatch. GitHub may delay scheduled runs, and schedules only fire from the default branch, so it is inactive until merged.

It generates, asserts a rerun is a no-op, builds and verifies. It **does not commit** unless the repository variable `DEMO_AUTO_COMMIT=true` is set — that would push bot commits to `main` and needs owner approval.

Unattended operation is **not proven** until two scheduled runs have succeeded; record their run URLs here when they happen.

## Deployment (not performed — requires approval)

Any static host works. Example for Cloudflare Pages:

1. Run `npm run check:launch` locally with `SITE_URL` set; fix everything it reports.
2. Create a Pages project from this repo. Build command: `npm run generate && npm run build`, output: `dist`, env `SITE_URL=https://<your-domain>`, Node 22.
3. To refresh the demo daily, either enable `DEMO_AUTO_COMMIT` (Pages rebuilds on push) or add a Pages deploy hook triggered from the workflow.

GitHub Pages (project site): set `BASE_PATH=/auto-hp-mvp` and `SITE_URL=https://<user>.github.io` at build time; all internal links go through `href()` and respect the base.

## Operations checklist

- Before publishing: `check:launch` passes; contact address confirmed by the owner; pricing/terms text reviewed (no legal guarantees are made on the page).
- Daily: check the *Daily DEMO content* run summary; a failed run leaves yesterday's sample in place.
- Never add testimonials, customer counts or "real-time" wording until they are true and verifiable — `npm run verify` blocks the common phrasings.

## Validation plan (goals, not results)

7 days: contact 30 relevant businesses → 5 replies → 3 qualified interests → 1 paying monitor. Outbound contact requires owner approval.

## Review status

See [docs/REVIEW_STATUS.md](docs/REVIEW_STATUS.md).
