import { useRef, useEffect, useState } from 'react'
import { motion, useInView, animate } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import AmbientOrbs from '@/components/ui/AmbientOrbs'

const EASE = [0.16, 1, 0.3, 1] as const

interface Stat {
  value: number
  prefix?: string
  suffix?: string
  labelKey: string
  descKey: string
}

const STATS: Stat[] = [
  { value: 10,  suffix: '+', labelKey: 'stats.tech_label',     descKey: 'stats.tech_desc'     },
  { value: 7,   suffix: '',  labelKey: 'stats.months_label',   descKey: 'stats.months_desc'   },
  { value: 8,   suffix: '+', labelKey: 'stats.years_label',    descKey: 'stats.years_desc'    },
  { value: 100, suffix: '%', labelKey: 'stats.commit_label',   descKey: 'stats.commit_desc'   },
]

function AnimatedNumber({ value, suffix = '', prefix = '', inView }: { value: number; suffix?: string; prefix?: string; inView: boolean }) {
  const [display, setDisplay] = useState(0)

  useEffect(() => {
    if (!inView) return
    const controls = animate(0, value, {
      duration: 1.6,
      ease: 'easeOut',
      onUpdate: (v) => setDisplay(Math.round(v)),
    })
    return controls.stop
  }, [inView, value])

  return (
    <span>
      {prefix}{display}{suffix}
    </span>
  )
}

function StatCard({ stat, index }: { stat: Stat; index: number }) {
  const { t } = useTranslation()
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '-10% 0px' })

  return (
    <motion.div
      ref={ref}
      className="flex flex-col gap-1 p-6 rounded-2xl border border-ink-100 bg-surface-raised"
      initial={{ opacity: 0, y: 32 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.65, ease: EASE, delay: index * 0.1 }}
      whileHover={{ y: -4, borderColor: 'rgba(224,123,0,0.3)', boxShadow: '0 12px 32px rgba(224,123,0,0.07)' }}
    >
      <p
        className="font-display font-bold text-ink-950 tabular-nums leading-none"
        style={{ fontSize: 'clamp(2.4rem, 5vw, 3.8rem)' }}
        aria-label={`${stat.value}${stat.suffix ?? ''} ${t(stat.labelKey)}`}
      >
        <AnimatedNumber value={stat.value} suffix={stat.suffix ?? ''} prefix={stat.prefix ?? ''} inView={inView} />
      </p>
      <p className="text-sm font-semibold text-ink-950 mt-1">{t(stat.labelKey)}</p>
      <p className="text-xs text-ink-400 leading-relaxed">{t(stat.descKey)}</p>
    </motion.div>
  )
}

export default function StatsSection() {
  const { t } = useTranslation()

  return (
    <section className="relative bg-ink-950 py-section-y overflow-hidden" aria-label={t('stats.section_label')}>
      <AmbientOrbs intensity={0.6} />
      <div className="relative z-10 max-w-content mx-auto px-6">

        <motion.p
          className="text-white/35 text-xs tracking-[0.3em] uppercase mb-10"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          {t('stats.eyebrow')}
        </motion.p>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {STATS.map((stat, i) => (
            <StatCard key={stat.labelKey} stat={stat} index={i} />
          ))}
        </div>
      </div>
    </section>
  )
}

