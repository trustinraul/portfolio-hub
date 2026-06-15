# P5 — Portfolio Hub Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build the static one-page portfolio hub (`raulcalvo.vercel.app`) that frames the 4 deployed projects, tells Raúl's story, and centralizes contact.

**Architecture:** Next.js 16 App Router, 100% static (SSG), no Supabase. Sections are Server Components; interactivity (sticky nav scroll-spy, varied scroll reveals, stack marquee, editorial work index) is isolated into small `"use client"` components. Project data lives as typed data in `content/projects.ts` and is rendered in a loop, so adding a future project is an array edit. Visual identity inherits from Ingegno (dark, EB Garamond + Barlow, warm gold accent), hardened against AI-slop per the design system.

> ⚠️ **DESIGN GOVERNANCE.** The committed visual system, copy, motion and project layout live in `docs/superpowers/specs/2026-06-15-p5-hub-design-system.md` (DESIGN.md). It is the result of the impeccable audit and **supersedes any conflicting code below**. Key deltas already folded into the tasks: no per-section `//` eyebrow (the motif lives once, in the nav); no metric-tile row (numbers go in the About prose); the projects section is an **asymmetric editorial index** (`WorkIndex`/`ProjectRow`), not a 2×2 card grid; motion is **varied**, not one cloned `Reveal`; copy is rewritten. Build from the task code as written here — it already reflects DESIGN.md.

**Tech Stack:** Next.js 16.2.4, React 19, TypeScript 5, Tailwind CSS v4 (`@theme`), Framer Motion v12, `next/font/google`, Jest + ts-jest (node env, for data tests).

**Testing philosophy:** Jest here runs in `testEnvironment: 'node'` (matching P1–P4), so it tests *logic and data integrity* — not JSX rendering. The one meaningful unit test is the projects-data validation (Task 4). Everything visual is verified with `next build`, `eslint`, and Playwright screenshots at 375px and 1280px (Task 15). Do not force render-tests onto presentational components — that's not how this codebase tests.

**Environment notes (from workspace):**
- The sandbox has no GitHub credentials. `git commit` works locally; **pushing, creating the GitHub repo, and connecting Vercel are Raúl's manual steps** (Task 16).
- This is a brand-new project; it becomes its own git repo at `Portfolio/P5 - Hub/`.
- Work in the sandbox path `/sessions/.../mnt/Webdev/Portfolio/P5 - Hub/`; the user sees it at `C:\Users\rcalv\OneDrive\Documentos\Claude\Projects\Webdev\Portfolio\P5 - Hub\`.

---

## File structure

```
Portfolio/P5 - Hub/
├── CLAUDE.md                  # operational context (mirrors P1's)
├── README.md                  # English, written last
├── package.json · tsconfig.json · next.config.ts · postcss.config.mjs · eslint.config.mjs
├── jest.config.ts             # node env, testMatch __tests__/**/*.test.ts
├── app/
│   ├── layout.tsx             # fonts + metadata + openGraph/twitter
│   ├── page.tsx               # composes all sections
│   ├── globals.css            # @theme tokens, grain, base styles
│   └── opengraph-image.tsx    # OG PNG via ImageResponse
├── components/
│   ├── Reveal.tsx             # "use client" — Framer Motion reveal, variant-driven
│   ├── Nav.tsx                # "use client" — sticky + scroll-spy
│   ├── Hero.tsx               # "use client" — choreographed word reveal
│   ├── StackMarquee.tsx       # "use client" — infinite marquee
│   ├── About.tsx              # prose, numbers inline (no metric tiles)
│   ├── WorkIndex.tsx          # "use client" — asymmetric editorial index
│   ├── ProjectRow.tsx         # one full-width row, alternating alignment
│   ├── Contact.tsx
│   └── Footer.tsx
├── content/
│   └── projects.ts            # Project[] data + interface
├── lib/
│   └── site.ts                # name, urls, socials, nav, stack list, metrics
├── __tests__/
│   └── projects.test.ts       # data integrity test
└── public/
    ├── projects/{kombu,fortuna,archon,ingegno}.png
    └── cv-raul-calvo.pdf       # placeholder until Raúl provides the real one
