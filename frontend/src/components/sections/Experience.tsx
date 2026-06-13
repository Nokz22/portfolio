import { motion, useReducedMotion } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { useExperience } from '@/hooks/useExperience'
import { SkeletonLoader } from '@/components/ui/SkeletonLoader'
import { fadeUp } from '@/lib/motion-tokens'
import type { ExperienceDto } from '@/types/api'

function formatDate(dateStr: string, lang: string): string {
  const parts = dateStr.split('-')
  const year = parts[0]
  const month = parts[1]
  if (!year) return dateStr
  if (!month) return year
  try {
    const date = new Date(parseInt(year), parseInt(month) - 1)
    return new Intl.DateTimeFormat(lang, { month: 'short', year: 'numeric' }).format(date)
  } catch {
    return `${month}/${year}`
  }
}

interface ExperienceCardProps {
  entry: ExperienceDto
  reduced: boolean | null
  lang: string
}

function ExperienceCard({ entry, reduced, lang }: ExperienceCardProps) {
  const { t } = useTranslation()

  const motionProps = reduced
    ? {}
    : {
        initial: 'hidden',
        whileInView: 'visible',
        viewport: { once: true, margin: '-60px' },
        variants: fadeUp,
      }

  const start = formatDate(entry.startDate, lang)
  const end = entry.current ? t('experience.present') : (entry.endDate ? formatDate(entry.endDate, lang) : '')

  return (
    <motion.div {...motionProps} className="relative pl-10">
      {/* Timeline dot */}
      <span
        className="absolute left-[-5px] top-6 w-3 h-3 rounded-full bg-accent border-2 border-surface-raised"
        aria-hidden="true"
      />

      <motion.article
        className="bg-surface rounded-xl p-6 border border-ink-100 cursor-default"
        whileHover={reduced ? {} : {
          y: -4,
          borderColor: 'rgba(224, 123, 0, 0.3)',
          boxShadow: '0 12px 32px rgba(0,0,0,0.07)',
        }}
        transition={{ duration: 0.2, ease: 'easeOut' }}
      >
        <header className="flex flex-wrap items-start justify-between gap-3 mb-3">
          <div>
            <h3 className="font-display font-semibold text-xl text-ink-950">
              {entry.role}
            </h3>
            <p className="text-base text-ink-600 font-medium">{entry.company}</p>
          </div>
          <div className="flex flex-col items-end gap-1">
            <span className="text-sm text-ink-600 font-medium">
              {start} – {end}
            </span>
            <span className="text-xs text-ink-400">{entry.location}</span>
          </div>
        </header>

        <p className="text-sm text-ink-600 mb-4 leading-relaxed">{entry.description}</p>

        {entry.technologies.length > 0 && (
          <div className="flex flex-wrap gap-2" aria-label="Technologies">
            {entry.technologies.map((tech) => (
              <span
                key={tech}
                className="bg-surface-raised text-ink-600 text-xs font-medium px-2.5 py-1 rounded-md border border-ink-100"
              >
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
  const reduced = useReducedMotion()

  const titleMotion = reduced
    ? {}
    : {
        initial: 'hidden',
        whileInView: 'visible',
        viewport: { once: true },
        variants: fadeUp,
      }

  return (
    <section
      id="experience"
      className="bg-surface-raised py-section-y"
      aria-label={t('experience.title')}
    >
      <div className="max-w-content mx-auto px-6">
        {/* Section header */}
        <motion.div {...titleMotion} className="flex flex-col gap-2 mb-12">
          <span
            className="font-display text-[clamp(4rem,8vw,7rem)] text-accent/15 font-bold leading-none select-none"
            aria-hidden="true"
          >
            02
          </span>
          <h2 className="font-display text-[clamp(1.8rem,4vw,3rem)] text-ink-950 font-bold">
            {t('experience.title')}
          </h2>
        </motion.div>

        {/* Timeline */}
        {isLoading && (
          <div className="flex flex-col gap-6">
            {[1, 2, 3].map((i) => (
              <SkeletonLoader key={i} className="h-40 w-full" />
            ))}
          </div>
        )}

        {entries && entries.length > 0 && (
          <div className="relative">
            {/* Vertical line */}
            <div
              className="absolute left-0 top-0 bottom-0 w-px bg-ink-100"
              aria-hidden="true"
            />
            <div className="flex flex-col gap-6">
              {entries.map((entry) => (
                <ExperienceCard key={entry.id} entry={entry} reduced={reduced} lang={i18n.language} />
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  )
}
