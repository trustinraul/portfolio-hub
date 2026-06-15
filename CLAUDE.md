# CLAUDE.md — P5 Portfolio Hub

> Contexto operativo para Claude Code. Leer antes de cualquier acción.

---

## Qué es este proyecto

El **hub** del portafolio de Raúl: una landing estática de una sola página que reúne los 4 proyectos desplegados (Kōmbu, Fortuna, Archon, Ingegno), cuenta su narrativa y centraliza el contacto. Es el "P5" de facto y el punto de entrada que se comparte en internet.

**Objetivo:** una web rápida, con criterio y sin AI-slop, que en 30 segundos diga "este tío construye productos serios", con enlaces directos a cada demo y repo.

**Spec completo:** `docs/spec.md`
**Plan de implementación:** `docs/plan.md` ← leer y ejecutar task por task
**Sistema de diseño:** `docs/DESIGN.md` ← **gobierna** todo lo visual, copy, motion y layout

---

## Orden de lectura al arrancar

1. Este `CLAUDE.md`
2. `docs/DESIGN.md` (manda en lo visual)
3. `docs/spec.md`
4. `docs/plan.md` (ejecutar task por task con `superpowers:subagent-driven-development` o `executing-plans`)

**Regla de gobierno:** ante cualquier conflicto entre el plan y el DESIGN.md, gana el DESIGN.md. El plan ya está alineado con él.

---

## Stack

| Capa | Tecnología |
|---|---|
| Framework | Next.js 16 — **siempre App Router, nunca Pages Router** |
| UI | React 19 + Tailwind CSS v4 (`@theme`) |
| Animaciones | Framer Motion v12 — motion variado, nunca un único reveal clonado |
| Deploy | Vercel |
| Fuentes | EB Garamond + Barlow + JetBrains Mono (next/font/google) |
| Tests | Jest + ts-jest (node env) — solo data, no render de JSX |

**Sin Supabase. Sin base de datos. Sin backend. El hub es 100% estático (SSG).** El contacto es un `mailto:` directo, no un formulario con servidor.

---

## Paleta y diseño (de DESIGN.md)

| Token | Valor |
|---|---|
| `--bg` | `#080808` |
| `--surface` | `#111110` |
| `--text` | `#f2ede3` |
| `--text-muted` | `#a8a296` (asegura contraste AA) |
| `--accent` | `#c8a35b` (oro: numerales 01–04, hover, acentos) |

Identidad conservada de Ingegno (dark editorial), pero endurecida contra AI-slop.

---

## No-negociables de diseño (resultado de la auditoría impeccable)

- El motivo `//` vive **solo** en el wordmark del nav. **Nunca** como eyebrow sobre cada sección.
- **Sin** tiles de métricas (`04 / 100% / 2 meses`). Los números van dentro de la prosa de "Sobre".
- Los proyectos van en **índice editorial asimétrico** (`WorkIndex` / `ProjectRow`): filas a ancho completo, screenshots reales grandes, numerales 01–04, alineación alterna. **No** rejilla 2×2 de tarjetas idénticas.
- **Sin** sección Stack de chips: el stack vive en el marquee del hero.
- Motion **variado** por sección, con `prefers-reduced-motion` siempre.
- Copy sin em-dashes ni cadencia aforística. Botones = verbo + objeto.
- Contraste de body ≥ 4.5:1.

---

## Convenciones de código

- Idioma del código y commits: **inglés**. Idioma de la UI y de la conversación con Raúl: **español**.
- Componentes PascalCase, funciones/variables camelCase, rutas kebab-case.
- Functional components, props tipadas con interfaces. Server Components por defecto; `use client` solo donde haya interactividad.
- Tailwind: `@theme` para tokens, sin CSS custom salvo necesidad real.
- Commits: `tipo: descripción breve` (`feat`, `fix`, `style`, `refactor`, `chore`, `docs`).
- Datos de proyectos en `content/projects.ts` (no hardcodear en JSX).

---

## Entorno y deploy

- **El sandbox no tiene credenciales de GitHub.** Los `git commit` van locales; **crear el repo `trustinraul/portfolio-hub`, el push y conectar Vercel los hace Raúl a mano** (Task 16 del plan).
- PowerShell, si salta el lock: `Remove-Item .git\index.lock -Force` (no `rm -f`).
- URL objetivo: `raulcalvo.vercel.app`. `metadataBase` desde `NEXT_PUBLIC_SITE_URL` para migrar a dominio propio en una línea.
- CV real en dos idiomas: `public/cv-raul-calvo-es.pdf` (primario, UI español) y `public/cv-raul-calvo-en.pdf`. Enlazados desde Contact (`site.cvEs` / `site.cvEn`) y el nav móvil (ES).

---

## Criterios de "terminado"

- [ ] `npm run build && npm run lint && npm test` en verde.
- [ ] Responsive sin roturas a 375px; headlines sin overflow a 375/768/1280.
- [ ] Índice editorial con las 4 filas y screenshots reales; los 8 enlaces (4 demos + 4 repos) abren.
- [ ] `mailto`, LinkedIn y descarga de CV funcionan.
- [ ] OG image sirve PNG 200 y `twitter:card = summary_large_image`.
- [ ] `prefers-reduced-motion` desactiva todo el motion.
- [ ] Detector de impeccable (`detect.mjs`) limpio o solo falsos positivos conocidos.
- [ ] Sin `console.error` ni warnings críticos. Env vars en Vercel, no en el repo.
