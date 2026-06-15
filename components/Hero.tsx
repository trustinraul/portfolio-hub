'use client'

import { motion, useReducedMotion } from 'framer-motion'
import { site } from '@/lib/site'
import { StackMarquee } from './StackMarquee'

const HEADLINE = 'Construyo cosas para internet.'
const EASE = [0.16, 1, 0.3, 1] as const

export function Hero() {
  const reduce = useReducedMotion()
  const words = HEADLINE.split(' ')

  return (
    <section id="top" className="mx-auto max-w-5xl px-6 pt-24 pb-12 sm:pt-32">
      <h1 className="mb-6 max-w-3xl font-display text-[clamp(2.75rem,6vw,5.5rem)] font-medium leading-[1.04] tracking-[-0.02em] text-balance text-text">
        {words.map((w, i) => (
          <span key={i} className="inline-block overflow-hidden align-bottom">
            <motion.span
              className="inline-block"
              initial={reduce ? { opacity: 0 } : { y: '110%' }}
              animate={reduce ? { opacity: 1 } : { y: 0 }}
              transition={{ duration: 0.7, delay: 0.1 + i * 0.06, ease: EASE }}
            >
              {w}&nbsp;
            </motion.span>
          </span>
        ))}
      </h1>

      <motion.p
        className="mb-8 max-w-xl text-lg leading-relaxed text-pretty text-text-muted"
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1 + words.length * 0.06, ease: EASE }}
      >
        Tengo {site.age} años y en dos meses pasé de no saber HTML a desplegar cuatro
        proyectos reales: una landing, una web de reservas, un CRM con login y un SaaS
        multi-tenant.
      </motion.p>

      <motion.div
        className="mb-14 flex flex-wrap items-center gap-5"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.25 + words.length * 0.06 }}
      >
        <a href="#trabajo" className="rounded-md bg-text px-5 py-2.5 text-sm text-bg transition-opacity hover:opacity-90">
          Ver el trabajo
        </a>
        <a href="#contacto" className="font-mono text-sm text-text-muted underline-offset-4 transition-colors hover:text-text hover:underline">
          Escríbeme
        </a>
      </motion.div>

      <StackMarquee />
    </section>
  )
}
