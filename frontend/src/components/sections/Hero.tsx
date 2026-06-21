import { useRef, useEffect, useState } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { useProfile } from '@/hooks/useProfile'
import RevealText from '@/components/ui/RevealText'
import AmbientOrbs from '@/components/ui/AmbientOrbs'

// ── Code tokens ───────────────────────────────────────────────────────────────

interface TokenData {
  text: string; left: string; top: string; size: string
  opacity: number; factor: number; amber?: boolean
}

const CODE_TOKENS: TokenData[] = [
  { text: 'interface Dev {',  left: '53%', top: '12%', size: '0.95rem', opacity: 0.13, factor: 0.38 },
  { text: 'return this;',     left: '78%', top: '22%', size: '0.78rem', opacity: 0.10, factor: 0.54 },
  { text: 'async / await',    left: '65%', top: '36%', size: '1.15rem', opacity: 0.12, factor: 0.21 },
  { text: '{ }',              left: '89%', top: '48%', size: '2.0rem',  opacity: 0.08, factor: 0.60, amber: true },
  { text: 'npm run dev',      left: '56%', top: '60%', size: '0.82rem', opacity: 0.11, factor: 0.28 },
  { text: '// build & ship',  left: '72%', top: '70%', size: '0.74rem', opacity: 0.10, factor: 0.44 },
  { text: 'git push',         left: '59%', top: '80%', size: '0.88rem', opacity: 0.11, factor: 0.24 },
  { text: '=>',               left: '48%', top: '24%', size: '1.55rem', opacity: 0.09, factor: 0.63, amber: true },
  { text: 'extends React',    left: '82%', top: '41%', size: '0.82rem', opacity: 0.11, factor: 0.17 },
  { text: '@SpringBootApp',   left: '62%', top: '15%', size: '0.78rem', opacity: 0.12, factor: 0.47 },
  { text: 'docker run -it',   left: '48%', top: '74%', size: '0.85rem', opacity: 0.10, factor: 0.34 },
  { text: '</>',              left: '76%', top: '32%', size: '1.45rem', opacity: 0.09, factor: 0.50, amber: true },
]

function CodeToken({ text, left, top, size, opacity, factor, amber, scrollY }: TokenData & { scrollY: MotionValue<number> }) {
  const y = useTransform(scrollY, [0, 800], [0, factor * 200])
  return (
    <motion.span
      style={{
        position: 'absolute', left, top, fontSize: size, y,
        fontFamily: '"Fira Code","Cascadia Code","JetBrains Mono",Menlo,monospace',
        color: amber ? 'rgba(224,123,0,0.9)' : 'rgba(255,255,255,0.9)',
        textShadow: amber ? '0 0 28px rgba(224,123,0,0.25)' : '0 0 14px rgba(255,255,255,0.06)',
        pointerEvents: 'none', userSelect: 'none', letterSpacing: '0.02em', whiteSpace: 'nowrap',
      }}
      initial={{ opacity: 0 }}
      animate={{ opacity }}
      transition={{ duration: 1, delay: 1.4 + Math.random() * 0.6 }}
      aria-hidden="true"
    >
      {text}
    </motion.span>
  )
}

// ── Typewriter ────────────────────────────────────────────────────────────────

function useTypewriter(phrases: string[], typingSpeed = 65, deletingSpeed = 35, pauseMs = 2200) {
  const [idx, setIdx] = useState(0)
  const [displayed, setDisplayed] = useState('')
  const [deleting, setDeleting] = useState(false)
  const [started, setStarted] = useState(false)

  // Start typewriter after initial RevealText animations finish
  useEffect(() => {
    const t = setTimeout(() => setStarted(true), 2800)
    return () => clearTimeout(t)
  }, [])

  useEffect(() => {
    if (!started) return
    const phrase = phrases[idx]
    let timer: ReturnType<typeof setTimeout>

    if (!phrase) return
    if (!deleting && displayed === phrase) {
      timer = setTimeout(() => setDeleting(true), pauseMs)
    } else if (deleting && displayed === '') {
      setDeleting(false)
      setIdx((i) => (i + 1) % phrases.length)
    } else {
      timer = setTimeout(() => {
        setDisplayed(deleting
          ? phrase.slice(0, displayed.length - 1)
          : phrase.slice(0, displayed.length + 1)
        )
      }, deleting ? deletingSpeed : typingSpeed)
    }
    return () => clearTimeout(timer)
  }, [displayed, deleting, idx, phrases, typingSpeed, deletingSpeed, pauseMs, started])

  return { displayed, started }
}

function TypewriterTitle({ phrases }: { phrases: string[] }) {
  const { displayed, started } = useTypewriter(phrases)

  if (!started) return null

  return (
    <span className="inline-flex items-center gap-0.5">
      <span>{displayed}</span>
      <motion.span
        className="inline-block w-[2px] h-[1em] bg-accent ml-0.5 align-middle"
        animate={{ opacity: [1, 1, 0, 0] }}
        transition={{ duration: 0.9, repeat: Infinity, times: [0, 0.45, 0.5, 0.95] }}
        aria-hidden="true"
      />
    </span>
  )
}

