import { GithubIcon } from './icons'

const NAV_LINKS = [
  ['metrics', '#metrics'],
  ['topology', '#topology'],
  ['projects', '#projects'],
  ['stack', '#stack'],
  ['contact', '#contact'],
]

export default function Nav() {
  return (
    <nav className="fixed inset-x-0 top-0 z-50 border-b border-border/60 bg-bg/70 backdrop-blur-md">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-3.5">
        <a
          href="#top"
          className="font-mono text-sm font-semibold text-ink cursor-pointer focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent"
        >
          vic420<span className="text-accent">.com</span>
        </a>

        <div className="hidden items-center gap-6 font-mono text-xs text-muted sm:flex">
          {NAV_LINKS.map(([label, href]) => (
            <a
              key={href}
              href={href}
              className="transition-colors duration-200 hover:text-ink cursor-pointer focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent"
            >
              {label}
            </a>
          ))}
        </div>

        <a
          href="https://github.com/VictorS-UCLL"
          target="_blank"
          rel="noreferrer"
          aria-label="GitHub"
          className="text-muted transition-colors duration-200 hover:text-ink cursor-pointer focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent"
        >
          <GithubIcon className="h-4 w-4" />
        </a>
      </div>
    </nav>
  )
}
