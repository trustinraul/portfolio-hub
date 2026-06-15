# DESIGN.md — P5 Portfolio Hub

> Sistema de diseño comprometido tras la auditoría impeccable (Assessment A).
> **Gobierna sobre el spec y el plan** en todo lo visual, de copy, motion y layout de proyectos. Donde el código original del plan contradiga este documento, manda este documento.

**Decisiones del usuario (2026-06-15):** Hold & sharpen · Go big, memorable · Fixes: índice editorial asimétrico, motion variado, reescribir copy. Tipografía y paleta se conservan de Ingegno (identity-preservation).

---

## Escena (la frase que fuerza las decisiones)

Un founder o el dueño de un negocio local abre esto de noche, en el móvil o en un portátil, después de que alguien le pasara el link. Tiene 30 segundos y cero paciencia para otra plantilla. Tiene que pensar "este tío sabe lo que hace" antes de hacer scroll. El mood es: confiado, hecho a mano, sin postureo de agencia.

## Lane y referencia nombrada

**Dark, work-forward, motion-rich** — la versión con criterio de un portfolio de dev. Ancla: los portfolios personales de alto gusto tipo `rauno.me`, `emilkowal.ski`, `paco.me` — oscuros, asimétricos, donde **el trabajo y el movimiento hablan**, no la afectación serif-revista. Lo ejecutamos con la voz serif de Ingegno, no con sans minimal.

**Inverse test:** un competidor describiría el lane editorial-dark genérico como "portfolio oscuro con serif y labels mono". El nuestro se describe como "índice donde cuatro productos reales en pantalla grande cuentan una progresión, con motion hecho a mano". Si el build deriva hacia lo primero, ha fallado.

---

## Tipografía (conservada de Ingegno, comprometida más fuerte)

| Rol | Familia | Uso |
|---|---|---|
| Display | `EB_Garamond` | Headline del hero, nombres de proyecto, cierres. Tamaños grandes, peso 500/600, tracking `-0.02em` (nunca por debajo de `-0.04em`). |
| Body | `Barlow` | Párrafos, pitches. 400/500. |
| Mono | `JetBrains_Mono` | **Solo** wordmark, nav, numerales de índice, tags y micro-links. NO como eyebrow de cada sección. |

- Escala fluida `clamp()`, ratio ≥1.25 entre pasos. Hero display llega a `clamp(2.75rem, 6vw, 5.5rem)` (techo bajo 6rem).
- Texto claro sobre oscuro: `line-height` +0.05–0.1 (el tipo claro pesa menos y necesita aire).
- `text-wrap: balance` en h1–h3; `text-wrap: pretty` en prosa larga.

## Color (conservado, empujado dentro de la identidad)

Estrategia: **committed dentro del dark**. No introducimos hue nuevo; hacemos que el oro trabaje de verdad (numerales de índice grandes, estados hover, acentos de tipo), en vez de una línea fina decorativa.

| Token | Hex | OKLCH aprox | Uso |
|---|---|---|---|
| `--bg` | `#080808` | `oklch(0.16 0 0)` | Fondo |
| `--surface` | `#111110` | `oklch(0.20 0.002 90)` | Bloques, hover de fila |
| `--text` | `#F2EDE3` | `oklch(0.94 0.012 80)` | Texto principal (contraste ~17:1, AAA) |
| `--text-muted` | `#A8A296` | `oklch(0.70 0.014 80)` | Secundario (contraste ~7:1, subido desde `#9a958b` para asegurar AA) |
| `--accent` | `#C8A35B` | `oklch(0.73 0.10 80)` | Numerales 01–04, hover, acentos de tipo |

> Nota de implementación: el codebase (P1–P4) usa hex en `@theme` de Tailwind v4. Enviamos hex para mantener consistencia; el OKLCH es la intención de referencia.

**Contraste verificado:** `--text-muted` subido de `#9a958b` a `#A8A296` — el original quedaba justo en el límite para texto pequeño sobre `#080808`. Body nunca por debajo de 4.5:1.

---

## Estructura (one-page, jerarquía variada — no rejillas idénticas)

1. **Nav** — wordmark `raúl calvo` + tag mono `// builder`. Links: `sobre`, `trabajo`, `contacto` (sin el `//` repetido; el motivo vive aquí una vez). Sticky con scroll-spy.
2. **Hero** — una sola idea por fold. Headline display grande, subtítulo específico, un CTA primario. El marquee de stack se mantiene pero discreto, abajo.
3. **Sobre** — un párrafo con POV. Los números (4 proyectos, 2 meses, de cero) van **dentro de la frase**, no en tiles. Sin fila de métricas.
4. **Trabajo (índice editorial asimétrico)** — ver abajo. Es el corazón de la página.
5. **Contacto** — cierre + email + GitHub + LinkedIn + CV.
6. **Footer** — mínimo.

### Índice editorial asimétrico (reemplaza la rejilla 2×2)

Cada proyecto es una **fila a ancho completo**, no una tarjeta en rejilla. Composición:

