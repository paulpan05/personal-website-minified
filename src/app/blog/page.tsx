import type { Metadata } from 'next'
import Link from 'next/link'
import SiteNav from '@/components/SiteNav/SiteNav'
import { formatPostDate, getAllPosts } from '@/content/posts'
import { SITE_NAME } from '@/lib/site'

export const metadata: Metadata = {
  title: `Writing — ${SITE_NAME}`,
  description: 'Essays and longform writing by Paul Pan.',
}

export default function BlogIndex() {
  const posts = getAllPosts()
  return (
    <div className="blog">
      <SiteNav />
      <main className="blog-index">
        <h1>Writing</h1>
        {posts.length === 0 ? (
          <p>No posts yet.</p>
        ) : (
          <ul className="blog-list">
            {posts.map((post) => (
              <li key={post.slug}>
                <h2>
                  <Link href={`/blog/${post.slug}`}>{post.title}</Link>
                </h2>
                <p className="blog-meta">
                  <time dateTime={post.date}>{formatPostDate(post.date)}</time>
                  {' · '}
                  {post.readingMinutes} min read
                  {' · '}
                  {post.provenance}
                </p>
                <p>{post.description}</p>
              </li>
            ))}
          </ul>
        )}
      </main>
    </div>
  )
}
