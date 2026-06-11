import { X } from 'lucide-react'
import { NS_COLORS } from '../data/topology'

const PHASE_STYLE = {
  Running: 'text-live border-live/30 bg-live/10',
  Succeeded: 'text-live border-live/30 bg-live/10',
  Pending: 'text-progress border-progress/30 bg-progress/10',
  Failed: 'text-crit border-crit/30 bg-crit/10',
  Unknown: 'text-muted border-border bg-surface-2',
}

const STATUS_TEXT = {
  ready: { label: 'ready', cls: 'text-live' },
  degraded: { label: 'degraded', cls: 'text-progress' },
  down: { label: 'down', cls: 'text-crit' },
  unknown: { label: 'no signal', cls: 'text-muted' },
}

// Geek mode on demand: clicking a workload opens this; the canvas stays clean.
export default function DetailPanel({ workload, live, pods, onClose }) {
  const color = NS_COLORS[workload.namespace]
  const status = STATUS_TEXT[live?.status ?? 'unknown']
  const replicas = live?.ready != null && live?.desired != null ? `${live.ready}/${live.desired}` : '--'

  return (
    <div className="animate-fade-up rounded-xl border border-border bg-surface p-5">
      <div className="mb-3 flex items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <span aria-hidden className="h-2 w-2 rounded-full" style={{ background: color }} />
          <span className="font-mono text-sm text-ink">{workload.name}</span>
          <span className="rounded border border-border bg-bg px-1.5 py-0.5 font-mono text-[10px] text-muted">
            {workload.kind === 'sts' ? 'StatefulSet' : 'Deployment'}
          </span>
        </div>
        <button
          type="button"
          onClick={onClose}
          aria-label="Close detail panel"
          className="rounded-md p-1 text-muted transition-colors duration-200 hover:text-ink cursor-pointer focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      {/* What this workload actually does — always visible, no extra clicks. */}
      <p className="mb-5 max-w-2xl text-[13px] leading-relaxed text-muted">{workload.desc}</p>

      <div className="grid gap-5 sm:grid-cols-[200px_1fr]">
        <dl className="space-y-2 font-mono text-xs">
          {[
            ['namespace', <span key="ns" style={{ color }}>{workload.namespace}</span>],
            ['replicas', <span key="r" className="tnum text-ink">{replicas}</span>],
            ['status', <span key="s" className={status.cls}>● {status.label}</span>],
          ].map(([k, v]) => (
            <div key={k} className="flex items-center justify-between gap-4 border-b border-border/50 pb-2">
              <dt className="text-muted">{k}</dt>
              <dd>{v}</dd>
            </div>
          ))}
        </dl>

        <div>
          <div className="mb-2 grid grid-cols-[1fr_auto_auto] gap-x-4 font-mono text-[10px] uppercase tracking-widest text-muted">
            <span>pod</span>
            <span>phase</span>
            <span className="text-right">restarts</span>
          </div>
          {pods?.length ? (
            <ul className="space-y-1.5">
              {pods.map((p) => (
                <li
                  key={p.name}
                  className="grid grid-cols-[1fr_auto_auto] items-center gap-x-4 rounded-md border border-border/60 bg-surface-2/50 px-2.5 py-1.5 font-mono text-xs"
                >
                  <span className="truncate text-ink/80">{p.name}</span>
                  <span className={`rounded border px-1.5 py-px text-[10px] ${PHASE_STYLE[p.phase] ?? PHASE_STYLE.Unknown}`}>
                    {p.phase}
                  </span>
                  <span className="tnum text-right text-muted">{p.restarts}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="font-mono text-xs text-muted">— no live pod data</p>
          )}
        </div>
      </div>
    </div>
  )
}
