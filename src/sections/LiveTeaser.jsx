import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import { LiveDot } from '../components/ui'

const ITEMS = [
  { key: 'cpu', label: 'cpu', suffix: '%' },
  { key: 'pods', label: 'pods', suffix: '' },
  { key: 'uptime', label: 'uptime', suffix: '%' },
]

// The meta-hook, compressed: this site runs on the cluster it shows. One
// glance of live numbers up front; the full console lives at /dashboard.
export default function LiveTeaser({ metrics, live }) {
  return (
    <section id="live" className="mx-auto max-w-5xl scroll-mt-24 px-6 pb-6">
      <Link
        to="/dashboard"
        className="group flex flex-col gap-4 rounded-xl border border-border bg-surface/70 px-5 py-4 transition-colors duration-200 hover:border-border-bright sm:flex-row sm:items-center sm:justify-between cursor-pointer focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent"
      >
        <span className="flex items-center gap-2.5 font-mono text-xs text-muted">
          <LiveDot on={live} className="h-1.5 w-1.5" />
          <span>
            <span className="text-accent/80">{'// '}</span>live cluster
          </span>
        </span>

        <span className="flex items-center gap-6">
          {ITEMS.map(({ key, label, suffix }) => (
            <span key={key} className="flex items-baseline gap-1.5">
              <span className="tnum font-mono text-sm text-ink">
                {metrics[key] ?? '--'}
                {metrics[key] != null && suffix}
              </span>
              <span className="font-mono text-[10px] text-muted">{label}</span>
            </span>
          ))}
        </span>

        <span className="flex items-center gap-1.5 font-mono text-xs text-muted transition-colors duration-200 group-hover:text-accent">
          open dashboard
          <ArrowRight className="h-3.5 w-3.5 transition-transform duration-200 group-hover:translate-x-0.5" />
        </span>
      </Link>
    </section>
  )
}
