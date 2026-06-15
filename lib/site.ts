const FALLBACK_URL = 'https://raulcalvo.vercel.app'

// Falls back if NEXT_PUBLIC_SITE_URL is absent OR malformed, so a bad env var
// never throws when it reaches `new URL(site.url)` in the layout metadata.
function resolveSiteUrl(): string {
  const raw = process.env.NEXT_PUBLIC_SITE_URL
  if (!raw) return FALLBACK_URL
  try {
    return new URL(raw).origin
  } catch {
    return FALLBACK_URL
  }
}

export const site = {
  name: 'Raúl Calvo',
  tagline: 'Web developer & builder',
  url: resolveSiteUrl(),
  email: 'rcalvosanz@gmail.com',
  github: 'https://github.com/trustinraul',
  githubHandle: 'trustinraul',
  linkedin: 'https://www.linkedin.com/in/raul-calvo-sanz-678993416/',
  cvEs: '/cv-raul-calvo-es.pdf',
  cvEn: '/cv-raul-calvo-en.pdf',
  location: 'Valladolid',
  age: 18,
} as const

export const navItems = [
  { id: 'sobre', label: 'sobre' },
  { id: 'trabajo', label: 'trabajo' },
  { id: 'contacto', label: 'contacto' },
] as const

export const techStack = [
  'Next.js', 'React', 'TypeScript', 'Tailwind', 'Supabase', 'Vercel', 'Framer Motion', 'Git',
] as const
