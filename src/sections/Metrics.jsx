import { Boxes, Clock, Cpu, MemoryStick } from 'lucide-react'
import { SectionHead, LiveDot } from '../components/ui'
import { useReveal } from '../hooks/useReveal'

const STATS = [
  { key: 'cpu', label: 'cpu_usage', icon: Cpu, suffix: '%', caption: 'node avg · 5m rate', spark: true },
  { key: 'ram', label: 'mem_usage', icon: MemoryStick, suffix: '%', caption: 'of total memory', spark: true },
  { key: 'pods', label: 'pods_running', icon: Boxes, suffix: '' },
  { key: 'uptime', label: 'uptime', icon: Clock, suffix: '%', caption: 'node availability · 7d' },
]

// Builds up over the visit (30s/point) — an ops console earns its sparklines.
function Sparkline({ points }) {
  if (!points || points.length < 2) {
    return <div aria-hidden className="mt-3 h-7 border-b border-border/40" />
  }
  const w = 100
  const h = 28
  const path = points
    .map((v, i) => {
      const x = (i / (points.length - 1)) * w
      const y = h - 3 - (Math.min(Math.max(v, 0), 100) / 100) * (h - 6)
      return `${i === 0 ? 'M' : 'L'}${x.toFixed(1)},${y.toFixed(1)}`
    })
    .join(' ')
  return (
    <svg aria-hidden viewBox={`0 0 ${w} ${h}`} preserveAspectRatio="none" className="mt-3 h-7 w-full">
      <path d={path} fill="none" stroke="#39FF14" strokeOpacity="0.55" strokeWidth="1.5" vectorEffect="non-scaling-stroke" />
    </svg>
  )
}

export default function Metrics({ metrics, history, loading, live, lastUpdated }) {
  const ref = useReveal()
  return (
    <section ref={ref} id="metrics" className="reveal mx-auto max-w-5xl scroll-mt-24 px-6 py-20">
      <SectionHead
        index="01"
        title="live cluster metrics"
        right={
          <span className="flex items-center gap-2 font-mono text-[11px] text-muted">
            {loading ? (
              'connecting…'
            ) : (
              <>
                <LiveDot on={live} className="h-1.5 w-1.5" />
                {live ? `updated ${lastUpdated}` : 'offline — last known'}
              </>
            )}
          </span>
        }
      />

      <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
        {STATS.map((s) => (
          <StatCard key={s.key} stat={s} value={metrics[s.key]} history={history[s.key]} loading={loading} />
        ))}
      </div>
    </section>
  )
}

function StatCard({ stat, value, history, loading }) {
  const Icon = stat.icon
  return (
    <div className="rounded-xl border border-border bg-surface p-5 transition-colors duration-200 hover:border-border-bright">
      <div className="mb-4 flex items-center justify-between">
        <Icon className="h-4 w-4 text-muted" strokeWidth={1.75} />
        <span className="font-mono text-[10px] uppercase tracking-widest text-muted/60">{stat.label}</span>
      </div>

      {loading ? (
        <MetricSkeleton />
      ) : (
        <div className="tnum font-mono text-3xl font-semibold text-ink sm:text-4xl">
          {value ?? '--'}
          {value != null && stat.suffix && <span className="text-xl text-muted">{stat.suffix}</span>}
        </div>
      )}

      {stat.spark ? (
        <Sparkline points={history} />
      ) : (
        <div aria-hidden className="mt-3 h-7 border-b border-border/40" />
      )}
      {stat.caption && <div className="mt-2 font-mono text-[10px] text-muted/70">{stat.caption}</div>}
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
