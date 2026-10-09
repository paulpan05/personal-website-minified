import '@/styles/reset.scss'
import '@/styles/globals.scss'
import type { Metadata } from 'next'
import {
  SITE_DESCRIPTION,
  SITE_NAME,
  SITE_OG_IMAGE,
  SITE_URL,
} from '@/lib/site'
import SiteNav from '@/components/SiteNav/SiteNav'
import SiteFooter from '@/components/SiteFooter/SiteFooter'
import BackToTop from '@/components/BackToTop/BackToTop'

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: SITE_NAME,
  description: SITE_DESCRIPTION,
  openGraph: {
    title: SITE_NAME,
    description: SITE_DESCRIPTION,
    type: 'website',
    images: [SITE_OG_IMAGE],
  },
  twitter: {
    card: 'summary',
    title: SITE_NAME,
    description: SITE_DESCRIPTION,
    images: [SITE_OG_IMAGE.url],
  },
  icons: {
    icon: [
      { url: '/favicon.ico' },
      { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
    ],
    apple: [{ url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' }],
  },
  manifest: '/manifest.json',
  alternates: {
    // Relative to each route, so every page names itself as canonical on SITE_URL.
    canonical: './',
    types: {
      'application/rss+xml': [{ url: '/blog/rss.xml', title: "Writing" }],
    },
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <SiteNav />
        {children}
        <SiteFooter />
        <BackToTop />
      </body>
    </html>
  )
}