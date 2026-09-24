import { getCloudflareContext } from '@opennextjs/cloudflare'

export const dynamic = 'force-dynamic'

/** Distinct topic tags across the archive, alphabetical. Powers the filter
 *  chips without bundling every post's metadata into the client. */
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
        `SELECT DISTINCT value AS tag FROM posts, json_each(posts.tags) ORDER BY tag`,
      )
      .all<{ tag: string }>()
    return Response.json({
      tags: results.map((row) => row.tag),
      source: 'd1',
    })
  } catch {
    return Response.json(
      { tags: [], error: 'tags unavailable: database error' },
      { status: 503 },
    )
  }
}
