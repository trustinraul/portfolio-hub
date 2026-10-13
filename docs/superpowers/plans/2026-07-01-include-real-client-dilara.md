# Include Real Client Website (Dilara) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Añadir la web real de pago de Dilara al portfolio (P5 - Hub) como caso destacado de cliente real, diferenciado visualmente de los demos, ocupando el slot de Kōmbu.

**Architecture:** El portfolio renderiza los proyectos desde un único array tipado (`content/projects.ts`) en filas alternadas (`components/ProjectRow.tsx`). Extendemos el modelo `Project` con tres campos opcionales (`isRealClient`, `liveLabel`, y `repoUrl` pasa a opcional), añadimos Dilara como primer elemento, y adaptamos el render para mostrar un badge "Cliente real" y ocultar el link de código cuando el repo es privado. Sin nuevas dependencias.

**Tech Stack:** Next.js 14 App Router, TypeScript, Tailwind v4, Framer Motion, Jest + ts-jest. Screenshot vía Playwright (one-off).

---

## File Structure

| Archivo | Acción | Responsabilidad |
|---|---|---|
| `content/projects.ts` | Modificar | Tipo `Project` + datos. Añadir Dilara, reordenar, mover Kōmbu al final |
| `__tests__/projects.test.ts` | Modificar | Adaptar aserciones al nuevo tamaño y a `repoUrl` opcional + invariantes del cliente real |
| `components/ProjectRow.tsx` | Modificar | Badge "Cliente real", link de código condicional, label de demo contextual |
| `public/projects/dilara.png` | Crear | Thumbnail capturado de la web viva |
| `scripts/shot-dilara.mjs` | Crear (temporal) | Script Playwright one-off para la captura |

**Decisión sobre Kōmbu (punto 5):** lo mantenemos pero lo movemos al **último** lugar del array (lo real va primero, lo demo después). Es reversible. Si más tarde Raúl quiere eliminarlo, basta con borrar su objeto del array y bajar el largo esperado en el test de 5 a 4.

---

## Task 1: Extender el modelo `Project` y añadir Dilara

**Files:**
- Modify: `content/projects.ts`

- [ ] **Step 1: Actualizar la interface `Project`**

Reemplazar el bloque `export interface Project { ... }` (líneas 1-10) por:

```typescript
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
}
```

- [ ] **Step 2: Insertar Dilara como primer proyecto y mover Kōmbu al final**

Reemplazar el array `export const projects: Project[] = [ ... ]` completo por:

```typescript
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
```

- [ ] **Step 3: Commit**

```bash
git add content/projects.ts
git commit -m "feat: add Dilara real client to projects data, make repoUrl optional"
```

---

## Task 2: Adaptar los tests de datos

**Files:**
- Modify: `__tests__/projects.test.ts`

El test actual asume exactamente 4 proyectos y repo obligatorio en todos. Lo reescribimos para reflejar el nuevo modelo y añadir invariantes del cliente real.

- [ ] **Step 1: Escribir los tests actualizados (deben fallar contra el estado previo a Task 1)**

Reemplazar el contenido completo de `__tests__/projects.test.ts` por:

```typescript
import { projects } from '@/content/projects'

describe('projects data', () => {
  it('has 5 projects', () => {
    expect(projects).toHaveLength(5)
  })

  it('has unique slugs', () => {
    const slugs = projects.map((p) => p.slug)
    expect(new Set(slugs).size).toBe(projects.length)
  })

  it('every project has an https demo url', () => {
    for (const p of projects) {
      expect(p.demoUrl).toMatch(/^https:\/\//)
    }
  })

  it('any repo url present points to github', () => {
    for (const p of projects) {
      if (p.repoUrl) {
        expect(p.repoUrl).toMatch(/^https:\/\/github\.com\//)
      }
    }
  })

  it('every project has a local thumbnail, a pitch and at least one tag', () => {
    for (const p of projects) {
      expect(p.thumbnail.startsWith('/')).toBe(true)
      expect(p.pitch.length).toBeGreaterThan(10)
      expect(p.tags.length).toBeGreaterThan(0)
    }
  })

  it('duration, when present, is non-empty', () => {
    for (const p of projects) {
      if (p.duration !== undefined) {
        expect(p.duration.trim().length).toBeGreaterThan(0)
      }
    }
  })

  it('has exactly one real client, placed first, with a live label and no public repo', () => {
    const realClients = projects.filter((p) => p.isRealClient)
    expect(realClients).toHaveLength(1)
    expect(projects[0].isRealClient).toBe(true)
    const dilara = realClients[0]
    expect(dilara.slug).toBe('dilara')
    expect(dilara.liveLabel && dilara.liveLabel.length).toBeGreaterThan(0)
    expect(dilara.repoUrl).toBeUndefined()
  })
})
```

