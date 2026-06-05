import { Fragment } from 'react'
import { ArrowRight, ArrowUpRight, Server } from 'lucide-react'
import { GithubIcon } from './icons'
import { Pill, StatusBadge } from './ui'

// Featured homelab card — visually heavier, behaves like a dashboard widget,
// spans the full grid width and renders a mini architecture flow.
export function FeaturedCard() {
  const stack = ['proxmox', 'k3s', 'docker', 'traefik', 'cloudflare', 'prometheus', 'grafana']
  const flow = ['Proxmox', 'K3s', 'Traefik', 'Cloudflare']

  return (
    <article className="group relative overflow-hidden rounded-2xl border border-border bg-surface p-6 transition-all duration-200 hover:-translate-y-0.5 hover:border-border-bright sm:p-7 md:col-span-2">
      <div
        aria-hidden
        className="pointer-events-none absolute -right-20 -top-20 h-48 w-48 rounded-full bg-accent/10 blur-3xl"
      />

      <header className="mb-5 flex items-start justify-between gap-4">
        <div>
          <div className="mb-2 flex flex-wrap items-center gap-2">
            <Server className="h-4 w-4 text-accent" strokeWidth={2} />
            <h3 className="text-lg font-semibold text-ink">vic420 homelab</h3>
            <span className="rounded border border-accent/30 bg-accent/10 px-1.5 py-0.5 font-mono text-[10px] uppercase tracking-wide text-accent">
              featured
            </span>
          </div>
          <p className="max-w-xl text-sm leading-relaxed text-ink/70">
            Self-hosted production infrastructure built from scratch. Proxmox hypervisor, K3s
            cluster, Cloudflare Tunnel, full observability stack.
          </p>
        </div>
        <StatusBadge status="live" />
      </header>

      {/* Mini architecture flow — the card reads like a dashboard widget itself. */}
      <div className="mb-5 rounded-xl border border-border bg-bg/50 p-4">
        <div className="mb-3 font-mono text-[10px] uppercase tracking-widest text-muted">
          // stack flow
        </div>
        <div className="flex flex-wrap items-center gap-2">
          {flow.map((node, i) => (
            <Fragment key={node}>
              <span className="rounded-md border border-border bg-surface-2 px-2.5 py-1 font-mono text-xs text-ink">
                {node}
              </span>
              {i < flow.length - 1 && (
                <ArrowRight className="h-3.5 w-3.5 shrink-0 text-accent/70" />
              )}
            </Fragment>
          ))}
        </div>
      </div>

      <div className="mb-5 flex flex-wrap items-center gap-1.5">
        {stack.map((t) => (
          <Pill key={t}>{t}</Pill>
        ))}
      </div>

      <a
        href="https://github.com/VictorS-UCLL/homelab-k3s"
        target="_blank"
        rel="noreferrer"
        className="inline-flex items-center gap-1.5 font-mono text-xs text-muted transition-colors duration-200 hover:text-accent cursor-pointer"
      >
        <GithubIcon className="h-3.5 w-3.5" /> github.com/VictorS-UCLL/homelab-k3s
        <ArrowUpRight className="h-3.5 w-3.5" />
      </a>
    </article>
  )
}

// Standard / RAV3D / planned cards.
export default function ProjectCard({ project }) {
  if (project.variant === 'planned') return <PlannedCard />

  const isRav = project.variant === 'rav3d'

  return (
    <article
      className={`group relative overflow-hidden rounded-2xl border bg-surface p-6 transition-all duration-200 hover:-translate-y-0.5 ${
        isRav ? 'border-rav3d/40 hover:border-rav3d/70' : 'border-border hover:border-border-bright'
      }`}
    >
      {/* RAV3D's own brand identity bleeding through — purple, not orange. Intentional. */}
      {isRav && (
        <div
          aria-hidden
          className="pointer-events-none absolute -right-16 -top-16 h-40 w-40 rounded-full bg-rav3d/20 blur-3xl"
        />
      )}

      <header className="mb-3 flex items-start justify-between gap-3">
        <h3
          className={
            isRav
              ? 'font-mono text-lg font-bold uppercase tracking-tight text-rav3d'
              : 'text-lg font-semibold text-ink'
          }
        >
          {project.name}
        </h3>
        <StatusBadge status={project.status} />
      </header>

      <p className="mb-4 text-sm leading-relaxed text-ink/70">{project.description}</p>

      <div className="mb-5 flex flex-wrap gap-1.5">
        {project.tags.map((t) => (
          <Pill key={t} className={isRav ? 'border-rav3d/30 text-rav3d/90' : ''}>
            {t}
          </Pill>
        ))}
      </div>

      {project.href ? (
        <a
          href={project.href}
          target="_blank"
          rel="noreferrer"
          className={`inline-flex items-center gap-1.5 font-mono text-xs transition-colors duration-200 cursor-pointer ${
            isRav ? 'text-muted hover:text-rav3d' : 'text-muted hover:text-accent'
          }`}
        >
          {project.linkLabel}
          <ArrowUpRight className="h-3.5 w-3.5" />
        </a>
      ) : (
        <span className="font-mono text-xs text-muted/60">{project.linkLabel}</span>
      )}
    </article>
  )
}

// Honest empty slot for future work — dashed, muted, intentional (not a fake card).
function PlannedCard() {
  return (
    <article className="flex min-h-[120px] flex-col items-start justify-center rounded-2xl border border-dashed border-border p-6 md:col-span-2">
      <div className="font-mono text-xs text-muted">// next project</div>
      <p className="mt-1.5 text-sm text-muted/60">More coming — always building something.</p>
    </article>
  )
}
