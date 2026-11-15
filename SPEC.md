# AUTO SITE — 7-day MVP specification

## Purpose
Validate paid demand for a subscription website service for surf shops, surf schools and small coastal businesses. A polished website is the core product; automated updates are a differentiator, not a promise of accurate real-time wave data.

## Deliverables
1. Public-facing AUTO SITE landing page with clear value proposition, example, price, FAQ, and inquiry CTA.
2. A clearly labeled fictional demo surf shop ("SAMPLE SURF") with responsive homepage, news listing/detail and a next-morning wave information sample section.
3. Shop configuration in JSON; deterministic, idempotent daily content generation; scheduled GitHub Actions job at approximately 17:00 JST, noting scheduling may be delayed.
4. Astro + TypeScript, static-first, SVG/CSS decoration, no paid API, database, login, payment, video or fabricated testimonials.
5. Accessible mobile-first layouts, custom logo and favicon, SEO metadata, 404 page, automated checks, README with deployment and operational steps.

## Business assumptions — unvalidated
Monitor: JPY 9,800/month tax included; regular: JPY 19,800/month tax included; initial setup JPY 0; three monitor slots. Treat these as test offers, not existing customers. Avoid unapproved legal guarantees.

## Data integrity
No live forecasts unless a licensed source and verified pipeline are configured. MVP sample data must be explicitly labeled DEMO and must not be presented as current observation. Keep data provider interface replaceable. Do not assume Open-Meteo data may be resold commercially without reviewing its license.

## Acceptance
- npm install / build / lint or equivalent checks pass.
- Mobile 375px and desktop 1440px checked.
- Sample generated content does not duplicate on reruns.
- No secrets, fake reviews, dead CTA or deceptive real-time claims.
- Two successful scheduled runs needed before claiming unattended operation is proven.
- Build in a feature branch, open PR, do not merge or deploy without user approval.

## Validation plan
7 days: contact 30 relevant businesses; target 5 replies, 3 qualified interests, 1 paying monitor. These are goals, not achieved results.
