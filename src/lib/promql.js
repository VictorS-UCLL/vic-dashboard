// Every PromQL query the site runs, in one place. All verified against the
// cluster's Prometheus via the Grafana datasource proxy.

// Cluster-level stat cards (instant scalars).
export const METRIC_QUERIES = {
  cpu: '100-(avg(rate(node_cpu_seconds_total{mode="idle"}[5m]))*100)',
  ram: '(1-(node_memory_MemAvailable_bytes/node_memory_MemTotal_bytes))*100',
  pods: 'count(kube_pod_status_phase{phase="Running"})',
  uptime: 'node_time_seconds-node_boot_time_seconds',
}

// Topology overlay (instant vectors with labels).
export const TOPOLOGY_QUERIES = {
  // labels: deployment, namespace
  deployReady: 'kube_deployment_status_replicas_available',
  deployDesired: 'kube_deployment_spec_replicas',
  // labels: statefulset, namespace
  stsReady: 'kube_statefulset_status_replicas_ready',
  stsDesired: 'kube_statefulset_replicas',
  // labels: namespace, pod, phase — value "1" marks the current phase
  podPhase: 'kube_pod_status_phase',
  // restart count summed per pod
  podRestarts: 'sum by (namespace, pod) (kube_pod_container_status_restarts_total)',
}
