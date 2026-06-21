import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { useExperience } from '@/hooks/useExperience'
import { SkeletonLoader } from '@/components/ui/SkeletonLoader'
import RevealText from '@/components/ui/RevealText'
import type { ExperienceDto } from '@/types/api'

const EASE = [0.16, 1, 0.3, 1] as const

function formatDate(dateStr: string, lang: string): string {
  const parts = dateStr.split('-')
  const year = parts[0]
  const month = parts[1]
  if (!year) return dateStr
  if (!month) return year
  try {
    return new Intl.DateTimeFormat(lang, { month: 'short', year: 'numeric' }).format(
      new Date(parseInt(year), parseInt(month) - 1)
    )
  } catch {
    return `${month}/${year}`
  }
}

function TimelineLine() {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '-10% 0px' })

  return (
    <motion.div
      ref={ref}
      className="absolute left-0 top-0 bottom-0 w-px bg-ink-200"
      style={{ originY: 0 }}
      initial={{ scaleY: 0 }}
      animate={inView ? { scaleY: 1 } : {}}
      transition={{ duration: 1.5, ease: EASE, delay: 0.2 }}
      aria-hidden="true"
    />
  )
}

function ExperienceCard({ entry, lang, index }: { entry: ExperienceDto; lang: string; index: number }) {
  const { t } = useTranslation()
  const start = formatDate(entry.startDate, lang)
  const end = entry.current ? t('experience.present') : (entry.endDate ? formatDate(entry.endDate, lang) : '')

  return (
    <motion.div
      className="relative pl-10"
      initial={{ opacity: 0, x: -32 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{ duration: 0.65, ease: EASE, delay: index * 0.08 }}
    >
      {/* Dot */}
      <motion.span
        className="absolute left-[-5px] top-6 w-3 h-3 rounded-full bg-accent border-2 border-surface-raised"
        initial={{ scale: 0 }}
        whileInView={{ scale: 1 }}
        viewport={{ once: true }}
        transition={{ type: 'spring', stiffness: 400, damping: 20, delay: 0.1 + index * 0.08 }}
        aria-hidden="true"
      />

      <motion.article
        className="bg-surface rounded-xl p-6 border border-ink-100 cursor-default"
        whileHover={{ y: -4, borderColor: 'rgba(224,123,0,0.3)', boxShadow: '0 12px 32px rgba(0,0,0,0.07)' }}
        transition={{ duration: 0.2, ease: 'easeOut' }}
      >
        <header className="flex flex-wrap items-start justify-between gap-3 mb-3">
          <div>
            <h3 className="font-display font-semibold text-xl text-ink-950">{entry.role}</h3>
            <p className="text-base text-ink-600 font-medium">{entry.company}</p>
          </div>
          <div className="flex flex-col items-end gap-1">
            <span className="text-sm text-ink-600 font-medium">{start} – {end}</span>
            <span className="text-xs text-ink-400">{entry.location}</span>
          </div>
        </header>

        <p className="text-sm text-ink-600 mb-4 leading-relaxed">{entry.description}</p>

        {entry.technologies.length > 0 && (
          <div className="flex flex-wrap gap-2" aria-label="Technologies">
            {entry.technologies.map((tech) => (
              <span key={tech} className="bg-surface-raised text-ink-600 text-xs font-medium px-2.5 py-1 rounded-md border border-ink-100">
                {tech}
              </span>
            ))}
          </div>
        )}
      </motion.article>
    </motion.div>
  )
}

export default function Experience() {
  const { t, i18n } = useTranslation()
  const { data: entries, isLoading } = useExperience()

  return (
    <section id="experience" className="bg-surface-raised py-section-y" aria-label={t('experience.title')}>
      <div className="max-w-content mx-auto px-6">

        <div className="flex flex-col gap-1 mb-12">
          <motion.span
            className="font-display text-[clamp(4rem,8vw,7rem)] text-accent/15 font-bold leading-none select-none block"
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.7, ease: EASE }}
            aria-hidden="true"
          >
            02
          </motion.span>
          <h2 className="font-display text-[clamp(1.8rem,4vw,3rem)] text-ink-950 font-bold">
            <RevealText text={t('experience.title')} by="word" delay={0.08} />
          </h2>
        </div>

        {isLoading && (
          <div className="flex flex-col gap-6">
            {[1, 2, 3].map((i) => <SkeletonLoader key={i} className="h-40 w-full" />)}
          </div>
        )}

        {entries && entries.length > 0 && (
          <div className="relative">
            <TimelineLine />
            <div className="flex flex-col gap-6">
              {entries.map((entry, i) => (
                <ExperienceCard key={entry.id} entry={entry} lang={i18n.language} index={i} />
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  )
}
