import { motion, useReducedMotion } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { useProfile } from '@/hooks/useProfile'
import { SkeletonLoader } from '@/components/ui/SkeletonLoader'
import { fadeUp } from '@/lib/motion-tokens'

export default function About() {
  const { t } = useTranslation()
  const { data: profile, isLoading } = useProfile()
  const reduced = useReducedMotion()

  const motionProps = reduced
    ? {}
    : {
        initial: 'hidden',
        whileInView: 'visible',
        viewport: { once: true, margin: '-80px' },
        variants: fadeUp,
      }

  return (
    <section
      id="about"
      className="bg-surface py-section-y"
      aria-label={t('about.title')}
    >
      <div className="max-w-content mx-auto px-6">
        <div className="grid md:grid-cols-[1fr_2fr] gap-content-gap items-start">
          {/* Left: section label */}
          <motion.div {...motionProps} className="flex flex-col gap-2">
            <span
              className="font-display text-display-xl text-accent/20 font-bold leading-none select-none"
              aria-hidden="true"
            >
              01
            </span>
            <h2 className="font-display text-display-sm text-ink-950 font-semibold">
              {t('about.title')}
            </h2>
          </motion.div>

          {/* Right: content */}
          <motion.div {...motionProps} className="flex flex-col gap-6">
            {isLoading ? (
              <>
                <SkeletonLoader className="h-6 w-full" />
                <SkeletonLoader className="h-6 w-5/6" />
                <SkeletonLoader className="h-6 w-4/6" />
                <SkeletonLoader className="h-6 w-3/4" />
                <SkeletonLoader className="h-10 w-36 mt-2" />
              </>
            ) : (
              <>
                <p className="text-body-lg text-ink-600 leading-relaxed">
                  {profile?.summary}
                </p>
                {profile?.cvUrl && (
                  <a
                    href={profile.cvUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 bg-accent hover:bg-accent-dim text-white font-semibold px-6 py-3 rounded-lg transition-colors duration-fast w-fit"
                    data-cursor="pointer"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="w-4 h-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                      aria-hidden="true"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                      />
                    </svg>
                    {t('about.download_cv')}
                  </a>
                )}
              </>
            )}
          </motion.div>
        </div>
      </div>
    </section>
  )
}
