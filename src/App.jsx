import { Suspense, lazy, useEffect } from 'react'
import { Routes, Route, useLocation } from 'react-router-dom'
import Nav from './components/Nav'
import Footer from './components/Footer'
import Hero from './sections/Hero'
import LiveTeaser from './sections/LiveTeaser'
import Projects from './sections/Projects'
import Stack from './sections/Stack'
import Contact from './sections/Contact'
import Privacy from './pages/Privacy'
import { useClusterData } from './hooks/useClusterData'

// The dashboard carries React Flow and the full polling set — keep it (and
// everything it imports) out of the home-page bundle.
const Dashboard = lazy(() => import('./pages/Dashboard'))

// React Router preserves scroll across navigations; a dashboard↔home jump
// should always land at the top.
function ScrollToTop() {
  const { pathname } = useLocation()
  useEffect(() => window.scrollTo(0, 0), [pathname])
  return null
}

function PageFallback() {
  return (
    <div className="flex min-h-screen items-center justify-center font-mono text-xs text-muted">
      loading…
    </div>
  )
}

function Home() {
  // Light mode: only the four scalar metrics for the teaser strip — the
  // topology queries don't run until /dashboard mounts the full hook.
  const { metrics, live } = useClusterData({ topology: false })

  return (
    <div id="top" className="relative flex min-h-screen flex-col">
      <Nav />
      <main className="flex-1">
        <Hero />
        <LiveTeaser metrics={metrics} live={live} />
        <Projects />
        <Stack />
        <Contact />
      </main>
      <Footer />
    </div>
  )
}

export default function App() {
  return (
    <>
      <ScrollToTop />
      <Suspense fallback={<PageFallback />}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/privacy" element={<Privacy />} />
        </Routes>
      </Suspense>
    </>
  )
}
