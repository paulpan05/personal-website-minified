import Link from 'next/link'
import { formatPostDate, getAllPosts } from '@/content/posts'

export default function Writing() {
  const posts = getAllPosts().slice(0, 3)
  if (posts.length === 0) {
    return null
  }
  return (
    <section className="writing" aria-labelledby="writing-heading">
      <h2 id="writing-heading">Writing</h2>
      <ul className="writing-list">
        {posts.map((post) => (
          <li key={post.slug}>
            <Link href={`/blog/${post.slug}`}>{post.title}</Link>
            {' · '}
            <time dateTime={post.date}>{formatPostDate(post.date)}</time>
          </li>
        ))}
      </ul>
      <p>
        <Link href="/blog">More posts →</Link>
      </p>
    </section>
  )
}
