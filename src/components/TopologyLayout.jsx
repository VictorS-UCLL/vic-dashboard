/**
 * Pure layout engine for the namespace-grouped topology.
 *
 * Top-down dependency flow. Child coordinates are RELATIVE to their parent
 * group (RF v12 parentId + extent:'parent'); group coordinates are absolute.
 */

const NODE_W = 180
const NODE_H = 66
const ROW_GAP = 26
const GROUP_PAD_X = 22
const GROUP_PAD_TOP = 48
const GROUP_PAD_BOT = 22

export const NODE_DIMS = { NODE_W, NODE_H }

const SHORT = {
    'kube-prometheus-stack-grafana': 'grafana',
    'kube-prometheus-stack-operator': 'prom-operator',
    'kube-prometheus-stack-kube-state-metrics': 'kube-state-metrics',
    'prometheus-kube-prometheus-stack-prometheus': 'prometheus',
    'local-path-provisioner': 'local-path',
}
export const shortLabel = (name) => SHORT[name] ?? name

const PRIORITY = {
    traefik: 0,
    portfolio: 0,
    'kube-prometheus-stack-grafana': 0,
    'prometheus-kube-prometheus-stack-prometheus': 1,
    'kube-prometheus-stack-kube-state-metrics': 2,
    'kube-prometheus-stack-operator': 3,
    coredns: 1,
    'metrics-server': 2,
    'local-path-provisioner': 3,
}
const priority = (name) => PRIORITY[name] ?? 5

function groupDims(count) {
    return {
        width: GROUP_PAD_X * 2 + NODE_W,
        height: GROUP_PAD_TOP + GROUP_PAD_BOT + count * NODE_H + (count - 1) * ROW_GAP,
    }
}

// Wider horizontal separation so the down-and-across edges have room to route
// cleanly without crossing through groups.
const GROUP_LAYOUT = {
    'kube-system': { x: 60,  y: 170 },
    default:       { x: 60,  y: 540 },
    monitoring:    { x: 420, y: 540 },
}

export function buildGraph(workloads) {
    const byNs = {}
    for (const w of workloads) (byNs[w.namespace] ??= []).push(w)
    for (const ns of Object.keys(byNs)) {
        byNs[ns].sort((a, b) => priority(a.name) - priority(b.name) || a.name.localeCompare(b.name))
    }

    const nodes = []

    for (const ns of ['kube-system', 'default', 'monitoring']) {
        const items = byNs[ns] ?? []
        if (items.length === 0) continue

        const base = GROUP_LAYOUT[ns] ?? { x: 60, y: 170 }
        const { width, height } = groupDims(items.length)

        nodes.push({
            id: `group-${ns}`,
            type: 'nsGroup',
            position: base,
            data: { namespace: ns, count: items.length },
            style: { width, height },
            selectable: false,
            draggable: true,
        })

        items.forEach((w, i) => {
            nodes.push({
                id: w.name,
                type: 'workload',
                parentId: `group-${ns}`,
                extent: 'parent',
                position: { x: GROUP_PAD_X, y: GROUP_PAD_TOP + i * (NODE_H + ROW_GAP) },
                data: {
                    label: shortLabel(w.name),
                    fullName: w.name,
                    namespace: w.namespace,
                    kind: w.kind,
                    available: w.available,
                    pods: w.pods,
                    isSelected: false,
                },
            })
        })
    }

    const ksGroup = byNs['kube-system'] ?? []
    const ksWidth = groupDims(ksGroup.length).width
    const cfX = GROUP_LAYOUT['kube-system'].x + ksWidth / 2 - NODE_W / 2

    nodes.unshift({
        id: 'cloudflare',
        type: 'external',
        position: { x: cfX, y: 30 },
        data: {
            label: 'Cloudflare',
            fullName: 'Cloudflare',
            namespace: 'cloudflare',
            isSelected: false,
            description:
                'Edge network. TLS termination, DDoS protection, and Argo Tunnel routing to the origin. Real IP never exposed.',
            pods: [],
        },
    })

    return { nodes }
}

// ── edges: smoothstep (orthogonal) with rounded corners + offsets ───────────
export function buildEdges({ accent, border, rav3d }) {
    const arrow = (color) => ({ type: 'arrowclosed', width: 13, height: 13, color })
    const lbl = (color) => ({
        labelStyle: { fill: color, fontFamily: 'monospace', fontSize: 10 },
        labelBgStyle: { fill: '#111318', fillOpacity: 0.9 },
        labelBgPadding: [5, 3],
        labelBgBorderRadius: 4,
    })

    return [
        {
            id: 'cf→traefik',
            source: 'cloudflare', target: 'traefik',
            type: 'smoothstep', label: 'https', animated: true,
            pathOptions: { borderRadius: 12 },
            markerEnd: arrow(accent),
            style: { stroke: accent, strokeWidth: 1.6, opacity: 0.85 },
            ...lbl(accent),
        },
        {
            id: 'traefik→portfolio',
            source: 'traefik', target: 'portfolio',
            type: 'smoothstep', label: 'routes', animated: true,
            pathOptions: { borderRadius: 12, offset: 16 },
            markerEnd: arrow('#8a90a3'),
            style: { stroke: '#4a4f63', strokeWidth: 1.5 },
            ...lbl('#8a90a3'),
        },
        {
            id: 'traefik→grafana',
            source: 'traefik', target: 'kube-prometheus-stack-grafana',
            type: 'smoothstep', label: 'routes', animated: true,
            pathOptions: { borderRadius: 12, offset: 32 },
            markerEnd: arrow('#8a90a3'),
            style: { stroke: '#4a4f63', strokeWidth: 1.5 },
            ...lbl('#8a90a3'),
        },
        {
            id: 'ksm→prometheus',
            source: 'kube-prometheus-stack-kube-state-metrics',
            target: 'prometheus-kube-prometheus-stack-prometheus',
            type: 'smoothstep', label: 'scrape', animated: false,
            pathOptions: { borderRadius: 12, offset: 12 },
            markerEnd: arrow(rav3d),
            style: { stroke: rav3d, strokeWidth: 1.3, strokeDasharray: '5 4', opacity: 0.7 },
            ...lbl(rav3d),
        },
        {
            id: 'prometheus→grafana',
            source: 'prometheus-kube-prometheus-stack-prometheus',
            target: 'kube-prometheus-stack-grafana',
            type: 'smoothstep', label: 'datasource', animated: false,
            pathOptions: { borderRadius: 12, offset: 24 },
            markerEnd: arrow(rav3d),
            style: { stroke: rav3d, strokeWidth: 1.3, strokeDasharray: '5 4', opacity: 0.7 },
            ...lbl(rav3d),
        },
    ]
}