- [ ] **Step 2: Ejecutar los tests y verificar que pasan**

Run: `npm test`
Expected: PASS — 7 tests verdes (Task 1 ya dejó los datos en su sitio).

- [ ] **Step 3: Commit**

```bash
git add __tests__/projects.test.ts
git commit -m "test: cover real client invariants and optional repoUrl"
```

---

## Task 3: Capturar el thumbnail de la web viva

**Files:**
- Create: `scripts/shot-dilara.mjs`
- Create: `public/projects/dilara.png`

El thumbnail se muestra en `aspect-video` (16:9) con `object-cover`, así que capturamos un viewport 1280×720.

- [ ] **Step 1: Instalar Playwright (one-off, no se añade a package.json)**

Run: `npx --yes playwright@latest install chromium`
Expected: descarga el binario de Chromium sin error.

- [ ] **Step 2: Crear el script de captura**

Create `scripts/shot-dilara.mjs`:

```javascript
import { chromium } from 'playwright'

const browser = await chromium.launch()
const page = await browser.newPage({ viewport: { width: 1280, height: 720 } })
await page.goto('https://dilarasalondebelleza.es', { waitUntil: 'networkidle' })
// Pequeña espera para reveals/animaciones por encima del pliegue
await page.waitForTimeout(1500)
await page.screenshot({
  path: 'public/projects/dilara.png',
  clip: { x: 0, y: 0, width: 1280, height: 720 },
})
await browser.close()
console.log('saved public/projects/dilara.png')
```

- [ ] **Step 3: Ejecutar la captura**

Run: `npx --yes playwright@latest exec node scripts/shot-dilara.mjs` (o, si Playwright ya está en node_modules: `node scripts/shot-dilara.mjs`)
Expected: imprime `saved public/projects/dilara.png` y el archivo existe.

Run: `ls -la public/projects/dilara.png`
Expected: archivo > 0 bytes.

> Si la captura sale en blanco o con un banner de cookies tapando el hero, ajustar: aceptar/cerrar el banner antes del screenshot (`await page.getByRole('button', { name: /aceptar/i }).click().catch(() => {})`) o subir `y` en el `clip` para encuadrar el hero.

- [ ] **Step 4: Eliminar el script temporal (no queremos basura en el repo)**

Run: `rm scripts/shot-dilara.mjs && rmdir scripts 2>/dev/null || true`
Expected: solo queda el `.png`.

- [ ] **Step 5: Commit**

```bash
git add public/projects/dilara.png
git commit -m "feat: add Dilara live site thumbnail"
```

---

## Task 4: Render del badge y links condicionales en `ProjectRow`

**Files:**
- Modify: `components/ProjectRow.tsx`

Tres cambios de render para clientes reales: (a) badge `liveLabel` en lugar de la línea "Construido en {duration}", (b) link de código solo si hay `repoUrl`, (c) el link de demo dice "ver web" para el cliente real y "demo" para los demos.

- [ ] **Step 1: Sustituir la línea de duración por badge condicional**

En `components/ProjectRow.tsx`, reemplazar esta línea (línea 80):

```tsx
        <p className="mt-2 font-mono text-xs text-text-muted">Construido en {project.duration}</p>
```

por:

