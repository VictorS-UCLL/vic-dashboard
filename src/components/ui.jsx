// Small shared presentational primitives used across sections.

const STATUS = {
  live: { label: 'live', text: 'text-live', dot: 'bg-live', ping: true },
  progress: { label: 'in progress', text: 'text-progress', dot: 'bg-progress', ping: false },
  planned: { label: 'planned', text: 'text-muted', dot: 'bg-muted', ping: false },
}

// Console-style section opener: `// 02 · cluster topology ————————— <right slot>`.
// The numbered label + hairline rule frames every section the same way.
export function SectionHead({ index, title, right }) {
  return (
    <div className="mb-7 flex items-center gap-4">
      <div className="shrink-0 font-mono text-xs tracking-wide text-muted">
        <span className="text-accent/80">{'// '}</span>
        <span className="text-muted/60">{index} · </span>
        {title}
      </div>
      <div aria-hidden className="h-px flex-1 bg-border/60" />
      {right && <div className="shrink-0">{right}</div>}
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

// Pulsing live dot, reused by nav/hero/metrics readouts.
export function LiveDot({ on = true, className = 'h-2 w-2' }) {
  return (
    <span className={`relative flex ${className}`}>
      {on && <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-live opacity-60" />}
      <span className={`relative inline-flex rounded-full ${className} ${on ? 'bg-live' : 'bg-muted'}`} />
    </span>
  )
}
