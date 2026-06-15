import { Nav } from '@/components/Nav'
import { Hero } from '@/components/Hero'
import { About } from '@/components/About'
import { WorkIndex } from '@/components/WorkIndex'
import { Contact } from '@/components/Contact'
import { Footer } from '@/components/Footer'

export default function Home() {
  return (
    <>
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[60] focus:rounded-md focus:bg-text focus:px-4 focus:py-2 focus:text-sm focus:text-bg"
      >
        Saltar al contenido
      </a>
      <Nav />
      <main id="main-content">
        <Hero />
        <About />
        <WorkIndex />
        <Contact />
      </main>
      <Footer />
    </>
  )
}
