import { MarkerType } from '@xyflow/react'
import { NAMESPACES, WORKLOADS, EXTERNAL, CONNECTIONS, NS_COLORS } from '../data/topology'

// Deterministic, hand-placed layered layout. The graph is known at build time,
// so no runtime layout engine: the serving path reads top-down on the left
// (cloudflare → traefik → portfolio), monitoring flows in its own box on the
// right, and the corridor between namespace boxes (y≈420) carries the one
// long cross edge. Tune positions here, nowhere else.

export const NODE_W = 200
export const NODE_H = 64

const NS_BOXES = {
  'ns-kube-system': { x: 20, y: 170, w: 1020, h: 190 },
  'ns-default': { x: 20, y: 470, w: 300, h: 180 },
  'ns-monitoring': { x: 360, y: 470, w: 680, h: 290 },
}

// Workload positions, relative to their namespace box.
const POS = {
  traefik: { x: 40, y: 80 },
  coredns: { x: 300, y: 80 },
  'metrics-server': { x: 550, y: 80 },
  'local-path-provisioner': { x: 790, y: 80 },
  portfolio: { x: 40, y: 80 },
  'kube-state-metrics': { x: 40, y: 70 },
  'prom-operator': { x: 440, y: 70 },
  prometheus: { x: 40, y: 190 },
  grafana: { x: 440, y: 190 },
}

const CLOUDFLARE_POS = { x: 60, y: 20 }

// Which handles each connection uses, plus designed routing overrides.
const EDGE_ROUTING = {
  'e-https': { sourceHandle: 'out-b', targetHandle: 'in-t' },
  'e-route-portfolio': { sourceHandle: 'out-b', targetHandle: 'in-t', labelY: 495 },
  // Tees off the portfolio trunk at the inter-box corridor, then runs right.
  'e-route-grafana': { sourceHandle: 'out-b', targetHandle: 'in-t', corridorY: 420 },
  'e-scrape': { sourceHandle: 'out-b', targetHandle: 'in-t' },
  'e-datasource': { sourceHandle: 'out-r', targetHandle: 'in-l' },
}

const TONES = {
  ingress: { stroke: 'rgba(57, 255, 20, 0.45)', label: '#39FF14' },
  telemetry: { stroke: 'rgba(155, 48, 255, 0.6)', label: '#c490ff' },
}

export function buildNodes() {
  const nsCounts = {}
  for (const w of WORKLOADS) nsCounts[w.namespace] = (nsCounts[w.namespace] ?? 0) + 1

  // Parents must precede children in the array.
  const groups = NAMESPACES.map((ns) => {
    const box = NS_BOXES[ns.id]
    return {
      id: ns.id,
      type: 'namespace',
      position: { x: box.x, y: box.y },
      width: box.w,
      height: box.h,
      draggable: false,
      selectable: false,
      focusable: false,
      data: { name: ns.name, color: NS_COLORS[ns.name], count: nsCounts[ns.name], w: box.w, h: box.h },
    }
  })

  const external = {
    id: EXTERNAL.id,
    type: 'external',
    position: CLOUDFLARE_POS,
    width: NODE_W,
    height: 70,
    data: { name: EXTERNAL.name, sub: EXTERNAL.sub },
  }

  const workloads = WORKLOADS.map((w) => ({
    id: w.id,
    type: 'workload',
    position: POS[w.id],
    parentId: `ns-${w.namespace}`,
    extent: 'parent',
    width: NODE_W,
    height: NODE_H,
    data: { name: w.name, kind: w.kind, color: NS_COLORS[w.namespace], live: undefined },
  }))

  return [...groups, external, ...workloads]
}

export function buildEdges() {
  return CONNECTIONS.map((c) => {
    const tone = TONES[c.tone]
    const routing = EDGE_ROUTING[c.id] ?? {}
    return {
      id: c.id,
      source: c.source,
      target: c.target,
      sourceHandle: routing.sourceHandle,
      targetHandle: routing.targetHandle,
      type: 'labeled',
      animated: Boolean(c.animated),
      focusable: false,
      style: { stroke: tone.stroke, strokeWidth: 1.5 },
      markerEnd: { type: MarkerType.ArrowClosed, width: 14, height: 14, color: tone.stroke },
      data: {
        label: c.label,
        labelColor: tone.label,
        corridorY: routing.corridorY,
        labelY: routing.labelY,
      },
    }
  })
}
