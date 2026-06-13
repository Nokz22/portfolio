import { lazy, Suspense, useEffect } from 'react'
import { Routes, Route, useLocation } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import SkipToContent from '@/components/ui/SkipToContent'

// Route-level code splitting — each page is its own chunk
const Home          = lazy(() => import('./pages/Home'))
const ProjectDetail = lazy(() => import('./pages/ProjectDetail'))
const NotFound      = lazy(() => import('./pages/NotFound'))

function App() {
  const location = useLocation()
  const { i18n } = useTranslation()

  // Keep <html lang> in sync with the active i18n language.
  // Screen readers use this attribute to select the correct voice/pronunciation.
  useEffect(() => {
    document.documentElement.lang = i18n.language
  }, [i18n.language])

  return (
    <>
      <SkipToContent />
      <AnimatePresence mode="wait">
        <Suspense fallback={null}>
          <Routes location={location} key={location.pathname}>
            <Route path="/"               element={<Home />} />
            <Route path="/projects/:slug" element={<ProjectDetail />} />
            <Route path="*"               element={<NotFound />} />
          </Routes>
        </Suspense>
      </AnimatePresence>
    </>
  )
}

export default App
