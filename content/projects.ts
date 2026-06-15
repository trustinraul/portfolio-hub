export interface Project {
  slug: string
  name: string
  pitch: string
  tags: string[]
  demoUrl: string
  repoUrl: string
  thumbnail: string
  accent: string
}

export const projects: Project[] = [
  {
    slug: 'kombu',
    name: 'Kōmbu',
    pitch: 'Landing dark-premium para un restaurante japonés de autor en Madrid.',
    tags: ['Next.js', 'Tailwind', 'Framer Motion', 'Resend'],
    demoUrl: 'https://p1-kombu.vercel.app',
    repoUrl: 'https://github.com/trustinraul/p1-kombu',
    thumbnail: '/projects/kombu.png',
    accent: '#c9a84c',
  },
  {
    slug: 'fortuna',
    name: 'Fortuna',
    pitch: 'Estudio de tatuaje con reservas en tiempo real y panel de admin.',
    tags: ['Next.js', 'Supabase', 'Server Actions'],
    demoUrl: 'https://p2-fortuna.vercel.app',
    repoUrl: 'https://github.com/trustinraul/p2-fortuna',
    thumbnail: '/projects/fortuna.png',
    accent: '#e8dfc8',
  },
  {
    slug: 'archon',
    name: 'Archon',
    pitch: 'CRM full-stack para freelancers: clientes, proyectos, tareas y facturas, con auth + RLS.',
    tags: ['Next.js', 'Supabase Auth', 'RLS', 'CRUD'],
    demoUrl: 'https://p3-archon.vercel.app',
    repoUrl: 'https://github.com/trustinraul/p3-archon',
    thumbnail: '/projects/archon.png',
    accent: '#5dcaa5',
  },
  {
    slug: 'ingegno',
    name: 'Ingegno',
    pitch: 'SaaS multi-tenant: un perfil público premium para polymaths y builders.',
    tags: ['Next.js', 'Supabase', 'Multi-tenancy'],
    demoUrl: 'https://p4-ingegno.vercel.app',
    repoUrl: 'https://github.com/trustinraul/p4-ingegno',
    thumbnail: '/projects/ingegno.png',
    accent: '#85b7eb',
  },
]
