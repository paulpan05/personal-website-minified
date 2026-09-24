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
    const year = post.date.slice(0, 4)
    const group = groups.get(year)
    if (group) {
      group.push(post)
    } else {
      groups.set(year, [post])
    }
  }
  return [...groups.entries()].sort(([a], [b]) => (a < b ? 1 : -1))
}

export default function BlogIndex() {
  const posts = getAllPosts()
  return (
    <div className="blog">
      <main className="blog-index">
        <h1>Writing</h1>
        {posts.length === 0 ? (
          <p>No posts yet.</p>
        ) : (
          <BlogSearch posts={posts}>
            {groupByYear(posts).map(([year, yearPosts]) => (
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
          </BlogSearch>
        )}
      </main>
    </div>
  )
}
