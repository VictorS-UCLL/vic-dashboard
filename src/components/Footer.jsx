import { Link } from 'react-router-dom'
import { GithubIcon } from './icons'

export default function Footer() {
  return (
    <footer className="border-t border-border/40 bg-bg">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
        <span className="font-mono text-[11px] text-muted">© 2026 Victor Suciu</span>

        <div className="flex items-center gap-5 font-mono text-[11px] text-muted">
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
