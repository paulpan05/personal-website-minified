'use client'

import { useEffect, useState } from 'react'

const SHOW_AFTER_PX = 600

export default function BackToTop() {
  const [visible, setVisible] = useState(false)
  const [footerVisible, setFooterVisible] = useState(false)

  useEffect(() => {
    const sync = () => setVisible(window.scrollY > SHOW_AFTER_PX)
    sync()
    window.addEventListener('scroll', sync, { passive: true })
    return () => window.removeEventListener('scroll', sync)
  }, [])

  // Stand down when the footer is on screen: the button would cover footer
  // links (and the footer nav already serves readers at the bottom).
  useEffect(() => {
    const footer = document.querySelector('.site-footer')
    if (!footer) {
      return
    }
    const observer = new IntersectionObserver(
      ([entry]) => setFooterVisible(entry.isIntersecting),
      { threshold: 0 },
    )
    observer.observe(footer)
    return () => observer.disconnect()
  }, [])

  const scrollTop = () => {
    const reduced = window.matchMedia(
      '(prefers-reduced-motion: reduce)',
    ).matches
    window.scrollTo({ top: 0, behavior: reduced ? 'auto' : 'smooth' })
  }

  if (!visible || footerVisible) {
    return null
  }

  return (
    <button type="button" className="back-to-top" onClick={scrollTop}>
      <span aria-hidden="true">↑ </span>Top
    </button>
  )
}
