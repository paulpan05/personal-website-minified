# AGENTS.md — personal-website-minified

Next.js (App Router) + `@next/mdx` blog, deployed to Cloudflare Workers via
OpenNext. Canonical origin: `https://paulpan.net`
(`src/lib/site.ts`, override with `NEXT_PUBLIC_SITE_URL`).

## Commands

- `npm run dev` / `npm run build` / `npm run start` / `npm run lint`
- `npm test` — self-sufficient: installs Playwright browsers (`pretest`),
  builds, starts `next start -p 3100`, runs smoke tests (route 200s + mobile
  overflow). No manual setup.
- Cloudflare dashboard Build command must be
  `npx @opennextjs/cloudflare build`. `npm run preview` serves the Worker
  build locally on `:8787` — kill it and any `workerd` leftovers when done.

## Landmines (learned the hard way)

1. `"build"` in package.json must stay `next build`.
   `opennextjs-cloudflare build` invokes that script internally — pointing it
   at itself recurses forever.
2. Workers have no filesystem. Blog content must be bundled at build time
   (`@next/mdx` + the `POST_DEFS` registry in `src/content/posts.ts`).
   Runtime `fs` reads work in `next dev` but 404 in preview/production.
3. `src/mdx-components.tsx` is load-bearing. Without it MDX falls back to
   `@mdx-js/react`, which crashes Server Components
   (`e.createContext is not a function`).
4. SQLite `INSERT OR REPLACE` does NOT fire `AFTER DELETE` triggers for its
   conflict-resolution delete — reseeds written that way silently accumulate
   duplicate FTS rows (observed: 3 posts → 6 FTS rows, every query doubled).
   Seeds must use explicit `DELETE` + `INSERT` pairs; the plain `DELETE`
   fires the sync trigger. Verified empirically, not from docs.

## Conventions

- Design tokens live in `src/styles/_tokens.scss` — reference them, never
  hardcode palette/typeface values.
- Type voices: `$font-display` (monospace) for headings/nav/meta/code,
  `$font-body` (system sans) for prose.