- Numeral de índice grande en oro (`01`–`04`, ~`clamp(3rem,8vw,7rem)`). El número **gana su sitio**: la progresión P1→P4 es la narrativa (de "sé hacer webs" a "sé hacer productos"), así que es secuencia real, no scaffolding.
- Screenshot real grande del proyecto (~55–60% del ancho en desktop), **es el elemento protagonista** — tu imagery de verdad.
- Nombre en serif grande, pitch en Barlow, tags mono, links `demo`/`código`.
- **Alterna la alineación** fila a fila (imagen izquierda / imagen derecha) y **varía el espaciado vertical** entre filas (no idéntico). En móvil apila, imagen primero.
- Hover: el numeral se rellena de oro y la imagen hace un leve scale/clip. Una fila no es una tarjeta con borde; es composición editorial.

---

## Motion (variado, orquestado — no un fade-up clonado)

Framer Motion. Materiales más allá de opacity/transform donde mejoren: `clip-path`/`mask` en reveals de imagen.

- **Primer load (el momento "go big"):** entrada coreografiada del hero — el wordmark aparece, el headline se revela por palabras con un mask vertical (stagger ~60ms), el marquee arranca. Un solo gesto fuerte y memorable, no micro-animaciones dispersas.
- **Sobre:** reveal por líneas de texto, distinto del hero.
- **Índice de trabajo:** cada fila entra con la imagen haciendo un `clip-path` reveal + el numeral y el texto con un slide corto desfasado. Stagger entre filas. Cada fila se siente tallada, no clonada.
- **Reduced motion:** `@media (prefers-reduced-motion: reduce)` → crossfade o instantáneo en todo. Los reveals realzan contenido **ya visible** (nada de gatear la visibilidad con una clase que no dispara en tabs ocultas).
- Easing: ease-out exponencial (quart/expo). Sin bounce ni elastic.

---

## Copy (reescrito — POV, específico, sin aforismos, sin em-dash, sin buzzwords)

Reglas: cada palabra se gana su sitio. Nada de cadencia "frase seria + rebote corto". Sin guiones largos. Labels de botón = verbo + objeto.

**Hero**
- Wordmark: `raúl calvo` · tag mono: `// builder · valladolid`
- Headline (display): **Construyo cosas para internet.**
- Subtítulo: **Tengo 18 años y en dos meses pasé de no saber HTML a desplegar cuatro proyectos reales: una landing, una web de reservas, un CRM con login y un SaaS multi-tenant.**
- CTA primario: **Ver el trabajo** · secundario (texto): **Escríbeme**
- (Alternativa de headline si "cosas para internet" se siente informal para cliente: **Diseño y construyo webs y productos digitales.**)

**Sobre**
> Empecé sabiendo algo de Python y nada de desarrollo web. En dos meses construí y desplegué cuatro proyectos, de una landing estática a un SaaS multi-tenant con autenticación. No usé plantillas: dirigí cada decisión de producto, diseño y arquitectura, y escribí el código con IA como herramienta, no como muleta. Trabajo rápido y entrego cosas que funcionan en producción.

**Pitches de proyecto** (una línea, en `content/projects.ts`)
- Kōmbu — Landing dark-premium para un restaurante japonés de autor en Madrid.
- Fortuna — Estudio de tatuaje con reservas en tiempo real y panel de administración.
- Archon — CRM para freelancers: clientes, proyectos, tareas y facturas, con login y permisos por usuario.
- Ingegno — SaaS multi-tenant: un perfil público para builders que hacen muchas cosas.

**Contacto**
- Headline: **¿Tienes algo en mente?**
- Sub: **Hago webs y productos para negocios y founders. Lo más rápido es un email.**
- Acciones: `rcalvosanz@gmail.com` · `GitHub` · `LinkedIn` · `Descargar CV`

**Footer**: `raúl calvo · 2026` · `Construido con Next.js`

---

## Lo que matamos (checklist de bans cerrados)

- [x] Eyebrow `// sección` sobre cada heading → el `//` vive **solo** en nav/wordmark.
- [x] Tiles de métricas `04 / 100% / 2 meses` → números dentro de la frase de "Sobre".
- [x] Rejilla 2×2 de tarjetas idénticas → índice editorial asimétrico de filas.
- [x] Rejilla de chips idénticos en stack → marquee discreto (ya existe) o tira inline; sin rejilla de tarjetas.
- [x] Un único `Reveal` clonado → sistema de motion variado por sección.
- [x] Copy con cadencia aforística → reescrito, específico.
- [x] Swatches de color como placeholder → screenshots reales grandes.

## Lo que conservamos (identity-preservation, decisión de Raúl)

- EB Garamond + Barlow + JetBrains Mono.
- Paleta dark `#080808` + cream + oro `#C8A35B`.
- Grano sutil de Ingegno.
- Stack Next.js estático, sin Supabase.

---

## Verificación post-build (cuando exista código)

Correr la crítica completa de impeccable (Assessment A + detector `detect.mjs` + overlay de navegador) sobre el build real, más:
- Contraste AA en body (`detect` + manual).
- Sin overflow de headings a 375 / 768 / 1280.
- `prefers-reduced-motion` desactiva todo el motion.
- Re-puntuar heurísticas sobre la UI viva.
