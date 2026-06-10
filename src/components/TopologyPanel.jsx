import { Boxes, Cloud, Server, X } from 'lucide-react'

const PHASE_COLOR = {
    Running:   'text-live',
    Succeeded: 'text-muted',
    Pending:   'text-progress',
    Failed:    'text-red-400',
    Unknown:   'text-muted',
}

const NS_PILL = {
    default:       'bg-accent/10 text-accent border-accent/30',
    monitoring:    'bg-rav3d/10 text-rav3d border-rav3d/30',
    'kube-system': 'bg-sys/10 text-sys border-sys/30',
    cloudflare:    'bg-accent/10 text-accent border-accent/30',
}

export default function TopologyPanel({ node, onClose }) {
    if (!node) return null

    const healthy = node.isStatic || node.available > 0
    const KindIcon =
        node.namespace === 'cloudflare' ? Cloud
            : node.kind === 'StatefulSet' ? Server
                : Boxes
    const pill = NS_PILL[node.namespace] ?? 'bg-surface-2 text-muted border-border'

    return (
        <div className="mt-4 animate-fade-up overflow-hidden rounded-xl border border-border bg-surface">
            <div className="flex items-start justify-between gap-4 border-b border-border bg-surface-2/40 px-5 py-3.5">
                <div className="flex items-center gap-2.5">
                    <KindIcon className="h-4 w-4 text-muted" strokeWidth={2} />
                    <span className="font-mono text-sm font-semibold text-ink">
            {node.fullName ?? node.name}
          </span>
                    <span className={`rounded border px-1.5 py-0.5 font-mono text-[10px] ${pill}`}>
            {node.namespace}
          </span>
                </div>
                <button
                    onClick={onClose}
                    aria-label="Close detail panel"
                    className="shrink-0 rounded-md p-1 text-muted transition-colors duration-150 hover:bg-surface-2 hover:text-ink"
                >
                    <X className="h-4 w-4" strokeWidth={2} />
                </button>
            </div>

            <div className="p-5">
                {node.isStatic ? (
                    <p className="font-mono text-xs leading-relaxed text-muted">{node.description}</p>
                ) : (
                    <>
                        <div className="mb-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
                            <Stat label="kind" value={node.kind} />
                            <Stat label="replicas" value={`${node.available}/1`} />
                            <Stat
                                label="status"
                                value={healthy ? 'healthy' : 'degraded'}
                                valueClass={healthy ? 'text-live' : 'text-red-400'}
                            />
                            <Stat label="pods" value={String(node.pods?.length ?? 0)} />
                        </div>

                        {node.pods?.length > 0 && (
                            <>
                                <div className="mb-2.5 font-mono text-[11px] text-muted">
                                    <span className="text-accent/70">// </span>pods
                                </div>
                                <div className="flex flex-col gap-2">
                                    {node.pods.map((pod) => (
                                        <PodRow key={pod.name} pod={pod} />
                                    ))}
                                </div>
                            </>
                        )}
                    </>
                )}
            </div>
        </div>
    )
}

function Stat({ label, value, valueClass = 'text-ink' }) {
    return (
        <div className="rounded-lg border border-border bg-surface-2 px-3 py-2.5">
            <div className="mb-1 font-mono text-[10px] text-muted">{label}</div>
            <div className={`font-mono text-sm font-semibold ${valueClass}`}>{value}</div>
        </div>
    )
}

function PodRow({ pod }) {
    const phaseClass = PHASE_COLOR[pod.phase] ?? 'text-muted'
    return (
        <div className="grid grid-cols-[1fr_auto_auto] items-center gap-4 rounded-lg border border-border bg-surface-2 px-3 py-2.5">
      <span className="truncate font-mono text-[11px] text-muted" title={pod.name}>
        {pod.name}
      </span>
            <span className={`font-mono text-[11px] ${phaseClass}`}>{pod.phase}</span>
            <span
                className={`font-mono text-[11px] ${pod.restarts > 0 ? 'text-progress' : 'text-muted'}`}
                title="restart count"
            >
        {pod.restarts}r
      </span>
        </div>
    )
}
