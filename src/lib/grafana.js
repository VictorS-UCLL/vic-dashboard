// Same-origin in dev AND prod: the Vite dev proxy (dev) and the portfolio's own
// nginx (prod) forward /grafana-api to Grafana and inject the Bearer token
// server-side, so the token is never shipped in the browser bundle.
const BASE = '/grafana-api'

// Grafana 13 removed the legacy numeric datasource proxy (/proxy/1/...) — it
// requires the datasource UID (uid="prometheus", verified via /api/datasources).
const DS_PROXY = '/api/datasources/proxy/uid/prometheus/api/v1/query'

async function query(promql, signal) {
  const url = `${BASE}${DS_PROXY}?query=${encodeURIComponent(promql)}`
  const res = await fetch(url, { signal, headers: { 'Content-Type': 'application/json' } })
  if (!res.ok) throw new Error(`grafana ${res.status}`)
  const json = await res.json()
  return json?.data?.result ?? []
}

// First sample of an instant vector as a number, or null.
export async function queryScalar(promql, signal) {
  const result = await query(promql, signal)
  const raw = result?.[0]?.value?.[1]
  return raw == null ? null : Number(raw)
}

// Full instant vector: [{ labels, value }].
export async function queryVector(promql, signal) {
  const result = await query(promql, signal)
  return result.map((r) => ({ labels: r.metric ?? {}, value: Number(r.value?.[1]) }))
}

// Run a map of named queries concurrently, fail-soft per query: one failure
// never blanks the others. Returns { name: value | undefined } — undefined
// means "this query failed this tick, keep last known".
export async function queryAllSettled(specs, signal) {
  const names = Object.keys(specs)
  const settled = await Promise.allSettled(names.map((n) => specs[n](signal)))
  const out = {}
  let fulfilled = 0
  settled.forEach((s, i) => {
    if (s.status === 'fulfilled') {
      out[names[i]] = s.value
      fulfilled++
    }
  })
  return { out, fulfilled, total: names.length }
}