```

Responsibilities: `lib/site.ts` is the single source of truth for identity/links (DRY — consumed by Nav, Hero, Contact, Footer, metadata). `content/projects.ts` owns the project list. Each component renders one section and nothing else.

---

### Task 1: Scaffold project

**Files:**
- Create: entire `Portfolio/P5 - Hub/` tree

- [ ] **Step 1: Scaffold with create-next-app**

The folder `Portfolio/P5 - Hub/` already exists with `CLAUDE.md`, `docs/` (spec.md, plan.md, DESIGN.md) and `_resources/`. `create-next-app` refuses a non-empty target, so scaffold into a temp dir and merge:
```bash
cd "Portfolio"
npx create-next-app@latest "_p5-scaffold" --typescript --tailwind --eslint --app --no-src-dir --import-alias "@/*" --use-npm
rm -rf "_p5-scaffold/.git"            # git is managed in "P5 - Hub"
cp -rn "_p5-scaffold/." "P5 - Hub/"   # merge generated app; -n preserves existing docs/CLAUDE.md
rm -rf "_p5-scaffold"
cd "P5 - Hub"
```
Accept defaults for Turbopack if prompted. Expected: the Next.js 16 app files now sit alongside the existing `CLAUDE.md`, `docs/` and `_resources/` in `Portfolio/P5 - Hub/`.

- [ ] **Step 2: Add Framer Motion + Jest toolchain**

Run:
```bash
cd "Portfolio/P5 - Hub"
npm install framer-motion@^12
npm install -D jest@^30 ts-jest@^29 @types/jest@^30 jest-environment-node@^30
```
Expected: installs without peer-dep errors.

- [ ] **Step 3: Add the `test` script + jest config**

Edit `package.json` `scripts` to include:
```json
"test": "jest"
```

Create `jest.config.ts`:
```ts
import type { Config } from 'jest'

const config: Config = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/$1',
  },
  testMatch: ['**/__tests__/**/*.test.ts'],
}

export default config
```

- [ ] **Step 4: Clean scaffolding cruft**

Run:
```bash
rm -f public/next.svg public/vercel.svg public/globe.svg public/window.svg public/file.svg
```
Replace `app/page.tsx` body with a temporary `export default function Home() { return <main /> }` so the build stays green until Task 12.

- [ ] **Step 5: Init git + first commit**

Run:
```bash
git init
git add -A
git commit -m "chore: scaffold portfolio hub with next, tailwind v4, framer-motion, jest"
```
Expected: clean commit. (No push — Raúl does that in Task 16.)

---

### Task 2: Design tokens, fonts, base styles

**Files:**
- Modify: `app/globals.css`
- Modify: `app/layout.tsx` (fonts only; metadata in Task 12)

- [ ] **Step 1: Write `app/globals.css`**

```css
@import "tailwindcss";

@theme {
  --color-bg: #080808;
  --color-surface: #111110;
  --color-surface-2: #0a0a0a;
  --color-border: rgba(255, 255, 255, 0.07);
  --color-text: #f2ede3;
  --color-text-muted: #a8a296;
  --color-text-faint: #6f6a60;
  --color-accent: #c8a35b;
}

@theme inline {
  --font-display: var(--font-eb-garamond);
  --font-body: var(--font-barlow);
  --font-mono: var(--font-jetbrains-mono);
}

@layer base {
  html {
    scroll-behavior: smooth;
  }
  body {
    background-color: var(--color-bg);
    color: var(--color-text);
    font-family: var(--font-body), system-ui, sans-serif;
    background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.025'/%3E%3C/svg%3E");
    background-size: 200px 200px;
  }
  ::selection {
    background-color: var(--color-accent);
    color: var(--color-bg);
  }
  @media (prefers-reduced-motion: reduce) {
    * { animation: none !important; transition: none !important; }
  }
}
```

- [ ] **Step 2: Wire fonts in `app/layout.tsx`**

```tsx
import type { Metadata } from 'next'
import { EB_Garamond, Barlow, JetBrains_Mono } from 'next/font/google'
import './globals.css'

const ebGaramond = EB_Garamond({ subsets: ['latin'], variable: '--font-eb-garamond', display: 'swap' })
const barlow = Barlow({ subsets: ['latin'], weight: ['400', '500', '600'], variable: '--font-barlow', display: 'swap' })
const jetbrainsMono = JetBrains_Mono({ subsets: ['latin'], variable: '--font-jetbrains-mono', display: 'swap' })

