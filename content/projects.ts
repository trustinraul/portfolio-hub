export interface Project {
  slug: string
  name: string
  pitch: string
  tags: string[]
  demoUrl: string
  repoUrl?: string
  thumbnail: string
  duration?: string
  isRealClient?: boolean
  liveLabel?: string
  testimonial?: { quote: string; author: string }
  metric?: { value: string; label: string }
}

export const projects: Project[] = [
  {
    slug: 'dilara',
    name: 'Dilara',
    pitch:
      'Web en producción para un salón de belleza en Valladolid. Cliente real de pago: one-pager rápido con captación de citas por WhatsApp, GA4 y SEO local.',
    tags: ['Next.js', 'Tailwind v4', 'GA4', 'SEO local'],
    demoUrl: 'https://dilarasalondebelleza.es',
    thumbnail: '/projects/dilara.png',
    isRealClient: true,
    liveLabel: 'Cliente real · En producción',
    // TODO: rellenar cuando Dilara apruebe la cita
    // testimonial: { quote: 'PLACEHOLDER_FRASE_DE_DILARA', author: 'Dilara — Salón de Belleza' },
    // TODO: rellenar con dato real y estable de GA4 (p. ej. clics WhatsApp/mes)
    // metric: { value: 'PLACEHOLDER_NUMERO', label: 'PLACEHOLDER_QUE_MIDE' },
  },
  {
    slug: 'fortuna',
    name: 'Fortuna',
    pitch: 'Estudio de tatuaje con reservas en tiempo real y panel de admin.',
    tags: ['Next.js', 'Supabase', 'Server Actions'],
    demoUrl: 'https://p2-fortuna.vercel.app',
    repoUrl: 'https://github.com/trustinraul/p2-fortuna',
    thumbnail: '/projects/fortuna.png',
    duration: '7 días',
  },
  {
    slug: 'archon',
    name: 'Archon',
    pitch: 'CRM full-stack para freelancers: clientes, proyectos, tareas y facturas, con auth + RLS.',
    tags: ['Next.js', 'Supabase Auth', 'RLS', 'CRUD'],
    demoUrl: 'https://p3-archon.vercel.app',
    repoUrl: 'https://github.com/trustinraul/p3-archon',
    thumbnail: '/projects/archon.png',
    duration: '10 días',
  },
  {
    slug: 'ingegno',
    name: 'Ingegno',
    pitch: 'SaaS multi-tenant: un perfil público premium para polymaths y builders.',
    tags: ['Next.js', 'Supabase', 'Multi-tenancy'],
    demoUrl: 'https://p4-ingegno.vercel.app',
    repoUrl: 'https://github.com/trustinraul/p4-ingegno',
    thumbnail: '/projects/ingegno.png',
    duration: '3-4 semanas',
  },
  {
    slug: 'kombu',
    name: 'Kōmbu',
    pitch: 'Landing dark-premium para un restaurante japonés de autor en Madrid.',
    tags: ['Next.js', 'Tailwind', 'Framer Motion', 'Resend'],
    demoUrl: 'https://p1-kombu.vercel.app',
    repoUrl: 'https://github.com/trustinraul/p1-kombu',
    thumbnail: '/projects/kombu.png',
    duration: '4-5 días',
  },
]
