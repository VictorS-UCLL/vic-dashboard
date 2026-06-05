import { Link } from 'react-router-dom'
import { GithubIcon } from './icons'

export default function Footer() {
  return (
    <footer className="border-t border-border bg-bg">
      <div className="mx-auto flex max-w-5xl flex-col items-start justify-between gap-2 px-6 py-6 font-mono text-[11px] text-muted sm:flex-row sm:items-center">
        <span>
          © 2026 victor suciu — vic420.com
          <span className="mx-3 opacity-30">·</span>
          <span className="text-accent/80">$</span> built with react + vite · served from k3s
        </span>

        <div className="flex items-center gap-4">
          <Link
            to="/privacy"
            className="transition-colors duration-200 hover:text-ink"
          >
            Privacy Policy
          </Link>
          <a
            href="https://github.com/VictorS-UCLL"
            target="_blank"
            rel="noreferrer"
            aria-label="GitHub"
            className="transition-colors duration-200 hover:text-ink"
          >
            <GithubIcon className="h-3.5 w-3.5" />
          </a>
        </div>
      </div>
    </footer>
  )
}
