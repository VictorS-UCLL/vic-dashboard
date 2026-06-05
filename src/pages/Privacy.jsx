import { Link } from 'react-router-dom'

export default function Privacy() {
  return (
    <div className="min-h-screen bg-bg text-ink">
      <div className="mx-auto max-w-2xl px-6 py-20">
        {/* Back link */}
        <Link
          to="/"
          className="mb-12 inline-block font-mono text-xs text-muted transition-colors duration-200 hover:text-ink"
        >
          ← back
        </Link>

        <h1 className="mt-4 font-mono text-base font-semibold text-ink">Privacy Policy</h1>
        <p className="mt-1 font-mono text-[11px] text-muted">Last updated: June 5, 2026</p>

        <div className="mt-10 space-y-5 text-sm leading-relaxed text-muted/80">
          <p>
            This website is a personal portfolio. It does not collect, store, or process any
            personal data. No cookies are set. No analytics are used. No forms collect user
            information.
          </p>
          <p>
            The site is self-hosted on infrastructure located in Belgium and served through
            Cloudflare's global network. Cloudflare may process request metadata (such as IP
            addresses) in accordance with their own privacy policy.
          </p>
          <p>
            The live metrics panel fetches data from a self-hosted Grafana instance. No visitor
            data is involved in this process.
          </p>
          <p>
            For any questions:{' '}
            <a
              href="mailto:suciuvictor99@gmail.com"
              className="text-ink/60 underline underline-offset-2 transition-colors duration-200 hover:text-ink"
            >
              suciuvictor99@gmail.com
            </a>
          </p>
        </div>
      </div>
    </div>
  )
}
