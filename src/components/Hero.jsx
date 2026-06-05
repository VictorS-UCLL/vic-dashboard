import { ArrowDown, Mail, Terminal } from 'lucide-react'
import { GithubIcon } from './icons'

export default function Hero() {
  return (
    <section className="relative mx-auto flex min-h-[88vh] max-w-5xl flex-col justify-center px-6 pt-28">
      {/* Soft accent glow behind the name — orange used sparingly, never as wallpaper. */}
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/4 top-1/3 -z-10 h-72 w-72 -translate-x-1/2 rounded-full bg-accent/10 blur-[120px]"
      />

      <div className="mb-7 inline-flex w-fit items-center gap-2 rounded-full border border-border bg-surface/60 px-3 py-1 font-mono text-xs text-muted">
        <span className="relative flex h-2 w-2">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-live opacity-60" />
          <span className="relative inline-flex h-2 w-2 rounded-full bg-live" />
        </span>
        live on self-hosted k3s
      </div>

      <h1 className="text-5xl font-extrabold tracking-tight text-ink sm:text-7xl">Victor Suciu</h1>

      <div className="mt-4 flex items-center gap-2 font-mono text-sm text-accent sm:text-base">
        <Terminal className="h-4 w-4" strokeWidth={2} />
        <span>infrastructure engineer / builder</span>
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
          className="inline-flex items-center gap-2 rounded-lg border border-border bg-surface px-4 py-2.5 text-sm font-medium text-ink transition-colors duration-200 hover:border-border-bright hover:bg-surface-2 cursor-pointer"
        >
          <GithubIcon className="h-4 w-4" /> GitHub
        </a>
        <a
          href="#contact"
          className="inline-flex items-center gap-2 rounded-lg px-4 py-2.5 text-sm font-medium text-muted transition-colors duration-200 hover:text-ink cursor-pointer"
        >
          <Mail className="h-4 w-4" /> Get in touch
        </a>
      </div>

      <a
        href="#metrics"
        aria-label="Scroll to metrics"
        className="absolute bottom-8 left-6 text-muted transition-colors duration-200 hover:text-ink cursor-pointer"
      >
        <ArrowDown className="h-5 w-5 animate-bounce" />
      </a>
    </section>
  )
}
