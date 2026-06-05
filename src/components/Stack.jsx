import { Pill, SectionLabel } from './ui'

const GROUPS = [
  { label: 'infrastructure', items: ['Proxmox', 'K3s', 'Docker', 'Linux', 'Ubuntu'] },
  { label: 'networking', items: ['Cloudflare', 'Traefik', 'UFW', 'NTP'] },
  { label: 'backend', items: ['Java', 'Spring Boot', 'PostgreSQL', 'REST APIs'] },
  { label: 'frontend', items: ['Next.js', 'React', 'Tailwind'] },
  { label: 'automation', items: ['GitHub Actions', 'Bash', 'Ansible'] },
  { label: 'dev tools', items: ['Git', 'Python', 'YAML'] },
]

export default function Stack() {
  return (
    <section id="stack" className="mx-auto max-w-5xl scroll-mt-24 px-6 py-20">
      <SectionLabel>stack</SectionLabel>

      <div className="grid gap-10 md:grid-cols-5">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:col-span-3">
          {GROUPS.map((g) => (
            <div key={g.label}>
              <div className="mb-3 font-mono text-xs text-muted">{g.label}</div>
              <div className="flex flex-wrap gap-1.5">
                {g.items.map((it) => (
                  <Pill key={it} className="text-ink/80">
                    {it}
                  </Pill>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="md:col-span-2">
          <p className="text-sm leading-relaxed text-ink/70">
            Second-year Applied Computer Science student focused on DevOps, backend, and cloud
            infrastructure. I build and deploy full-stack applications with Java, Spring Boot,
            Next.js, and PostgreSQL — and run the infrastructure they live on. Coming from a business
            background, I think in systems and outcomes, not just code. Currently running a small 3D
            printing brand on the side, and looking for an internship where I can contribute real
            engineering work.
          </p>
        </div>
      </div>
    </section>
  )
}
