import { Boxes, Clock, Cpu, MemoryStick } from 'lucide-react'
import { useGrafanaMetrics } from '../hooks/useGrafanaMetrics'

const STATS = [
  { key: 'cpu', label: 'cpu_usage', icon: Cpu, suffix: '%' },
  { key: 'ram', label: 'mem_usage', icon: MemoryStick, suffix: '%' },
  { key: 'pods', label: 'pods_running', icon: Boxes, suffix: '' },
  { key: 'uptime', label: 'uptime', icon: Clock, suffix: '' },
]

export default function MetricsPanel() {
  const { metrics, loading, live, lastUpdated } = useGrafanaMetrics()

  return (
    <section id="metrics" className="mx-auto max-w-5xl scroll-mt-24 px-6 py-20">
      <div className="mb-6 flex items-center justify-between">
        <div className="font-mono text-xs tracking-wide text-muted">
          <span className="text-accent/80">// </span>live cluster metrics
        </div>
        <span className="font-mono text-[11px] text-muted">
          {loading ? 'connecting…' : live ? `updated ${lastUpdated}` : '—'}
        </span>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
        {STATS.map((s) => (
          <StatCard key={s.key} stat={s} value={metrics[s.key]} loading={loading} live={live} />
        ))}
      </div>
    </section>
  )
}

function StatCard({ stat, value, loading, live }) {
  const Icon = stat.icon
  return (
    <div className="rounded-xl border border-border bg-surface p-5 transition-colors duration-200 hover:border-border-bright">
      <div className="mb-4 flex items-center justify-between">
        <Icon className="h-4 w-4 text-muted" strokeWidth={1.75} />
        <span className="relative flex h-1.5 w-1.5" title={live ? 'live' : 'no signal'}>
          {live && (
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-live opacity-60" />
          )}
          <span
            className={`relative inline-flex h-1.5 w-1.5 rounded-full ${live ? 'bg-live' : 'bg-muted'}`}
          />
        </span>
      </div>

      {loading ? (
        <MetricSkeleton />
      ) : (
        <div className="tnum font-mono text-3xl font-semibold text-ink sm:text-4xl">
          {value ?? '--'}
          {value != null && stat.suffix && <span className="text-xl text-muted">{stat.suffix}</span>}
        </div>
      )}

      <div className="mt-2 font-mono text-xs text-muted">{stat.label}</div>
    </div>
  )
}

function MetricSkeleton() {
  return (
    <div className="relative h-9 w-20 overflow-hidden rounded bg-surface-2">
      <div className="absolute inset-0 -translate-x-full animate-shimmer bg-gradient-to-r from-transparent via-white/5 to-transparent" />
    </div>
  )
}
