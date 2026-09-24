import Image from 'next/image'
import Link from 'next/link'
import { repoLink } from '@/data/paragraphs'
import {
  ProfileIconLinks,
  OldEmail,
  NewEmail,
  PhoneNumber,
} from '@/data/infos'

const SECTION_LINKS = [
  { label: 'About', href: '/#about' },
  { label: 'Experience', href: '/#experience' },
  { label: 'Projects', href: '/#projects' },
  { label: 'Writing', href: '/blog' },
  { label: 'Contact', href: '/#contact' },
]

export default function SiteFooter() {
  const phoneHref = `tel:${PhoneNumber.replace(/[^+\d]/g, '')}`
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
      <section
        className="footer-contact"
        id="contact"
        aria-labelledby="footer-contact-heading"
      >
        <h2 id="footer-contact-heading">
          <span aria-hidden="true" className="prompt">
            ${' '}
          </span>
          More About Me
        </h2>
        <div className="profile-links">
          {ProfileIconLinks.map((profile, index) => (
            <a
              key={index}
              href={profile.link}
              aria-label={profile.site_name}
              target="_blank"
              rel="noopener noreferrer"
            >
              <Image
                src={profile.icon}
                alt={profile.site_name}
                width={50}
                height={50}
                loading="lazy"
              />
            </a>
          ))}
        </div>
        <p>
          <b>Primary email: </b>
          <a href={`mailto:${NewEmail}`}>{NewEmail}</a>
        </p>
        <p>
          <b>Legacy email: </b>
          <a href={`mailto:${OldEmail}`}>{OldEmail}</a>
        </p>
        <p>
          <b>Phone Number: </b>
          <a href={phoneHref}>{PhoneNumber}</a>
        </p>
      </section>
      <span className="site-links">
        <a href="/blog/rss.xml">RSS</a>
        <a href={repoLink} target="_blank" rel="noopener noreferrer">
          Source
        </a>
      </span>
    </footer>
  )
}
