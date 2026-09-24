import type { MetadataRoute } from 'next'
import { getAllPosts } from '@/content/posts'
import { SITE_URL } from '@/lib/site'

export default function sitemap(): MetadataRoute.Sitemap {
  const posts = getAllPosts()
  return [
    { url: SITE_URL, lastModified: new Date() },
    { url: `${SITE_URL}/blog`, lastModified: new Date() },
    ...posts.map((post) => ({
      url: `${SITE_URL}/blog/${post.slug}`,
      lastModified: new Date(post.publishedAt),
    })),
  ]
}
