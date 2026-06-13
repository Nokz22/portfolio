import { motion, useReducedMotion } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { useContactForm } from '@/hooks/useContactForm'
import { useProfile } from '@/hooks/useProfile'
import { fadeUp } from '@/lib/motion-tokens'

function SpinnerIcon() {
  return (
    <svg
      className="animate-spin w-4 h-4"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
      />
    </svg>
  )
}

const INPUT_CLASS =
  'bg-surface-raised border border-ink-100 focus:border-accent focus:ring-1 focus:ring-accent/30 rounded-lg px-4 py-3 text-ink-950 w-full outline-none transition-colors duration-fast text-body-md'

export default function Contact() {
  const { t } = useTranslation()
  const { data: profile } = useProfile()
  const {
    name,
    email,
    message,
    setName,
    setEmail,
    setMessage,
    status,
    handleSubmit,
  } = useContactForm()
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

  return (
    <section
      id="contact"
      className="bg-surface py-section-y"
      aria-label={t('contact.title')}
    >
      <div className="max-w-content mx-auto px-6">
        <div className="grid md:grid-cols-[1fr_1.5fr] gap-content-gap items-start">
          {/* Left: info */}
          <div className="flex flex-col gap-8">
            <motion.div {...titleMotion} className="flex flex-col gap-2">
              <span
                className="font-display text-display-xl text-accent/20 font-bold leading-none select-none"
                aria-hidden="true"
              >
                05
              </span>
              <h2 className="font-display text-display-sm text-ink-950 font-semibold">
                {t('contact.title')}
              </h2>
            </motion.div>

            <motion.p {...motionProps(0.1)} className="text-body-lg text-ink-600">
              {t('contact.subtitle')}
            </motion.p>

            <motion.div {...motionProps(0.2)} className="flex flex-col gap-4">
              {profile?.email && (
                <a
                  href={`mailto:${profile.email}`}
                  className="flex items-center gap-3 text-body-md text-ink-600 hover:text-accent transition-colors duration-fast"
                  data-cursor="pointer"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-5 h-5 text-accent shrink-0"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                    aria-hidden="true"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  {profile.email}
                </a>
              )}
              {profile?.linkedin && (
                <a
                  href={profile.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 text-body-md text-ink-600 hover:text-accent transition-colors duration-fast"
                  data-cursor="pointer"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className="w-5 h-5 text-accent shrink-0"
                    aria-hidden="true"
                  >
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                  </svg>
                  LinkedIn
                </a>
              )}
            </motion.div>
          </div>

          {/* Right: form */}
          <motion.div {...motionProps(0.15)}>
            <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-4">
              {/* Honeypot — hidden from humans */}
              <div className="hidden" aria-hidden="true">
                <label htmlFor="website">Website</label>
                <input id="website" name="website" type="text" tabIndex={-1} autoComplete="off" />
              </div>

              <div>
                <label htmlFor="contact-name" className="block text-label-lg text-ink-600 mb-1.5">
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
                <label htmlFor="contact-email" className="block text-label-lg text-ink-600 mb-1.5">
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
                <label htmlFor="contact-message" className="block text-label-lg text-ink-600 mb-1.5">
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
                <p className="text-body-md text-green-600 bg-green-50 border border-green-200 rounded-lg px-4 py-3" role="status">
                  {t('contact.success')}
                </p>
              )}

              {status === 'error' && (
                <p className="text-body-md text-red-600 bg-red-50 border border-red-200 rounded-lg px-4 py-3" role="alert">
                  {t('contact.error')}
                </p>
              )}

              {status !== 'success' && (
                <button
                  type="submit"
                  disabled={status === 'sending'}
                  className="flex items-center justify-center gap-2 bg-accent hover:bg-accent-dim disabled:opacity-60 text-white font-semibold px-6 py-3 rounded-lg transition-colors duration-fast"
                  data-cursor="pointer"
                >
                  {status === 'sending' && <SpinnerIcon />}
                  {status === 'sending' ? t('contact.sending') : t('contact.send')}
                </button>
              )}
            </form>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
