import { site } from '@/lib/site'

export function Footer() {
  return (
    <footer className="border-t border-border">
      <div className="mx-auto flex max-w-5xl flex-col gap-2 px-6 py-8 font-mono text-xs text-text-faint sm:flex-row sm:items-center sm:justify-between">
        <span>{site.name} · © 2026</span>
        <span>Hecho con Next.js + Tailwind</span>
      </div>
    </footer>
  )
}
