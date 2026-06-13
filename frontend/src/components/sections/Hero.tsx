import { useRef } from 'react'
import { motion, useScroll, useTransform, useReducedMotion } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { useProfile } from '@/hooks/useProfile'
import { fadeUp } from '@/lib/motion-tokens'
import ForgeShader from '@/components/webgl/ForgeShader'

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.12,
    },
  },
}

function ScrollIndicator() {
  return (
    <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2">
      <span className="text-white/40 text-xs tracking-widest uppercase">scroll</span>
      <motion.div
        animate={{ y: [0, 8, 0] }}
        transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
        aria-hidden="true"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="w-4 h-4 text-white/40"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </motion.div>
    </div>
  )
}

export default function Hero() {
  const { t } = useTranslation()
  const { data: profile } = useProfile()
  const reduced = useReducedMotion()
  const sectionRef = useRef<HTMLElement>(null)

  // Parallax — shader background moves slower than content on scroll
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end start'],
  })
  const shaderY = useTransform(scrollYProgress, [0, 1], ['0%', '25%'])
  const contentY = useTransform(scrollYProgress, [0, 1], ['0%', '8%'])

  const variants = reduced
    ? { hidden: { opacity: 1, y: 0 }, visible: { opacity: 1, y: 0 } }
    : fadeUp

  return (
    <section
      ref={sectionRef}
      id="hero"
      className="relative min-h-screen flex flex-col justify-center bg-ink-950 text-white overflow-hidden"
      aria-label="Hero"
    >
      {/* WebGL background — moves slower than content (parallax) */}
      <motion.div
        className="absolute inset-0"
        style={reduced ? {} : { y: shaderY }}
      >
        <ForgeShader />
      </motion.div>

      {/* Content */}
      <motion.div
        className="relative z-10 pt-20 pb-24 px-6 max-w-content mx-auto w-full"
        style={reduced ? {} : { y: contentY }}
      >
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="flex flex-col gap-6 max-w-2xl"
        >
          {/* Availability badge */}
          <motion.div variants={variants}>
            <span className="inline-flex items-center gap-2 bg-accent/10 border border-accent/30 text-accent text-xs font-semibold px-4 py-1.5 rounded-full tracking-wide">
              <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" aria-hidden="true" />
              {t('hero.available')}
            </span>
          </motion.div>

          {/* Name */}
          <motion.h1
            variants={variants}
            className="font-display text-[clamp(2.8rem,7vw,5.5rem)] font-bold text-white leading-none tracking-tight"
          >
            {profile?.name ?? 'Nuno Ferreira'}
          </motion.h1>

          {/* Title */}
          <motion.p
            variants={variants}
            className="font-display text-[clamp(1.2rem,3vw,2rem)] font-medium text-white/60"
          >
            {profile?.title ?? 'Junior Software Developer'}
          </motion.p>

          {/* Location */}
          <motion.p variants={variants} className="text-base text-white/40 flex items-center gap-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-4 h-4 shrink-0"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
              />
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            {profile?.location ?? 'Porto, Portugal'}
          </motion.p>

          {/* CTAs */}
          <motion.div variants={variants} className="flex flex-wrap gap-4 pt-2">
            <motion.button
              onClick={() => document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth' })}
              className="bg-accent hover:bg-accent-dim text-white font-semibold px-6 py-3 rounded-lg transition-colors duration-fast"
              data-cursor="pointer"
              whileHover={reduced ? {} : { scale: 1.04, y: -2 }}
              whileTap={reduced ? {} : { scale: 0.97 }}
              transition={{ type: 'spring', stiffness: 400, damping: 20 }}
            >
              {t('hero.cta_primary')}
            </motion.button>
            <motion.a
              href={profile?.cvUrl ?? '#'}
              target={profile?.cvUrl ? '_blank' : undefined}
              rel="noopener noreferrer"
              className="border border-white/30 hover:border-white/60 text-white px-6 py-3 rounded-lg transition-colors duration-fast inline-block"
              data-cursor="pointer"
              whileHover={reduced ? {} : { scale: 1.04, y: -2 }}
              whileTap={reduced ? {} : { scale: 0.97 }}
              transition={{ type: 'spring', stiffness: 400, damping: 20 }}
            >
              {t('hero.cta_secondary')}
            </motion.a>
          </motion.div>
        </motion.div>
      </motion.div>

      {/* Scroll indicator */}
      {!reduced && <ScrollIndicator />}
    </section>
  )
}
