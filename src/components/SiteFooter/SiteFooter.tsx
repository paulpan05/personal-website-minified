import { repoLink } from '@/data/paragraphs'

export default function SiteFooter() {
  return (
    <footer className="site-footer">
      <span className="site-wordmark" aria-hidden="true">
        ~/paulpan
      </span>
      <span className="site-links">
        <a href="/blog/rss.xml">RSS</a>
        <a href={repoLink} target="_blank" rel="noopener noreferrer">
          Source
        </a>
      </span>
    </footer>
  )
}
