import { motion } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { useProfile } from '@/hooks/useProfile'
import { SkeletonLoader } from '@/components/ui/SkeletonLoader'
import RevealText from '@/components/ui/RevealText'

const EASE = [0.16, 1, 0.3, 1] as const

export default function About() {
  const { t } = useTranslation()
  const { data: profile, isLoading } = useProfile()

  return (
    <section id="about" className="bg-surface py-section-y" aria-label={t('about.title')}>
      <div className="max-w-content mx-auto px-6">
        <div className="grid md:grid-cols-[1fr_2fr] gap-content-gap items-start">

          {/* Left */}
          <div>
            <motion.span
              className="font-display text-display-xl text-accent/20 font-bold leading-none select-none block"
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.7, ease: EASE }}
              aria-hidden="true"
            >
              01
            </motion.span>
            <h2 className="font-display text-display-sm text-ink-950 font-semibold mt-1">
              <RevealText text={t('about.title')} by="word" delay={0.08} />
            </h2>
          </div>

          {/* Right */}
          <div className="flex flex-col gap-6">
            {isLoading ? (
              <>
                <SkeletonLoader className="h-6 w-full" />
                <SkeletonLoader className="h-6 w-5/6" />
                <SkeletonLoader className="h-6 w-4/6" />
                <SkeletonLoader className="h-10 w-36 mt-2" />
              </>
            ) : (
              <>
                <motion.p
                  className="text-body-lg text-ink-600 leading-relaxed"
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.2 }}
                  transition={{ duration: 0.7, ease: EASE, delay: 0.12 }}
                >
                  {profile?.summary}
                </motion.p>
                {profile?.cvUrl && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.2 }}
                    transition={{ duration: 0.6, ease: EASE, delay: 0.22 }}
                  >
                    <motion.a
                      href={profile.cvUrl}
                      download="Nuno-Ferreira-CV.pdf"
                      className="inline-flex items-center gap-2 bg-accent hover:bg-accent-dim text-white font-semibold px-6 py-3 rounded-lg transition-colors duration-fast w-fit"
                      data-cursor="pointer"
                      whileHover={{ scale: 1.03, y: -2 }}
                      whileTap={{ scale: 0.97 }}
                      transition={{ type: 'spring', stiffness: 380, damping: 20 }}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                      </svg>
                      {t('about.download_cv')}
                    </motion.a>
                  </motion.div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
