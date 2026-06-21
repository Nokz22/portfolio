import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { useSkills } from '@/hooks/useSkills'
import { SkeletonLoader } from '@/components/ui/SkeletonLoader'
import RevealText from '@/components/ui/RevealText'
import type { SkillDto } from '@/types/api'

const EASE = [0.16, 1, 0.3, 1] as const

const LEVEL_CONFIG: Record<SkillDto['level'], { width: string; color: string }> = {
  expert:       { width: '92%', color: '#E07B00' },
  advanced:     { width: '74%', color: '#b06010' },
  intermediate: { width: '50%', color: '#64748b' },
  learning:     { width: '22%', color: '#94a3b8' },
}

function SkillBar({ skill, index }: { skill: SkillDto; index: number }) {
  const { t } = useTranslation()
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '-8% 0px' })
  const cfg = LEVEL_CONFIG[skill.level]

  return (
    <div ref={ref} className="flex flex-col gap-1.5">
      <div className="flex items-center justify-between">
        <span className={`text-sm font-medium ${skill.level === 'learning' ? 'text-ink-400 italic' : 'text-ink-950'}`}>
          {skill.name}
        </span>
        <span className="text-xs text-ink-400 font-medium">
          {t(`skills.levels.${skill.level}`)}
        </span>
      </div>
      {/* Track */}
      <div className="h-1 bg-ink-100 rounded-full overflow-hidden">
        <motion.div
          className="h-full rounded-full"
          style={{ background: cfg.color }}
          initial={{ width: 0 }}
          animate={inView ? { width: cfg.width } : { width: 0 }}
          transition={{ duration: 1.1, ease: EASE, delay: index * 0.07 }}
        />
      </div>
    </div>
  )
}

export default function Skills() {
  const { t } = useTranslation()
  const { data: groups, isLoading } = useSkills()

  return (
    <section id="skills" className="bg-surface py-section-y" aria-label={t('skills.title')}>
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
            03
          </motion.span>
          <h2 className="font-display text-[clamp(1.8rem,4vw,3rem)] text-ink-950 font-bold">
            <RevealText text={t('skills.title')} by="word" delay={0.08} />
          </h2>
        </div>

        {isLoading && (
          <div className="grid sm:grid-cols-2 gap-content-gap">
            {[1, 2, 3, 4].map((i) => <SkeletonLoader key={i} className="h-32 w-full" />)}
          </div>
        )}

        {groups && (
          <div className="grid sm:grid-cols-2 gap-x-16 gap-y-12">
            {groups.map((group, gi) => (
              <motion.div
                key={group.domain}
                initial={{ opacity: 0, y: 28 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.6, ease: EASE, delay: gi * 0.08 }}
              >
                <h3 className="text-xs font-bold text-ink-400 uppercase tracking-[0.18em] mb-5 pb-2 border-b border-ink-100">
                  {t(`skills.domains.${group.domain}`, { defaultValue: group.domain })}
                </h3>
                <div className="flex flex-col gap-4">
                  {group.skills.map((skill, si) => (
                    <SkillBar key={skill.name} skill={skill} index={gi * 4 + si} />
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
