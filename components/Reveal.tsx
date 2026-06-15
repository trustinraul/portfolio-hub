'use client'

import { motion, useReducedMotion, type Variants } from 'framer-motion'
import type { ReactNode } from 'react'

type Variant = 'up' | 'lines' | 'clip'

const EASE = [0.16, 1, 0.3, 1] as const

const map: Record<Variant, Variants> = {
  up: { hidden: { opacity: 0, y: 28 }, show: { opacity: 1, y: 0 } },
  lines: { hidden: { opacity: 0, y: 14 }, show: { opacity: 1, y: 0 } },
  clip: {
    hidden: { opacity: 0, clipPath: 'inset(0 0 100% 0)' },
    show: { opacity: 1, clipPath: 'inset(0 0 0% 0)' },
  },
}

export function Reveal({
  children,
  variant = 'up',
  delay = 0,
  className,
}: {
  children: ReactNode
  variant?: Variant
  delay?: number
  className?: string
}) {
  const reduce = useReducedMotion()
  return (
    <motion.div
      className={className}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: '-80px' }}
      variants={map[variant]}
      transition={{ duration: reduce ? 0 : 0.7, delay: reduce ? 0 : delay, ease: EASE }}
    >
      {children}
    </motion.div>
  )
}
