import Link from 'next/link'

export default function SiteNav() {
  return (
    <nav className="site-nav" aria-label="Site">
      <Link href="/">Home</Link>
      <Link href="/blog">Writing</Link>
    </nav>
  )
}
