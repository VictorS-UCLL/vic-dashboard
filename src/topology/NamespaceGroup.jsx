// Namespace container box (OKD/Lens-style). Pure visual — not draggable,
// not selectable; children are constrained inside via extent: 'parent'.
export default function NamespaceGroup({ data }) {
  const { name, color, count, w, h } = data

  return (
    <div
      className="rounded-xl border"
      style={{ width: w, height: h, borderColor: `${color}33`, background: `${color}07` }}
    >
      <div className="flex items-center justify-between px-4 pt-2.5">
        <span className="flex items-center gap-2 font-mono text-[11px]" style={{ color }}>
          <span aria-hidden className="h-1.5 w-1.5 rounded-full" style={{ background: color }} />
          {name}
        </span>
        <span className="font-mono text-[10px] text-muted">
          {count} workload{count === 1 ? '' : 's'}
        </span>
      </div>
    </div>
  )
}