export const metadata: Metadata = { title: 'Raúl Calvo', description: 'Web developer & builder.' }

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" className={`${ebGaramond.variable} ${barlow.variable} ${jetbrainsMono.variable}`}>
      <body>{children}</body>
    </html>
  )
}
```

- [ ] **Step 3: Verify build + commit**

Run: `npm run build`
Expected: build succeeds.
```bash
git add app/globals.css app/layout.tsx
git commit -m "style: add ingegno-inspired tokens, fonts, grain"
```

---

### Task 3: Site config

**Files:**
- Create: `lib/site.ts`

- [ ] **Step 1: Write `lib/site.ts`**

```ts
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
```

The `//` motif appears only on the nav wordmark tag (`// builder`), not as a per-section eyebrow, and not in the link labels. No `metrics` export — the numbers live in the About prose (Task 8), per DESIGN.md.

- [ ] **Step 2: Commit**

```bash
git add lib/site.ts
git commit -m "feat: add site config (identity, links, nav, stack)"
```

---

### Task 4: Projects data (TDD)

**Files:**
- Create: `content/projects.ts`
- Test: `__tests__/projects.test.ts`

- [ ] **Step 1: Write the failing test**

`__tests__/projects.test.ts`:
```ts
import { projects } from '@/content/projects'

describe('projects data', () => {
  it('has exactly 4 projects', () => {
    expect(projects).toHaveLength(4)
  })

  it('has unique slugs', () => {
    const slugs = projects.map((p) => p.slug)
    expect(new Set(slugs).size).toBe(4)
  })

  it('every project has https demo and repo urls', () => {
    for (const p of projects) {
      expect(p.demoUrl).toMatch(/^https:\/\//)
      expect(p.repoUrl).toMatch(/^https:\/\/github\.com\//)
    }
  })

  it('every project has a local thumbnail, a pitch and at least one tag', () => {
    for (const p of projects) {
      expect(p.thumbnail.startsWith('/')).toBe(true)
      expect(p.pitch.length).toBeGreaterThan(10)
      expect(p.tags.length).toBeGreaterThan(0)
    }
  })
})
```

- [ ] **Step 2: Run the test, verify it fails**

Run: `npm test`
Expected: FAIL — `Cannot find module '@/content/projects'`.

- [ ] **Step 3: Write `content/projects.ts`**

```ts
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
```

- [ ] **Step 4: Run the test, verify it passes**

Run: `npm test`
Expected: PASS — 4 tests green.

- [ ] **Step 5: Commit**

```bash
git add content/projects.ts __tests__/projects.test.ts
git commit -m "feat: add projects data with integrity test"
```

---

### Task 5: Motion primitives (variant-driven, not one cloned reveal)

**Files:**
- Create: `components/Reveal.tsx`

Per DESIGN.md, motion is varied: a `variant` prop selects a different entrance per context, and reduced-motion collapses everything to a crossfade. Hero and `ProjectRow` add their own choreography on top of this primitive (word stagger, clip-path), so the page never reads as one identical fade-up.

- [ ] **Step 1: Write `components/Reveal.tsx`**

```tsx
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
  const variants: Variants = reduce
    ? { hidden: { opacity: 0 }, show: { opacity: 1 } }
    : map[variant]
  return (
    <motion.div
      className={className}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: '-80px' }}
      variants={variants}
      transition={{ duration: 0.7, delay, ease: EASE }}
    >
      {children}
    </motion.div>
  )
}
```

- [ ] **Step 2: Commit**

```bash
git add components/Reveal.tsx
git commit -m "feat: add variant-driven reveal primitive with reduced-motion"
```

---

### Task 6: Nav (sticky + scroll-spy)

**Files:**
- Create: `components/Nav.tsx`

- [ ] **Step 1: Write `components/Nav.tsx`**

