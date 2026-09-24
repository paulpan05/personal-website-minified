/**
 * Seed SQL for the D1 search + listing database.
 *
 * Usage:
 *   node scripts/seed-search-db.mjs > d1/seed.sql
 *   npx wrangler d1 execute DB --local --file=d1/seed.sql     # local dev
 *   npx wrangler d1 execute DB --remote --file=d1/seed.sql    # production
 *
 * Single direction of derivation: MDX files + POST_DEFS (the source of
 * truth) -> D1 rows. This regenerates the whole seed from scratch, so
 * re-running after adding essays is safe and no divergence between code
 * and database is possible. D1 is the ONLY query tier — there is no
 * static index and no silent fallback.
 *
 * Reseeds use explicit DELETE + INSERT, never INSERT OR REPLACE: SQLite
 * does not fire AFTER DELETE triggers for REPLACE conflict-resolution
 * deletes, so REPLACE accumulates duplicate FTS rows on every reseed
 * (observed). The plain DELETE fires the sync trigger, which removes all
 * FTS rows for the slug before the fresh INSERT.
 */
import { readdirSync, readFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { toPlainText } from './mdx-text.mjs'
import { POST_DEFS } from '../src/content/posts.ts'

const postsDir = join(
  dirname(fileURLToPath(import.meta.url)),
  '..',
  'src',
  'content',
  'posts',
)

const escapeLiteral = (value) =>
  String(value).replace(/'/g, "''")

const files = new Set(
  readdirSync(postsDir).filter((file) => file.endsWith('.mdx')),
)

const statements = []
for (const def of POST_DEFS) {
  const file = `${def.slug}.mdx`
  if (!files.has(file)) {
    console.error(`skip: ${def.slug} (no ${file})`)
    continue
  }
  const body = toPlainText(readFileSync(join(postsDir, file), 'utf8')).trim()
  const { load: _load, ...meta } = def
  void _load
  statements.push(
    `DELETE FROM posts WHERE slug = '${escapeLiteral(meta.slug)}';\n` +
      `INSERT INTO posts (slug, title, published_at, description, tags, reading_minutes, provenance, body) VALUES (` +
      `'${escapeLiteral(meta.slug)}', ` +
      `'${escapeLiteral(meta.title)}', ` +
      `'${escapeLiteral(meta.publishedAt)}', ` +
      `'${escapeLiteral(meta.description)}', ` +
      `'${escapeLiteral(JSON.stringify(meta.tags))}', ` +
      `${meta.readingMinutes}, ` +
      `'${escapeLiteral(meta.provenance)}', ` +
      `'${escapeLiteral(body)}');`,
  )
}

process.stdout.write(`${statements.join('\n')}\n`)
// Merge FTS5 delete-tombstones left by INSERT OR REPLACE: without this,
// reseeds can return duplicate rows until SQLite merges on its own
// schedule (observed in production, not locally — hence explicit).
process.stdout.write(`INSERT INTO posts_fts (posts_fts) VALUES ('optimize');\n`)
console.error(`seed: ${statements.length} posts -> d1/seed.sql format (stdout)`)
