'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useCallback, useEffect, useState } from 'react'

interface NavEntry {
  label: string
  href: string
  hash?: string
  /** Stays exposed on mobile; unpinned links collapse under Menu. */
  pinned?: boolean
  /** Full-page route (vs homepage anchor). */
  isPage?: boolean
}

// Display order mirrors the homepage top-to-bottom, with Writing slotted
// where a reader would look for it. Contact targets the footer contact
// block, which lives on every page.
const NAV_LINKS: NavEntry[] = [
  { label: 'About', href: '/#about', hash: '#about' },
  { label: 'Experience', href: '/#experience', hash: '#experience' },
  { label: 'Projects', href: '/#projects', hash: '#projects' },
  { label: 'Writing', href: '/blog', pinned: true, isPage: true },
  { label: 'Contact', href: '/#contact', hash: '#contact', pinned: true },
]

// Active-section band, as fractions of viewport height (below the sticky
// bar, above the fold). The section covering most of this band wins.
const BAND_TOP_FRACTION = 0.2
const BAND_BOTTOM_FRACTION = 0.45

export default function SiteNav() {
  const pathname = usePathname()
  const [activeHash, setActiveHash] = useState('')
  const [menuOpen, setMenuOpen] = useState(false)

  // Track the URL hash (nav clicks, deep links, back/forward).
  useEffect(() => {
    const syncHash = () => {
      setActiveHash(window.location.hash)
      setMenuOpen(false)
    }
    syncHash()
    window.addEventListener('hashchange', syncHash)
    return () => window.removeEventListener('hashchange', syncHash)
  }, [pathname])

  // Track the section in view while scrolling the homepage. Measures every
  // section's overlap with the active band fresh on each scroll — an
  // IntersectionObserver callback only reports changed entries, which made
  // scrolling down always crown whatever just entered.
  const recomputeActive = useCallback(() => {
    if (window.location.pathname !== '/') {
      return
    }
    const doc = document.documentElement
    if (
      window.innerHeight + window.scrollY >=
      doc.scrollHeight - 4
    ) {
      setActiveHash('#contact')
      return
    }
    const bandTop = window.innerHeight * BAND_TOP_FRACTION
    const bandBottom = window.innerHeight * BAND_BOTTOM_FRACTION
    let best = ''
    let bestOverlap = 0
    for (const link of NAV_LINKS) {
      if (!link.hash) {
        continue
      }
      const el = document.querySelector(link.href.slice(1))
      if (!el) {
        continue
      }
      const rect = el.getBoundingClientRect()
      const overlap = Math.max(
        0,
        Math.min(rect.bottom, bandBottom) - Math.max(rect.top, bandTop),
      )
      if (overlap > bestOverlap) {
        bestOverlap = overlap
        best = link.hash
      }
    }
    if (best !== '') {
      setActiveHash(best)
    } else if (window.location.hash === '') {
      // Hero: no section in the band and no hash — underline the wordmark.
      setActiveHash('')
    }
  }, [])

  useEffect(() => {
    if (pathname !== '/') {
      return
    }
    recomputeActive()
    window.addEventListener('scroll', recomputeActive, { passive: true })
    window.addEventListener('resize', recomputeActive)
    return () => {
      window.removeEventListener('scroll', recomputeActive)
      window.removeEventListener('resize', recomputeActive)
    }
  }, [pathname, recomputeActive])

  // Close the mobile menu on page navigation.
  useEffect(() => {
    setMenuOpen(false)
  }, [pathname])

  const onHome = pathname === '/'
  const writingActive =
    pathname === '/blog' || pathname.startsWith('/blog/')
  const homeActive = onHome && activeHash === ''

  const renderLink = (link: NavEntry) => {
    const active = link.isPage
      ? writingActive
      : onHome && activeHash === link.hash
    return (
      <Link
        key={link.href}
        href={link.href}
        aria-current={active ? 'page' : undefined}
        className={[
          active ? 'active' : '',
          link.pinned ? '' : 'collapsible',
        ]
          .join(' ')
          .trim() || undefined}
      >
        {link.label}
      </Link>
    )
  }

  return (
    <nav
      className="site-nav"
      aria-label="Site"
      onKeyDown={(event) => {
        if (event.key === 'Escape') {
          setMenuOpen(false)
        }
      }}
    >
      <Link
        href="/"
        className={`site-wordmark${homeActive ? ' active' : ''}`}
        aria-current={homeActive ? 'page' : undefined}
      >
        ~/paulpan
      </Link>
      <span
        id="site-nav-menu"
        className={`site-links${menuOpen ? ' open' : ''}`}
        // Next.js same-page hash navigations use pushState, which fires no
        // hashchange — so close the menu on any link tap directly.
        onClick={() => setMenuOpen(false)}
      >
        {NAV_LINKS.map(renderLink)}
      </span>
      <button
        type="button"
        className="nav-toggle"
        aria-expanded={menuOpen}
        aria-controls="site-nav-menu"
        onClick={() => setMenuOpen((open) => !open)}
      >
        Menu <span aria-hidden="true">▾</span>
      </button>
    </nav>
  )
}