```tsx
'use client'

import { useEffect, useState } from 'react'
import { navItems, site } from '@/lib/site'

export function Nav() {
  const [active, setActive] = useState<string>('')
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) setActive(e.target.id)
        })
      },
      { rootMargin: '-45% 0px -45% 0px' },
    )
    navItems.forEach((n) => {
      const el = document.getElementById(n.id)
      if (el) observer.observe(el)
    })
    return () => {
      window.removeEventListener('scroll', onScroll)
      observer.disconnect()
    }
  }, [])

  return (
    <header
      className={`sticky top-0 z-50 transition-colors duration-300 ${scrolled ? 'bg-bg/80 backdrop-blur border-b border-border' : 'bg-transparent'}`}
    >
      <nav className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
        <a href="#top" className="flex items-baseline gap-2">
          <span className="font-display text-lg text-text">raúl calvo</span>
          <span className="font-mono text-[11px] text-accent">// builder</span>
        </a>
        <ul className="hidden gap-6 font-mono text-xs text-text-muted sm:flex">
          {navItems.map((n) => (
            <li key={n.id}>
              <a href={`#${n.id}`} className={`transition-colors hover:text-text ${active === n.id ? 'text-text' : ''}`}>
                {n.label}
              </a>
            </li>
          ))}
        </ul>
        <a href={site.cv} className="font-mono text-xs text-accent sm:hidden">CV</a>
      </nav>
    </header>
  )
}
```

Note: Tailwind v4 exposes `@theme` colors as utilities (`text-accent`, `bg-bg`, `border-border`, `text-text-muted`). The `bg-bg/80` opacity modifier works on the custom color.

- [ ] **Step 2: Verify build + commit**

Run: `npm run build`
Expected: succeeds (component not yet mounted, but must type-check). If unused-import lint fails, that's fine until Task 12 — only fix type errors here.
```bash
git add components/Nav.tsx
git commit -m "feat: add sticky nav with scroll-spy"
```

---

### Task 7: Hero + StackMarquee

**Files:**
- Create: `components/StackMarquee.tsx`
- Create: `components/Hero.tsx`

- [ ] **Step 1: Write `components/StackMarquee.tsx`**

```tsx
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
```

- [ ] **Step 2: Write `components/Hero.tsx`**

Choreographed first-load: the headline reveals word by word behind a mask (the "go big" moment), subtitle and CTA follow, then the marquee. Copy is the rewritten DESIGN.md version. Reduced-motion users get a plain crossfade (the words are visible by default; motion only enhances).

```tsx
'use client'

import { motion, useReducedMotion } from 'framer-motion'
import { site } from '@/lib/site'
import { StackMarquee } from './StackMarquee'

const HEADLINE = 'Construyo cosas para internet.'
const EASE = [0.16, 1, 0.3, 1] as const

export function Hero() {
  const reduce = useReducedMotion()
  const words = HEADLINE.split(' ')

  return (
    <section id="top" className="mx-auto max-w-5xl px-6 pt-24 pb-12 sm:pt-32">
      <h1 className="mb-6 max-w-3xl font-display text-[clamp(2.75rem,6vw,5.5rem)] font-medium leading-[1.04] tracking-[-0.02em] text-balance text-text">
        {words.map((w, i) => (
          <span key={i} className="inline-block overflow-hidden align-bottom">
            <motion.span
              className="inline-block"
              initial={reduce ? { opacity: 0 } : { y: '110%' }}
              animate={reduce ? { opacity: 1 } : { y: 0 }}
              transition={{ duration: 0.7, delay: 0.1 + i * 0.06, ease: EASE }}
            >
              {w}&nbsp;
            </motion.span>
          </span>
        ))}
      </h1>

      <motion.p
        className="mb-8 max-w-xl text-lg leading-relaxed text-pretty text-text-muted"
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1 + words.length * 0.06, ease: EASE }}
      >
        Tengo {site.age} años y en dos meses pasé de no saber HTML a desplegar cuatro
        proyectos reales: una landing, una web de reservas, un CRM con login y un SaaS
        multi-tenant.
      </motion.p>

      <motion.div
        className="mb-14 flex flex-wrap items-center gap-5"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.25 + words.length * 0.06 }}
      >
        <a href="#trabajo" className="rounded-md bg-text px-5 py-2.5 text-sm text-bg transition-opacity hover:opacity-90">
          Ver el trabajo
        </a>
        <a href="#contacto" className="font-mono text-sm text-text-muted underline-offset-4 transition-colors hover:text-text hover:underline">
          Escríbeme
        </a>
      </motion.div>

      <StackMarquee />
    </section>
  )
}
```

- [ ] **Step 3: Verify build + commit**

Run: `npm run build`
Expected: succeeds.
```bash
git add components/Hero.tsx components/StackMarquee.tsx
git commit -m "feat: add hero and stack marquee"
```

---

### Task 8: About (prose, numbers inline — no metric tiles)

**Files:**
- Create: `components/About.tsx`

No `Metrics` component, no 3-up stat tiles (killed per DESIGN.md). The numbers (four projects, two months, from zero) live inside the prose. Copy is the rewritten DESIGN.md version: no em dashes, no aphoristic "serious + short rebuttal" cadence. Reveal uses the `lines` variant so it reads differently from the hero.

- [ ] **Step 1: Write `components/About.tsx`**

```tsx
import { Reveal } from './Reveal'

