import { BaseEdge, EdgeLabelRenderer } from '@xyflow/react'

// Designed edge routing instead of generic bezier soup. Three cases:
// aligned-vertical and aligned-horizontal render straight runs; everything
// else takes an orthogonal corridor path (down → across → down) with rounded
// corners, at data.corridorY if the layout pins one.
function buildPath(sx, sy, tx, ty, corridorY) {
  if (Math.abs(sx - tx) < 4) {
    return { path: `M ${sx},${sy} L ${tx},${ty}`, labelX: sx, labelY: (sy + ty) / 2, beside: true }
  }
  if (Math.abs(sy - ty) < 4) {
    return { path: `M ${sx},${sy} L ${tx},${ty}`, labelX: (sx + tx) / 2, labelY: sy - 14 }
  }
  const cy = corridorY ?? (sy + ty) / 2
  const dir = tx > sx ? 1 : -1
  const r = 10
  const path =
    `M ${sx},${sy} L ${sx},${cy - r} ` +
    `Q ${sx},${cy} ${sx + dir * r},${cy} ` +
    `L ${tx - dir * r},${cy} ` +
    `Q ${tx},${cy} ${tx},${cy + r} ` +
    `L ${tx},${ty}`
  return { path, labelX: (sx + tx) / 2, labelY: cy }
}

export default function LabeledEdge({ id, sourceX, sourceY, targetX, targetY, style, markerEnd, data = {} }) {
  const { path, labelX, labelY, beside } = buildPath(sourceX, sourceY, targetX, targetY, data.corridorY)

  return (
    <>
      <BaseEdge id={id} path={path} style={style} markerEnd={markerEnd} />
      {data.label && (
        <EdgeLabelRenderer>
          <div
            className="pointer-events-none absolute rounded border border-border bg-bg px-1.5 py-0.5 font-mono text-[10px] leading-none"
            style={{
              color: data.labelColor,
              transform: beside
                ? `translate(10px, -50%) translate(${labelX}px, ${data.labelY ?? labelY}px)`
                : `translate(-50%, -50%) translate(${labelX}px, ${data.labelY ?? labelY}px)`,
            }}
          >
            {data.label}
          </div>
        </EdgeLabelRenderer>
      )}
    </>
  )
}
