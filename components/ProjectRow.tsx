'use client'

import Image from 'next/image'
import { motion, useReducedMotion } from 'framer-motion'
import { useEffect, useRef, useState } from 'react'
import type { Project } from '@/content/projects'

const EASE = [0.16, 1, 0.3, 1] as const

export function ProjectRow({ project, index }: { project: Project; index: number }) {
  const reduce = useReducedMotion()
  const n = String(index + 1).padStart(2, '0')
  const imageRight = index % 2 === 1

  // Reveal driven by a direct getBoundingClientRect check on scroll instead of
  // framer's whileInView. The IntersectionObserver behind whileInView fired
  // unreliably for these rows in stacked/narrow layouts (the project images, the
  // page's protagonist content, shipped blank on mobile). A plain rect check is
  // exact and fires on every viewport. Visibility never stays gated on it: the
  // <noscript> fallback shows everything when JS is off.
  const ref = useRef<HTMLDivElement>(null)
  const [reveal, setReveal] = useState(false)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const check = () => {
      if (el.getBoundingClientRect().top < window.innerHeight * 0.85) {
        setReveal(true)
        window.removeEventListener('scroll', check)
      }
    }
    check()
    window.addEventListener('scroll', check, { passive: true })
    window.addEventListener('resize', check, { passive: true })
    window.addEventListener('orientationchange', check, { passive: true })
    return () => {
      window.removeEventListener('scroll', check)
      window.removeEventListener('resize', check)
      window.removeEventListener('orientationchange', check)
    }
  }, [])

  const hiddenImage = reduce ? { opacity: 0 } : { opacity: 0, clipPath: 'inset(0 0 100% 0)' }
  const shownImage = { opacity: 1, clipPath: 'inset(0 0 0% 0)' }
  const hiddenText = reduce ? { opacity: 0 } : { opacity: 0, y: 24 }
  const shownText = { opacity: 1, y: 0 }

  return (
    <div ref={ref} className="group grid items-center gap-8 md:grid-cols-2 md:gap-14">
      <motion.a
        href={project.demoUrl}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={`Abrir demo de ${project.name}`}
        className={`relative block aspect-video overflow-hidden rounded-lg bg-surface ${imageRight ? 'md:order-2' : ''}`}
        initial={hiddenImage}
        animate={reveal ? shownImage : hiddenImage}
        transition={{ duration: reduce ? 0 : 0.8, ease: EASE }}
      >
        <Image
          src={project.thumbnail}
          alt={`Captura de ${project.name}`}
          fill
          sizes="(max-width: 768px) 100vw, 50vw"
          priority={index === 0}
          className="object-cover transition-transform duration-700 group-hover:scale-[1.04]"
        />
      </motion.a>

      <motion.div
        className={imageRight ? 'md:order-1' : ''}
        initial={hiddenText}
        animate={reveal ? shownText : hiddenText}
        transition={{ duration: reduce ? 0 : 0.7, delay: reduce ? 0 : 0.12, ease: EASE }}
      >
        <span className="block font-mono text-[clamp(3rem,8vw,6.5rem)] font-medium leading-none text-accent/40 transition-colors group-hover:text-accent">
          {n}
        </span>
        <h3 className="mt-2 font-display text-4xl tracking-[-0.01em] text-text sm:text-5xl">{project.name}</h3>
        <p className="mt-2 font-mono text-xs text-text-muted">Construido en {project.duration}</p>
        <p className="mt-4 max-w-md text-base leading-relaxed text-pretty text-text-muted">{project.pitch}</p>
        <div className="mt-5 flex flex-wrap gap-2">
          {project.tags.map((t) => (
            <span key={t} className="rounded border border-border px-2 py-0.5 font-mono text-[11px] text-text-faint">
              {t}
            </span>
          ))}
        </div>
        <div className="mt-6 flex gap-6 font-mono text-sm">
          <a href={project.demoUrl} target="_blank" rel="noopener noreferrer" className="text-accent underline-offset-4 hover:underline">demo <span aria-hidden="true">↗</span></a>
          <a href={project.repoUrl} target="_blank" rel="noopener noreferrer" className="text-text-muted underline-offset-4 hover:text-text hover:underline">código <span aria-hidden="true">↗</span></a>
        </div>
      </motion.div>
    </div>
  )
}
