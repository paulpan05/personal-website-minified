'use client'

import { useEffect, useMemo, useState } from 'react'
import type { ReactNode } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
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

interface TagFacet {
  tag: string
  count: number
}

const SEARCH_LIMIT = 20
// Topics shown before "show more" — keeps the panel bounded when the
// vocabulary grows with the archive (hundreds of topics at 10k essays).
const INITIAL_FACETS = 10

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

function facetParams(query: string, tags: string[]): URLSearchParams {
  const params = new URLSearchParams()
  if (query !== '') {
    params.set('q', query)
  }
  for (const tag of tags) {
    params.append('tag', tag)
  }
  return params
}

/**
 * Archive browser: commerce-style filter — a toggle button with an
 * active-count badge expanding a facet panel (multi-select topic
 * checkboxes with counts, show more/less past INITIAL_FACETS, clear-all,
 * done) — plus full-text search. Reads listing metadata, facets, and
 * search hits from the D1-backed API routes — the client never holds more
 * than one page of posts, at any archive size. Tag filtering is OR within
 * the facet; a text query ANDs across it. Text search returns the top
 * SEARCH_LIMIT hits by bm25; tag-only browsing pages through /api/posts.
 * Filter state lives in the URL (?q= + repeated ?tag=) so filtered views
 * are shareable; the server-rendered first page (children) stays as the
 * SEO/no-JS baseline and the inactive view.
 */
export default function BlogSearch({
  children,
}: {
  children: ReactNode
}) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [query, setQuery] = useState(() => searchParams.get('q') ?? '')
  const [activeTags, setActiveTags] = useState<string[]>(() =>
    searchParams.getAll('tag').filter((t) => t !== ''),
  )
  const [tags, setTags] = useState<TagFacet[] | null>(null)
  const [results, setResults] = useState<PostMeta[] | null>(null)
  const [resultPage, setResultPage] = useState({ page: 1, totalPages: 1 })
  const [resultMeta, setResultMeta] = useState('')
  const [unavailable, setUnavailable] = useState(false)
  const [panelOpen, setPanelOpen] = useState(false)
  const [showAllFacets, setShowAllFacets] = useState(false)

  const trimmed = query.trim()
  const filtering = trimmed !== '' || activeTags.length > 0

  // Topic facets with counts, fetched once. Hidden (not faked) if down.
  useEffect(() => {
    fetchJson<{ tags: TagFacet[] }>('/api/tags')
      .then((data) => setTags(data.tags))
      .catch(() => setTags([]))
  }, [])

  // Debounced search/listing fetch; filter state mirrors into the URL.
  useEffect(() => {
    if (!filtering) {
      setResults(null)
      setUnavailable(false)
      return
    }
    let cancelled = false
    const timer = setTimeout(() => {
      router.replace(`/blog?${facetParams(trimmed, activeTags)}`, {
        scroll: false,
      })
      const run = async () => {
        try {
          if (trimmed !== '') {
            const data = await fetchJson<{
              posts: ApiPostRow[]
            }>(`/api/search?${facetParams(trimmed, activeTags)}`)
            if (cancelled) {
              return
            }
            const ranked = data.posts.map(toMeta)
            setResults(ranked)
            setResultPage({ page: 1, totalPages: 1 })
            const parts = [
              `${ranked.length} of up to ${SEARCH_LIMIT} essays matching “${trimmed}”`,
            ]
            if (activeTags.length > 0) {
              parts.push(`in ${activeTags.map((t) => `“${t}”`).join(', ')}`)
            }
            setResultMeta(parts.join(' '))
          } else {
            const data = await fetchJson<{
              posts: ApiPostRow[]
              page: number
              totalPages: number
              total: number
            }>(`/api/posts?${facetParams('', activeTags)}&page=1`)
            if (cancelled) {
              return
            }
            setResults(data.posts.map(toMeta))
            setResultPage({ page: data.page, totalPages: data.totalPages })
            setResultMeta(
              `${data.total} essay${data.total === 1 ? '' : 's'} in ${activeTags.map((t) => `“${t}”`).join(', ')}`,
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query, activeTags, filtering, trimmed])

  const turnTagPage = (direction: 1 | -1) => {
    const next = resultPage.page + direction
    fetchJson<{
      posts: ApiPostRow[]
      page: number
      totalPages: number
    }>(`/api/posts?${facetParams('', activeTags)}&page=${next}`)
      .then((data) => {
        setResults(data.posts.map(toMeta))
        setResultPage({ page: data.page, totalPages: data.totalPages })
        setUnavailable(false)
      })
      .catch(() => setUnavailable(true))
  }

  const toggleTag = (tag: string) => {
    setActiveTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag],
    )
  }

  const clearFilters = () => {
    setQuery('')
    setActiveTags([])
    router.replace('/blog', { scroll: false })
  }

  const facets = useMemo(() => tags ?? [], [tags])
  const visibleFacets = showAllFacets ? facets : facets.slice(0, INITIAL_FACETS)
  const activeCount = activeTags.length + (trimmed !== '' ? 1 : 0)

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
      {facets.length > 0 && (
        <div className="filter-wrap">
          <button
            type="button"
            className="filter-toggle"
            aria-expanded={panelOpen}
            aria-controls="blog-filter-panel"
            onClick={() => setPanelOpen((open) => !open)}
          >
            <span aria-hidden="true">{panelOpen ? '▾' : '▸'}</span> Filters
            {activeCount > 0 && (
              <span className="filter-badge">{activeCount}</span>
            )}
          </button>
          {panelOpen && (
            <section
              id="blog-filter-panel"
              className="filter-panel"
              aria-label="Essay filters"
            >
              <fieldset className="filter-group">
                <legend>Topics</legend>
                <ul className="filter-options">
                  {visibleFacets.map(({ tag, count }) => (
                    <li key={tag}>
                      <label className="filter-option">
                        <input
                          type="checkbox"
                          checked={activeTags.includes(tag)}
                          onChange={() => toggleTag(tag)}
                        />
                        <span className="filter-option-label">{tag}</span>
                        <span className="tag-count">({count})</span>
                      </label>
                    </li>
                  ))}
                </ul>
                {facets.length > INITIAL_FACETS && (
                  <button
                    type="button"
                    className="filter-more"
                    onClick={() => setShowAllFacets((show) => !show)}
                  >
                    {showAllFacets
                      ? 'Show fewer topics'
                      : `Show all ${facets.length} topics`}
                  </button>
                )}
              </fieldset>
              <div className="filter-actions">
                {filtering && (
                  <button
                    type="button"
                    className="clear-filters"
                    onClick={clearFilters}
                  >
                    Clear all
                  </button>
                )}
                <button
                  type="button"
                  className="filter-done"
                  onClick={() => setPanelOpen(false)}
                >
                  Done
                </button>
              </div>
            </section>
          )}
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
              {activeTags.length > 0
                ? ` in ${activeTags.map((t) => `“${t}”`).join(', ')}`
                : ''}
              .
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
