import { useEffect, useRef, useState } from 'react'
import { queryScalar, queryVector, queryAllSettled } from '../lib/grafana'
import { METRIC_QUERIES, TOPOLOGY_QUERIES } from '../lib/promql'
import { WORKLOADS } from '../data/topology'
import { formatAvailability, formatClock, roundOrNull } from '../lib/format'

const POLL_MS = 30_000
const HISTORY_LEN = 24 // ~12 min of session sparkline at 30s/tick

const EMPTY_METRICS = { cpu: null, ram: null, pods: null, uptime: null }

// Index a replica vector by "namespace/name" using the given label key.
function indexReplicas(vector, labelKey) {
  const map = {}
  for (const { labels, value } of vector ?? []) {
    map[`${labels.namespace}/${labels[labelKey]}`] = value
  }
  return map
}

// A pod belongs to workload W in namespace N when its name starts with W's
// metric name (k8s naming). Longest matching prefix wins, so e.g. a pod of
// prometheus-kube-prometheus-stack-prometheus never lands on a shorter
// sibling workload.
function workloadForPod(namespace, podName) {
  let best = null
  let bestLen = -1
  for (const w of WORKLOADS) {
    if (w.namespace !== namespace) continue
    const prefix = w.metric ?? w.name
    if (podName.startsWith(prefix) && prefix.length > bestLen) {
      best = w
      bestLen = prefix.length
    }
  }
  return best
}

function deriveStatus(ready, desired) {
  if (ready == null || desired == null) return 'unknown'
  if (desired > 0 && ready >= desired) return 'ready'
  if (ready > 0) return 'degraded'
  return 'down'
}

/**
 * One 30s tick feeds everything live on the page: the four stat cards, the
 * topology overlay (replica readiness per workload), and the pod lists for
 * the detail panel. Fail-soft per query (allSettled): a failed query keeps
 * its last-known value; `live` is true while Grafana is reachable at all.
 *
 * `topology: false` is the light mode for the home-page teaser — only the
 * four scalar metrics are polled; the six vector queries stay off until the
 * /dashboard route mounts the full hook.
 */
export function useClusterData({ topology = true } = {}) {
  const [state, setState] = useState({
    metrics: EMPTY_METRICS,
    history: { cpu: [], ram: [] },
    workloads: {}, // id → { ready, desired, status }
    pods: {}, // workload id → [{ name, phase, restarts }]
    loading: true,
    live: false,
    lastUpdated: null,
  })
  const timer = useRef(null)

  useEffect(() => {
    const controller = new AbortController()

    async function tick() {
      const specs = {
        cpu: (s) => queryScalar(METRIC_QUERIES.cpu, s),
        ram: (s) => queryScalar(METRIC_QUERIES.ram, s),
        pods: (s) => queryScalar(METRIC_QUERIES.pods, s),
        uptime: (s) => queryScalar(METRIC_QUERIES.uptime, s),
        ...(topology && {
          deployReady: (s) => queryVector(TOPOLOGY_QUERIES.deployReady, s),
          deployDesired: (s) => queryVector(TOPOLOGY_QUERIES.deployDesired, s),
          stsReady: (s) => queryVector(TOPOLOGY_QUERIES.stsReady, s),
          stsDesired: (s) => queryVector(TOPOLOGY_QUERIES.stsDesired, s),
          podPhase: (s) => queryVector(TOPOLOGY_QUERIES.podPhase, s),
          podRestarts: (s) => queryVector(TOPOLOGY_QUERIES.podRestarts, s),
        }),
      }

      let result
      try {
        result = await queryAllSettled(specs, controller.signal)
      } catch {
        return // aborted
      }
      if (controller.signal.aborted) return
      const { out, fulfilled } = result

      setState((prev) => {
        // Per-metric last-known-good: undefined = query failed this tick.
        const metrics = {
          cpu: out.cpu !== undefined ? roundOrNull(out.cpu) : prev.metrics.cpu,
          ram: out.ram !== undefined ? roundOrNull(out.ram) : prev.metrics.ram,
          pods: out.pods !== undefined ? roundOrNull(out.pods) : prev.metrics.pods,
          uptime: out.uptime !== undefined ? formatAvailability(out.uptime) : prev.metrics.uptime,
        }

        const history = { ...prev.history }
        for (const k of ['cpu', 'ram']) {
          if (out[k] != null && !Number.isNaN(out[k])) {
            history[k] = [...prev.history[k], out[k]].slice(-HISTORY_LEN)
          }
        }

        // Workload readiness — only rebuilt when the replica queries landed.
        let workloads = prev.workloads
        if (out.deployReady && out.stsReady) {
          const ready = {
            ...indexReplicas(out.deployReady, 'deployment'),
            ...indexReplicas(out.stsReady, 'statefulset'),
          }
          const desired = {
            ...indexReplicas(out.deployDesired, 'deployment'),
            ...indexReplicas(out.stsDesired, 'statefulset'),
          }
          workloads = {}
          for (const w of WORKLOADS) {
            const key = `${w.namespace}/${w.metric ?? w.name}`
            const r = ready[key] ?? null
            const d = desired[key] ?? null
            workloads[w.id] = { ready: r, desired: d, status: deriveStatus(r, d) }
          }
        }

        // Pod lists per workload, with restart counts joined by pod name.
        let pods = prev.pods
        if (out.podPhase) {
          const restarts = {}
          for (const { labels, value } of out.podRestarts ?? []) {
            restarts[`${labels.namespace}/${labels.pod}`] = value
          }
          pods = {}
          for (const { labels, value } of out.podPhase) {
            if (value !== 1) continue // only the pod's current phase carries 1
            const w = workloadForPod(labels.namespace, labels.pod ?? '')
            if (!w) continue
            ;(pods[w.id] ??= []).push({
              name: labels.pod,
              phase: labels.phase,
              restarts: restarts[`${labels.namespace}/${labels.pod}`] ?? 0,
            })
          }
          for (const list of Object.values(pods)) list.sort((a, b) => a.name.localeCompare(b.name))
        }

        return {
          metrics,
          history,
          workloads,
          pods,
          loading: false,
          live: fulfilled > 0,
          lastUpdated: fulfilled > 0 ? formatClock() : prev.lastUpdated,
        }
      })
    }

    tick()
    timer.current = setInterval(tick, POLL_MS)
    return () => {
      controller.abort()
      clearInterval(timer.current)
    }
  }, [topology])

  return state
}
