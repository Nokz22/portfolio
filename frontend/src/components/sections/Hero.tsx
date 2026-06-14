import { useRef } from 'react'
import { motion, useScroll, useTransform, type MotionValue } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { useProfile } from '@/hooks/useProfile'
import RevealText from '@/components/ui/RevealText'

// ── Floating code tokens ──────────────────────────────────────────────────────

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

function ScrollIndicator() {
  return (
    <motion.div
      className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 2, duration: 0.8 }}
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

export default function Hero() {
  const { t } = useTranslation()
  const { data: profile } = useProfile()
  const sectionRef = useRef<HTMLElement>(null)

  const { scrollY } = useScroll()
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end start'],
  })

  // Parallax layers at different speeds
  const bgY        = useTransform(scrollYProgress, [0, 1], ['0%', '30%'])
  const contentY   = useTransform(scrollYProgress, [0, 1], ['0%', '12%'])
  const tokensY    = useTransform(scrollYProgress, [0, 1], ['0%', '6%'])

  const name  = profile?.name  ?? 'Nuno Ferreira'
  const title = profile?.title ?? 'Junior Software Developer'

  return (
    <section
      ref={sectionRef}
      id="hero"
      aria-label="Hero"
      className="relative min-h-screen flex flex-col justify-center text-white overflow-hidden"
      style={{ backgroundColor: '#0f0f12' }}
    >
      {/* ── Static ambient gradient (always visible, CSS-only) ── */}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        style={{ y: bgY }}
        aria-hidden="true"
      >
        <div
          className="absolute inset-0"
          style={{
            background: `
              radial-gradient(ellipse 70% 80% at 18% 62%, rgba(224,123,0,0.14) 0%, transparent 60%),
              radial-gradient(ellipse 55% 60% at 82% 28%, rgba(224,123,0,0.09) 0%, transparent 55%),
              radial-gradient(ellipse 50% 55% at 50% 90%, rgba(224,123,0,0.06) 0%, transparent 65%)
            `,
          }}
        />
      </motion.div>

      {/* ── Code tokens — parallax depth layer ── */}
      <motion.div
        className="absolute inset-0 hidden md:block pointer-events-none"
        style={{ y: tokensY }}
        aria-hidden="true"
      >
        {CODE_TOKENS.map((token) => (
          <CodeToken key={token.text} {...token} scrollY={scrollY} />
        ))}
      </motion.div>

      {/* ── Main content ── */}
      <motion.div
        className="relative z-10 pt-20 pb-28 px-6 max-w-content mx-auto w-full"
        style={{ y: contentY }}
      >
        <div className="flex flex-col gap-5 max-w-2xl">

          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
          >
            <span className="inline-flex items-center gap-2 bg-accent/10 border border-accent/30 text-accent text-xs font-semibold px-4 py-1.5 rounded-full tracking-wide">
              <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" aria-hidden="true" />
              {t('hero.available')}
            </span>
          </motion.div>

          {/* Name — char-by-char reveal */}
          <h1
            className="font-display font-bold text-white leading-none tracking-tight"
            style={{ fontSize: 'clamp(3rem, 8vw, 6rem)' }}
          >
            <RevealText text={name} by="char" delay={0.3} trigger="mount" />
          </h1>

          {/* Accent divider line draws from left */}
          <motion.div
            className="h-px bg-white/15 w-full max-w-lg"
            style={{ originX: 0 }}
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1], delay: 0.88 }}
            aria-hidden="true"
          />

          {/* Title — word-by-word */}
          <p
            className="font-display font-medium text-white/55"
            style={{ fontSize: 'clamp(1.1rem, 3vw, 1.85rem)' }}
          >
            <RevealText text={title} by="word" delay={0.82} trigger="mount" />
          </p>

          {/* Location */}
          <motion.p
            className="text-sm text-white/35 flex items-center gap-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.7, delay: 1.1 }}
          >
            <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            {profile?.location ?? 'Porto, Portugal'}
          </motion.p>

          {/* CTAs */}
          <motion.div
            className="flex flex-wrap gap-4 pt-2"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
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
              download={profile?.cvUrl ? 'Nuno-Ferreira-CV.pdf' : undefined}
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
