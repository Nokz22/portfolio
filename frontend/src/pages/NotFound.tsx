import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'

export default function NotFound() {
  return (
    <motion.main
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      className="min-h-screen bg-surface flex flex-col items-center justify-center gap-8 px-6"
      aria-label="Página não encontrada"
    >
      <div className="flex flex-col items-center gap-4 text-center">
        <span
          className="font-display text-display-2xl text-accent font-bold leading-none"
          aria-hidden="true"
        >
          404
        </span>
        <h1 className="font-display text-display-sm text-ink-950 font-semibold">
          Página não encontrada
        </h1>
        <p className="text-body-md text-ink-600 max-w-sm">
          A página que procuras não existe ou foi movida.
        </p>
        <Link
          to="/"
          className="inline-flex items-center gap-2 bg-accent hover:bg-accent-dim text-white font-semibold px-6 py-3 rounded-lg transition-colors duration-fast mt-4"
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
          Voltar ao início
        </Link>
      </div>
    </motion.main>
  )
}
