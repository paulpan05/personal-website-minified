'use client'

import { useEffect, useState } from 'react'

const SHOW_AFTER_PX = 600

export default function BackToTop() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const sync = () => setVisible(window.scrollY > SHOW_AFTER_PX)
    sync()
    window.addEventListener('scroll', sync, { passive: true })
    return () => window.removeEventListener('scroll', sync)
  }, [])

  const scrollTop = () => {
    const reduced = window.matchMedia(
      '(prefers-reduced-motion: reduce)',
    ).matches
    window.scrollTo({ top: 0, behavior: reduced ? 'auto' : 'smooth' })
  }

  if (!visible) {
    return null
  }

  return (
    <button type="button" className="back-to-top" onClick={scrollTop}>
      <span aria-hidden="true">↑ </span>Top
    </button>
  )
}
