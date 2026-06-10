import { Fragment } from 'react'
import { ArrowRight, ArrowUpRight, Server } from 'lucide-react'
import { GithubIcon } from '../components/icons'
import { Pill, SectionHead, StatusBadge, LiveDot } from '../components/ui'
import { FEATURED, PROJECTS } from '../data/projects'

export default function Projects() {
  return (
    <section id="projects" className="mx-auto max-w-5xl scroll-mt-24 px-6 py-20">
      <SectionHead index="03" title="projects" />
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <FeaturedCard />
        {PROJECTS.map((p) => (
          <ProjectCard key={p.name} project={p} />
        ))}
        <PlannedCard />
      </div>
    </section>
  )
}

// The hero project — full width, reads like a dashboard widget. The pipeline
// ends at this very page: that's the whole pitch.
function FeaturedCard() {
  return (
    <article className="group relative overflow-hidden rounded-2xl border border-border bg-surface p-6 transition-all duration-200 hover:-translate-y-0.5 hover:border-border-bright sm:p-7 md:col-span-2">
      <div
        aria-hidden
        className="pointer-events-none absolute -right-20 -top-20 h-48 w-48 rounded-full bg-accent/[0.08] blur-3xl"
      />

      <div className="grid gap-6 md:grid-cols-[1fr_300px]">
        <div>
          <header className="mb-4 flex items-start justify-between gap-4">
            <div className="flex flex-wrap items-center gap-2">
              <Server className="h-4 w-4 text-accent" strokeWidth={2} />
              <h3 className="text-lg font-semibold text-ink">{FEATURED.name}</h3>
              <span className="rounded border border-accent/30 bg-accent/10 px-1.5 py-0.5 font-mono text-[10px] uppercase tracking-wide text-accent">
                featured
              </span>
            </div>
            <StatusBadge status={FEATURED.status} />
          </header>

          <p className="mb-5 max-w-xl text-sm leading-relaxed text-ink/70">{FEATURED.description}</p>

          <div className="mb-5 flex flex-wrap items-center gap-1.5">
            {FEATURED.tags.map((t) => (
              <Pill key={t}>{t}</Pill>
            ))}
          </div>

          <a
            href={FEATURED.href}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1.5 font-mono text-xs text-muted transition-colors duration-200 hover:text-accent cursor-pointer focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent"
          >
            <GithubIcon className="h-3.5 w-3.5" /> {FEATURED.repo}
            <ArrowUpRight className="h-3.5 w-3.5" />
          </a>
        </div>

        {/* Serving pipeline, top-down — a one-glance echo of the topology. */}
        <div className="rounded-xl border border-border bg-bg/50 p-4">
          <div className="mb-3 font-mono text-[10px] uppercase tracking-widest text-muted">
            {'// serving path'}
          </div>
          <div className="flex flex-col gap-1.5">
            {FEATURED.pipeline.map((node, i) => {
              const last = i === FEATURED.pipeline.length - 1
              return (
                <Fragment key={node}>
                  <div
                    className={`flex items-center justify-between rounded-md border px-2.5 py-1.5 font-mono text-xs ${
                      last ? 'border-accent/40 bg-accent/[0.06] text-ink' : 'border-border bg-surface-2 text-ink/80'
                    }`}
                  >
                    {node}
                    {last && (
                      <span className="flex items-center gap-1.5 text-[10px] text-accent">
                        <LiveDot className="h-1.5 w-1.5" /> you are here
                      </span>
                    )}
                  </div>
                  {!last && (
                    <ArrowRight aria-hidden className="ml-3 h-3 w-3 rotate-90 text-accent/60" />
                  )}
                </Fragment>
              )
            })}
          </div>
        </div>
      </div>
    </article>
  )
}

function ProjectCard({ project }) {
  if (project.variant === 'rav3d') return <Rav3dCard project={project} />
  return <ArchiveCard project={project} />
}

// RAV3D's own identity bleeding through — purple on near-black, industrial
// wordmark, faint diagonal stripes. Intentionally breaks the house style.
function Rav3dCard({ project }) {
  return (
    <article className="group relative overflow-hidden rounded-2xl border border-rav3d/40 bg-[#0c0a10] p-6 transition-all duration-200 hover:-translate-y-0.5 hover:border-rav3d/70">
      <div
        aria-hidden
        className="pointer-events-none absolute -right-16 -top-16 h-44 w-44 rounded-full bg-rav3d/25 blur-3xl"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.05]"
        style={{
          backgroundImage:
            'repeating-linear-gradient(-45deg, #9B30FF 0, #9B30FF 1px, transparent 1px, transparent 9px)',
        }}
      />

      <header className="relative mb-3 flex items-start justify-between gap-3">
        <h3 className="font-mono text-2xl font-black uppercase tracking-tighter text-rav3d">
          RAV3D
        </h3>
        <StatusBadge status={project.status} />
      </header>

      <p className="relative mb-1 font-mono text-[10px] uppercase tracking-widest text-rav3d/60">
        underground hardware · BE rave scene
      </p>
      <p className="relative mb-4 mt-3 text-sm leading-relaxed text-ink/70">{project.description}</p>

      <div className="relative mb-5 flex flex-wrap gap-1.5">
        {project.tags.map((t) => (
          <Pill key={t} className="border-rav3d/30 bg-transparent text-rav3d/90">
            {t}
          </Pill>
        ))}
      </div>

      <span className="relative font-mono text-xs text-muted/70">{project.linkLabel}</span>
    </article>
  )
}

// Emilio — archive-folder aesthetic: dashed inner frame, catalogue label.
function ArchiveCard({ project }) {
  return (
    <article className="group relative rounded-2xl border border-border bg-surface p-2 transition-all duration-200 hover:-translate-y-0.5 hover:border-border-bright">
      <div className="h-full rounded-xl border border-dashed border-border/80 p-4 sm:p-5">
        <header className="mb-3 flex items-start justify-between gap-3">
          <div>
            <div className="font-mono text-[10px] uppercase tracking-widest text-muted/60">
              archive — BE / graffiti
            </div>
            <h3 className="mt-1 text-lg font-semibold text-ink">{project.name}</h3>
          </div>
          <StatusBadge status={project.status} />
        </header>

        <p className="mb-4 text-sm leading-relaxed text-ink/70">{project.description}</p>

        <div className="mb-5 flex flex-wrap gap-1.5">
          {project.tags.map((t) => (
            <Pill key={t}>{t}</Pill>
          ))}
        </div>

        <span className="font-mono text-xs text-muted/60">{project.linkLabel}</span>
      </div>
    </article>
  )
}

// Honest empty slot for future work — dashed, muted, intentional.
function PlannedCard() {
  return (
    <article className="flex min-h-[120px] flex-col items-start justify-center rounded-2xl border border-dashed border-border p-6 md:col-span-2">
      <div className="font-mono text-xs text-muted">{'// next project'}</div>
      <p className="mt-1.5 text-sm text-muted/60">More coming — always building something.</p>
    </article>
  )
}
