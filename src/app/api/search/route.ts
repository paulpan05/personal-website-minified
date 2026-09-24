import { getCloudflareContext } from '@opennextjs/cloudflare'

export const dynamic = 'force-dynamic'

const MAX_QUERY_TOKENS = 8
const MAX_RESULTS = 20

interface SearchRow {
  slug: string
  title: string
  published_at: string
  description: string
  tags: string
  reading_minutes: number
  provenance: string
}

/** Build a safe FTS5 MATCH expression: quoted per-token prefixes ANDed.
 *  User input never reaches SQL unquoted — tokens are strict [a-z0-9]+. */
function toMatchExpression(query: string): string | null {
  const tokens = query
    .toLowerCase()
    .match(/[a-z0-9]+/g)
    ?.filter((token) => token.length >= 2)
    .slice(0, MAX_QUERY_TOKENS)
  if (!tokens || tokens.length === 0) {
    return null
  }
  return tokens.map((token) => `"${token}"*`).join(' AND ')
}

function tagPredicate(tag: string | null): { clause: string; value: string } {
  // Tags are stored as a JSON array string; matching the quoted form avoids
  // substring false positives ("AI" must not match "said").
  return tag
    ? { clause: 'AND p.tags LIKE ?2', value: `%"${tag}"%` }
    : { clause: '', value: '' }
}

export async function GET(request: Request): Promise<Response> {
  const params = new URL(request.url).searchParams
  const query = params.get('q')?.trim() ?? ''
  const tag = params.get('tag')?.trim() || null
  const match = toMatchExpression(query)
  if (!match) {
    return Response.json({ posts: [] })
  }
  let db: D1Database
  try {
    ;({ env: { DB: db } } = getCloudflareContext())
  } catch {
    return Response.json(
      { posts: [], error: 'search unavailable: no database binding' },
      { status: 503 },
    )
  }
  try {
    // Parameter numbering must stay dense (?1..?N with no gaps), so the
    // LIMIT placeholder shifts depending on whether the tag clause exists.
    const { clause, value } = tagPredicate(tag)
    const limitParam = tag ? '?3' : '?2'
    const stmt = db.prepare(
      // NOTE: FTS5 MATCH requires the table name, not an alias (D1 rejects
      // `f MATCH`). bm25() likewise takes the table name.
      `SELECT p.slug, p.title, p.published_at, p.description, p.tags, p.reading_minutes, p.provenance
       FROM posts_fts JOIN posts AS p ON p.slug = posts_fts.slug
       WHERE posts_fts MATCH ?1 ${clause}
       ORDER BY bm25(posts_fts) LIMIT ${limitParam}`,
    )
    const bound = tag
      ? stmt.bind(match, value, MAX_RESULTS)
      : stmt.bind(match, MAX_RESULTS)
    const { results } = await bound.all<SearchRow>()
    return Response.json({ posts: results, source: 'd1-fts5' })
  } catch {
    return Response.json(
      { posts: [], error: 'search unavailable: database error' },
      { status: 503 },
    )
  }
}
