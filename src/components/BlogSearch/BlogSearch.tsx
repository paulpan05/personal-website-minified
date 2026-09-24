'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import type { ReactNode } from 'react'
import type { PostMeta } from '@/content/posts'
import BlogEntry from '@/components/BlogEntry/BlogEntry'

interface SearchIndex {
  version: number
  slugs: string[]
  stopwords: string[]
  postings: Record<string, Array<[number, number]>>
}

function wordTokens(text: string): string[] {
  return text.toLowerCase().match(/[a-z0-9]+/g) ?? []
}

interface RankedPost {
  post: PostMeta
  score: number
}

function rankPosts(
  candidates: PostMeta[],
  queryTokens: string[],
  stopwords: Set<string>,
  index: SearchIndex,
): RankedPost[] {
  const tokens = queryTokens.filter(
    (token) => token.length >= 2 && !stopwords.has(token),
  )
  if (tokens.length === 0) {
    return candidates.map((post) => ({ post, score: 0 }))
  }
  const slugToIndex = new Map(index.slugs.map((slug, i) => [slug, i]))
  const ranked: RankedPost[] = []
  for (const post of candidates) {
    const titleWords = new Set(wordTokens(post.title))
    const tagWords = new Set(post.tags.flatMap(wordTokens))
    const slugIndex = slugToIndex.get(post.slug)
    let score = 0
    let matched = true
    for (const token of tokens) {
      const inTitle = titleWords.has(token)
      const inTags = tagWords.has(token)
      const posting = slugIndex === undefined
        ? undefined
        : index.postings[token]?.find(([i]) => i === slugIndex)
      if (!inTitle && !inTags && !posting) {
        matched = false
        break
      }
      score += (inTitle ? 10 : 0) + (inTags ? 5 : 0) + (posting?.[1] ?? 0)
    }
    if (matched) {
      ranked.push({ post, score })
    }
  }
  // Stable sort: candidates arrive newest-first, so date ties keep it.
  ranked.sort((a, b) => b.score - a.score)
  return ranked
}

export default function BlogSearch({
  posts,
  children,
}: {
  posts: PostMeta[]
  /** Server-rendered default list (SEO + no-JS); shown when inactive. */
  children: ReactNode
}) {
  const [query, setQuery] = useState('')
  const [activeTag, setActiveTag] = useState<string | null>(null)
  const [index, setIndex] = useState<SearchIndex | null>(null)
  // Slugs ranked by the D1 FTS5 API (bm25). Null until the API answers;
  // a failed API falls back to the bundled static index below.
  const [apiSlugs, setApiSlugs] = useState<string[] | null>(null)
  const indexPromise = useRef<Promise<SearchIndex> | null>(null)

  const tags = useMemo(
    () => [...new Set(posts.flatMap((post) => post.tags))].sort(),
    [posts],
  )
  const queryTokens = useMemo(() => wordTokens(query.trim()), [query])
  const filtering = queryTokens.length > 0 || activeTag !== null

  // Lazy-load the full-text index on first search keystroke — never part
  // of the initial bundle. Tag-only filtering needs no index at all.
  const loadStaticIndex = () => {
    if (index || indexPromise.current) {
      return
    }
    indexPromise.current = import('@/content/search-index.json').then(
      (mod) => {
        const loaded = (mod.default ?? mod) as unknown as SearchIndex
        setIndex(loaded)
        return loaded
      },
    )
  }

  // Prefer the D1 FTS5 API (porter stemming, bm25); fall back to the
  // bundled static index when the API has no database (local `next start`,
  // unmigrated environments). Debounced per keystroke.
  useEffect(() => {
    setApiSlugs(null)
    if (queryTokens.length === 0) {
      return
    }
    const trimmed = query.trim()
    let cancelled = false
    const controller = new AbortController()
    const timeout = setTimeout(() => controller.abort(), 2500)
    const timer = setTimeout(() => {
      fetch(`/api/search?q=${encodeURIComponent(trimmed)}`, {
        signal: controller.signal,
      })
        .then(async (res) => {
          if (!res.ok) {
            throw new Error('search API unavailable')
          }
          const data = (await res.json()) as { slugs: string[] }
          if (!cancelled) {
            setApiSlugs(data.slugs)
          }
        })
        .catch(() => {
          if (!cancelled) {
            loadStaticIndex()
          }
        })
    }, 200)
    return () => {
      cancelled = true
      clearTimeout(timer)
      clearTimeout(timeout)
      controller.abort()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query])

  const results = useMemo<RankedPost[] | null>(() => {
    if (!filtering) {
      return null
    }
    const candidates = activeTag
      ? posts.filter((post) => post.tags.includes(activeTag))
      : posts
    if (queryTokens.length === 0) {
      return candidates.map((post) => ({ post, score: 0 }))
    }
    if (apiSlugs !== null) {
      // D1 answered: keep bm25 order, apply the tag filter client-side,
      // re-boost title/tag hits so metadata still outranks body mentions.
      const order = new Map(apiSlugs.map((slug, i) => [slug, i]))
      const matched = candidates.filter((post) => order.has(post.slug))
      const titleBoost = (post: PostMeta) => {
        const titleWords = new Set(wordTokens(post.title))
        const tagWords = new Set(post.tags.flatMap(wordTokens))
        return queryTokens.reduce(
          (sum, token) =>
            sum + (titleWords.has(token) ? 10 : 0) + (tagWords.has(token) ? 5 : 0),
          0,
        )
      }
      matched.sort(
        (a, b) =>
          order.get(a.slug)! - order.get(b.slug)! ||
          titleBoost(b) - titleBoost(a),
      )
      return matched.map((post) => ({ post, score: 0 }))
    }
    if (!index) {
      return null
    }
    return rankPosts(candidates, queryTokens, new Set(index.stopwords), index)
  }, [filtering, activeTag, posts, queryTokens, apiSlugs, index])

  const loadingText =
    queryTokens.length > 0 && apiSlugs === null && index === null

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
      {tags.length > 0 && (
        <div className="tag-chips" role="group" aria-label="Filter by topic">
          {tags.map((tag) => (
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
      {results === null ? (
        children
      ) : (
        <div className="search-results" aria-live="polite">
          {loadingText ? (
            <p className="search-meta">Searching…</p>
          ) : results.length === 0 ? (
            <p className="search-meta">
              No essays match{query.trim() !== '' ? ` “${query.trim()}”` : ''}
              {activeTag ? ` in “${activeTag}”` : ''}.
            </p>
          ) : (
            <>
              <p className="search-meta">
                {results.length} of {posts.length} essays
                {activeTag ? ` in “${activeTag}”` : ''}
                {query.trim() !== '' ? ` matching “${query.trim()}”` : ''}.
              </p>
              <ul className="blog-list">
                {results.map(({ post }) => (
                  <BlogEntry key={post.slug} post={post} />
                ))}
              </ul>
            </>
          )}
        </div>
      )}
    </div>
  )
}
