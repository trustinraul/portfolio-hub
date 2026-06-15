'use client'

import { techStack } from '@/lib/site'

export function StackMarquee() {
  const items = [...techStack, ...techStack]
  return (
    <div className="relative overflow-hidden border-y border-border py-3">
      <div className="flex w-max animate-[marquee_28s_linear_infinite] gap-6 font-mono text-xs text-text-faint">
        {items.map((t, i) => (
          <span key={i} className="flex items-center gap-6 whitespace-nowrap">
            {t} <span className="text-accent">✦</span>
          </span>
        ))}
      </div>
      <style jsx>{`
        @keyframes marquee {
          from { transform: translateX(0); }
          to { transform: translateX(-50%); }
        }
      `}</style>
    </div>
  )
}
