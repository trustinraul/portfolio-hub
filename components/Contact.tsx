import { site } from '@/lib/site'
import { Reveal } from './Reveal'

export function Contact() {
  return (
    <section id="contacto" className="mx-auto max-w-5xl px-6 py-28 sm:py-36">
      <Reveal variant="lines">
        <h2 className="mb-6 font-display text-[clamp(2.25rem,5vw,4rem)] tracking-[-0.02em] text-balance text-text">
          ¿Tienes algo en mente?
        </h2>
        <p className="mb-9 max-w-md text-lg leading-relaxed text-pretty text-text-muted">
          Hago webs y productos para negocios y founders. Lo más rápido es un email.
        </p>
        <div className="flex flex-wrap items-center gap-5 font-mono text-sm">
          <a href={`mailto:${site.email}`} className="rounded-md bg-text px-5 py-2.5 text-bg transition-opacity hover:opacity-90">
            {site.email}
          </a>
          <a href={site.github} target="_blank" rel="noopener noreferrer" className="text-text-muted underline-offset-4 hover:text-text hover:underline">GitHub ↗</a>
          <a href={site.linkedin} target="_blank" rel="noopener noreferrer" className="text-text-muted underline-offset-4 hover:text-text hover:underline">LinkedIn ↗</a>
          <a href={site.cv} className="text-accent underline-offset-4 hover:underline">Descargar CV ↓</a>
        </div>
      </Reveal>
    </section>
  )
}
