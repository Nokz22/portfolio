import { motion, useReducedMotion } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { useContactForm } from '@/hooks/useContactForm'
import { useProfile } from '@/hooks/useProfile'
import { fadeUp } from '@/lib/motion-tokens'

function SpinnerIcon() {
  return (
    <svg className="animate-spin w-4 h-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" aria-hidden="true">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
    </svg>
  )
}

const INPUT_CLASS =
  'bg-surface-raised border border-ink-100 focus:border-accent focus:ring-1 focus:ring-accent/30 rounded-lg px-4 py-3 text-ink-950 w-full outline-none transition-colors duration-fast text-sm'

export default function Contact() {
  const { t } = useTranslation()
  const { data: profile } = useProfile()
  const { name, email, message, setName, setEmail, setMessage, status, handleSubmit } = useContactForm()
  const reduced = useReducedMotion()

  const motionProps = (delay = 0) =>
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
              transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1], delay },
            },
          },
        }

  const titleMotion = reduced
    ? {}
    : {
        initial: 'hidden',
        whileInView: 'visible',
        viewport: { once: true },
        variants: fadeUp,
      }

  const types = [
    t('contact.type_fulltime'),
    t('contact.type_freelance'),
    t('contact.type_porto'),
    t('contact.type_remote'),
  ]

  return (
    <section
      id="contact"
      className="bg-surface py-section-y"
      aria-label={t('contact.title')}
    >
      <div className="max-w-content mx-auto px-6">
        <div className="grid md:grid-cols-[1fr_1.5fr] gap-content-gap items-start">

          {/* Left: job-seeking info */}
          <div className="flex flex-col gap-8">
            <motion.div {...titleMotion} className="flex flex-col gap-2">
              <span
                className="font-display text-[clamp(4rem,8vw,7rem)] text-accent/15 font-bold leading-none select-none"
                aria-hidden="true"
              >
                05
              </span>
              <h2 className="font-display text-[clamp(1.8rem,4vw,3rem)] text-ink-950 font-bold">
                {t('contact.title')}
              </h2>
            </motion.div>

            {/* Open to work badge */}
            <motion.div {...motionProps(0.05)}>
              <span className="inline-flex items-center gap-2 bg-green-50 border border-green-200 text-green-700 text-xs font-semibold px-4 py-2 rounded-full">
                <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" aria-hidden="true" />
                {t('contact.open_to_work')}
              </span>
            </motion.div>

            <motion.p {...motionProps(0.1)} className="text-base text-ink-600 leading-relaxed">
              {t('contact.subtitle')}
            </motion.p>

            {/* Availability tags */}
            <motion.div {...motionProps(0.15)} className="flex flex-wrap gap-2">
              {types.map((type) => (
                <span
                  key={type}
                  className="bg-surface-raised border border-ink-100 text-ink-600 text-xs font-semibold px-3 py-1.5 rounded-lg"
                >
                  {type}
                </span>
              ))}
            </motion.div>

            {/* Contact links */}
            <motion.div {...motionProps(0.2)} className="flex flex-col gap-3">
              {profile?.email && (
                <a
                  href={`mailto:${profile.email}`}
                  className="flex items-center gap-3 text-sm text-ink-600 hover:text-accent transition-colors duration-fast group"
                  data-cursor="pointer"
                >
                  <span className="w-9 h-9 rounded-lg bg-surface-raised border border-ink-100 flex items-center justify-center group-hover:border-accent/40 group-hover:bg-accent/5 transition-colors duration-fast">
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </span>
                  {profile.email}
                </a>
              )}
              {profile?.linkedin && (
                <a
                  href={profile.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 text-sm text-ink-600 hover:text-accent transition-colors duration-fast group"
                  data-cursor="pointer"
                >
                  <span className="w-9 h-9 rounded-lg bg-surface-raised border border-ink-100 flex items-center justify-center group-hover:border-accent/40 group-hover:bg-accent/5 transition-colors duration-fast">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 text-accent" aria-hidden="true">
                      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                    </svg>
                  </span>
                  LinkedIn
                </a>
              )}
              {profile?.github && (
                <a
                  href={profile.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 text-sm text-ink-600 hover:text-accent transition-colors duration-fast group"
                  data-cursor="pointer"
                >
                  <span className="w-9 h-9 rounded-lg bg-surface-raised border border-ink-100 flex items-center justify-center group-hover:border-accent/40 group-hover:bg-accent/5 transition-colors duration-fast">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 text-accent" aria-hidden="true">
                      <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
                    </svg>
                  </span>
                  GitHub
                </a>
              )}
            </motion.div>
          </div>

          {/* Right: form */}
          <motion.div {...motionProps(0.15)}>
            <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-4">
              {/* Honeypot */}
              <div className="hidden" aria-hidden="true">
                <label htmlFor="website">Website</label>
                <input id="website" name="website" type="text" tabIndex={-1} autoComplete="off" />
              </div>

              <div>
                <label htmlFor="contact-name" className="block text-sm font-semibold text-ink-600 mb-1.5">
                  {t('contact.name')}
                </label>
                <input
                  id="contact-name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className={INPUT_CLASS}
                  required
                  autoComplete="name"
                  disabled={status === 'sending' || status === 'success'}
                />
              </div>

              <div>
                <label htmlFor="contact-email" className="block text-sm font-semibold text-ink-600 mb-1.5">
                  {t('contact.email')}
                </label>
                <input
                  id="contact-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={INPUT_CLASS}
                  required
                  autoComplete="email"
                  disabled={status === 'sending' || status === 'success'}
                />
              </div>

              <div>
                <label htmlFor="contact-message" className="block text-sm font-semibold text-ink-600 mb-1.5">
                  {t('contact.message')}
                </label>
                <textarea
                  id="contact-message"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  rows={6}
                  className={INPUT_CLASS + ' resize-none'}
                  required
                  disabled={status === 'sending' || status === 'success'}
                />
              </div>

              {status === 'success' && (
                <p className="text-sm text-green-600 bg-green-50 border border-green-200 rounded-lg px-4 py-3" role="status">
                  {t('contact.success')}
                </p>
              )}

              {status === 'error' && (
                <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-4 py-3" role="alert">
                  {t('contact.error')}
                </p>
              )}

              {status !== 'success' && (
                <motion.button
                  type="submit"
                  disabled={status === 'sending'}
                  className="flex items-center justify-center gap-2 bg-accent hover:bg-accent-dim disabled:opacity-60 text-white font-semibold px-6 py-3 rounded-lg transition-colors duration-fast"
                  data-cursor="pointer"
                  whileHover={reduced ? {} : { scale: 1.02, y: -1 }}
                  whileTap={reduced ? {} : { scale: 0.98 }}
                  transition={{ type: 'spring', stiffness: 400, damping: 20 }}
                >
                  {status === 'sending' && <SpinnerIcon />}
                  {status === 'sending' ? t('contact.sending') : t('contact.send')}
                </motion.button>
              )}
            </form>
          </motion.div>

        </div>
      </div>
    </section>
  )
}
