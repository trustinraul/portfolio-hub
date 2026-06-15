# Spec: P5 — Portfolio Hub

**Fecha:** 2026-06-15
**Estado:** Aprobado · diseño endurecido tras auditoría impeccable
**Autor:** Raúl (dirección) · Jarvis (diseño técnico)
**Objetivo:** Construir el hub del portafolio: una web única de una página que reúne los 4 proyectos (Kōmbu, Fortuna, Archon, Ingegno), cuenta la narrativa común de Raúl y centraliza el contacto. Es el "P5" de facto y el punto de entrada que se comparte en internet.

> ⚠️ **El sistema visual, el copy, el motion y el layout de proyectos los gobierna `2026-06-15-p5-hub-design-system.md` (DESIGN.md).** Ese documento es el resultado de la auditoría impeccable y manda donde contradiga las secciones "Identidad visual" / "Estructura" de abajo. Este spec mantiene arquitectura, datos, SEO y criterios de terminado.

---

## Contexto

Los 4 proyectos del portafolio están desplegados, auditados y pulidos (OG images, READMEs, seguridad verificada). Cada uno vive en su propio repo y dominio `.vercel.app`. Falta el **marco**: una sola URL que un cliente o founder pueda abrir y entender en 30 segundos quién es Raúl y qué ha construido, con enlaces directos a cada demo y repo.

El hub no compite visualmente con los 4 proyectos: es la galería que los enmarca. Su trabajo es dar contexto, transmitir nivel y dirigir al visitante hacia las demos.

Decisiones cerradas con Raúl en el brainstorm (ver historial):

- **Dominio:** `raulcalvo.vercel.app` por ahora. `metadataBase` se lee de una env var para poder migrar a dominio propio en una línea cuando se registre.
- **Secciones:** proyectos + contacto (baseline) + sobre mí + stack/skills + descarga de CV. **Sin blog.**
- **Dirección visual:** "Eco de Ingegno" — dark editorial polymath, con acentos developer (motivo `// sección` de N4xv, marquee de stack de Ankit Singh). Enfoque A del brainstorm: editorial con terminal como condimento, no como base.
- **Idioma:** español en la interfaz (audiencia inicial: negocio local español). Código, identificadores y commits en inglés, como en el resto del workspace.

