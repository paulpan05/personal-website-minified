'use client'

import { useEffect, useMemo, useState } from 'react'
import type { ReactNode } from 'react'
import type { PostMeta } from '@/content/posts'
import BlogEntry from '@/components/BlogEntry/BlogEntry'

interface ApiPostRow {
  slug: string
  title: string
  published_at: string
  description: string
  tags: string
  reading_minutes: number
  provenance: string
}

function toMeta(row: ApiPostRow): PostMeta {
  return {
    slug: row.slug,
    title: row.title,
    publishedAt: row.published_at,
    description: row.description,
    tags: JSON.parse(row.tags) as string[],
    readingMinutes: row.reading_minutes,
    provenance: row.provenance as PostMeta['provenance'],
  }
}

async function fetchJson<T>(url: string): Promise<T> {
  const controller = new AbortController()
  const timeout = setTimeout(() => controller.abort(), 5000)
  try {
    const res = await fetch(url, { signal: controller.signal })
    if (!res.ok) {
      throw new Error(`request failed: ${res.status}`)
    }
    return (await res.json()) as T
  } finally {
    clearTimeout(timeout)
  }
}

/**
 * Archive browser. Reads listing metadata, tags, and search hits from the
 * D1-backed API routes — the client never holds more than one page of
 * posts, at any archive size. The server-rendered first page (children)
 * stays as the SEO/no-JS baseline and the inactive view.
 */
export default function BlogSearch({
  children,
}: {
  children: ReactNode
}) {
  const [query, setQuery] = useState('')
  const [activeTag, setActiveTag] = useState<string | null>(null)
  const [tags, setTags] = useState<string[] | null>(null)
  const [results, setResults] = useState<PostMeta[] | null>(null)
  const [resultPage, setResultPage] = useState({ page: 1, totalPages: 1 })
  const [resultMeta, setResultMeta] = useState('')
  const [unavailable, setUnavailable] = useState(false)

  const trimmed = query.trim()
  const filtering = trimmed !== '' || activeTag !== null

  // Topic chips, fetched once. Hidden (not faked) if the API is down.
  useEffect(() => {
    fetchJson<{ tags: string[] }>('/api/tags')
      .then((data) => setTags(data.tags))
      .catch(() => setTags([]))
  }, [])

  // Debounced search/listing fetch. Tag-only browsing pages through
  // /api/posts; text queries go to /api/search (D1 FTS5, title/tag
  // re-boosted client-side over the bm25 order it returns).
  useEffect(() => {
    if (!filtering) {
      setResults(null)
      setUnavailable(false)
      return
    }
    let cancelled = false
    const timer = setTimeout(() => {
      const run = async () => {
        try {
          if (trimmed !== '') {
            const params = new URLSearchParams({ q: trimmed })
            if (activeTag) {
              params.set('tag', activeTag)
            }
            const data = await fetchJson<{
              posts: ApiPostRow[]
            }>(`/api/search?${params}`)
            if (cancelled) {
              return
            }
            const ranked = data.posts.map(toMeta)
            setResults(ranked)
            setResultPage({ page: 1, totalPages: 1 })
            const parts = [`${ranked.length} essay${ranked.length === 1 ? '' : 's'} matching “${trimmed}”`]
            if (activeTag) {
              parts.push(`in “${activeTag}”`)
            }
            setResultMeta(parts.join(' '))
          } else {
            const data = await fetchJson<{
              posts: ApiPostRow[]
              page: number
              totalPages: number
              total: number
            }>(`/api/posts?tag=${encodeURIComponent(activeTag ?? '')}&page=1`)
            if (cancelled) {
              return
            }
            setResults(data.posts.map(toMeta))
            setResultPage({ page: data.page, totalPages: data.totalPages })
            setResultMeta(
              `${data.total} essay${data.total === 1 ? '' : 's'} in “${activeTag}”`,
            )
          }
          setUnavailable(false)
        } catch {
          if (!cancelled) {
            setUnavailable(true)
          }
        }
      }
      void run()
    }, 200)
    return () => {
      cancelled = true
      clearTimeout(timer)
    }
  }, [query, activeTag, filtering, trimmed])

  const turnTagPage = (direction: 1 | -1) => {
    const next = resultPage.page + direction
    fetchJson<{
      posts: ApiPostRow[]
      page: number
      totalPages: number
    }>(`/api/posts?tag=${encodeURIComponent(activeTag ?? '')}&page=${next}`)
      .then((data) => {
        setResults(data.posts.map(toMeta))
        setResultPage({ page: data.page, totalPages: data.totalPages })
        setUnavailable(false)
      })
      .catch(() => setUnavailable(true))
  }

  const chips = useMemo(() => tags ?? [], [tags])

  return (
    <div className="blog-search">
      <label className="search-field" htmlFor="blog-search-input">
        <span>Search essays</span>
        <input
          id="blog-search-input"
          type="search"
          autoComplete="off"
          placeholder="Titles, topics, authors, methods…"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
        />
      </label>
      {chips.length > 0 && (
        <div className="tag-chips" role="group" aria-label="Filter by topic">
          {chips.map((tag) => (
            <button
              key={tag}
              type="button"
              className="tag-chip"
              aria-pressed={activeTag === tag}
              onClick={() => setActiveTag((prev) => (prev === tag ? null : tag))}
            >
              {tag}
            </button>
          ))}
        </div>
      )}
      {results === null && !unavailable ? (
        children
      ) : (
        <div className="search-results" aria-live="polite">
          {unavailable ? (
            <p className="search-meta">
              Search is unavailable right now. Showing the latest essays
              below — try again in a moment.
            </p>
          ) : results !== null && results.length === 0 ? (
            <p className="search-meta">
              No essays match{trimmed !== '' ? ` “${trimmed}”` : ''}
              {activeTag ? ` in “${activeTag}”` : ''}.
            </p>
          ) : (
            results !== null && (
              <>
                <p className="search-meta">{resultMeta}.</p>
                <ul className="blog-list">
                  {results.map((post) => (
                    <BlogEntry key={post.slug} post={post} />
                  ))}
                </ul>
                {resultPage.totalPages > 1 && (
                  <nav className="blog-pages" aria-label="Filtered essay pages">
                    {resultPage.page > 1 && (
                      <button
                        type="button"
                        onClick={() => turnTagPage(-1)}
                      >
                        ← Newer
                      </button>
                    )}
                    <span aria-current="page">
                      Page {resultPage.page} of {resultPage.totalPages}
                    </span>
                    {resultPage.page < resultPage.totalPages && (
                      <button
                        type="button"
                        onClick={() => turnTagPage(1)}
                      >
                        Older →
                      </button>
                    )}
                  </nav>
                )}
              </>
            )
          )}
          {unavailable && children}
        </div>
      )}
    </div>
  )
}
