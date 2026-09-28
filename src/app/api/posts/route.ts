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

/** Paginated archive metadata, newest first. Repeated ?tag= narrows to
 *  essays carrying ANY of the tags (OR within the facet, commerce-style). */
export async function GET(request: Request): Promise<Response> {
  const params = new URL(request.url).searchParams
  const rawPage = Number(params.get('page') ?? '1')
  const rawPer = Number(params.get('per') ?? String(DEFAULT_PER_PAGE))
  const page = Math.max(1, Number.isFinite(rawPage) ? Math.floor(rawPage) : 1)
  const per = Math.min(
    MAX_PER_PAGE,
    Math.max(1, Number.isFinite(rawPer) ? Math.floor(rawPer) : DEFAULT_PER_PAGE),
  )
  const tags = params
    .getAll('tag')
    .map((t) => t.trim())
    .filter((t) => t !== '')
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
    // Indexed equality on the junction table (no LIKE scans): a post
    // matches when ANY tag hits (OR within the facet). Parameter
    // numbering stays dense (?1..?N).
    const tagIn = tags.map((_, i) => `?${i + 1}`).join(', ')
    const tagExists = (alias: string): string =>
      tags.length === 0
        ? ''
        : `WHERE EXISTS (SELECT 1 FROM post_tags WHERE post_tags.post_slug = ${alias}.slug AND post_tags.tag IN (${tagIn}))`
    const countResult =
      tags.length === 0
        ? await db
            .prepare('SELECT count(*) AS total FROM posts')
            .first<{ total: number }>()
        : await db
            .prepare(`SELECT count(*) AS total FROM posts ${tagExists('posts')}`)
            .bind(...tags)
            .first<{ total: number }>()
    const total = countResult?.total ?? 0
    const totalPages = Math.max(1, Math.ceil(total / per))
    const safePage = Math.min(page, totalPages)
    const offset = (safePage - 1) * per
    // Raw snake_case rows, same wire shape as /api/search: the client maps
    // to PostMeta (including JSON.parse on the tags string) in one place.
    const fields = `slug, title, published_at, description, tags, reading_minutes, provenance`
    const { results } =
      tags.length === 0
        ? await db
            .prepare(
              `SELECT ${fields} FROM posts ORDER BY published_at DESC LIMIT ?1 OFFSET ?2`,
            )
            .bind(per, offset)
            .all<PostRow>()
        : await db
            .prepare(
              `SELECT ${fields} FROM posts ${tagExists('posts')} ORDER BY published_at DESC LIMIT ?${tags.length + 1} OFFSET ?${tags.length + 2}`,
            )
            .bind(...tags, per, offset)
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
