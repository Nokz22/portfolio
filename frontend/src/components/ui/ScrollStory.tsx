import { useRef } from 'react'
import {
  motion,
  useScroll,
  useTransform,
  useReducedMotion,
  MotionValue,
} from 'framer-motion'
import { useTranslation } from 'react-i18next'
import AmbientOrbs from '@/components/ui/AmbientOrbs'

interface Chapter {
  eyebrow: string
  headline: string
  body: string
  index: number
}

// Maps progress through [inStart → inEnd → outStart → outEnd] to opacity [0→1→1→0]
function useChapterOpacity(
  progress: MotionValue<number>,
  inStart: number,
  inEnd: number,
  outStart: number,
  outEnd: number,
) {
  return useTransform(progress, [inStart, inEnd, outStart, outEnd], [0, 1, 1, 0])
}

function useChapterY(
  progress: MotionValue<number>,
  inStart: number,
  inEnd: number,
  outStart: number,
  outEnd: number,
) {
  return useTransform(progress, [inStart, inEnd, outStart, outEnd], [50, 0, 0, -50])
}

interface ChapterSlideProps {
  chapter: Chapter
  progress: MotionValue<number>
  inStart: number
  inEnd: number
  outStart: number
  outEnd: number
}

function ChapterSlide({ chapter, progress, inStart, inEnd, outStart, outEnd }: ChapterSlideProps) {
  const opacity = useChapterOpacity(progress, inStart, inEnd, outStart, outEnd)
  const y = useChapterY(progress, inStart, inEnd, outStart, outEnd)
  const num = String(chapter.index + 1).padStart(2, '0')

  return (
    <motion.div
      style={{ opacity, y }}
      className="absolute inset-0 flex items-center justify-center pointer-events-none"
      aria-hidden="true"
    >
      <div className="text-center px-6 max-w-3xl mx-auto">
        {/* Eyebrow */}
        <p className="text-accent text-xs font-bold tracking-[0.3em] uppercase mb-4">
          {num} — {chapter.eyebrow}
        </p>

        {/* Main headline */}
        <h3 className="font-display font-bold text-white leading-none tracking-tight mb-6"
          style={{ fontSize: 'clamp(3.5rem, 12vw, 9rem)' }}
        >
          {chapter.headline}
        </h3>

        {/* Tags */}
        <div className="flex flex-wrap items-center justify-center gap-3">
          {chapter.body.split(' · ').map((tag) => (
            <span
              key={tag}
              className="border border-white/20 text-white/60 text-sm font-medium px-4 py-1.5 rounded-full"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>
    </motion.div>
  )
}

// ─── Progress bar at bottom ────────────────────────────────────────────────────
function ProgressBar({ progress }: { progress: MotionValue<number> }) {
  const scaleX = useTransform(progress, [0, 1], [0, 1])
  return (
    <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-white/10">
      <motion.div className="h-full bg-accent origin-left" style={{ scaleX }} />
    </div>
  )
}

// ─── Dot navigation ────────────────────────────────────────────────────────────
function DotNav({
  count,
  progress,
}: {
  count: number
  progress: MotionValue<number>
}) {
  return (
    <div className="absolute right-8 top-1/2 -translate-y-1/2 flex flex-col gap-3">
      {Array.from({ length: count }).map((_, i) => {
        const center = (i + 0.5) / count
        const opacity = useTransform(
          progress,
          [center - 0.4 / count, center, center + 0.4 / count],
          [0.25, 1, 0.25],
        )
        return (
          <motion.span
            key={i}
            style={{ opacity }}
            className="w-1.5 h-1.5 rounded-full bg-white block"
          />
        )
      })}
    </div>
  )
}

// ─── Main component ─────────────────────────────────────────────────────────────
export default function ScrollStory() {
  const { i18n } = useTranslation()
  const containerRef = useRef<HTMLDivElement>(null)
  const reduced = useReducedMotion()

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end'],
  })

  const isPT = i18n.language.startsWith('pt')

  const CHAPTERS: Chapter[] = [
    {
      eyebrow: isPT ? 'Backend' : 'Backend',
      headline: 'Java',
      body: 'Spring Boot · REST APIs · OOP',
      index: 0,
    },
    {
      eyebrow: isPT ? 'Frontend' : 'Frontend',
      headline: 'React',
      body: 'TypeScript · Tailwind CSS · Vite',
      index: 1,
    },
    {
      eyebrow: isPT ? 'Ferramentas' : 'Tooling',
      headline: 'Docker',
      body: 'Git · CI/CD · Linux',
      index: 2,
    },
    {
      eyebrow: isPT ? 'Disponibilidade' : 'Availability',
      headline: isPT ? 'Porto' : 'Porto',
      body: isPT
        ? 'Full-time · Freelance · Remoto'
        : 'Full-time · Freelance · Remote',
      index: 3,
    },
  ]

  // Each chapter occupies 25% of scroll range; overlap the transitions slightly
  const n = CHAPTERS.length
  const span = 1 / n
  const fadeSpan = span * 0.25

  // If reduced motion, show a simple static grid instead
  if (reduced) {
    return (
      <section id="stack" className="relative bg-ink-950 py-24 px-6 overflow-hidden" aria-label="Stack">
        <AmbientOrbs />
        <div className="relative z-10 max-w-content mx-auto grid sm:grid-cols-2 gap-8">
          {CHAPTERS.map((ch) => (
            <div key={ch.index} className="text-center">
              <p className="text-accent text-xs tracking-widest uppercase mb-2">{ch.eyebrow}</p>
              <h3 className="font-display text-5xl font-bold text-white mb-3">{ch.headline}</h3>
              <p className="text-white/50 text-sm">{ch.body}</p>
            </div>
          ))}
        </div>
      </section>
    )
  }

  return (
    // Container is taller than viewport — gives scroll room for the pinned inner
    <div
      ref={containerRef}
      style={{ height: `${(n + 1) * 100}vh` }}
      aria-label="Stack showcase"
    >
      {/* Sticky viewport — stays pinned while user scrolls through the container */}
      <div className="sticky top-0 h-screen bg-ink-950 overflow-hidden">
        <AmbientOrbs />
        {/* Chapters — stacked absolutely, each fades in/out */}
        {CHAPTERS.map((ch, i) => {
          const inStart  = i * span
          const inEnd    = i * span + fadeSpan
          const outStart = (i + 1) * span - fadeSpan
          // Last chapter stays visible until the end
          const outEnd   = i === n - 1 ? 1 : (i + 1) * span

          return (
            <ChapterSlide
              key={ch.index}
              chapter={ch}
              progress={scrollYProgress}
              inStart={inStart}
              inEnd={inEnd}
              outStart={outStart}
              outEnd={outEnd}
            />
          )
        })}

        {/* Dot nav */}
        <DotNav count={n} progress={scrollYProgress} />

        {/* Scroll hint — fades out quickly */}
        <motion.p
          className="absolute bottom-8 left-1/2 -translate-x-1/2 text-white/30 text-xs tracking-widest uppercase"
          style={{
            opacity: useTransform(scrollYProgress, [0, 0.08], [1, 0]),
          }}
          aria-hidden="true"
        >
          scroll
        </motion.p>

        {/* Progress bar */}
        <ProgressBar progress={scrollYProgress} />
      </div>
    </div>
  )
}
