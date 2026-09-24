import type { Metadata } from 'next'
import { getAllPosts } from '@/content/posts'
import type { PostMeta } from '@/content/posts'
import { SITE_NAME } from '@/lib/site'
import BlogEntry from '@/components/BlogEntry/BlogEntry'
import BlogSearch from '@/components/BlogSearch/BlogSearch'

export const metadata: Metadata = {
  title: `Writing — ${SITE_NAME}`,
  description: 'Essays and longform writing by Paul Pan.',
}

function groupByYear(posts: PostMeta[]): Array<[string, PostMeta[]]> {
  const groups = new Map<string, PostMeta[]>()
  for (const post of posts) {
    const year = post.publishedAt.slice(0, 4)
    const group = groups.get(year)
    if (group) {
      group.push(post)
    } else {
      groups.set(year, [post])
    }
  }
  return [...groups.entries()].sort(([a], [b]) => (a < b ? 1 : -1))
}

// Unfiltered archive pages stay small as the collection grows: 20 essays
// per page. Filtered/search views (client-side) show matches uncapped.
const PAGE_SIZE = 20

export default async function BlogIndex({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>
}) {
  const posts = getAllPosts()
  const totalPages = Math.max(1, Math.ceil(posts.length / PAGE_SIZE))
  const requested = Number((await searchParams).page ?? '1')
  const page = Math.min(
    totalPages,
    Math.max(1, Number.isFinite(requested) ? Math.floor(requested) : 1),
  )
  const pagePosts = posts.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)
  return (
    <div className="blog">
      <main className="blog-index">
        <h1>Writing</h1>
        {posts.length === 0 ? (
          <p>No posts yet.</p>
        ) : (
          <BlogSearch posts={posts}>
            {groupByYear(pagePosts).map(([year, yearPosts]) => (
              <section
                key={year}
                className="blog-year"
                aria-labelledby={`year-${year}`}
              >
                <h2 id={`year-${year}`}>{year}</h2>
                <ul className="blog-list">
                  {yearPosts.map((post) => (
                    <BlogEntry key={post.slug} post={post} />
                  ))}
                </ul>
              </section>
            ))}
            {totalPages > 1 && (
              <nav className="blog-pages" aria-label="Essay pages">
                {page > 1 && (
                  <a href={page === 2 ? '/blog' : `/blog?page=${page - 1}`}>
                    ← Newer
                  </a>
                )}
                <span aria-current="page">
                  Page {page} of {totalPages}
                </span>
                {page < totalPages && (
                  <a href={`/blog?page=${page + 1}`}>Older →</a>
                )}
              </nav>
            )}
          </BlogSearch>
        )}
      </main>
    </div>
  )
}
