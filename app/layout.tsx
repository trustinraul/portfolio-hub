import type { Metadata } from 'next'
import { EB_Garamond, Barlow, JetBrains_Mono } from 'next/font/google'
import { site } from '@/lib/site'
import './globals.css'

const ebGaramond = EB_Garamond({ subsets: ['latin'], variable: '--font-eb-garamond', display: 'swap' })
const barlow = Barlow({ subsets: ['latin'], weight: ['400', '500', '600'], variable: '--font-barlow', display: 'swap' })
const jetbrainsMono = JetBrains_Mono({ subsets: ['latin'], variable: '--font-jetbrains-mono', display: 'swap' })

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

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" className={`${ebGaramond.variable} ${barlow.variable} ${jetbrainsMono.variable}`}>
      <body>{children}</body>
    </html>
  )
}