```tsx
        {project.isRealClient ? (
          <span className="mt-3 inline-flex items-center gap-1.5 rounded-full border border-accent/40 bg-accent/10 px-3 py-1 font-mono text-[11px] uppercase tracking-wide text-accent">
            <span aria-hidden="true" className="inline-block h-1.5 w-1.5 rounded-full bg-accent" />
            {project.liveLabel ?? 'Cliente real'}
          </span>
        ) : project.duration ? (
          <p className="mt-2 font-mono text-xs text-text-muted">Construido en {project.duration}</p>
        ) : null}
```

- [ ] **Step 2: Hacer condicionales los links de demo y código**

Reemplazar el bloque de links (líneas 89-92):

```tsx
        <div className="mt-6 flex gap-6 font-mono text-sm">
          <a href={project.demoUrl} target="_blank" rel="noopener noreferrer" className="text-accent underline-offset-4 hover:underline">demo <span aria-hidden="true">↗</span></a>
          <a href={project.repoUrl} target="_blank" rel="noopener noreferrer" className="text-text-muted underline-offset-4 hover:text-text hover:underline">código <span aria-hidden="true">↗</span></a>
        </div>
```

por:

```tsx
        <div className="mt-6 flex gap-6 font-mono text-sm">
          <a href={project.demoUrl} target="_blank" rel="noopener noreferrer" className="text-accent underline-offset-4 hover:underline">
            {project.isRealClient ? 'ver web' : 'demo'} <span aria-hidden="true">↗</span>
          </a>
          {project.repoUrl && (
            <a href={project.repoUrl} target="_blank" rel="noopener noreferrer" className="text-text-muted underline-offset-4 hover:text-text hover:underline">código <span aria-hidden="true">↗</span></a>
          )}
        </div>
```

- [ ] **Step 3: Actualizar el aria-label de la imagen para el cliente real**

Reemplazar (línea 54):

```tsx
        aria-label={`Abrir demo de ${project.name}`}
```

por:

```tsx
        aria-label={`Abrir ${project.isRealClient ? 'la web de' : 'demo de'} ${project.name}`}
```

- [ ] **Step 4: Verificar tipos y lint**

Run: `npx tsc --noEmit && npm run lint`
Expected: sin errores de tipos (Project ya admite los campos opcionales) ni de lint.

- [ ] **Step 5: Commit**

```bash
git add components/ProjectRow.tsx
git commit -m "feat: render real-client badge and conditional repo link in ProjectRow"
```

---

## Task 5: Verificación final, responsive y deploy

**Files:** ninguno nuevo — verificación de extremo a extremo.

- [ ] **Step 1: Build de producción**

Run: `npm run build`
Expected: build OK, sin errores. La página `/` genera estática.

- [ ] **Step 2: Tests + lint completos**

Run: `npm test && npm run lint`
Expected: todos los tests verdes, lint limpio.

- [ ] **Step 3: Revisión visual local (desktop + móvil 375px)**

Run: `npm run dev` y abrir `http://localhost:3000`.
Verificar manualmente:
- Dilara aparece **primera** en la sección `#trabajo` con el badge "Cliente real · En producción".
- La fila de Dilara **no** muestra link "código" (solo "ver web").
- El thumbnail de Dilara carga (no aparece el recuadro `bg-surface` vacío).
- A 375px (DevTools responsive) nada se rompe: badge, tags y links envuelven bien.
- Kōmbu sigue presente como último proyecto, con su demo y código intactos.

- [ ] **Step 4: Commit final (si hubo ajustes en Step 3) y push**

```bash
git add -A
git commit -m "chore: finalize Dilara real-client section" || echo "nada que commitear"
git push
```

Expected: Vercel auto-despliega desde `main`. Verificar la URL pública del portfolio una vez termine el deploy.

---

## Task 6: Andamiaje de testimonio + métrica (con placeholders)

Mecanismo de código listo para prueba social. Se deja con placeholders comentados: cuando Dilara dé el OK a la cita y tengas un dato de GA4 estable, se rellena el texto y aparece. Mientras los campos estén `undefined`, no se renderiza nada.