- Site chrome (`SiteNav`, `SiteFooter`, `BackToTop`) renders once in
  `src/app/layout.tsx`, not per page. `SiteNav` is a client component:
  active state is recomputed from every section's overlap with the viewport
  band on scroll (an IntersectionObserver callback only reports changed
  entries — don't use it to pick a winner), with a bottom-of-page pin for
  the last section. Homepage sections carry anchor ids (`#about`,
  `#experience`, `#projects`) that the nav targets; the Contact entry
  targets `#contact`, the contact block inside the footer (site-wide, every
  page). Nav labels match destination headings. Below 640px the nav is combo: goal links
  (Writing, More About Me) stay exposed, the rest collapse under a labeled
  Menu toggle with a chevron (44px rows, closes on tap/Escape/navigation,
  toggle pinned top-right via flex order). The footer repeats the section
  links. Keep footer `.site-links` rules out of nav-only selectors.
- Post footer navigation uses `getAdjacentPosts()` from the registry.
- No snapshot/image tests. Two suites: `tests/smoke.spec.ts` (route 200s +
  mobile overflow, runs in `npm test`) and `tests/search-d1.spec.ts`
  (real-D1 behavior, gated on `SEARCH_API_URL`, run under preview/prod).
- Keep `/test-results` and `/playwright-report` out of git (ignored).
- Provenance: every post carries exactly one `provenance` value —
  `AI-assisted` (AI-drafted under the author's direction; needs a process
  note in the post) or `human-written` (the author's own prose).
  Never mix, never omit.

## Search at scale (D1 is the only query tier)

- Source of truth: MDX files + `POST_DEFS`. D1 is derived via
  `scripts/seed-search-db.mjs` (imports the registry through Node type
  stripping — no regex parsing) and holds the full row: slug, title,
  published_at, description, tags, reading_minutes, provenance, body.
  Regeneration is whole-table DELETE + INSERT (never INSERT OR REPLACE —
  see landmine 4), so code and database cannot diverge. There is no static
  index and no silent fallback.
- Schema: `migrations/0001_search.sql` (posts + porter-stemmed FTS5 +
  sync triggers), `migrations/0002_metadata.sql` (metadata columns),
  `migrations/0003_fix_fts_triggers.sql` (plain-DELETE trigger bodies +
  one-time rebuild — the pre-fix triggers used a no-op delete form).
  `cloudflare-env.d.ts` is force-tracked (generated, but
  fresh clones need it for `D1Database` types) — regenerate with
  `npm run cf-typegen` whenever bindings change and commit the result.
  Regenerate the seed after adding essays:
  `node scripts/seed-search-db.mjs > d1/seed.sql`.
- Reads: `/api/search` (FTS5 bm25, full metadata rows, optional `tag`),
  `/api/posts` (paginated metadata, optional `tag`), `/api/tags`
  (distinct topics). The client never holds more than one page; the
  server-rendered first page stays the SEO/no-JS baseline. FTS5 MATCH
  requires the table name, never an alias; D1 bind placeholders must stay
  densely numbered; route files may only export route handlers.
- Without a database the APIs answer 503 + explicit `error` and the UI
  reports unavailability — never shadow results. (`next start` may or
  may not resolve the platform proxy at request time; the smoke shape
  test accepts both tiers. Real D1 behavior is pinned by
  `tests/search-d1.spec.ts` under preview/prod.)
- Local: apply everything in `migrations/` once
  (`npx wrangler d1 execute DB --local --file=...` per file, in order),
  then `--file=d1/seed.sql` after each batch of posts.
  Verify under the real Worker (`npm run preview`, :8787).
- Remote: `npm run setup:d1` (checks login, creates the DB if needed,
  patches the id, applies migrations, seeds, verifies counts). Manual
  equivalent: `wrangler d1 create personal-website-search`,
  `wrangler d1 migrations apply DB --remote`,
  `wrangler d1 execute DB --remote --file=d1/seed.sql`.
- Proving prod reads D1:
  `SEARCH_API_URL=https://paulpan.net npx playwright test tests/search-d1.spec.ts`.
  It asserts `source: "d1-fts5"`/`"d1"` plus known query→slug mappings. If
  it fails but smoke passes, prod has no database — check
  migrations/seeding. Dashboard Workers + D1 analytics corroborate.
- Index page: 20 essays per page (`?page=N`), year subheads per page,
  tag chips + search box (FTS5 bm25 ranking over quoted per-token prefix
  matches, all tokens ANDed; tokens must be ≥2 chars, max 8 per query).
  RSS capped at the 20 latest. Smoke tests
  enumerate all routes up to 25 posts, then sample deterministically.
- Scale, measured 2026-09-24 with 500 synthetic posts in a scratch copy:
  full build <2 min, 510 static pages, First Load JS unchanged at ~107 kB
  (listing metadata travels in the RSC payload, not the bundle — pagination
  caps it). D1 is the only query tier, so per-post body growth does not
  touch the bundle. Re-measure with
  `scripts/gen-fixture-posts.mjs <copy> <N>` before assuming headroom.
  Triggers for the next migration (dynamic post rendering, R2 bodies):
  build approaching CI timeouts.

## Publishing a post

1. Add `src/content/posts/<slug>.mdx` (no frontmatter — metadata lives in
   `POST_DEFS` in `src/content/posts.ts`).
2. Register it in `POST_DEFS` with title, `publishedAt` (full ISO 8601
   go-live timestamp — never backdate to a draft's date), tags,
   description, reading-time estimate.
3. Figures: dependency-free SVG components in `src/components/<Name>/`
   (see `ArcAgiChart`). Every figure needs `<title>`/`<desc>`, a numbered
   `<figcaption>`, and must not overclaim the data (e.g. snapshots from
   different harnesses are not a learning curve — say so in the caption).
4. Re-seed D1: `node scripts/seed-search-db.mjs > d1/seed.sql`, then
   `--file=d1/seed.sql` against local (always) and remote (before the
   deploy that must serve the new post). Listing, search, and tags read
   D1 exclusively — an unseeded post is invisible to all three.
5. The index page shows 20 essays per screen (`?page=N`) with year
   subheads, tag chips, and a search box, all backed by the `/api/posts`,
   `/api/tags`, and `/api/search` routes.
6. `source: 'd1'` / `'d1-fts5'` in API responses proves the tier — curl
   prod to check. The D1 path is covered by `tests/search-d1.spec.ts`,
   gated on SEARCH_API_URL (skipped without it).
7. Run `npm test` (post routes derive from POST_DEFS, so new posts are
   covered automatically), screenshot-check desktop + 390px widths using
   Playwright's bundled chromium — never the system-Chrome `--screenshot`
   CLI, which mis-scales viewports and produces false overflow alarms.
   Capture full-page (`fullPage: true`) screenshots, not isolated viewports,
   and scroll through the page step by step — viewport-only shots miss
   section-level defects (e.g. white-on-paper cards halfway down).
   Commit + push.
8. Restart any `next start` preview server after rebuilding: a running
   server serves stale CSS/JS and produces misleading screenshots and
   probes. Kill, rebuild, restart, then verify.
