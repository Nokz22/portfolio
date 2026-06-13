import { motion, useReducedMotion } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { useExperience } from '@/hooks/useExperience'
import { SkeletonLoader } from '@/components/ui/SkeletonLoader'
import { fadeUp } from '@/lib/motion-tokens'
import type { ExperienceDto } from '@/types/api'

const MONTH_NAMES = new Map<string, string>([
  ['01', 'Jan'], ['02', 'Fev'], ['03', 'Mar'], ['04', 'Abr'],
  ['05', 'Mai'], ['06', 'Jun'], ['07', 'Jul'], ['08', 'Ago'],
  ['09', 'Set'], ['10', 'Out'], ['11', 'Nov'], ['12', 'Dez'],
])

function formatDate(dateStr: string): string {
  const parts = dateStr.split('-')
  const year = parts[0] ?? dateStr
  const month = parts[1]
  if (!month) return year
  const monthName = MONTH_NAMES.get(month) ?? month
  return `${monthName} ${year}`
}

interface ExperienceCardProps {
  entry: ExperienceDto
  reduced: boolean | null
}

function ExperienceCard({ entry, reduced }: ExperienceCardProps) {
  const { t } = useTranslation()

  const motionProps = reduced
    ? {}
    : {
        initial: 'hidden',
        whileInView: 'visible',
        viewport: { once: true, margin: '-60px' },
        variants: fadeUp,
      }

  const start = formatDate(entry.startDate)
  const end = entry.current ? t('experience.present') : (entry.endDate ? formatDate(entry.endDate) : '')

  return (
    <motion.div {...motionProps} className="relative pl-10">
      {/* Timeline dot */}
      <span
        className="absolute left-[-5px] top-6 w-3 h-3 rounded-full bg-accent border-2 border-surface-raised"
        aria-hidden="true"
      />

      <article className="bg-surface rounded-xl p-6 border border-ink-100">
        <header className="flex flex-wrap items-start justify-between gap-3 mb-3">
          <div>
            <h3 className="font-display font-semibold text-heading-xl text-ink-950">
              {entry.role}
            </h3>
            <p className="text-body-md text-ink-600 font-medium">{entry.company}</p>
          </div>
          <div className="flex flex-col items-end gap-1">
            <span className="text-label-sm text-ink-400">
              {start} – {end}
            </span>
          </div>
        </header>

        <p className="text-body-md text-ink-600 mb-4">{entry.description}</p>

        {entry.technologies.length > 0 && (
          <div className="flex flex-wrap gap-2" aria-label="Technologies">
            {entry.technologies.map((tech) => (
              <span
                key={tech}
                className="bg-surface-raised text-ink-600 text-label-sm px-2 py-0.5 rounded"
              >
                {tech}
              </span>
            ))}
          </div>
        )}
      </article>
    </motion.div>
  )
}

export default function Experience() {
  const { t } = useTranslation()
  const { data: entries, isLoading, error } = useExperience()
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
            className="font-display text-display-xl text-accent/20 font-bold leading-none select-none"
            aria-hidden="true"
          >
            02
          </span>
          <h2 className="font-display text-display-sm text-ink-950 font-semibold">
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

        {error && (
          <p className="text-body-md text-ink-400">{error.message}</p>
        )}

        {entries && entries.length > 0 && (
          <div className="relative">
            {/* Vertical line */}
            <div
              className="absolute left-0 top-0 bottom-0 w-px bg-ink-100"
              aria-hidden="true"
            />
            <div className="flex flex-col gap-8">
              {entries.map((entry) => (
                <ExperienceCard key={entry.id} entry={entry} reduced={reduced} />
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  )
}
