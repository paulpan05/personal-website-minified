import '@/styles/reset.scss'
import '@/styles/globals.scss'
import type { Metadata } from 'next'
import { SITE_URL } from '@/lib/site'

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: "Paul's Main Website",
  description:
    'Paul Pan — software engineer at Meta Reality Labs. Experience, highlighted projects, writing, and contact info.',
  openGraph: {
    title: "Paul's Main Website",
    description:
      "Paul Pan — software engineer at Meta Reality Labs. Experience, highlighted projects, writing, and contact info.",
    type: 'website',
  },
  twitter: {
    card: 'summary',
    title: "Paul's Main Website",
    description:
      "Paul Pan — software engineer at Meta Reality Labs. Experience, highlighted projects, writing, and contact info.",
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
      <body>{children}</body>
    </html>
  )
}