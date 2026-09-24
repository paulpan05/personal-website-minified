'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useCallback, useEffect, useState } from 'react'

interface NavEntry {
  label: string
  href: string
  hash: string
}

// Homepage order: About, Experience, Projects, Writing (separate page),
// Contact (last section on the homepage).
const SECTION_LINKS: NavEntry[] = [
  { label: 'About', href: '/#about', hash: '#about' },
  { label: 'Experience', href: '/#experience', hash: '#experience' },
  { label: 'Projects', href: '/#projects', hash: '#projects' },
  { label: 'Contact', href: '/#contact', hash: '#contact' },
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
    for (const link of SECTION_LINKS) {
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
  const isSectionLink = (link: NavEntry) =>
    onHome && activeHash === link.hash

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
      <button
        type="button"
        className="nav-toggle"
        aria-expanded={menuOpen}
        aria-controls="site-nav-menu"
        onClick={() => setMenuOpen((open) => !open)}
      >
        Menu
      </button>
      <span
        id="site-nav-menu"
        className={`site-links${menuOpen ? ' open' : ''}`}
        // Next.js same-page hash navigations use pushState, which fires no
        // hashchange — so close the menu on any link tap directly.
        onClick={() => setMenuOpen(false)}
      >
        {SECTION_LINKS.slice(0, 3).map((link) => (
          <Link
            key={link.href}
            href={link.href}
            aria-current={isSectionLink(link) ? 'page' : undefined}
            className={isSectionLink(link) ? 'active' : undefined}
          >
            {link.label}
          </Link>
        ))}
        <Link
          href="/blog"
          aria-current={writingActive ? 'page' : undefined}
          className={writingActive ? 'active' : undefined}
        >
          Writing
        </Link>
        {SECTION_LINKS.slice(3).map((link) => (
          <Link
            key={link.href}
            href={link.href}
            aria-current={isSectionLink(link) ? 'page' : undefined}
            className={isSectionLink(link) ? 'active' : undefined}
          >
            {link.label}
          </Link>
        ))}
      </span>
    </nav>
  )
}
