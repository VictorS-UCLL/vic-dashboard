import { Mail } from 'lucide-react'
import { GithubIcon, LinkedinIcon } from './icons'
import { SectionLabel } from './ui'

// NOTE: email + LinkedIn are placeholders — swap in the real ones.
const LINKS = [
  { Icon: GithubIcon, label: 'VictorS-UCLL', href: 'https://github.com/VictorS-UCLL' },
  { Icon: Mail, label: 'hello@vic420.com', href: 'mailto:hello@vic420.com' },
  { Icon: LinkedinIcon, label: 'linkedin', href: 'https://www.linkedin.com/' },
]

export default function Contact() {
  return (
    <section id="contact" className="mx-auto max-w-5xl scroll-mt-24 px-6 py-20">
      <SectionLabel>contact</SectionLabel>

      <div className="rounded-2xl border border-border bg-surface p-7 sm:p-9">
        <h2 className="text-2xl font-semibold tracking-tight text-ink">Let's build something.</h2>
        <p className="mt-2 max-w-md text-sm leading-relaxed text-ink/70">
          Open to internships and collaborations. The fastest way to reach me is email or GitHub.
        </p>

        <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:gap-4">
          {LINKS.map(({ Icon, label, href }) => (
            <a
              key={label}
              href={href}
              target={href.startsWith('http') ? '_blank' : undefined}
              rel={href.startsWith('http') ? 'noreferrer' : undefined}
              className="inline-flex items-center gap-2 rounded-lg border border-border bg-surface-2/50 px-4 py-2.5 font-mono text-sm text-muted transition-colors duration-200 hover:border-border-bright hover:text-ink cursor-pointer"
            >
              <Icon className="h-4 w-4" />
              {label}
            </a>
          ))}
        </div>
      </div>

    </section>
  )
}
