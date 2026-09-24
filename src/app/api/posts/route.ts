import { getCloudflareContext } from '@opennextjs/cloudflare'

export const dynamic = 'force-dynamic'

const DEFAULT_PER_PAGE = 20
const MAX_PER_PAGE = 100

interface PostRow {
  slug: string
  title: string
  published_at: string
  description: string
  tags: string
  reading_minutes: number
  provenance: string
}

/** Paginated archive metadata, newest first. Optional ?tag= narrows. */
export async function GET(request: Request): Promise<Response> {
  const params = new URL(request.url).searchParams
  const rawPage = Number(params.get('page') ?? '1')
  const rawPer = Number(params.get('per') ?? String(DEFAULT_PER_PAGE))
  const page = Math.max(1, Number.isFinite(rawPage) ? Math.floor(rawPage) : 1)
  const per = Math.min(
    MAX_PER_PAGE,
    Math.max(1, Number.isFinite(rawPer) ? Math.floor(rawPer) : DEFAULT_PER_PAGE),
  )
  const tag = params.get('tag')?.trim() || null
  let db: D1Database
  try {
    ;({ env: { DB: db } } = getCloudflareContext())
  } catch {
    return Response.json(
      { posts: [], error: 'listing unavailable: no database binding' },
      { status: 503 },
    )
  }
  try {
    const tagClause = tag ? 'WHERE tags LIKE ?1' : ''
    // Dense parameter numbering (see search route): offset/limit shift.
    const countResult = tag
      ? await db
          .prepare(`SELECT count(*) AS total FROM posts ${tagClause}`)
          .bind(`%"${tag}"%`)
          .first<{ total: number }>()
      : await db
          .prepare('SELECT count(*) AS total FROM posts')
          .first<{ total: number }>()
    const total = countResult?.total ?? 0
    const totalPages = Math.max(1, Math.ceil(total / per))
    const safePage = Math.min(page, totalPages)
    const offset = (safePage - 1) * per
    // Raw snake_case rows, same wire shape as /api/search: the client maps
    // to PostMeta (including JSON.parse on the tags string) in one place.
    const fields = `slug, title, published_at, description, tags, reading_minutes, provenance`
    const { results } = tag
      ? await db
          .prepare(
            `SELECT ${fields} FROM posts WHERE tags LIKE ?1 ORDER BY published_at DESC LIMIT ?2 OFFSET ?3`,
          )
          .bind(`%"${tag}"%`, per, offset)
          .all<PostRow>()
      : await db
          .prepare(
            `SELECT ${fields} FROM posts ORDER BY published_at DESC LIMIT ?1 OFFSET ?2`,
          )
          .bind(per, offset)
          .all<PostRow>()
    return Response.json({
      posts: results,
      total,
      page: safePage,
      perPage: per,
      totalPages,
      source: 'd1',
    })
  } catch {
    return Response.json(
      { posts: [], error: 'listing unavailable: database error' },
      { status: 503 },
    )
  }
}
