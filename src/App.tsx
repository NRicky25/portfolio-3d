import { useEffect, useState } from 'react'
import { BrowserRouter, Route, Routes, useLocation } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'
import Home from './pages/Home'
import ProjectDetail from './pages/ProjectDetail'
import NotFound from './pages/NotFound'
import Loader from './components/Loader'
import Nav from './components/Nav'
import Cursor from './components/Cursor'
import { useReducedMotion } from './hooks/useReducedMotion'
import { useLenis } from './hooks/useLenis'

export function AppRoutes() {
  const location = useLocation()
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<Home />} />
        <Route path="/projects/:slug" element={<ProjectDetail />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </AnimatePresence>
  )
}

export default function App() {
  const reduced = useReducedMotion()
  const [loading, setLoading] = useState(!reduced)
  useLenis(!reduced)

  useEffect(() => {
    if (reduced) setLoading(false)
  }, [reduced])

  return (
    <BrowserRouter>
      <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-md focus:bg-violet-600 focus:px-3 focus:py-2">
        Skip to content
      </a>
      <AnimatePresence>{loading && <Loader key="loader" onDone={() => setLoading(false)} />}</AnimatePresence>
      <Cursor />
      <Nav />
      <AppRoutes />
      <div className="grain" aria-hidden />
    </BrowserRouter>
  )
}
