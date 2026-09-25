import { getCloudflareContext } from '@opennextjs/cloudflare'

export const dynamic = 'force-dynamic'

/** Topic tags across the archive with per-topic essay counts, alphabetical.
 *  Powers the multi-select filter facets (commerce-style: checkbox/chip +
 *  count) without bundling every post's metadata into the client. */
export async function GET(): Promise<Response> {
  let db: D1Database
  try {
    ;({ env: { DB: db } } = getCloudflareContext())
  } catch {
    return Response.json(
      { tags: [], error: 'tags unavailable: no database binding' },
      { status: 503 },
    )
  }
  try {
    const { results } = await db
      .prepare(
        `SELECT value AS tag, count(*) AS count FROM posts, json_each(posts.tags) GROUP BY value ORDER BY tag`,
      )
      .all<{ tag: string; count: number }>()
    return Response.json({
      tags: results,
      source: 'd1',
    })
  } catch {
    return Response.json(
      { tags: [], error: 'tags unavailable: database error' },
      { status: 503 },
    )
  }
}
