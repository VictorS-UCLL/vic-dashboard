import { Routes, Route } from 'react-router-dom'
import Nav from './components/Nav'
import Footer from './components/Footer'
import Hero from './sections/Hero'
import Metrics from './sections/Metrics'
import Topology from './sections/Topology'
import Projects from './sections/Projects'
import Stack from './sections/Stack'
import Contact from './sections/Contact'
import Privacy from './pages/Privacy'
import { useClusterData } from './hooks/useClusterData'

function Portfolio() {
  // One poll feeds everything live on the page — stat cards, topology
  // overlay, and pod detail share a single 30s tick.
  const { metrics, history, workloads, pods, loading, live, lastUpdated } = useClusterData()

  return (
    <div id="top" className="relative flex min-h-screen flex-col">
      <Nav />
      <main className="flex-1">
        <Hero />
        <Metrics metrics={metrics} history={history} loading={loading} live={live} lastUpdated={lastUpdated} />
        <Topology workloads={workloads} pods={pods} live={live} />
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
    <Routes>
      <Route path="/" element={<Portfolio />} />
      <Route path="/privacy" element={<Privacy />} />
    </Routes>
  )
}
