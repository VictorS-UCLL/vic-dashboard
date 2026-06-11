// Semantic model of the real cluster — what exists and what talks to what.
// This is the single source of truth; positions live in topology/layout.js.
// Workload names/namespaces must match kube-state-metrics label values exactly.

export const NS_COLORS = {
  default: '#39FF14',
  monitoring: '#9B30FF',
  'kube-system': '#36b8c8',
}

export const NAMESPACES = [
  { id: 'ns-kube-system', name: 'kube-system' },
  { id: 'ns-default', name: 'default' },
  { id: 'ns-monitoring', name: 'monitoring' },
]

// kind: 'deploy' | 'sts'. id doubles as the React Flow node id and the
// live-data lookup key — never reuse one. `metric` is the kube-state-metrics
// label value when it differs from the display name (the monitoring stack is
// a Helm chart, so its workloads carry kube-prometheus-stack-* names —
// verified live against the cluster).
export const WORKLOADS = [
  {
    id: 'traefik', name: 'traefik', kind: 'deploy', namespace: 'kube-system',
    desc: 'Ingress controller — receives traffic from the Cloudflare tunnel and routes it to the right service inside the cluster.',
  },
  {
    id: 'coredns', name: 'coredns', kind: 'deploy', namespace: 'kube-system',
    desc: 'Cluster DNS — every service name lookup inside the cluster goes through this pod.',
  },
  {
    id: 'metrics-server', name: 'metrics-server', kind: 'deploy', namespace: 'kube-system',
    desc: 'Resource metrics API — powers kubectl top and autoscaling decisions with live CPU/memory readings.',
  },
  {
    id: 'local-path-provisioner', name: 'local-path-provisioner', kind: 'deploy', namespace: 'kube-system',
    desc: 'Storage provisioner — creates PersistentVolumes on node-local disk when a workload claims storage.',
  },
  {
    id: 'portfolio', name: 'portfolio', kind: 'deploy', namespace: 'default',
    desc: 'This website — nginx serving the static bundle you are reading, plus the locked-down proxy that feeds it live metrics.',
  },
  {
    id: 'kube-state-metrics', name: 'kube-state-metrics', kind: 'deploy', namespace: 'monitoring', metric: 'kube-prometheus-stack-kube-state-metrics',
    desc: 'Exports cluster object state — deployments, replicas, pod phases — as Prometheus metrics. The topology you see is built from its data.',
  },
  {
    id: 'prom-operator', name: 'prom-operator', kind: 'deploy', namespace: 'monitoring', metric: 'kube-prometheus-stack-operator',
    desc: 'Operator for the monitoring stack — keeps Prometheus configured and reconciled so the rest of this namespace runs itself.',
  },
  {
    id: 'prometheus', name: 'prometheus', kind: 'sts', namespace: 'monitoring', metric: 'prometheus-kube-prometheus-stack-prometheus',
    desc: 'Time-series database — scrapes and stores every metric in the cluster. Runs as a StatefulSet so its data survives restarts.',
  },
  {
    id: 'grafana', name: 'grafana', kind: 'deploy', namespace: 'monitoring', metric: 'kube-prometheus-stack-grafana',
    desc: 'Dashboards and the datasource proxy — the same instance this page queries for the live numbers above.',
  },
]

// Not a k8s object — the edge in front of everything.
export const EXTERNAL = {
  id: 'cloudflare',
  name: 'cloudflare',
  sub: 'TLS · DDoS · tunnel',
}

// tone drives edge color: 'ingress' (serving path, green) or
// 'telemetry' (monitoring flow, purple).
export const CONNECTIONS = [
  { id: 'e-https', source: 'cloudflare', target: 'traefik', label: 'https', tone: 'ingress', animated: true },
  { id: 'e-route-portfolio', source: 'traefik', target: 'portfolio', label: 'routes', tone: 'ingress' },
  { id: 'e-route-grafana', source: 'traefik', target: 'grafana', label: 'routes', tone: 'ingress' },
  { id: 'e-scrape', source: 'kube-state-metrics', target: 'prometheus', label: 'scrape', tone: 'telemetry' },
  { id: 'e-datasource', source: 'prometheus', target: 'grafana', label: 'datasource', tone: 'telemetry' },
]
