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
- No snapshot/image tests. Smoke tests only (`tests/smoke.spec.ts`).
- Keep `/test-results` and `/playwright-report` out of git (ignored).
- Provenance: every post carries exactly one `provenance` value —
  `AI-assisted` (AI-drafted under the author's direction; needs a process
  note in the post) or `human-written` (the author's own prose).
  Never mix, never omit.

## Publishing a post

1. Add `src/content/posts/<slug>.mdx` (no frontmatter — metadata lives in
   `POST_DEFS` in `src/content/posts.ts`).
2. Register it in `POST_DEFS` with title, date, tags, description,
   reading-time estimate.
3. Figures: dependency-free SVG components in `src/components/<Name>/`
   (see `ArcAgiChart`). Every figure needs `<title>`/`<desc>`, a numbered
   `<figcaption>`, and must not overclaim the data (e.g. snapshots from
   different harnesses are not a learning curve — say so in the caption).
4. The search index regenerates itself: `prebuild` runs
   `scripts/build-search-index.mjs` before every `npm run build` (and
   `npm test` builds first, so it is covered there too). Commit the
   regenerated `src/content/search-index.json` with the post — never
   hand-edit it. The index lazy-loads on first search keystroke; post
   metadata for ranking comes from `POST_DEFS`, already in the bundle.
5. The index page groups posts by year (server-rendered, SEO + no-JS safe)
   with a client search box (full-text over the index, title ×10 / tag ×5 /
   body-count scoring, all query tokens must match) and tag filter chips.
6. Run `npm test` (post routes derive from POST_DEFS, so new posts are
   covered automatically), screenshot-check desktop + 390px widths using
   Playwright's bundled chromium — never the system-Chrome `--screenshot`
   CLI, which mis-scales viewports and produces false overflow alarms.
   Capture full-page (`fullPage: true`) screenshots, not isolated viewports,
   and scroll through the page step by step — viewport-only shots miss
   section-level defects (e.g. white-on-paper cards halfway down).
   Commit + push.
5. Restart any `next start` preview server after rebuilding: a running
   server serves stale CSS/JS and produces misleading screenshots and
   probes. Kill, rebuild, restart, then verify.
