// Small shared presentational primitives used across sections.

const STATUS = {
  live: { label: 'live', text: 'text-live', dot: 'bg-live', ping: true },
  progress: { label: 'in progress', text: 'text-progress', dot: 'bg-progress', ping: false },
  planned: { label: 'planned', text: 'text-muted', dot: 'bg-muted', ping: false },
}

// Monospace `// section` label that opens each section.
export function SectionLabel({ children }) {
  return (
    <div className="mb-7 font-mono text-xs tracking-wide text-muted">
      <span className="text-accent/80">// </span>
      {children}
    </div>
  )
}

// Status pill: colored dot (live pulses) + monospace label.
export function StatusBadge({ status = 'planned' }) {
  const s = STATUS[status] ?? STATUS.planned
  return (
    <span className="inline-flex shrink-0 items-center gap-1.5 font-mono text-[11px]">
      <span className="relative flex h-1.5 w-1.5">
        {s.ping && (
          <span className={`absolute inline-flex h-full w-full animate-ping rounded-full ${s.dot} opacity-60`} />
        )}
        <span className={`relative inline-flex h-1.5 w-1.5 rounded-full ${s.dot}`} />
      </span>
      <span className={s.text}>{s.label}</span>
    </span>
  )
}

// Monospace tech tag.
export function Pill({ children, className = '' }) {
  return (
    <span
      className={`rounded-md border border-border bg-surface-2/60 px-2 py-0.5 font-mono text-[11px] text-muted ${className}`}
    >
      {children}
    </span>
  )
}