// ── Scroll indicator ──────────────────────────────────────────────────────────

function ScrollIndicator() {
  return (
    <motion.div
      className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 2.2, duration: 0.8 }}
    >
      <span className="text-white/40 text-[10px] tracking-[0.3em] uppercase">scroll</span>
      <motion.div
        animate={{ y: [0, 8, 0] }}
        transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut' }}
      >
        <svg className="w-4 h-4 text-white/30" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </motion.div>
    </motion.div>
  )
}


// ── Hero ──────────────────────────────────────────────────────────────────────

export default function Hero() {
  const { t } = useTranslation()
  const { data: profile } = useProfile()
  const sectionRef = useRef<HTMLElement>(null)

  const { scrollY } = useScroll()
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end start'],
  })

  const bgY      = useTransform(scrollYProgress, [0, 1], ['0%', '30%'])
  const contentY = useTransform(scrollYProgress, [0, 1], ['0%', '12%'])
  const tokensY  = useTransform(scrollYProgress, [0, 1], ['0%', '6%'])

  const name    = profile?.name  ?? 'Nuno Ferreira'
  const title   = profile?.title ?? 'Junior Software Developer'
  const phrases = t('hero.phrases', { returnObjects: true }) as string[]

  return (
    <section
      ref={sectionRef}
      id="hero"
      aria-label="Hero"
      className="relative min-h-screen flex flex-col justify-center text-white overflow-hidden"
      style={{ backgroundColor: '#0f0f12' }}
    >
      {/* Animated ambient orbs */}
      <motion.div className="absolute inset-0" style={{ y: bgY }} aria-hidden="true">
        <AmbientOrbs />
      </motion.div>

      {/* Code tokens */}
      <motion.div className="absolute inset-0 hidden md:block pointer-events-none" style={{ y: tokensY }} aria-hidden="true">
        {CODE_TOKENS.map((token) => (
          <CodeToken key={token.text} {...token} scrollY={scrollY} />
        ))}
      </motion.div>

      {/* Content */}
      <motion.div className="relative z-10 pt-20 pb-28 px-6 max-w-content mx-auto w-full" style={{ y: contentY }}>
        <div className="flex flex-col gap-5 max-w-2xl">

          {/* Badge */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}>
            <span className="inline-flex items-center gap-2 bg-accent/10 border border-accent/30 text-accent text-xs font-semibold px-4 py-1.5 rounded-full tracking-wide">
              <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" aria-hidden="true" />
              {t('hero.available')}
            </span>
          </motion.div>

          {/* Name */}
          <h1 className="font-display font-bold text-white leading-none tracking-tight" style={{ fontSize: 'clamp(3rem, 8vw, 6rem)' }}>
            <RevealText text={name} by="char" delay={0.3} trigger="mount" />
          </h1>

          {/* Divider */}
          <motion.div className="h-px bg-white/15 w-full max-w-lg" style={{ originX: 0 }}
            initial={{ scaleX: 0 }} animate={{ scaleX: 1 }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1], delay: 0.88 }}
            aria-hidden="true"
          />

          {/* Title — reveals once, then typewriter takes over */}
          <div className="font-display font-medium text-white/55 min-h-[2.2rem]" style={{ fontSize: 'clamp(1.1rem, 3vw, 1.85rem)' }}>
            <motion.span
              initial={{ opacity: 1 }}
              animate={{ opacity: 1 }}
            >
              <RevealText text={title} by="word" delay={0.82} trigger="mount" />
            </motion.span>
            <TypewriterTitle phrases={Array.isArray(phrases) ? phrases : [title]} />
          </div>

          {/* Location */}
          <motion.p className="text-sm text-white/35 flex items-center gap-2"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            transition={{ duration: 0.7, delay: 1.1 }}
          >
            <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            {profile?.location ?? 'Porto, Portugal'}
          </motion.p>

          {/* CTAs */}
          <motion.div className="flex flex-wrap gap-4 pt-2"
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1], delay: 1.2 }}
          >
            <motion.button
              onClick={() => document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth' })}
              className="bg-accent hover:bg-accent-dim text-white font-semibold px-6 py-3 rounded-lg transition-colors"
              data-cursor="pointer"
              whileHover={{ scale: 1.04, y: -2 }}
              whileTap={{ scale: 0.97 }}
              transition={{ type: 'spring', stiffness: 400, damping: 20 }}
            >
              {t('hero.cta_primary')}
            </motion.button>
            <motion.a
              href={profile?.cvUrl ?? '#'}
              target={profile?.cvUrl ? '_blank' : undefined}
              rel="noopener noreferrer"
              className="border border-white/25 hover:border-white/60 text-white px-6 py-3 rounded-lg transition-colors inline-block"
              data-cursor="pointer"
              whileHover={{ scale: 1.04, y: -2 }}
              whileTap={{ scale: 0.97 }}
              transition={{ type: 'spring', stiffness: 400, damping: 20 }}
            >
              {t('hero.cta_secondary')}
            </motion.a>
          </motion.div>
        </div>
      </motion.div>

      <ScrollIndicator />
    </section>
  )
}
