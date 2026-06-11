import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import Metrics from '../sections/Metrics'
import Topology from '../sections/Topology'
import Footer from '../components/Footer'
import { LiveDot } from '../components/ui'
import { useClusterData } from '../hooks/useClusterData'

// The full ops console — metrics + topology today, room to grow (nodes,
// ingress rates, alerts…) without touching the front page.
export default function Dashboard() {
  const { metrics, history, workloads, pods, loading, live, lastUpdated } = useClusterData()

  useEffect(() => {
    const prev = document.title
    document.title = 'Cluster dashboard — vic420.com'
    return () => {
      document.title = prev
    }
  }, [])

  return (
    <div className="relative flex min-h-screen flex-col">
      <header className="fixed inset-x-0 top-0 z-50 border-b border-border/60 bg-bg/70 backdrop-blur-md">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-3.5">
          <div className="flex items-center gap-5">
            <Link
              to="/"
              className="flex items-center gap-1.5 font-mono text-xs text-muted transition-colors duration-200 hover:text-ink cursor-pointer focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent"
            >
              <ArrowLeft className="h-3.5 w-3.5" /> home
            </Link>
            <span className="font-mono text-sm font-semibold text-ink">
              vic420<span className="text-accent">.com</span>
              <span className="font-normal text-muted"> / dashboard</span>
            </span>
          </div>
          <span className="flex items-center gap-2 font-mono text-[11px] text-muted">
            <LiveDot on={live} className="h-1.5 w-1.5" />
            {loading ? 'connecting…' : live ? `live · ${lastUpdated}` : 'offline — last known'}
          </span>
        </div>
      </header>

      <main className="flex-1 pt-16">
        <div className="mx-auto max-w-5xl px-6 pt-10">
          <h1 className="text-2xl font-semibold tracking-tight text-ink">Cluster dashboard</h1>
          <p className="mt-1.5 text-sm text-muted">
            Live view of the K3s homelab serving this site. Polls every 30s, fails soft.
          </p>
        </div>

        <Metrics metrics={metrics} history={history} loading={loading} live={live} lastUpdated={lastUpdated} />
        <Topology workloads={workloads} pods={pods} live={live} />
      </main>
      <Footer />
    </div>
  )
}
