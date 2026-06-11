import { Pill, SectionHead } from '../components/ui'
import { STACK_GROUPS, BIO } from '../data/stack'

export default function Stack() {
  return (
    <section id="stack" className="mx-auto max-w-5xl scroll-mt-24 px-6 py-20">
      <SectionHead index="02" title="stack" />

      <div className="grid gap-10 md:grid-cols-5">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:col-span-3">
          {STACK_GROUPS.map((g) => (
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
          <div className="rounded-xl border border-border bg-surface/70 p-5">
            <div className="mb-3 font-mono text-[10px] uppercase tracking-widest text-muted">
              $ cat bio.txt
            </div>
            <p className="text-sm leading-relaxed text-ink/70">{BIO}</p>
          </div>
        </div>
      </div>
    </section>
  )
}
