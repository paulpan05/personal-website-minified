import Link from 'next/link'
import { repoLink } from '@/data/paragraphs'

const SECTION_LINKS = [
  { label: 'About', href: '/#about' },
  { label: 'Experience', href: '/#experience' },
  { label: 'Projects', href: '/#projects' },
  { label: 'Writing', href: '/blog' },
  { label: 'More About Me', href: '/#contact' },
]

export default function SiteFooter() {
  return (
    <footer className="site-footer">
      <Link href="/" className="site-wordmark" aria-label="Home">
        ~/paulpan
      </Link>
      <nav className="site-links" aria-label="Footer">
        {SECTION_LINKS.map((link) => (
          <a key={link.href} href={link.href}>
            {link.label}
          </a>
        ))}
      </nav>
      <span className="site-links">
        <a href="/blog/rss.xml">RSS</a>
        <a href={repoLink} target="_blank" rel="noopener noreferrer">
          Source
        </a>
      </span>
    </footer>
  )
}
