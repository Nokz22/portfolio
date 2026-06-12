import { lazy, Suspense } from 'react'
import { Routes, Route, useLocation } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'

// Route-level code splitting — each page is its own chunk
const Home          = lazy(() => import('./pages/Home'))
const ProjectDetail = lazy(() => import('./pages/ProjectDetail'))
const NotFound      = lazy(() => import('./pages/NotFound'))

function App() {
  const location = useLocation()

  return (
    // AnimatePresence enables exit animations on route change (Phase 2)
    <AnimatePresence mode="wait">
      <Suspense fallback={null}>
        <Routes location={location} key={location.pathname}>
          <Route path="/"                  element={<Home />} />
          <Route path="/projects/:slug"    element={<ProjectDetail />} />
          <Route path="*"                  element={<NotFound />} />
        </Routes>
      </Suspense>
    </AnimatePresence>
  )
}

export default App
