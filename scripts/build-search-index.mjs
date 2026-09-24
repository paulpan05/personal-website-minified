/**
 * Build-time full-text search index for the blog.
 *
 * Runs as `prebuild` (and therefore inside `npm test`, which builds first).
 * Reads every essay in src/content/posts/*.mdx with Node fs — legal here
 * because this runs at build time, not on Cloudflare Workers (no fs there).
 *
 * Output: src/content/search-index.json, committed to git alongside posts:
 *   { version, slugs: [alphabetical, == getPostSlugs() order],
 *     postings: { token: [[slugIndex, count], ...] } }
 * The client lazy-loads this JSON on first search keystroke, so it never
 * touches the initial bundle. Metadata (titles/tags/descriptions) stays in
 * POST_DEFS; this file carries body text only. Never hand-edit it.
 */
import { readdirSync, readFileSync, writeFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { toPlainText } from './mdx-text.mjs'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const postsDir = join(root, 'src', 'content', 'posts')
const outPath = join(root, 'src', 'content', 'search-index.json')

const STOPWORDS = new Set(
  'a about above after again against all almost also always am among amount an and another any around because been before behind being below between both during each few following from further having here however into itself more most other over several such than that the them then there these through under until up upon were when while with within without'.split(
    ' ',
  ),
)

/** Strip MDX/markdown syntax, keeping the human-readable words. */

function tokenize(text) {
  const counts = new Map()
  for (const match of text.toLowerCase().matchAll(/[a-z0-9]+/g)) {
    const token = match[0]
    if (token.length < 2 || STOPWORDS.has(token)) {
      continue
    }
    counts.set(token, (counts.get(token) ?? 0) + 1)
  }
  return counts
}

const files = readdirSync(postsDir)
  .filter((file) => file.endsWith('.mdx'))
  .sort()
const slugs = files.map((file) => file.replace(/\.mdx$/, ''))

const postings = {}
files.forEach((file, index) => {
  const text = toPlainText(readFileSync(join(postsDir, file), 'utf8'))
  for (const [token, count] of tokenize(text)) {
    ;(postings[token] ??= []).push([index, count])
  }
})

writeFileSync(
  outPath,
  `${JSON.stringify({ version: 1, slugs, stopwords: [...STOPWORDS], postings })}\n`,
)
const bytes = Buffer.byteLength(JSON.stringify({ slugs, postings }))
console.log(
  `search index: ${slugs.length} posts, ${Object.keys(postings).length} tokens, ${(bytes / 1024).toFixed(1)} KB -> src/content/search-index.json`,
)
