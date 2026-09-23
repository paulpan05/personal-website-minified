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
- No snapshot/image tests. Smoke tests only (`tests/smoke.spec.ts`).
- Keep `/test-results` and `/playwright-report` out of git (ignored).

## Publishing a post

1. Add `src/content/posts/<slug>.mdx` (no frontmatter — metadata lives in
   `POST_DEFS` in `src/content/posts.ts`).
2. Register it in `POST_DEFS` with title, date, tags, description,
   reading-time estimate.
3. Figures: dependency-free SVG components in `src/components/<Name>/`
   (see `ArcAgiChart`). Every figure needs `<title>`/`<desc>`, a numbered
   `<figcaption>`, and must not overclaim the data (e.g. snapshots from
   different harnesses are not a learning curve — say so in the caption).
4. Add the slug to `tests/smoke.spec.ts` (both the 200s list and the
   mobile-overflow list — new pages get no coverage otherwise), then run
   `npm test`, screenshot-check desktop + 390px widths, commit + push.
