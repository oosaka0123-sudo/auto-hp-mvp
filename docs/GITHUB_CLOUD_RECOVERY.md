# GitHub cloud recovery — surf-shop MVP

This branch verifies that the ChatGPT GitHub connector can create a branch and commit a file without PC04 or Desktop Commander.

## Scope
- Target: **surf shops only**, monitor price ¥9,800/month.
- Preserve the PC04 local implementation commit `eb97c59` (40 files); it was not pushed because its OAuth credential lacked the `workflow` scope.
- Do not claim the local implementation is available in GitHub yet.
- Prefer Astro static pages, mobile-first design, SVG/CSS, accessible navigation, clear fictional demo labeling, no video or paid AI API.
- Required pages: proposal landing page, fictional surf shop demo, shop services, lessons/rental, news, access/contact.
- Daily demo content must be deterministic, clearly marked sample data, and must not masquerade as real-time wave observations.

## Next steps
1. Recover the existing PC04 commit when connectivity returns, or independently recreate its implementation in GitHub.
2. Run CI, inspect visual output, and verify daily generation.
3. Create a review PR; do not merge or deploy without verification.

This document is a connectivity test and recovery handoff, **not** a completed website.
