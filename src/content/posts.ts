import type { ComponentType } from 'react'

export interface MdxModule {
  default: ComponentType
}

export interface PostMeta {
  slug: string
  title: string
  date: string
  description: string
  tags: string[]
  readingMinutes: number
}

interface PostDef extends PostMeta {
  load: () => Promise<MdxModule>
}

// Single source of truth for post metadata. Content lives in ./posts/ and is
// bundled at build time, so nothing here touches the filesystem at runtime
// (there is no fs on Cloudflare Workers). To add a post: drop an .mdx file
// in ./posts/ and add one entry below.
const POST_DEFS: PostDef[] = [
  {
    slug: 'benchmark-intelligence-gap',
    title:
      'The Benchmark–Intelligence Gap: Why High Scores Overstate Fluid and Commonsense Intelligence',
    date: '2026-09-23',
    description:
      'Benchmark scores measure displayed skill on fixed tasks, not efficient learning under novelty. A position paper on ARC-AGI, commonsense evaluation, and what honest measurement would require.',
    tags: ['AI evaluation', 'position paper', 'ARC-AGI', 'commonsense reasoning'],
    readingMinutes: 23,
    load: () => import('./posts/benchmark-intelligence-gap.mdx'),
  },
]

function toMeta({ load: _load, ...meta }: PostDef): PostMeta {
  void _load
  return meta
}

function findDef(slug: string): PostDef {
  const def = POST_DEFS.find((entry) => entry.slug === slug)
  if (!def) {
    throw new Error(`Unknown post slug: ${slug}`)
  }
  return def
}

export function getPostSlugs(): string[] {
  return POST_DEFS.map((entry) => entry.slug).sort()
}

export function getPost(slug: string): PostMeta {
  return toMeta(findDef(slug))
}

export function getAllPosts(): PostMeta[] {
  return POST_DEFS.map(toMeta).sort((a, b) =>
    a.date < b.date ? 1 : a.date > b.date ? -1 : 0,
  )
}

export function loadPostContent(slug: string): Promise<MdxModule> {
  return findDef(slug).load()
}

export function formatPostDate(iso: string): string {
  return new Date(`${iso}T00:00:00Z`).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    timeZone: 'UTC',
  })
}
