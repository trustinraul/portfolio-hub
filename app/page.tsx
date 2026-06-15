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
