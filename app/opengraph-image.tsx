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
