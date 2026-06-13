import { motion } from 'framer-motion'
import { Link, useParams } from 'react-router-dom'

export default function ProjectDetail() {
  const { slug } = useParams<{ slug: string }>()

  return (
    <motion.main
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      className="min-h-screen bg-surface flex flex-col items-center justify-center gap-8 px-6"
      aria-label="Project detail"
    >
      <div className="flex flex-col items-center gap-4 text-center max-w-lg">
        <Link
          to="/"
          className="flex items-center gap-2 text-ink-400 hover:text-accent transition-colors duration-fast text-label-lg self-start"
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
            <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Voltar
        </Link>
        <h1 className="font-display text-display-sm text-ink-950 font-semibold">
          {slug}
        </h1>
        <p className="text-body-md text-ink-400">
          Detalhes do projecto em breve.
        </p>
      </div>
    </motion.main>
  )
}
