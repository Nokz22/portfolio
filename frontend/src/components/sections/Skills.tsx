import { motion, useReducedMotion } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { useSkills } from '@/hooks/useSkills'
import { SkeletonLoader } from '@/components/ui/SkeletonLoader'
import { fadeUp } from '@/lib/motion-tokens'
import type { SkillDto } from '@/types/api'

const LEVEL_COLORS: Record<SkillDto['level'], string> = {
  expert: 'bg-accent',
  advanced: 'bg-slate-500',
  intermediate: 'bg-slate-400',
  learning: 'bg-transparent border border-ink-300',
}

interface SkillPillProps {
  skill: SkillDto
  index: number
  reduced: boolean | null
}

function SkillPill({ skill, index, reduced }: SkillPillProps) {
  const { t } = useTranslation()
  const isLearning = skill.level === 'learning'

  return (
    <motion.div
      className={`flex items-center gap-2.5 bg-surface-raised rounded-lg px-4 py-3 border cursor-default ${
        isLearning ? 'border-dashed border-ink-200' : 'border-transparent'
      }`}
      title={t(`skills.levels.${skill.level}`)}
      initial={reduced ? {} : { opacity: 0, y: 16 }}
      whileInView={reduced ? {} : { opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1], delay: index * 0.04 }}
      whileHover={reduced ? {} : {
        scale: 1.05,
        backgroundColor: 'rgba(224,123,0,0.06)',
        borderColor: 'rgba(224,123,0,0.25)',
        transition: { duration: 0.15 },
      }}
    >
      <span
        className={`w-2 h-2 rounded-full shrink-0 ${LEVEL_COLORS[skill.level]}`}
        aria-hidden="true"
      />
      <span className={`text-sm font-medium ${isLearning ? 'italic text-ink-400' : 'text-ink-950'}`}>
        {skill.name}
      </span>
    </motion.div>
  )
}

export default function Skills() {
  const { t } = useTranslation()
  const { data: groups, isLoading } = useSkills()
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
      id="skills"
      className="bg-surface py-section-y"
      aria-label={t('skills.title')}
    >
      <div className="max-w-content mx-auto px-6">
        {/* Section header */}
        <motion.div {...titleMotion} className="flex flex-col gap-2 mb-12">
          <span
            className="font-display text-[clamp(4rem,8vw,7rem)] text-accent/15 font-bold leading-none select-none"
            aria-hidden="true"
          >
            03
          </span>
          <h2 className="font-display text-[clamp(1.8rem,4vw,3rem)] text-ink-950 font-bold">
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

        {groups && (
          <div className="flex flex-col gap-content-gap">
            {groups.map((group, gi) => (
              <motion.div
                key={group.domain}
                initial={reduced ? {} : { opacity: 0, y: 24 }}
                whileInView={reduced ? {} : { opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-60px' }}
                transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1], delay: gi * 0.08 }}
              >
                <h3 className="font-display text-base font-semibold text-ink-400 uppercase tracking-widest mb-4">
                  {group.domain}
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                  {group.skills.map((skill, si) => (
                    <SkillPill
                      key={skill.name}
                      skill={skill}
                      index={gi * 4 + si}
                      reduced={reduced}
                    />
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
