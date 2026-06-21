import { Reveal } from './Reveal'

export function About() {
  return (
    <section id="sobre" className="mx-auto max-w-3xl px-6 py-24 scroll-mt-20 sm:py-32">
      <Reveal variant="lines">
        <p className="font-display text-[clamp(1.5rem,3vw,2.25rem)] leading-snug text-pretty text-text">
          Empecé sabiendo algo de Python y nada de desarrollo web. En dos meses construí
          y desplegué cuatro proyectos, de una landing estática a un SaaS multi-tenant con
          autenticación.
        </p>
        <p className="mt-6 max-w-2xl text-lg leading-relaxed text-pretty text-text-muted">
          No usé plantillas: dirigí cada decisión de producto, diseño y arquitectura, y
          escribí el código con IA como herramienta, no como muleta. Trabajo rápido y
          entrego cosas que funcionan en producción.
        </p>
      </Reveal>
    </section>
  )
}