Referencias de Raúl: [ankit-singh-web-resume.vercel.app](https://ankit-singh-web-resume.vercel.app/) (premium, marquee, métricas, cierre potente) y [n4xv.github.io](https://n4xv.github.io/) (estética terminal, labels `// sección`, mono).

---

## Objetivo y no-objetivos

### Objetivo
Una landing estática, rápida y visualmente cuidada que:
1. Posicione a Raúl en el hero (headline display + historia específica; copy en DESIGN.md).
2. Cuente la historia corta (de cero a 4 proyectos en producción en ~2 meses), con los números dentro de la prosa.
3. Muestre el stack con confianza (marquee discreto).
4. Presente los 4 proyectos como **índice editorial asimétrico** con screenshots reales grandes + pitch + enlaces a demo y código.
5. Centralice el contacto (email, GitHub, LinkedIn) y ofrezca descarga de CV.

### No-objetivos (YAGNI)
- Sin blog, CMS ni contenido dinámico.
- Sin Supabase, sin base de datos, sin auth.
- Sin formulario de contacto con backend — el contacto es un `mailto:` directo (P1 ya demostró formularios; el hub no necesita repetirlo).
- Sin 3D / WebGL / React-Three-Fiber (fuera de stack, agujero de tiempo). La sensación premium se logra con Framer Motion + CSS.
- Sin modo claro: el hub es dark-only, coherente con la identidad.

---

## Identidad visual

> Resumen. El detalle vive en **DESIGN.md** (`2026-06-15-p5-hub-design-system.md`), que manda.

Tras la auditoría impeccable, la dirección es **Hold & sharpen / Go big, memorable**: se conserva la identidad de Ingegno (identity-preservation) pero se matan los tells de AI-slop y la memorabilidad se carga en composición, motion y copy, no en colores nuevos.

| Token | Hex | Uso |
|---|---|---|
| `--bg` | `#080808` | Fondo base |
| `--surface` | `#111110` | Bloques, hover de fila |
| `--text` | `#F2EDE3` | Texto principal (contraste ~17:1) |
| `--text-muted` | `#A8A296` | Secundario (subido desde `#9a958b` para asegurar AA) |
| `--accent` | `#C8A35B` | Oro: numerales 01–04, hover, acentos de tipo |

- **Tipografía (conservada):** `EB_Garamond` display + `Barlow` body + `JetBrains_Mono`. La mono vive **solo** en wordmark, nav, numerales y micro-labels — NO como eyebrow de cada sección.
- **Color:** committed dentro del dark. El oro trabaja de verdad (numerales de índice grandes, hover), no como línea decorativa.
- **Motion (Framer Motion):** variado, no un fade-up clonado. Entrada coreografiada del hero (reveal por palabras con mask), reveal por líneas en "Sobre", `clip-path` reveal + slide desfasado por fila en el índice de trabajo. `prefers-reduced-motion` → crossfade/instantáneo.
- **Grano:** ruido sutil de Ingegno, opacidad baja.

---

## Estructura de la página (one-page scroll)

> Copy literal y detalle de motion/layout en **DESIGN.md**. Aquí el esqueleto.

Orden vertical, nav sticky con scroll-spy, **jerarquía variada** (no rejillas idénticas, no eyebrow por sección):

1. **Nav** — wordmark `raúl calvo` + tag mono `// builder` (el motivo `//` vive aquí, una sola vez). Links: `sobre`, `trabajo`, `contacto`. Sticky translúcido al scroll.
2. **Hero** — una idea por fold. Headline display grande ("Construyo cosas para internet."), subtítulo específico con la historia, un CTA primario ("Ver el trabajo"). Marquee de stack discreto debajo.
3. **Sobre** — un párrafo con POV; los números (4 proyectos, 2 meses, de cero) van **dentro de la frase**, sin tiles de métricas.
4. **Trabajo** — **índice editorial asimétrico** (reemplaza la rejilla 2×2). Cada proyecto es una fila a ancho completo: numeral `01`–`04` en oro, screenshot real grande como protagonista, nombre serif, pitch, tags, links `demo`/`código`. Alterna alineación y varía el espaciado fila a fila. Apila en móvil.
5. **Contacto** — cierre ("¿Tienes algo en mente?"), `mailto:rcalvosanz@gmail.com`, GitHub (`trustinraul`), LinkedIn (`linkedin.com/in/raul-calvo-sanz-678993416`), botón "Descargar CV".
6. **Footer** — mínimo: `raúl calvo · 2026 · Construido con Next.js`.

---

## Arquitectura técnica

- **Stack:** Next.js 14+ (App Router), React, Tailwind CSS, TypeScript. Deploy en Vercel. 100% estático (SSG), sin Supabase, consistente con P1.
- **Estructura de carpetas:** `Portfolio/P5 - Hub/` como repo Git independiente, mismo patrón que P1–P4 (`app/`, `components/`, `content/`, `lib/`, `public/`, `docs/`, `_resources/`, su propio `CLAUDE.md`).
- **Repo / deploy:** `trustinraul/portfolio-hub` → `raulcalvo.vercel.app`.
- **Página única:** `app/page.tsx` compone las secciones; cada sección es un Server Component salvo las que necesitan interactividad (`Nav` con scroll-spy y las animaciones Framer Motion → `use client` donde haga falta, lo mínimo).

### Modelo de datos

Los 4 proyectos viven como data tipada en `content/projects.ts`, no hardcodeados en JSX. Añadir un proyecto futuro = añadir un objeto al array.

```ts
interface Project {
  slug: string;          // "kombu"
  name: string;          // "Kōmbu"
  pitch: string;         // una línea, español
  tags: string[];        // ["Next.js", "Tailwind", "Framer Motion"]
  demoUrl: string;       // "https://p1-kombu.vercel.app"
  repoUrl: string;       // "https://github.com/trustinraul/p1-kombu"
  thumbnail: string;     // "/projects/kombu.png" (OG image o screenshot)
  accent: string;        // color del swatch/acento de la card
}
```

Contenido inicial de los 4:

| slug | name | pitch | demo | repo |
|---|---|---|---|---|
| kombu | Kōmbu | Landing dark-premium para un restaurante japonés de autor en Madrid. | p1-kombu.vercel.app | trustinraul/p1-kombu |
| fortuna | Fortuna | Estudio de tatuaje con reservas en tiempo real y panel de admin. | p2-fortuna.vercel.app | trustinraul/p2-fortuna |
| archon | Archon | CRM full-stack para freelancers: clientes, proyectos, tareas y facturas, con auth + RLS. | p3-archon.vercel.app | trustinraul/p3-archon |
| ingegno | Ingegno | SaaS multi-tenant: un perfil público premium para polymaths y builders. | p4-ingegno.vercel.app | trustinraul/p4-ingegno |

### Componentes

- `Nav` (client) — wordmark + links + scroll-spy.
- `Hero` (client) — headline con reveal coreografiado, CTA, `StackMarquee`.
- `StackMarquee` (client) — loop discreto de tecnologías.
- `About` — un párrafo con POV (sin `Metrics`; los números van en la frase).
- `WorkIndex` (client) — mapea `projects` → `ProjectRow`; orquesta el stagger.
- `ProjectRow` — numeral `01`–`04`, screenshot grande, nombre, pitch, tags, links; alterna alineación según índice.
- `Contact` — cierre, mailto, links sociales, botón CV.
- `Footer`.

> Cambios vs. plan original: se elimina `Metrics`; `ProjectGrid`/`ProjectCard` se reemplazan por `WorkIndex`/`ProjectRow` (índice editorial, no rejilla de tarjetas). La sección `Stack` como rejilla de chips se reduce al marquee del hero. El motion deja de ser un único `Reveal` clonado.

Cada componente con una responsabilidad clara, props tipadas con interfaces, Server Component por defecto y `use client` solo donde haya interactividad.

---

## SEO / metadata / OG

- `metadataBase` desde env var (`NEXT_PUBLIC_SITE_URL`), default `https://raulcalvo.vercel.app`, para migrar a dominio propio sin tocar código.
- `app/opengraph-image.tsx` propio del hub (mismo patrón ya aplicado a los 4 proyectos), con bloque `openGraph` y `twitter` en el layout. `twitter:card = summary_large_image`.
- Title/description orientados a "Raúl Calvo — Web Developer / Builder" con keywords de freelance web dev.
- `lang="es"`.

---

## Responsive

Mobile-first, breakpoints Tailwind `sm/md/lg`. Verificar a 375px sin elementos rotos (criterio del workspace):
- Nav colapsa (los links pueden pasar a menú simple).
- Índice de trabajo: filas alternas → apiladas, imagen primero, numeral encima.
- Marquee sigue funcionando en móvil.
- Headlines display: probar copy a 375/768/1280 sin overflow (techo `clamp` 5.5rem).

---

## Inputs requeridos de Raúl (antes o durante el build)

Estos no bloquean el diseño; se dejan como placeholder y se rellenan al construir:

1. **URL de LinkedIn** — `https://www.linkedin.com/in/raul-calvo-sanz-678993416/` ✅ recibida.
2. **PDF del CV** — si ya existe, va a `/public/cv-raul-calvo.pdf`; si no, se genera después y se enlaza. El botón se construye igualmente.
3. **Thumbnails** — por defecto se reutilizan las OG images de cada proyecto; si Raúl prefiere screenshots dedicados, se capturan en el build.

---

## Criterios de "terminado"

(Heredados del checklist del workspace.)

- [ ] Desplegado en `raulcalvo.vercel.app` con URL pública funcional.
- [ ] Repo `trustinraul/portfolio-hub` en GitHub con README en inglés (descripción, stack, cómo correr en local, screenshot).
- [ ] Responsivo verificado a 375px, sin elementos rotos.
- [ ] Los 8 enlaces (4 demos + 4 repos) abren correctamente; mailto y LinkedIn funcionan; CV descarga.
- [ ] OG image sirve PNG 200 y `twitter:card = summary_large_image`.
- [ ] Sin `console.error` ni warnings críticos en producción.
- [ ] Env vars en Vercel, no expuestas en el repo.

---

## Fuera de scope (explícito)

Blog, CMS, formulario con backend, Supabase, auth, modo claro, 3D/WebGL, animaciones decorativas sin función, i18n (el hub es solo español). Cualquiera de estos se trataría como un proyecto/iteración aparte con su propio spec.
