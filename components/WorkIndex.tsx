import { projects } from '@/content/projects'
import { ProjectRow } from './ProjectRow'

export function WorkIndex() {
  return (
    <section id="trabajo" className="mx-auto max-w-5xl px-6 py-20">
      <div className="space-y-28 sm:space-y-40">
        {projects.map((p, i) => (
          <div key={p.slug} className={i % 2 === 1 ? 'md:translate-y-6' : ''}>
            <ProjectRow project={p} index={i} />
          </div>
        ))}
      </div>
    </section>
  )
}
