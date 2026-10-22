import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import PageTransition from '../components/PageTransition'
import Hero from '../components/Hero'
import About from '../components/About'
import Projects from '../components/Projects'
import Experience from '../components/Experience'
import Contact from '../components/Contact'
import Footer from '../components/Footer'
import { scrollToTarget } from '../hooks/useLenis'

export default function Home() {
  const location = useLocation()

  useEffect(() => {
    document.title = 'Ricky Kang — Developer'
    // arriving from a detail page via the nav: jump to the requested section
    const target = (location.state as { scrollTo?: string } | null)?.scrollTo
    if (target) {
      const id = window.setTimeout(() => scrollToTarget(target), 550)
      return () => window.clearTimeout(id)
    }
    window.scrollTo(0, 0)
  }, [location.state])

  return (
    <PageTransition>
      <Hero />
      <About />
      <Projects />
      <Experience />
      <Contact />
      <Footer />
    </PageTransition>
  )
}
