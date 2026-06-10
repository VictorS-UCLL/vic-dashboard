import { Cloud } from 'lucide-react'
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

// The edge in front of the cluster — not a k8s object, so it gets a dashed
// frame and sits outside every namespace box.
export default function ExternalNode({ data }) {
  return (
    <div
      role="group"
      aria-label={`${data.name}, external edge`}
      className="h-[70px] w-[200px] rounded-lg border border-dashed border-border-bright bg-surface/70 px-3.5 py-2.5"
    >
      <div className="flex items-center justify-between gap-2">
        <span className="flex items-center gap-2 font-mono text-xs text-ink">
          <Cloud className="h-3.5 w-3.5 text-muted" strokeWidth={1.75} />
          {data.name}
        </span>
        <span className="rounded border border-border bg-bg px-1 py-px font-mono text-[9px] tracking-wide text-muted">
          EDGE
        </span>
      </div>
      <div className="mt-1.5 pl-[22px] font-mono text-[10px] text-muted">{data.sub}</div>

      <Handle type="source" position={Position.Bottom} id="out-b" style={HIDDEN_HANDLE} />
    </div>
  )
}
