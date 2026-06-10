import { Handle, Position } from '@xyflow/react'

const HIDDEN_HANDLE = {
  opacity: 0,
  width: 1,
  height: 1,
  minWidth: 0,
  minHeight: 0,
  border: 'none',
  background: 'transparent',
  pointerEvents: 'none',
}

const STATUS_DOT = {
  ready: 'bg-live',
  degraded: 'bg-progress',
  down: 'bg-crit',
  unknown: 'bg-muted',
}

const KIND_LABEL = { deploy: 'DEP', sts: 'STS' }

export default function WorkloadNode({ data, selected }) {
  const { name, kind, color, live } = data
  const status = live?.status ?? 'unknown'
  const replicas = live?.ready != null && live?.desired != null ? `${live.ready}/${live.desired}` : '--'

  return (
    <div
      role="group"
      aria-label={`${name}, ${kind === 'sts' ? 'StatefulSet' : 'Deployment'}, ${replicas} ready`}
      className={`relative h-16 w-[200px] rounded-lg border bg-surface-2 transition-[border-color,box-shadow] duration-200 ${
        selected ? 'border-transparent' : 'border-border hover:border-border-bright'
      }`}
      style={selected ? { boxShadow: `0 0 0 1.5px ${color}, 0 0 24px -6px ${color}66` } : undefined}
    >
      {/* Namespace color bar — the one constant visual key across the site. */}
      <span aria-hidden className="absolute inset-y-0 left-0 w-[3px] rounded-l-lg" style={{ background: color }} />

      <div className="flex h-full flex-col justify-center gap-1 py-2 pl-3.5 pr-3">
        <div className="flex items-center justify-between gap-2">
          <span className="truncate font-mono text-xs text-ink">{name}</span>
          <span className="shrink-0 rounded border border-border bg-bg px-1 py-px font-mono text-[9px] tracking-wide text-muted">
            {KIND_LABEL[kind]}
          </span>
        </div>
        <div className="flex items-center justify-between">
          <span className="tnum font-mono text-[11px] text-muted">{replicas} ready</span>
          <span className="relative flex h-1.5 w-1.5" title={status}>
            {status === 'ready' && (
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-live opacity-60" />
            )}
            <span className={`relative inline-flex h-1.5 w-1.5 rounded-full ${STATUS_DOT[status]}`} />
          </span>
        </div>
      </div>

      <Handle type="target" position={Position.Top} id="in-t" style={HIDDEN_HANDLE} />
      <Handle type="target" position={Position.Left} id="in-l" style={HIDDEN_HANDLE} />
      <Handle type="source" position={Position.Bottom} id="out-b" style={HIDDEN_HANDLE} />
      <Handle type="source" position={Position.Right} id="out-r" style={HIDDEN_HANDLE} />
    </div>
  )
}
