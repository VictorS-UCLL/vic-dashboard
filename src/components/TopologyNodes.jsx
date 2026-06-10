import { memo } from 'react'
import { Handle, Position } from '@xyflow/react'
import { Boxes, Cloud, Layers, Server } from 'lucide-react'

/* ─── namespace colour map (static literals for Tailwind JIT) ────────────── */
const NS = {
    default: {
        text: 'text-accent', border: 'border-accent/30', borderT: 'border-t-accent',
        badge: 'bg-accent/10 text-accent border-accent/30', dot: 'bg-live', ping: 'bg-live',
        group: 'border-accent/25', groupText: 'text-accent',
    },
    monitoring: {
        text: 'text-rav3d', border: 'border-rav3d/30', borderT: 'border-t-rav3d',
        badge: 'bg-rav3d/10 text-rav3d border-rav3d/30', dot: 'bg-rav3d', ping: 'bg-rav3d',
        group: 'border-rav3d/25', groupText: 'text-rav3d',
    },
    'kube-system': {
        text: 'text-sys', border: 'border-sys/30', borderT: 'border-t-sys',
        badge: 'bg-sys/10 text-sys border-sys/30', dot: 'bg-sys', ping: null,
        group: 'border-sys/25', groupText: 'text-sys',
    },
    cloudflare: {
        text: 'text-accent', border: 'border-accent/30', borderT: 'border-t-accent',
        badge: 'bg-accent/10 text-accent border-accent/30', dot: 'bg-accent', ping: null,
        group: 'border-accent/25', groupText: 'text-accent',
    },
}
const FALLBACK = NS['kube-system']

/* ─── namespace group container ──────────────────────────────────────────── */
export const NamespaceGroup = memo(function NamespaceGroup({ data }) {
    const ns = NS[data.namespace] ?? FALLBACK
    return (
        <div
            className={`h-full w-full rounded-2xl border border-dashed ${ns.group} bg-surface/30 backdrop-blur-[1px]`}
        >
            <div className="flex items-center gap-1.5 px-3 pt-2.5">
                <Layers className={`h-3 w-3 ${ns.groupText}`} strokeWidth={2} />
                <span className={`font-mono text-[11px] font-semibold ${ns.groupText}`}>
          {data.namespace}
        </span>
                <span className="font-mono text-[10px] text-muted">
          · {data.count} {data.count === 1 ? 'workload' : 'workloads'}
        </span>
            </div>
        </div>
    )
})

/* ─── workload node (deployment / statefulset) ───────────────────────────── */
export const WorkloadNode = memo(function WorkloadNode({ data }) {
    const ns = NS[data.namespace] ?? FALLBACK
    const healthy = data.available > 0
    const KindIcon = data.kind === 'StatefulSet' ? Server : Boxes

    return (
        <>
            <Handle type="target" position={Position.Top} />
            <Handle type="source" position={Position.Bottom} />

            <div
                className={[
                    'w-[150px] cursor-pointer select-none rounded-lg border border-border border-t-2 bg-surface',
                    'px-3 py-2.5 transition-all duration-200',
                    ns.borderT,
                    data.isSelected
                        ? 'border-border-bright ring-1 ring-border-bright/50'
                        : 'hover:border-border-bright',
                ].join(' ')}
            >
                <div className="mb-1.5 flex items-center gap-1.5">
          <span className="relative flex h-1.5 w-1.5 shrink-0">
            {healthy && ns.ping && (
                <span className={`absolute inline-flex h-full w-full animate-ping rounded-full opacity-60 ${ns.ping}`} />
            )}
              <span className={`relative inline-flex h-1.5 w-1.5 rounded-full ${healthy ? ns.dot : 'bg-muted'}`} />
          </span>
                    <span className="truncate font-mono text-[12px] font-semibold text-ink">
            {data.label}
          </span>
                </div>

                <div className="flex items-center gap-1.5">
          <span className="inline-flex items-center gap-1 rounded border border-border bg-surface-2 px-1.5 py-0.5 font-mono text-[9px] text-muted">
            <KindIcon className="h-2.5 w-2.5" strokeWidth={2} />
              {data.kind === 'StatefulSet' ? 'STS' : 'Deploy'}
          </span>
                    <span className="rounded border border-border bg-surface-2 px-1.5 py-0.5 font-mono text-[9px] text-muted">
            {healthy ? `${data.available}/1` : '0/1'}
          </span>
                </div>
            </div>
        </>
    )
})

/* ─── external node (Cloudflare) ─────────────────────────────────────────── */
export const ExternalNode = memo(function ExternalNode({ data }) {
    const ns = NS.cloudflare
    return (
        <>
            <Handle type="source" position={Position.Bottom} />
            <div
                className={[
                    'w-[150px] cursor-pointer select-none rounded-lg border border-border border-t-2 bg-surface',
                    'px-3 py-2.5 transition-all duration-200',
                    ns.borderT,
                    data.isSelected
                        ? 'border-border-bright ring-1 ring-border-bright/50'
                        : 'hover:border-border-bright',
                ].join(' ')}
            >
                <div className="mb-1.5 flex items-center gap-1.5">
                    <Cloud className={`h-3.5 w-3.5 ${ns.text}`} strokeWidth={2} />
                    <span className="font-mono text-[12px] font-semibold text-ink">
            {data.label}
          </span>
                </div>
                <span className={`rounded border px-1.5 py-0.5 font-mono text-[9px] ${ns.badge}`}>
          edge
        </span>
            </div>
        </>
    )
})
