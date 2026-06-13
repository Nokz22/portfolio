import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { LanguageToggle } from '@/components/ui/LanguageToggle'

const NAV_ITEMS = [
  { key: 'nav.about', id: 'about' },
  { key: 'nav.experience', id: 'experience' },
  { key: 'nav.skills', id: 'skills' },
  { key: 'nav.projects', id: 'projects' },
  { key: 'nav.contact', id: 'contact' },
] as const

export default function Navbar() {
  const { t } = useTranslation()
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  function scrollTo(id: string) {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
    setMenuOpen(false)
  }

  const baseNav = scrolled
    ? 'bg-surface/90 backdrop-blur-md border-b border-ink-100 text-ink-950'
    : 'bg-transparent text-white'

  return (
    <>
      <header
        className={`fixed top-0 inset-x-0 z-50 transition-all duration-moderate ease-out-cubic ${baseNav}`}
      >
        <div className="max-w-content mx-auto px-6 h-16 flex items-center justify-between">
          {/* Monogram */}
          <button
            onClick={() => scrollTo('hero')}
            className="font-display font-bold text-accent text-xl leading-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
            aria-label="Go to top"
          >
            NF
          </button>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-8" aria-label="Primary navigation">
            {NAV_ITEMS.map((item) => (
              <button
                key={item.id}
                onClick={() => scrollTo(item.id)}
                className={`text-label-lg font-medium transition-colors duration-fast hover:text-accent ${
                  scrolled ? 'text-ink-600' : 'text-white/80'
                }`}
              >
                {t(item.key)}
              </button>
            ))}
          </nav>

          {/* Right: lang toggle + hamburger */}
          <div className="flex items-center gap-4">
            <div className={scrolled ? '' : '[&_button]:!text-white/80 [&_button.text-accent]:!text-accent [&_span]:!text-white/30'}>
              <LanguageToggle />
            </div>

            {/* Hamburger */}
            <button
              onClick={() => setMenuOpen((v) => !v)}
              className="md:hidden p-2 rounded-lg"
              aria-label={menuOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={menuOpen}
            >
              <span className="block w-5 h-0.5 bg-current mb-1 transition-all duration-fast" />
              <span className="block w-5 h-0.5 bg-current mb-1 transition-all duration-fast" />
              <span className="block w-5 h-0.5 bg-current transition-all duration-fast" />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile overlay menu */}
      {menuOpen && (
        <div
          className="fixed inset-0 z-40 bg-ink-950/95 backdrop-blur-sm flex flex-col items-center justify-center gap-8"
          role="dialog"
          aria-modal="true"
          aria-label="Navigation menu"
        >
          <button
            onClick={() => setMenuOpen(false)}
            className="absolute top-5 right-6 text-white/60 hover:text-white text-2xl"
            aria-label="Close menu"
          >
            ✕
          </button>
          {NAV_ITEMS.map((item) => (
            <button
              key={item.id}
              onClick={() => scrollTo(item.id)}
              className="text-display-sm text-white font-display font-semibold hover:text-accent transition-colors duration-fast"
            >
              {t(item.key)}
            </button>
          ))}
          <div className="mt-4">
            <LanguageToggle />
          </div>
        </div>
      )}
    </>
  )
}