export function About() {
  return (
    <section id="sobre" className="mx-auto max-w-3xl px-6 py-24 sm:py-32">
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
```

- [ ] **Step 2: Verify build + commit**

Run: `npm run build`
Expected: succeeds.
```bash
git add components/About.tsx
git commit -m "feat: add about section with prose, no metric tiles"
```

---

### Task 9: ~~Stack section~~ — REMOVED

Cut per DESIGN.md. A standalone grid of identical tech chips is exactly the "identical card grid" slop tell, and it duplicates the stack that already runs in the hero marquee (`StackMarquee`, Task 7). No `Stack.tsx`, no `// stack` section, no `stack` nav item. Skip to Task 10.

---

### Task 10: WorkIndex + ProjectRow (asymmetric editorial index)

**Files:**
- Create: `components/ProjectRow.tsx`
- Create: `components/WorkIndex.tsx`

Replaces the 2×2 card grid. Each project is a full-width row: a large index numeral (`01`–`04`, the real P1→P4 sequence, so the number carries narrative), a big screenshot as the hero element, name, pitch, tags, and `demo`/`código` links. Alignment alternates row to row; on mobile it stacks image-first. Motion: the image reveals with a `clip-path` wipe, the text slides up just after (staggered, not the cloned hero fade).

- [ ] **Step 1: Write `components/ProjectRow.tsx`**

```tsx
'use client'

import Image from 'next/image'
import { motion, useReducedMotion } from 'framer-motion'
import type { Project } from '@/content/projects'

const EASE = [0.16, 1, 0.3, 1] as const

export function ProjectRow({ project, index }: { project: Project; index: number }) {
  const reduce = useReducedMotion()
  const n = String(index + 1).padStart(2, '0')
  const imageRight = index % 2 === 1

  return (
    <div className="grid items-center gap-8 md:grid-cols-2 md:gap-14">
      <motion.a
        href={project.demoUrl}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={`Abrir demo de ${project.name}`}
        className={`group relative block aspect-[16/10] overflow-hidden rounded-lg bg-surface ${imageRight ? 'md:order-2' : ''}`}
        initial={reduce ? { opacity: 0 } : { opacity: 0, clipPath: 'inset(0 0 100% 0)' }}
        whileInView={reduce ? { opacity: 1 } : { opacity: 1, clipPath: 'inset(0 0 0% 0)' }}
        viewport={{ once: true, margin: '-80px' }}
        transition={{ duration: 0.8, ease: EASE }}
      >
        <Image
          src={project.thumbnail}
          alt={`Captura de ${project.name}`}
          fill
          sizes="(max-width: 768px) 100vw, 50vw"
          className="object-cover transition-transform duration-700 group-hover:scale-[1.04]"
        />
      </motion.a>

      <motion.div
        className={imageRight ? 'md:order-1' : ''}
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-80px' }}
        transition={{ duration: 0.7, delay: 0.12, ease: EASE }}
      >
        <span className="block font-mono text-[clamp(3rem,8vw,6.5rem)] font-medium leading-none text-accent/30 transition-colors group-hover:text-accent">
          {n}
        </span>
        <h3 className="mt-2 font-display text-4xl tracking-[-0.01em] text-text sm:text-5xl">{project.name}</h3>
        <p className="mt-4 max-w-md text-base leading-relaxed text-pretty text-text-muted">{project.pitch}</p>
        <div className="mt-5 flex flex-wrap gap-2">
          {project.tags.map((t) => (
            <span key={t} className="rounded border border-border px-2 py-0.5 font-mono text-[11px] text-text-faint">
              {t}
            </span>
          ))}
        </div>
        <div className="mt-6 flex gap-6 font-mono text-sm">
          <a href={project.demoUrl} target="_blank" rel="noopener noreferrer" className="text-accent underline-offset-4 hover:underline">demo ↗</a>
          <a href={project.repoUrl} target="_blank" rel="noopener noreferrer" className="text-text-muted underline-offset-4 hover:text-text hover:underline">código ↗</a>
        </div>
      </motion.div>
    </div>
  )
}
```

- [ ] **Step 2: Write `components/WorkIndex.tsx`**

Varied vertical rhythm (not a uniform gap): alternate rows get extra top spacing on desktop so the index breathes asymmetrically.

```tsx
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
```

- [ ] **Step 3: Verify build + commit**

Run: `npm run build`
Expected: succeeds (thumbnails resolve at runtime; placeholders added in Task 14).
```bash
git add components/ProjectRow.tsx components/WorkIndex.tsx
git commit -m "feat: add asymmetric editorial work index"
```

---

### Task 11: Contact + Footer

**Files:**
- Create: `components/Contact.tsx`
- Create: `components/Footer.tsx`

- [ ] **Step 1: Write `components/Contact.tsx`**

```tsx
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
```

- [ ] **Step 2: Write `components/Footer.tsx`**

```tsx
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
```

- [ ] **Step 3: Verify build + commit**

Run: `npm run build`
Expected: succeeds.
```bash
git add components/Contact.tsx components/Footer.tsx
git commit -m "feat: add contact and footer"
```

---

### Task 12: Assemble page + layout metadata

**Files:**
- Modify: `app/page.tsx`
- Modify: `app/layout.tsx`

- [ ] **Step 1: Write `app/page.tsx`**

```tsx
import { Nav } from '@/components/Nav'
import { Hero } from '@/components/Hero'
import { About } from '@/components/About'
import { WorkIndex } from '@/components/WorkIndex'
import { Contact } from '@/components/Contact'
import { Footer } from '@/components/Footer'

export default function Home() {
  return (
    <>
      <Nav />
      <main>
        <Hero />
        <About />
        <WorkIndex />
        <Contact />
      </main>
      <Footer />
    </>
  )
}
```

- [ ] **Step 2: Add full metadata + openGraph to `app/layout.tsx`**

Replace the `metadata` export from Task 2 with:
```tsx
import { site } from '@/lib/site'

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: `${site.name} — Web developer & builder`,
  description:
    'Portfolio de Raúl Calvo: cuatro proyectos web en producción, de landing estática a SaaS multi-tenant. Next.js, React, Supabase.',
  openGraph: {
    title: `${site.name} — Web developer & builder`,
    description: 'Cuatro proyectos web en producción. Next.js, React, Supabase.',
    url: site.url,
    siteName: site.name,
    locale: 'es_ES',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: `${site.name} — Web developer & builder`,
    description: 'Cuatro proyectos web en producción.',
  },
}
```

- [ ] **Step 3: Build + lint**

Run: `npm run build && npm run lint`
Expected: build succeeds, lint clean (no unused imports now that everything is wired).
```bash
git add app/page.tsx app/layout.tsx
git commit -m "feat: assemble hub page and add metadata/openGraph"
```

---

### Task 13: OG image

**Files:**
- Create: `app/opengraph-image.tsx`

- [ ] **Step 1: Write `app/opengraph-image.tsx`**

```tsx
import { ImageResponse } from 'next/og'
import { site } from '@/lib/site'

export const runtime = 'edge'
export const alt = 'Raúl Calvo — Web developer & builder'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default function Og() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%', height: '100%', display: 'flex', flexDirection: 'column',
          justifyContent: 'center', padding: 80, backgroundColor: '#080808', color: '#f2ede3',
          fontFamily: 'serif',
        }}
      >
        <div style={{ fontSize: 28, color: '#c8a35b', letterSpacing: 2 }}>// builder · {site.location.toLowerCase()}</div>
        <div style={{ fontSize: 88, marginTop: 24, lineHeight: 1.05 }}>Construyo cosas<br />para internet.</div>
        <div style={{ fontSize: 30, marginTop: 32, color: '#a8a296' }}>{site.name} · 4 proyectos en producción</div>
      </div>
    ),
    size,
  )
}
```

- [ ] **Step 2: Build + verify OG route + commit**

Run: `npm run build`
Expected: succeeds; `/opengraph-image` is generated. (Live 200 check happens after deploy in Task 16.)
```bash
git add app/opengraph-image.tsx
git commit -m "feat: add opengraph image"
```

---

### Task 14: Static assets (thumbnails + CV placeholder)

**Files:**
- Create: `public/projects/{kombu,fortuna,archon,ingegno}.png`
- Create: `public/cv-raul-calvo.pdf`

- [ ] **Step 1: Capture project thumbnails**

Use the Playwright skill to screenshot each live demo at 1280×720 and save as the four PNGs. Commands (one per project), run after `npx playwright install chromium`:
```bash
node -e "const{chromium}=require('playwright');(async()=>{const b=await chromium.launch();const p=await b.newPage({viewport:{width:1280,height:720}});for(const[u,f] of [['https://p1-kombu.vercel.app','public/projects/kombu.png'],['https://p2-fortuna.vercel.app','public/projects/fortuna.png'],['https://p3-archon.vercel.app','public/projects/archon.png'],['https://p4-ingegno.vercel.app','public/projects/ingegno.png']]){await p.goto(u,{waitUntil:'networkidle'});await p.waitForTimeout(1500);await p.screenshot({path:f});}await b.close();})()"
```
Expected: four PNGs in `public/projects/`. (Fallback if a site needs auth/redirects: reuse that project's existing `/opengraph-image` PNG instead.)

- [ ] **Step 2: Add a CV placeholder**

Until Raúl provides the real CV, generate a minimal valid one-page PDF placeholder so the download link works:
```bash
node -e "require('fs').writeFileSync('public/cv-raul-calvo.pdf', Buffer.from('%PDF-1.4\n1 0 obj<</Type/Catalog/Pages 2 0 R>>endobj\n2 0 obj<</Type/Pages/Kids[3 0 R]/Count 1>>endobj\n3 0 obj<</Type/Page/Parent 2 0 R/MediaBox[0 0 595 842]>>endobj\nxref\n0 4\n0000000000 65535 f \n0000000009 00000 n \n0000000052 00000 n \n0000000101 00000 n \ntrailer<</Size 4/Root 1 0 R>>\nstartxref\n164\n%%EOF'))"
```
Note in README/CLAUDE.md that this is a placeholder to be replaced.

- [ ] **Step 3: Build + commit**

Run: `npm run build`
Expected: project images resolve, no missing-asset runtime errors.
```bash
git add public/projects public/cv-raul-calvo.pdf
git commit -m "feat: add project thumbnails and cv placeholder"
```

---

### Task 15: Verification pass

**Files:** none (verification only)

- [ ] **Step 1: Full check**

Run: `npm run lint && npm test && npm run build`
Expected: lint clean, 4 data tests pass, build succeeds.

- [ ] **Step 2: Visual verification with Playwright**

Start the production server and screenshot at mobile + desktop:
```bash
npm run build && npm run start &
sleep 4
node -e "const{chromium}=require('playwright');(async()=>{const b=await chromium.launch();for(const[w,h,f] of [[375,812,'/tmp/hub-375.png'],[1280,900,'/tmp/hub-1280.png']]){const p=await b.newPage({viewport:{width:w,height:h}});await p.goto('http://localhost:3000',{waitUntil:'networkidle'});await p.waitForTimeout(1500);await p.screenshot({path:f,fullPage:true});await p.close();}await b.close();})()"
```
Then Read both screenshots and confirm: nav wordmark + 3 links visible, hero headline reveals and fits (no overflow at any width, clamp max 5.5rem), marquee present, About prose with numbers inline (no metric tiles), 4 project rows with real screenshots in alternating alignment and big gold numerals, contact + footer present. No overflow or broken layout at 375px.

- [ ] **Step 3: De-slop + design check (impeccable, post-build)**

Run the deterministic detector over the built markup and confirm the audit fixes held:
```bash
node /sessions/.../mnt/.remote-plugins/plugin_014fyKuoUjGFyuxpBF6CQzFW/skills/impeccable/scripts/detect.mjs --json app components
```
Expected: clean (exit 0) or only known false positives. Manually re-confirm against the DESIGN.md kill-list: no per-section `//` eyebrow, no metric-tile row, no identical card grid, varied motion, no em dashes in copy, body contrast ≥4.5:1. For a full pass, run `/impeccable critique` on a localhost URL (Assessment A + browser overlay) and fix any P0/P1 before deploy.

- [ ] **Step 4: Verify reduced motion**

In the browser devtools, emulate `prefers-reduced-motion: reduce` and confirm all entrances collapse to crossfade/instant and nothing stays hidden.

- [ ] **Step 5: Fix any issues found, then re-run Step 1–4**

Iterate until both viewports are clean. Commit fixes:
```bash
git add -A
git commit -m "fix: responsive and visual polish from verification pass"
```

---

### Task 16: README, project CLAUDE.md, and manual deploy handoff

**Files:**
- Create: `README.md`, `CLAUDE.md` (project-level)

- [ ] **Step 1: Write `README.md` (English)**

Sections: project description ("Portfolio hub aggregating four deployed web projects"), live URL, stack, features, local dev (`npm install`, `npm run dev`), env vars (`NEXT_PUBLIC_SITE_URL`), and a hero screenshot (`/tmp/hub-1280.png` copied into `_resources/` or `public/`). Match the tone of P1's README.

- [ ] **Step 2: Write project `CLAUDE.md`**

Operational context mirroring P1's: stack, conventions, "static, no Supabase", note that `public/cv-raul-calvo.pdf` is a placeholder and the LinkedIn/email are live.

- [ ] **Step 3: Commit**

```bash
git add README.md CLAUDE.md
git commit -m "docs: add readme and project claude.md"
```

- [ ] **Step 4: Hand off deploy to Raúl (manual)**

The sandbox has no GitHub credentials. Tell Raúl to:
1. Create GitHub repo `trustinraul/portfolio-hub`.
2. `git remote add origin …` and push `main`. (PowerShell lock fix if needed: `Remove-Item .git\index.lock -Force`.)
3. Import the repo in Vercel, set `NEXT_PUBLIC_SITE_URL=https://raulcalvo.vercel.app` (or the chosen subdomain) as an env var, deploy.
4. After deploy, verify live: `/opengraph-image` returns PNG 200 and the 8 project links work.

- [ ] **Step 5: Update workspace docs**

Add P5 to the project history table in `Webdev/CLAUDE.md` once Raúl confirms the live URL, and replace the CV placeholder when he provides the real PDF.

---

## Self-Review

**Spec coverage:** Identity/tokens → Task 2. Sections (hero, about, work index, contact, footer, nav) → Tasks 6–12. Static Next.js + projects-as-data → Tasks 1, 4. SEO/OG/metadataBase → Tasks 12–13. Thumbnails (real screenshots) → Task 14. Contact links + CV → Tasks 11, 14. Responsive + 375px + de-slop + reduced-motion verify → Task 15. README + done-criteria + manual deploy → Task 16. Spanish UI, no blog/Supabase/3D → respected throughout. All spec sections map to a task.

**DESIGN.md coverage (post-impeccable):** asymmetric editorial index → Task 10 (`WorkIndex`/`ProjectRow`); no metric tiles → Task 8; `//` only in nav → Tasks 3, 6, 9; varied motion → Tasks 5, 7, 8, 10; rewritten copy → Tasks 6, 7, 8, 11, 13; contrast fix (`--color-text-muted` `#a8a296`) → Task 2; reduced-motion → Tasks 5, 15. Stack grid removed → Task 9.

**Placeholder scan:** No "TBD"/"add error handling" left. The CV PDF is an intentional, explicitly-flagged placeholder asset (not a plan gap) with a concrete generation command. LinkedIn/email are real values baked into `lib/site.ts`.

**Type consistency:** `Project` interface (Task 4) is the only shared type; `ProjectRow` (Task 10) consumes exactly those fields (`name`, `