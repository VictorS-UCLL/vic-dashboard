import { Suspense, lazy, useEffect, useState } from 'react'
import { Maximize2, Minimize2 } from 'lucide-react'
import DetailPanel from '../topology/DetailPanel'

// React Flow is the heaviest dependency on the page and the canvas is below
// the fold — split it out so the first paint doesn't pay for it.
const Canvas = lazy(() => import('../topology/Canvas'))

function CanvasFallback() {
  return (
    <div className="flex h-full items-center justify-center font-mono text-xs text-muted">
      loading topology…
    </div>
  )
}
import { WORKLOADS, NAMESPACES, NS_COLORS } from '../data/topology'
import { SectionHead, LiveDot } from '../components/ui'

function Legend() {
  return (
    <div className="hidden items-center gap-4 font-mono text-[10px] text-muted sm:flex">
      {NAMESPACES.map((ns) => (
        <span key={ns.id} className="flex items-center gap-1.5">
          <span aria-hidden className="h-1.5 w-1.5 rounded-full" style={{ background: NS_COLORS[ns.name] }} />
          {ns.name}
        </span>
      ))}
    </div>
  )
}

export default function Topology({ workloads, pods, live }) {
  const [selectedId, setSelectedId] = useState(null)
  const [fullscreen, setFullscreen] = useState(false)
  const selected = WORKLOADS.find((w) => w.id === selectedId)

  // Esc exits fullscreen; lock page scroll behind the overlay while open.
  useEffect(() => {
    if (!fullscreen) return
    const onKey = (e) => e.key === 'Escape' && setFullscreen(false)
    window.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      window.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [fullscreen])

  const FsIcon = fullscreen ? Minimize2 : Maximize2

  const viewer = (
    <>
      <div
        className={`overflow-hidden rounded-2xl border border-border bg-surface/40 ${
          fullscreen ? 'min-h-0 flex-1' : 'h-[420px] sm:h-[540px]'
        }`}
      >
        <Suspense fallback={<CanvasFallback />}>
          <Canvas workloads={workloads} selectedId={selectedId} onSelect={setSelectedId} fullscreen={fullscreen} />
        </Suspense>
      </div>

      <div className="mt-3 flex items-center justify-between gap-4">
        <p className="font-mono text-[10px] text-muted/70">
          drag nodes · pinch or buttons to zoom · click a workload for pod detail
        </p>
        <span className="flex items-center gap-1.5 font-mono text-[10px] text-muted">
          <LiveDot on={live} className="h-1.5 w-1.5" />
          {live ? 'streaming' : 'last known state'}
        </span>
      </div>

      {selected && (
        <div className={`mt-4 ${fullscreen ? 'max-h-[40vh] overflow-y-auto' : ''}`}>
          <DetailPanel
            workload={selected}
            live={workloads[selected.id]}
            pods={pods[selected.id]}
            onClose={() => setSelectedId(null)}
          />
        </div>
      )}
    </>
  )

  const expandBtn = (
    <button
      type="button"
      onClick={() => setFullscreen((f) => !f)}
      aria-label={fullscreen ? 'Exit fullscreen' : 'View topology fullscreen'}
      className="flex items-center gap-2 rounded-md border border-border bg-surface px-2.5 py-1.5 font-mono text-[11px] text-muted transition-colors duration-200 hover:border-border-bright hover:text-ink cursor-pointer focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent"
    >
      <FsIcon className="h-3.5 w-3.5" />
      {fullscreen ? 'exit' : 'expand'}
    </button>
  )

  if (fullscreen) {
    return (
      <section id="topology" className="mx-auto max-w-5xl scroll-mt-24 px-6 py-20">
        {/* Placeholder keeps scroll position; the viewer moves into an overlay. */}
        <div className="fixed inset-0 z-[70] flex flex-col bg-bg p-4 sm:p-6">
          <div className="mb-4 flex items-center justify-between gap-4">
            <div className="flex items-center gap-5">
              <span className="font-mono text-xs text-muted">
                <span className="text-accent/80">{'// '}</span>cluster topology — fullscreen
              </span>
              <Legend />
            </div>
            {expandBtn}
          </div>
          {viewer}
        </div>
      </section>
    )
  }

  return (
    <section id="topology" className="mx-auto max-w-5xl scroll-mt-24 px-6 py-20">
      <SectionHead
        index="02"
        title="cluster topology"
        right={
          <div className="flex items-center gap-5">
            <Legend />
            {expandBtn}
          </div>
        }
      />
      {viewer}
    </section>
  )
}
