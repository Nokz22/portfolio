import { motion, useReducedMotion } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { useSkills } from '@/hooks/useSkills'
import { SkeletonLoader } from '@/components/ui/SkeletonLoader'
import { fadeUp } from '@/lib/motion-tokens'
import type { SkillDto } from '@/types/api'

function levelDotClass(level: SkillDto['level']): string {
  if (level === 'expert') return 'bg-accent'
  if (level === 'advanced') return 'bg-slate-600'
  if (level === 'intermediate') return 'bg-slate-400'
  return 'bg-transparent'
}

interface SkillPillProps {
  skill: SkillDto
}

function SkillPill({ skill }: SkillPillProps) {
  const { t } = useTranslation()
  const isLearning = skill.level === 'learning'

  return (
    <div
      className={`flex items-center gap-2 bg-surface-raised rounded-lg px-4 py-3 ${
        isLearning ? 'border border-dashed border-ink-200' : ''
      }`}
      title={t(`skills.levels.${skill.level}`)}
    >
      <span
        className={`w-2 h-2 rounded-full shrink-0 ${levelDotClass(skill.level)} ${
          isLearning ? 'border border-ink-300' : ''
        }`}
        aria-hidden="true"
      />
      <span
        className={`text-body-sm text-ink-950 ${isLearning ? 'italic text-ink-400' : ''}`}
      >
        {skill.name}
      </span>
    </div>
  )
}

export default function Skills() {
  const { t } = useTranslation()
  const { data: groups, isLoading, error } = useSkills()
  const reduced = useReducedMotion()

  const titleMotion = reduced
    ? {}
    : {
        initial: 'hidden',
        whileInView: 'visible',
        viewport: { once: true },
        variants: fadeUp,
      }

  const groupMotion = (index: number) =>
    reduced
      ? {}
      : {
          initial: 'hidden',
          whileInView: 'visible',
          viewport: { once: true, margin: '-60px' },
          variants: {
            hidden: { opacity: 0, y: 24 },
            visible: {
              opacity: 1,
              y: 0,
              transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1], delay: index * 0.05 },
            },
          },
        }

  return (
    <section
      id="skills"
      className="bg-surface py-section-y"
      aria-label={t('skills.title')}
    >
      <div className="max-w-content mx-auto px-6">
        {/* Section header */}
        <motion.div {...titleMotion} className="flex flex-col gap-2 mb-12">
          <span
            className="font-display text-display-xl text-accent/20 font-bold leading-none select-none"
            aria-hidden="true"
          >
            03
          </span>
          <h2 className="font-display text-display-sm text-ink-950 font-semibold">
            {t('skills.title')}
          </h2>
        </motion.div>

        {isLoading && (
          <div className="grid sm:grid-cols-2 gap-content-gap">
            {[1, 2, 3, 4].map((i) => (
              <SkeletonLoader key={i} className="h-32 w-full" />
            ))}
          </div>
        )}

        {error && (
          <p className="text-body-md text-ink-400">{error.message}</p>
        )}

        {groups && (
          <div className="flex flex-col gap-content-gap">
            {groups.map((group, i) => (
              <motion.div key={group.domain} {...groupMotion(i)}>
                <h3 className="font-display text-heading-xl text-ink-950 font-semibold mb-4">
                  {group.domain}
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                  {group.skills.map((skill) => (
                    <SkillPill key={skill.name} skill={skill} />
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
