import { useEffect, useRef, useState } from 'react'

const BASE = '/grafana-api'
const DS   = `/api/datasources/proxy/uid/prometheus/api/v1/query`
const POLL_MS = 30_000

async function q(promql, signal) {
    const url = `${BASE}${DS}?query=${encodeURIComponent(promql)}`
    const res = await fetch(url, { signal })
    if (!res.ok) throw new Error(`grafana ${res.status}`)
    const json = await res.json()
    return json?.data?.result ?? []
}

/**
 * Builds the workload list (deployments + statefulsets) enriched with the
 * pods that belong to each, their phase, and restart counts.
 *
 * Pod → workload matching is by name prefix within the same namespace, which
 * is how Kubernetes names pods (<workload>-<hash>-<hash> for deployments,
 * <workload>-<ordinal> for statefulsets).
 */
function buildWorkloads(deployments, statefulsets, phases, restarts) {
    const phaseMap = {}
    for (const r of phases) {
        if (r.value[1] === '1') {
            phaseMap[`${r.metric.namespace}/${r.metric.pod}`] = r.metric.phase
        }
    }

    const restartMap = {}
    for (const r of restarts) {
        const key = `${r.metric.namespace}/${r.metric.pod}`
        restartMap[key] = (restartMap[key] ?? 0) + Number(r.value[1])
    }

    function podsFor(namespace, workloadName) {
        return Object.keys(phaseMap)
            .filter((k) => {
                const [ns, pod] = k.split('/')
                return ns === namespace && pod.startsWith(workloadName)
            })
            .map((k) => ({
                name: k.split('/')[1],
                phase: phaseMap[k] ?? 'Unknown',
                restarts: restartMap[k] ?? 0,
            }))
    }

    const fromDeployments = deployments.map((r) => ({
        name: r.metric.deployment,
        namespace: r.metric.namespace,
        kind: 'Deployment',
        available: Number(r.value[1]),
        pods: podsFor(r.metric.namespace, r.metric.deployment),
    }))

    const fromStatefulsets = statefulsets.map((r) => ({
        name: r.metric.statefulset,
        namespace: r.metric.namespace,
        kind: 'StatefulSet',
        available: Number(r.value[1]),
        pods: podsFor(r.metric.namespace, r.metric.statefulset),
    }))

    return [...fromDeployments, ...fromStatefulsets]
}

export function useTopologyData() {
    const [workloads, setWorkloads] = useState([])
    const [loading, setLoading] = useState(true)
    const [live, setLive] = useState(false)
    const timer = useRef(null)

    useEffect(() => {
        const controller = new AbortController()

        async function tick() {
            try {
                const [deployments, statefulsets, phases, restarts] = await Promise.all([
                    q('kube_deployment_status_replicas_available', controller.signal),
                    q('kube_statefulset_status_replicas_ready', controller.signal),
                    q('kube_pod_status_phase', controller.signal),
                    q('kube_pod_container_status_restarts_total', controller.signal),
                ])
                setWorkloads(buildWorkloads(deployments, statefulsets, phases, restarts))
                setLive(true)
            } catch (err) {
                if (err.name !== 'AbortError') setLive(false)
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

    return { workloads, loading, live }
}
