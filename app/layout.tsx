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
