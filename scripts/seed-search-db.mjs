/**
 * Seed SQL for the D1 full-text search database.
 *
 * Usage:
 *   node scripts/seed-search-db.mjs > d1/seed.sql
 *   npx wrangler d1 execute DB --local --file=d1/seed.sql     # local dev
 *   npx wrangler d1 execute DB --remote --file=d1/seed.sql    # production
 *   (remote needs `wrangler login` + a real database_id in wrangler.jsonc)
 *
 * Source of truth stays the MDX files: this regenerates the whole seed
 * from scratch (INSERT OR REPLACE), so re-running after adding essays is
 * safe. D1 holds slug -> body text ONLY — titles/tags/descriptions stay in
 * POST_DEFS (already in the client bundle); the API returns slugs and the
 * client joins metadata locally.
 */
import { readdirSync, readFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { toPlainText } from './mdx-text.mjs'

const postsDir = join(
  dirname(fileURLToPath(import.meta.url)),
  '..',
  'src',
  'content',
  'posts',
)

const escapeLiteral = (value) =>
  value.replace(/'/g, "''")

const files = readdirSync(postsDir)
  .filter((file) => file.endsWith('.mdx'))
  .sort()

const statements = files.map((file) => {
  const slug = file.replace(/\.mdx$/, '')
  const body = toPlainText(readFileSync(join(postsDir, file), 'utf8')).trim()
  return `INSERT OR REPLACE INTO posts (slug, body) VALUES ('${escapeLiteral(slug)}', '${escapeLiteral(body)}');`
})

process.stdout.write(`${statements.join('\n')}\n`)
console.error(`seed: ${files.length} posts -> d1/seed.sql format (stdout)`)
