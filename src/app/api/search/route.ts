import { getCloudflareContext } from '@opennextjs/cloudflare'

export const dynamic = 'force-dynamic'

const MAX_QUERY_TOKENS = 8
const DEFAULT_PER_PAGE = 20
const MAX_PER_PAGE = 100

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

export async function GET(request: Request): Promise<Response> {
  const params = new URL(request.url).searchParams
  const query = params.get('q')?.trim() ?? ''
  // Repeated ?tag= narrows to essays carrying ANY tag (OR within the
  // facet — the commerce convention; the text query ANDs across it).
  const tags = params
    .getAll('tag')
    .map((t) => t.trim())
    .filter((t) => t !== '')
  const rawPage = Number(params.get('page') ?? '1')
  const rawPer = Number(params.get('per') ?? String(DEFAULT_PER_PAGE))
  const page = Math.max(1, Number.isFinite(rawPage) ? Math.floor(rawPage) : 1)
  const per = Math.min(
    MAX_PER_PAGE,
    Math.max(1, Number.isFinite(rawPer) ? Math.floor(rawPer) : DEFAULT_PER_PAGE),
  )
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
    // Parameter numbering must stay dense (?1..?N with no gaps): ?1 is
    // the MATCH expression, ?2.. are the junction tags, then limit/offset.
    // Tag narrowing is indexed equality on post_tags (no LIKE scans).
    const tagIn = tags.map((_, i) => `?${i + 2}`).join(', ')
    const clause =
      tags.length === 0
        ? ''
        : `AND EXISTS (SELECT 1 FROM post_tags WHERE post_tags.post_slug = p.slug AND post_tags.tag IN (${tagIn}))`
    const fromWhere = `FROM posts_fts JOIN posts AS p ON p.slug = posts_fts.slug
       WHERE posts_fts MATCH ?1 ${clause}`
    const totalResult = await db
      .prepare(`SELECT count(*) AS total ${fromWhere}`)
      .bind(match, ...tags)
      .first<{ total: number }>()
    const total = totalResult?.total ?? 0
    const totalPages = Math.max(1, Math.ceil(total / per))
    const safePage = Math.min(page, totalPages)
    const offset = (safePage - 1) * per
    const stmt = db.prepare(
      // NOTE: FTS5 MATCH requires the table name, not an alias (D1 rejects
      // `f MATCH`). bm25() likewise takes the table name.
      `SELECT p.slug, p.title, p.published_at, p.description, p.tags, p.reading_minutes, p.provenance
       ${fromWhere}
       ORDER BY bm25(posts_fts) LIMIT ?${tags.length + 2} OFFSET ?${tags.length + 3}`,
    )
    const { results } = await stmt
      .bind(match, ...tags, per, offset)
      .all<SearchRow>()
    return Response.json({
      posts: results,
      total,
      page: safePage,
      perPage: per,
      totalPages,
      source: 'd1-fts5',
    })
  } catch {
    return Response.json(
      { posts: [], error: 'search unavailable: database error' },
      { status: 503 },
    )
  }
}
