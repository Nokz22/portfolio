import { useEffect } from 'react'
import { motion } from 'framer-motion'
import Lenis from 'lenis'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import CustomCursor from '@/components/ui/CustomCursor'
import ScrollMarquee from '@/components/ui/ScrollMarquee'
import ScrollStory from '@/components/ui/ScrollStory'
import Hero from '@/components/sections/Hero'
import About from '@/components/sections/About'
import Experience from '@/components/sections/Experience'
import Skills from '@/components/sections/Skills'
import Projects from '@/components/sections/Projects'
import Contact from '@/components/sections/Contact'

export default function Home() {
  useEffect(() => {
    const lenis = new Lenis()
    let rafId: number
    const loop = (t: number) => {
      lenis.raf(t)
      rafId = requestAnimationFrame(loop)
    }
    rafId = requestAnimationFrame(loop)
    return () => {
      lenis.destroy()
      cancelAnimationFrame(rafId)
    }
  }, [])

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      <CustomCursor />
      <Navbar />
      <main id="main-content" aria-label="Portfolio">
        <Hero />

        {/* Scroll-linked marquee — separates Hero from content */}
        <ScrollMarquee />

        <About />
        <Experience />

        {/* Scroll-scrubbed story — pinned section that advances with scroll */}
        <ScrollStory />

        <Skills />
        <Projects />
        <Contact />
      </main>
      <Footer />
    </motion.div>
  )
}
