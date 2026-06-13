import { motion, useReducedMotion } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { useProjects } from '@/hooks/useProjects'
import { SkeletonLoader } from '@/components/ui/SkeletonLoader'
import { fadeUp } from '@/lib/motion-tokens'
import type { GithubRepoDto } from '@/types/api'

const LANGUAGE_COLORS = new Map<string, string>([
  ['Java', 'bg-orange-500'],
  ['TypeScript', 'bg-blue-500'],
  ['JavaScript', 'bg-yellow-400'],
  ['Python', 'bg-green-500'],
  ['CSS', 'bg-purple-500'],
])

function langColor(language: string | null): string {
  if (!language) return 'bg-slate-400'
  return LANGUAGE_COLORS.get(language) ?? 'bg-slate-400'
}

function GitHubLinkIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="currentColor"
      className="w-5 h-5"
      aria-hidden="true"
    >
      <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
    </svg>
  )
}

interface RepoCardProps {
  repo: GithubRepoDto
}

function RepoCard({ repo }: RepoCardProps) {
  const { t } = useTranslation()

  return (
    <article className="bg-surface rounded-xl p-6 border border-ink-100 hover:border-accent/40 transition-colors duration-fast flex flex-col gap-4 h-full">
      <header className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <h3 className="font-display font-semibold text-heading-xl text-ink-950 truncate">
            {repo.name}
          </h3>
          {repo.description && (
            <p className="text-body-sm text-ink-600 mt-1 line-clamp-2">{repo.description}</p>
          )}
        </div>
        <a
          href={repo.url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-ink-400 hover:text-ink-950 transition-colors duration-fast shrink-0"
          aria-label={`${t('projects.github')}: ${repo.name}`}
          data-cursor="pointer"
        >
          <GitHubLinkIcon />
        </a>
      </header>

      {repo.topics.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {repo.topics.slice(0, 4).map((topic) => (
            <span
              key={topic}
              className="bg-surface-raised text-ink-400 text-label-sm px-2 py-0.5 rounded"
            >
              {topic}
            </span>
          ))}
        </div>
      )}

      <footer className="mt-auto flex items-center justify-between text-label-sm text-ink-400">
        <div className="flex items-center gap-1.5">
          {repo.language && (
            <>
              <span
                className={`w-2.5 h-2.5 rounded-full ${langColor(repo.language)}`}
                aria-hidden="true"
              />
              <span>{repo.language}</span>
            </>
          )}
        </div>
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1" aria-label={`${repo.stars} ${t('projects.stars')}`}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-3.5 h-3.5"
              fill="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
            </svg>
            {repo.stars}
          </span>
          <span className="flex items-center gap-1" aria-label={`${repo.forks} forks`}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-3.5 h-3.5"
              fill="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path d="M12 21a1.5 1.5 0 110-3 1.5 1.5 0 010 3zm6-15a1.5 1.5 0 110-3 1.5 1.5 0 010 3zM6 6a1.5 1.5 0 110-3 1.5 1.5 0 010 3zm6 6.75A2.25 2.25 0 0114.25 15v.75a3 3 0 106 0v-1.5a2.25 2.25 0 00-2.25-2.25H12zm0 0V9.75M6 6v.75a3 3 0 000 6h.75" />
            </svg>
            {repo.forks}
          </span>
        </div>
      </footer>
    </article>
  )
}

export default function Projects() {
  const { t } = useTranslation()
  const { data: repos, isLoading, error } = useProjects()
  const reduced = useReducedMotion()

  const titleMotion = reduced
    ? {}
    : {
        initial: 'hidden',
        whileInView: 'visible',
        viewport: { once: true },
        variants: fadeUp,
      }

  const cardMotion = (index: number) =>
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
              transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1], delay: index * 0.08 },
            },
          },
        }

  return (
    <section
      id="projects"
      className="bg-surface-raised py-section-y"
      aria-label={t('projects.title')}
    >
      <div className="max-w-content mx-auto px-6">
        {/* Section header */}
        <motion.div {...titleMotion} className="flex flex-col gap-2 mb-12">
          <span
            className="font-display text-display-xl text-accent/20 font-bold leading-none select-none"
            aria-hidden="true"
          >
            04
          </span>
          <h2 className="font-display text-display-sm text-ink-950 font-semibold">
            {t('projects.title')}
          </h2>
        </motion.div>

        {isLoading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <SkeletonLoader key={i} className="h-48" />
            ))}
          </div>
        )}

        {error && (
          <p className="text-body-md text-ink-400">{t('projects.error')}</p>
        )}

        {repos && repos.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-6">
            {repos.slice(0, 4).map((repo, i) => (
              <motion.div key={repo.id} {...cardMotion(i)}>
                <RepoCard repo={repo} />
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
