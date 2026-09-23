import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import SiteNav from '@/components/SiteNav/SiteNav'
import { formatPostDate, getPost, getPostSlugs, loadPostContent } from '@/content/posts'
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
  try {
    post = getPost(slug)
    ;({ default: Content } = await loadPostContent(slug))
  } catch {
    notFound()
  }
  return (
    <div className="blog">
      <SiteNav />
      <main>
        <article className="blog-post">
          <header>
            <h1>{post.title}</h1>
            <p className="blog-meta">
              <time dateTime={post.date}>{formatPostDate(post.date)}</time>
              {' · '}
              {post.readingMinutes} min read
            </p>
            {post.tags.length > 0 && (
              <p className="blog-tags">{post.tags.join(' · ')}</p>
            )}
          </header>
          <Content />
        </article>
      </main>
    </div>
  )
}