**Files:**
- Modify: `content/projects.ts`
- Modify: `components/ProjectRow.tsx`

- [ ] **Step 1: Extender el modelo con `testimonial` y `metric`**

En `content/projects.ts`, añadir al final de la interface `Project` (antes del `}` de cierre):

```typescript
  testimonial?: { quote: string; author: string }
  metric?: { value: string; label: string }
```

- [ ] **Step 2: Dejar los placeholders en el objeto de Dilara**

En el objeto `dilara` de `projects.ts`, añadir tras `liveLabel` (comentados hasta tener el contenido real):

```typescript
    // TODO: rellenar cuando Dilara apruebe la cita
    // testimonial: { quote: 'PLACEHOLDER_FRASE_DE_DILARA', author: 'Dilara — Salón de Belleza' },
    // TODO: rellenar con dato real y estable de GA4 (p. ej. clics WhatsApp/mes)
    // metric: { value: 'PLACEHOLDER_NUMERO', label: 'PLACEHOLDER_QUE_MIDE' },
```

- [ ] **Step 3: Renderizar testimonio y métrica en `ProjectRow` (solo si existen)**

En `components/ProjectRow.tsx`, justo **después** del `<p>` del pitch (la línea con `{project.pitch}`), insertar:

```tsx
        {project.metric && (
          <p className="mt-4 font-display text-2xl text-text">
            {project.metric.value}{' '}
            <span className="font-sans text-sm text-text-muted">{project.metric.label}</span>
          </p>
        )}
        {project.testimonial && (
          <blockquote className="mt-4 max-w-md border-l-2 border-accent/40 pl-4 text-sm italic text-text-muted">
            “{project.testimonial.quote}”
            <cite className="mt-1 block not-italic font-mono text-[11px] text-text-faint">
              — {project.testimonial.author}
            </cite>
          </blockquote>
        )}
```

- [ ] **Step 4: Verificar que nada se rompe con los campos vacíos**

Run: `npx tsc --noEmit && npm test && npm run lint`
Expected: verde. Con `testimonial`/`metric` comentados (undefined), no se renderiza ningún bloque nuevo.

- [ ] **Step 5: Commit**

```bash
git add content/projects.ts components/ProjectRow.tsx
git commit -m "feat: add testimonial and metric scaffold for real client (placeholders)"
```

> Para activarlo: descomentar las líneas del Step 2 y sustituir los `PLACEHOLDER_*` por el texto real. Nada más.

---

## Self-Review

**Cobertura del spec (los 10 puntos):**
1. Extender interface (`isRealClient`, `repoUrl` opcional) → Task 1 Step 1.
2. `liveLabel` opcional para el badge → Task 1 Step 1.
3. Dilara como primer elemento → Task 1 Step 2 + test en Task 2.
4. Datos de Dilara (pitch resultado, tags, demoUrl viva) → Task 1 Step 2.
5. Decisión Kōmbu (mover al final, reversible) → Task 1 Step 2 + nota en File Structure.
6. Screenshot de la web → Task 3.
7. Badge "Cliente real" en ProjectRow → Task 4 Step 1.
8. Ocultar link código sin repo + label "ver web" → Task 4 Step 2.
9. Métrica/testimonio → andamiaje con placeholders en Task 6 (se rellena cuando haya OK de Dilara y dato de GA4).
10. Verificar (build, lint, test, móvil 375px) + commit/deploy → Task 5.

**Orden de ejecución:** Task 5 (verificación + deploy) va **después** de Task 6 si ejecutas el andamiaje en la misma tanda; si no, Task 6 se puede dejar para una sesión posterior sin afectar al deploy de Tasks 1-5.

**Placeholder scan:** sin TBD/TODO; todo el código está completo.

**Consistencia de tipos:** `isRealClient`, `liveLabel`, `repoUrl?`, `duration?` se definen en Task 1 y se consumen idénticos en Tasks 2 y 4.
