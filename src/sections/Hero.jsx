import { ArrowDown, Mail } from 'lucide-react'
import { GithubIcon } from '../components/icons'
import { LiveDot } from '../components/ui'

// Truthful infra facts, styled like a boot readout. Static on purpose — the
// live numbers live one scroll down.
const READOUT = [
  ['host', 'proxmox → k3s'],
  ['edge', 'cloudflare tunnel'],
  ['ingress', 'traefik'],
  ['telemetry', 'prometheus · grafana'],
  ['region', 'BE'],
]

export default function Hero() {
  return (
    <section className="relative mx-auto flex min-h-[88vh] max-w-5xl flex-col justify-center px-6 pt-28">
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/4 top-1/3 -z-10 h-72 w-72 -translate-x-1/2 rounded-full bg-accent/[0.07] blur-[120px]"
      />

      <div className="grid items-center gap-12 lg:grid-cols-[1fr_320px]">
        <div>
          <div className="mb-7 inline-flex w-fit items-center gap-2 rounded-full border border-border bg-surface/60 px-3 py-1 font-mono text-xs text-muted">
            <LiveDot className="h-2 w-2" />
            live on self-hosted k3s
          </div>

          <h1 className="text-5xl font-extrabold tracking-tight text-ink sm:text-7xl">
            Victor Suciu
          </h1>

          {/* Terminal moment: the command types itself, the answer follows. */}
          <div className="mt-5 font-mono text-sm sm:text-base" aria-label="whoami: infrastructure engineer and builder">
            <div aria-hidden className="flex items-center text-muted">
              <span className="text-accent/80">vic@k3s</span>
              <span>:~$&nbsp;</span>
              <span className="w-[6ch]">
                <span className="cmd-type text-ink">whoami</span>
              </span>
              <span className="caret -ml-1 text-accent">▍</span>
            </div>
            <div aria-hidden className="cmd-output mt-1.5 text-accent">
              infrastructure engineer · builder
            </div>
          </div>

          <p className="mt-6 max-w-xl text-lg leading-relaxed text-muted">
            Building production infrastructure and underground culture,
            <span className="text-ink"> one layer at a time.</span>
          </p>

          <div className="mt-9 flex flex-wrap items-center gap-3">
            <a
              href="https://github.com/VictorS-UCLL"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 rounded-lg border border-border bg-surface px-4 py-2.5 text-sm font-medium text-ink transition-colors duration-200 hover:border-border-bright hover:bg-surface-2 cursor-pointer focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent"
            >
              <GithubIcon className="h-4 w-4" /> GitHub
            </a>
            <a
              href="#contact"
              className="inline-flex items-center gap-2 rounded-lg px-4 py-2.5 text-sm font-medium text-muted transition-colors duration-200 hover:text-ink cursor-pointer focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent"
            >
              <Mail className="h-4 w-4" /> Get in touch
            </a>
          </div>
        </div>

        {/* System readout — the cluster this page is served from, as a console card. */}
        <aside className="hidden lg:block" aria-label="Infrastructure summary">
          <div className="rounded-xl border border-border bg-surface/70 p-1">
            <div className="flex items-center justify-between rounded-lg bg-surface-2/60 px-3.5 py-2">
              <span className="font-mono text-[10px] uppercase tracking-widest text-muted">system</span>
              <span className="flex gap-1" aria-hidden>
                <span className="h-1.5 w-1.5 rounded-full bg-border-bright" />
                <span className="h-1.5 w-1.5 rounded-full bg-border-bright" />
                <span className="h-1.5 w-1.5 rounded-full bg-live" />
              </span>
            </div>
            <dl className="px-3.5 py-2.5">
              {READOUT.map(([k, v]) => (
                <div
                  key={k}
                  className="flex items-center justify-between border-b border-border/40 py-2 font-mono text-xs last:border-0"
                >
                  <dt className="text-muted">{k}</dt>
                  <dd className="text-ink/80">{v}</dd>
                </div>
              ))}
              <div className="flex items-center justify-between py-2 font-mono text-xs">
                <dt className="text-muted">serving</dt>
                <dd className="flex items-center gap-1.5 text-live">
                  <LiveDot className="h-1.5 w-1.5" /> this page
                </dd>
              </div>
            </dl>
          </div>
        </aside>
      </div>

      <a
        href="#metrics"
        aria-label="Scroll to metrics"
        className="absolute bottom-8 left-6 text-muted transition-colors duration-200 hover:text-ink cursor-pointer focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent"
      >
        <ArrowDown className="h-5 w-5 animate-bounce" />
      </a>
    </section>
  )
}
