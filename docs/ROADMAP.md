# Roadmap — parked, not promised

Deferred items with a reason. Promote one by deleting it here and adding a
TODO section (or just building it).

## Later

- **OG/social image** — needs a designed asset (1200×630). When it exists,
  add `app/opengraph-image.tsx` (or a static `public/og.png` + metadata) and
  re-run `pnpm perf` for the SEO pass. Blocked on: asset from Steven.
- **Branded 404** — `app/not-found.tsx` in the index aesthetic. Small,
  unstarted. The default Next 404 currently serves.
- **Scheduled link check** — `pnpm check-links` is manual/pre-deploy. If
  reference rot ever matters (it won't at this traffic), run it on a weekly
  schedule against prod instead of gating CI on external sites.
- **Real-device pass** — responsive behavior is audited by class review +
  desktop emulation only. Worth 30 minutes on a phone before sharing the URL
  widely: labs, palette, mock timer, tables.
- **Print on paper** — print CSS exists and `<details>` expand for print, but
  nobody has held a printout. One field-manual print run before calling it done.

## Ongoing (process, not code)

- **Prose iteration** — read the course as a student; file specific
  reword requests (chapter + quote + complaint) and revise together.
- **Provider freshness** — `lastReviewed` dates on references. Re-verify when
  touching a chapter; the link checker catches rot, not staleness.
