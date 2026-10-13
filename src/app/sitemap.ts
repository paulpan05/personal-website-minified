import type { MetadataRoute } from 'next'
import { getAllPosts } from '@/content/posts'
import { SITE_URL } from '@/lib/site'

export default function sitemap(): MetadataRoute.Sitemap {
  const posts = getAllPosts()
  // Index pages change when the newest essay lands, so use its date rather
  // than the request time (which would claim a change on every crawl).
  const newest = posts
    .map((post) => new Date(post.publishedAt))
    .reduce((a, b) => (a > b ? a : b))
  return [
    { url: SITE_URL, lastModified: newest },
    { url: `${SITE_URL}/blog`, lastModified: newest },
    ...posts.map((post) => ({
      url: `${SITE_URL}/blog/${post.slug}`,
      lastModified: new Date(post.publishedAt),
    })),
  ]
}
