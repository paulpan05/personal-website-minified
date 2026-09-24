import { getAllPosts } from '@/content/posts'
import { SITE_AUTHOR, SITE_NAME, SITE_URL } from '@/lib/site'

function escapeXml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;')
}

export async function GET(): Promise<Response> {
  // RSS is a latest-posts feed, not an archive: cap at 20 so it stays
  // feed-reader sized as the archive grows toward hundreds of essays.
  const posts = getAllPosts().slice(0, 20)
  const items = posts
    .map(
      (post) => `    <item>
      <title>${escapeXml(post.title)}</title>
      <link>${SITE_URL}/blog/${post.slug}</link>
      <guid>${SITE_URL}/blog/${post.slug}</guid>
      <description>${escapeXml(post.description)}</description>
      <author>${escapeXml(SITE_AUTHOR)}</author>
      <pubDate>${new Date(`${post.date}T00:00:00Z`).toUTCString()}</pubDate>
    </item>`,
    )
    .join('\n')
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
  <channel>
    <title>${escapeXml(`${SITE_NAME} — Writing`)}</title>
    <link>${SITE_URL}/blog</link>
    <description>Essays and longform writing by ${escapeXml(SITE_AUTHOR)}.</description>
    <language>en-us</language>
${items}
  </channel>
</rss>
`
  return new Response(xml, {
    headers: { 'Content-Type': 'application/rss+xml; charset=utf-8' },
  })
}
