import { getCloudflareContext } from '@opennextjs/cloudflare'

export const dynamic = 'force-dynamic'

const MAX_QUERY_TOKENS = 8
const MAX_RESULTS = 20

interface FtsRow {
  slug: string
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
  const query = new URL(request.url).searchParams.get('q')?.trim() ?? ''
  const match = toMatchExpression(query)
  if (!match) {
    return Response.json({ slugs: [] })
  }
  let db: D1Database
  try {
    ;({ env: { DB: db } } = getCloudflareContext())
  } catch {
    // No binding (e.g. `next dev`/`next start` without D1): the client
    // falls back to the bundled static search index.
    return Response.json(
      { slugs: [], fallback: true },
      { status: 503 },
    )
  }
  try {
    const { results } = await db
      .prepare(
        `SELECT slug FROM posts_fts WHERE posts_fts MATCH ?1 ORDER BY bm25(posts_fts) LIMIT ?2`,
      )
      .bind(match, MAX_RESULTS)
      .all<FtsRow>()
    // `source` is the observability contract: anyone can curl prod and see
    // whether answers come from D1 or (via 503 + fallback:true) the static
    // index. Never fail silently into the fallback.
    return Response.json({
      slugs: results.map((row) => row.slug),
      source: 'd1-fts5',
    })
  } catch {
    // Empty/unmigrated DB: same fallback contract.
    return Response.json({ slugs: [], fallback: true }, { status: 503 })
  }
}
