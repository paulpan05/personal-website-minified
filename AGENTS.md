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
- Site chrome (`SiteNav`, `SiteFooter`) renders once in `src/app/layout.tsx`,
  not per page. `SiteNav` is a client component (active state via pathname +
  hash). Homepage sections carry anchor ids (`#about`, `#experience`,
  `#projects`, `#contact`) that the nav targets.
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
4. Run `npm test` (post routes derive from POST_DEFS, so new posts are
   covered automatically), screenshot-check desktop + 390px widths using
   Playwright's bundled chromium — never the system-Chrome `--screenshot`
   CLI, which mis-scales viewports and produces false overflow alarms.
   Commit + push.
