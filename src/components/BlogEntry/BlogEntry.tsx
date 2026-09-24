import Link from 'next/link'
import type { PostMeta } from '@/content/posts'

export function formatPostDateShort(iso: string): string {
  return new Date(`${iso}T00:00:00Z`).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    timeZone: 'UTC',
  })
}

/** Single essay entry. Server-safe: used by the index page and the client
 *  search results alike. */
export default function BlogEntry({ post }: { post: PostMeta }) {
  return (
    <li>
      <h2>
        <Link href={`/blog/${post.slug}`}>{post.title}</Link>
      </h2>
      <p className="blog-meta">
        <time dateTime={post.date}>{formatPostDateShort(post.date)}</time>
        {' · '}
        {post.readingMinutes} min read
        {' · '}
        {post.provenance}
      </p>
      <p>{post.description}</p>
    </li>
  )
}
