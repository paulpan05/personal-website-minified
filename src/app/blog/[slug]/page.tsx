import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import {
  formatPostDate,
  getAdjacentPosts,
  getPost,
  getPostSlugs,
  loadPostContent,
} from '@/content/posts'
import { SITE_AUTHOR, SITE_URL } from '@/lib/site'

interface PostPageParams {
  slug: string
}

export function generateStaticParams(): PostPageParams[] {
  return getPostSlugs().map((slug) => ({ slug }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<PostPageParams>
}): Promise<Metadata> {
  const { slug } = await params
  let post
  try {
    post = getPost(slug)
  } catch {
    return {}
  }
  const url = `${SITE_URL}/blog/${post.slug}`
  return {
    title: post.title,
    description: post.description,
    authors: [{ name: SITE_AUTHOR }],
    openGraph: {
      title: post.title,
      description: post.description,
      type: 'article',
      publishedTime: post.date,
      authors: [SITE_AUTHOR],
      url,
    },
    twitter: {
      card: 'summary',
      title: post.title,
      description: post.description,
    },
  }
}

export default async function BlogPost({
  params,
}: {
  params: Promise<PostPageParams>
}) {
  const { slug } = await params
  let post
  let Content
  let adjacent
  try {
    post = getPost(slug)
    ;({ default: Content } = await loadPostContent(slug))
    adjacent = getAdjacentPosts(slug)
  } catch {
    notFound()
  }
  return (
    <div className="blog">
      <main>
        <article className="blog-post">
          <header>
            <h1>{post.title}</h1>
            <p className="blog-meta">
              <time dateTime={post.date}>{formatPostDate(post.date)}</time>
              {' · '}
              {post.readingMinutes} min read
              {' · '}
              {post.provenance}
            </p>
            {post.tags.length > 0 && (
              <p className="blog-tags">{post.tags.join(' · ')}</p>
            )}
          </header>
          <Content />
        </article>
        <footer className="post-footer">
          <Link href="/blog" className="post-footer-index">
            ← All writing
          </Link>
          <nav className="post-footer-adjacent" aria-label="More essays">
            {adjacent.older ? (
              <Link href={`/blog/${adjacent.older.slug}`}>
                ← Older: {adjacent.older.title}
              </Link>
            ) : (
              <span />
            )}
            {adjacent.newer ? (
              <Link href={`/blog/${adjacent.newer.slug}`}>
                Newer: {adjacent.newer.title} →
              </Link>
            ) : (
              <span />
            )}
          </nav>
        </footer>
      </main>
    </div>
  )
}
