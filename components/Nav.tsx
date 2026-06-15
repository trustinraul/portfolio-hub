'use client'

import { useEffect, useState } from 'react'
import { navItems, site } from '@/lib/site'

export function Nav() {
  const [active, setActive] = useState<string>('')
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) setActive(e.target.id)
        })
      },
      { rootMargin: '-45% 0px -45% 0px' },
    )
    navItems.forEach((n) => {
      const el = document.getElementById(n.id)
      if (el) observer.observe(el)
    })
    return () => {
      window.removeEventListener('scroll', onScroll)
      observer.disconnect()
    }
  }, [])

  return (
    <header
      className={`sticky top-0 z-50 transition-colors duration-300 ${scrolled ? 'bg-bg/80 backdrop-blur border-b border-border' : 'bg-transparent'}`}
    >
      <nav className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
        <a href="#top" className="flex items-baseline gap-2">
          <span className="font-display text-lg text-text">raúl calvo</span>
          <span className="font-mono text-[11px] text-accent">// builder</span>
        </a>
        <ul className="hidden gap-6 font-mono text-xs text-text-muted sm:flex">
          {navItems.map((n) => (
            <li key={n.id}>
              <a href={`#${n.id}`} className={`transition-colors hover:text-text ${active === n.id ? 'text-text' : ''}`}>
                {n.label}
              </a>
            </li>
          ))}
        </ul>
        <a href={site.cv} className="font-mono text-xs text-accent sm:hidden">CV</a>
      </nav>
    </header>
  )
}
