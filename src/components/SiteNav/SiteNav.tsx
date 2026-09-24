'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'

interface NavEntry {
  label: string
  href: string
  hash?: string
}

// Homepage order: About, Experience, Projects, Writing (separate page),
// Contact (last section on the homepage).
const SECTION_LINKS: NavEntry[] = [
  { label: 'About', href: '/#about', hash: '#about' },
  { label: 'Experience', href: '/#experience', hash: '#experience' },
  { label: 'Projects', href: '/#projects', hash: '#projects' },
  { label: 'Contact', href: '/#contact', hash: '#contact' },
]

export default function SiteNav() {
  const pathname = usePathname()
  const [hash, setHash] = useState('')

  useEffect(() => {
    const sync = () => setHash(window.location.hash)
    sync()
    window.addEventListener('hashchange', sync)
    return () => window.removeEventListener('hashchange', sync)
  }, [pathname])

  const onHome = pathname === '/'
  const writingActive =
    pathname === '/blog' || pathname.startsWith('/blog/')
  const homeActive = onHome && hash === ''

  return (
    <nav className="site-nav" aria-label="Site">
      <Link
        href="/"
        className="site-wordmark"
        aria-current={homeActive ? 'page' : undefined}
      >
        ~/paulpan
      </Link>
      <span className="site-links">
        {SECTION_LINKS.slice(0, 3).map((link) => {
          const active = onHome && hash === link.hash
          return (
            <Link
              key={link.href}
              href={link.href}
              aria-current={active ? 'page' : undefined}
              className={active ? 'active' : undefined}
            >
              {link.label}
            </Link>
          )
        })}
        <Link
          href="/blog"
          aria-current={writingActive ? 'page' : undefined}
          className={writingActive ? 'active' : undefined}
        >
          Writing
        </Link>
        {SECTION_LINKS.slice(3).map((link) => {
          const active = onHome && hash === link.hash
          return (
            <Link
              key={link.href}
              href={link.href}
              aria-current={active ? 'page' : undefined}
              className={active ? 'active' : undefined}
            >
              {link.label}
            </Link>
          )
        })}
      </span>
    </nav>
  )
}
