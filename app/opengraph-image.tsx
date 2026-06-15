import { ImageResponse } from 'next/og'
import { site } from '@/lib/site'

export const runtime = 'edge'
export const alt = 'Raúl Calvo — Web developer & builder'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

// Satori requires every <div> with more than one child to set display:flex.
// Each text block below is a single string child, and the headline is an
// explicit flex column, so the card renders instead of streaming empty.
export default async function Og() {
  const garamond = await fetch(
    new URL('./eb-garamond-500.woff', import.meta.url),
  ).then((r) => r.arrayBuffer())

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%', height: '100%', display: 'flex', flexDirection: 'column',
          justifyContent: 'center', padding: 80, backgroundColor: '#080808', color: '#f2ede3',
          fontFamily: 'EB Garamond',
        }}
      >
        <div style={{ display: 'flex', fontSize: 28, color: '#c8a35b', letterSpacing: 2 }}>
          {`// builder · ${site.location.toLowerCase()}`}
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', fontSize: 88, marginTop: 24, lineHeight: 1.05 }}>
          <div style={{ display: 'flex' }}>Construyo cosas</div>
          <div style={{ display: 'flex' }}>para internet.</div>
        </div>
        <div style={{ display: 'flex', fontSize: 30, marginTop: 32, color: '#a8a296' }}>
          {`${site.name} · 4 proyectos en producción`}
        </div>
      </div>
    ),
    { ...size, fonts: [{ name: 'EB Garamond', data: garamond, weight: 500, style: 'normal' }] },
  )
}
