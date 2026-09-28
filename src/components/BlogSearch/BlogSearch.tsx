'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
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

const DEFAULT_PER_PAGE = 20
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

interface PagedResponse {
  posts: ApiPostRow[]
  total: number
  page: number
  totalPages: number
}

/** /api/search (text query present) and /api/posts (tag-only browsing)
 *  share the same paged wire shape, so one function drives the pager for
 *  both. Search ANDs the text query across tags; tag-only browsing ORs
 *  within the facet — the route, not the client, decides which. */
function fetchResultPage(
  query: string,
  tags: string[],
  page: number,
): Promise<PagedResponse> {
  const path = query !== '' ? '/api/search' : '/api/posts'
  return fetchJson<PagedResponse>(`${path}?${facetParams(query, tags, page)}`)
}

function describeResults(
  total: number,
  query: string,
  tags: string[],
): string {
  const parts = [`${total} essay${total === 1 ? '' : 's'}`]
  if (query !== '') {
    parts.push(`matching “${query}”`)
  }
  if (tags.length > 0) {
    parts.push(`in ${tags.map((t) => `“${t}”`).join(', ')}`)
  }
  return parts.join(' ')
}

function facetParams(
  query: string,
  tags: string[],
  page?: number,
): URLSearchParams {
  const params = new URLSearchParams()
  if (query !== '') {
    params.set('q', query)
  }
  for (const tag of tags) {
    params.append('tag', tag)
  }
  if (page !== undefined) {
    params.set('page', String(page))
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
 * the facet; a text query ANDs across it. Both text search and tag-only
 * browsing page through the same DEFAULT_PER_PAGE-per-page contract
 * (/api/search and /api/posts share page/perPage/totalPages/total).
 * Filter state lives in the URL (?q= + repeated ?tag= + ?page=) so
 * filtered views are shareable; the server-rendered first page (children)
 * stays as the SEO/no-JS baseline and the inactive view.
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
  // Consumed on the first fetch only, so a deep link like
  // /blog?q=x&page=3 opens on page 3; every later filter change starts
  // back at page 1 (a new filter invalidates any deep-linked page number).
  const isFirstRun = useRef(true)

  const trimmed = query.trim()
  const filtering = trimmed !== '' || activeTags.length > 0
  const initialPage = Math.max(
    1,
    Math.floor(Number(searchParams.get('page') ?? '1')) || 1,
  )

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
    // Read once per effect run (see isFirstRun comment), not inside the
    // timeout, so rapid typing before the debounce fires can't re-consume
    // the deep-linked page number more than once.
    const pageToFetch = isFirstRun.current ? initialPage : 1
    isFirstRun.current = false
    let cancelled = false
    const timer = setTimeout(() => {
      const run = async () => {
        try {
          const data = await fetchResultPage(trimmed, activeTags, pageToFetch)
          if (cancelled) {
            return
          }
          router.replace(
            `/blog?${facetParams(trimmed, activeTags, data.page)}`,
            { scroll: false },
          )
          setResults(data.posts.map(toMeta))
          setResultPage({ page: data.page, totalPages: data.totalPages })
          setResultMeta(describeResults(data.total, trimmed, activeTags))
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

  const turnPage = (direction: 1 | -1) => {
    const next = resultPage.page + direction
    fetchResultPage(trimmed, activeTags, next)
      .then((data) => {
        router.replace(
          `/blog?${facetParams(trimmed, activeTags, data.page)}`,
          { scroll: false },
        )
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
  // Badge counts checked topics only: the search text is already visible
  // in the input, so counting it here would imply a topic is selected.
  const activeCount = activeTags.length

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
                        onClick={() => turnPage(-1)}
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
                        onClick={() => turnPage(1)}
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
