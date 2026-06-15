export const site = {
  name: 'Raúl Calvo',
  tagline: 'Web developer & builder',
  url: process.env.NEXT_PUBLIC_SITE_URL ?? 'https://raulcalvo.vercel.app',
  email: 'rcalvosanz@gmail.com',
  github: 'https://github.com/trustinraul',
  githubHandle: 'trustinraul',
  linkedin: 'https://www.linkedin.com/in/raul-calvo-sanz-678993416/',
  cv: '/cv-raul-calvo.pdf',
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
