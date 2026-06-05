import { useEffect, useRef, useState } from 'react'

// Same-origin in dev AND prod: the Vite dev proxy (dev) and the portfolio's own
// nginx (prod) forward to Grafana and inject the Bearer token server-side, so the
// token is never shipped in the browser bundle.
const BASE = '/grafana-api'
const POLL_MS = 30_000

// Grafana 13 removed the legacy numeric datasource proxy (/proxy/1/...) — it now
// requires the datasource UID (uid="prometheus", verified via /api/datasources).
const DS_PROXY = `/api/datasources/proxy/uid/prometheus/api/v1/query`

// PromQL queries proxied through the Grafana datasource. Kept raw here and
// URL-encoded at fetch time.
const QUERIES = {
  cpu: '100-(avg(rate(node_cpu_seconds_total{mode="idle"}[5m]))*100)',
  ram: '(1-(node_memory_MemAvailable_bytes/node_memory_MemTotal_bytes))*100',
  pods: 'count(kube_pod_status_phase{phase="Running"})',
  uptime: 'node_time_seconds-node_boot_time_seconds',
}

async function query(promql, signal) {
  const url = `${BASE}${DS_PROXY}?query=${encodeURIComponent(promql)}`
  const res = await fetch(url, {
    signal,
    headers: { 'Content-Type': 'application/json' },
  })
  if (!res.ok) throw new Error(`grafana ${res.status}`)
  const json = await res.json()
  // Prometheus instant-vector shape: data.result[0].value = [timestamp, "value"].
  const raw = json?.data?.result?.[0]?.value?.[1]
  return raw == null ? null : Number(raw)
}

function formatUptime(seconds) {
  if (seconds == null || Number.isNaN(seconds)) return null
  const d = Math.floor(seconds / 86400)
  const h = Math.floor((seconds % 86400) / 3600)
  const m = Math.floor((seconds % 3600) / 60)
  if (d > 0) return `${d}d ${h}h`
  if (h > 0) return `${h}h ${m}m`
  return `${m}m`
}

const EMPTY = { cpu: null, ram: null, pods: null, uptime: null }

/**
 * Polls the four cluster metrics every 30s. Fails soft: on any error the
 * affected values fall back to `--` and `live` flips false — never a raw error.
 */
export function useGrafanaMetrics() {
  const [metrics, setMetrics] = useState(EMPTY)
  const [loading, setLoading] = useState(true)
  const [live, setLive] = useState(false)
  const [lastUpdated, setLastUpdated] = useState(null)
  const timer = useRef(null)

  useEffect(() => {
    const controller = new AbortController()

    async function tick() {
      try {
        const [cpu, ram, pods, uptime] = await Promise.all([
          query(QUERIES.cpu, controller.signal),
          query(QUERIES.ram, controller.signal),
          query(QUERIES.pods, controller.signal),
          query(QUERIES.uptime, controller.signal),
        ])
        setMetrics({
          cpu: cpu == null ? null : String(Math.round(cpu)),
          ram: ram == null ? null : String(Math.round(ram)),
          pods: pods == null ? null : String(Math.round(pods)),
          uptime: formatUptime(uptime),
        })
        setLive(true)
        setLastUpdated(
          new Date().toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
          }),
        )
      } catch (err) {
        if (err.name !== 'AbortError') setLive(false)
        // Keep any previously good values; first-load failure stays EMPTY → `--`.
      } finally {
        setLoading(false)
      }
    }

    tick()
    timer.current = setInterval(tick, POLL_MS)
    return () => {
      controller.abort()
      clearInterval(timer.current)
    }
  }, [])

  return { metrics, loading, live, lastUpdated }
}
