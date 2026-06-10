import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import {
    ReactFlow,
    Background,
    BackgroundVariant,
    Controls,
    useNodesState,
    useEdgesState,
} from '@xyflow/react'
import '@xyflow/react/dist/style.css'

import { SectionLabel } from './ui'
import { NamespaceGroup, WorkloadNode, ExternalNode } from './TopologyNodes'
import TopologyPanel from './TopologyPanel'
import { buildGraph, buildEdges } from './topologyLayout.jsx'
import { useTopologyData } from '../hooks/useTopologyData'

const C = {
    accent: '#39FF14',
    rav3d:  '#9B30FF',
    sys:    '#36b8c8',
    border: '#2a2d3a',
    muted:  '#6b7080',
}

const NODE_TYPES = {
    nsGroup:  NamespaceGroup,
    workload: WorkloadNode,
    external: ExternalNode,
}

const EDGES = buildEdges({ accent: C.accent, border: C.border, rav3d: C.rav3d })

const LEGEND = [
    { color: C.accent, label: 'traffic' },
    { color: C.rav3d,  label: 'metrics', dash: true },
    { color: C.sys,    label: 'kube-system' },
]

export default function Topology() {
    const { workloads, loading, live } = useTopologyData()
    const [selectedId, setSelectedId] = useState(null)

    const [nodes, setNodes, onNodesChange] = useNodesState([])
    const [edges, , onEdgesChange] = useEdgesState(EDGES)

    // Track whether we've done the one-time layout build.
    const built = useRef(false)

    /*
     * One-time layout: build node positions the first time workloads arrive.
     * After this, we NEVER rebuild from scratch — that would wipe dragged
     * positions. Live data is merged separately below.
     */
    useEffect(() => {
        if (built.current || workloads.length === 0) return
        const { nodes: initial } = buildGraph(workloads)
        setNodes(initial)
        built.current = true
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [workloads])

    /*
     * Live merge: on every poll, patch fresh metrics (available, pods) into the
     * EXISTING nodes by id — positions and everything else are preserved.
     */
    useEffect(() => {
        if (!built.current || workloads.length === 0) return
        const byName = Object.fromEntries(workloads.map((w) => [w.name, w]))
        setNodes((prev) =>
            prev.map((n) => {
                if (n.type !== 'workload') return n
                const w = byName[n.id]
                if (!w) return n
                return {
                    ...n,
                    data: { ...n.data, available: w.available, pods: w.pods },
                }
            }),
        )
    }, [workloads, setNodes])

    /*
     * Selection: toggle isSelected flag only — never touches position.
     */
    useEffect(() => {
        setNodes((prev) =>
            prev.map((n) =>
                n.type === 'nsGroup'
                    ? n
                    : { ...n, data: { ...n.data, isSelected: n.id === selectedId } },
            ),
        )
    }, [selectedId, setNodes])

    const handleNodeClick = useCallback((_, node) => {
        if (node.type === 'nsGroup') return
        setSelectedId((prev) => (prev === node.id ? null : node.id))
    }, [])

    const handleInit = useCallback((rf) => {
        setTimeout(() => rf.fitView({ padding: 0.18, minZoom: 0.4 }), 80)
    }, [])

    const selectedNode = useMemo(() => {
        if (!selectedId) return null
        if (selectedId === 'cloudflare') {
            return {
                name: 'Cloudflare', fullName: 'Cloudflare', namespace: 'cloudflare',
                isStatic: true, pods: [],
                description:
                    'Edge network. TLS termination, DDoS protection, and Argo Tunnel routing to the origin. Real IP never exposed.',
            }
        }
        return workloads.find((x) => x.name === selectedId) ?? null
    }, [selectedId, workloads])

    return (
        <section id="topology" className="mx-auto max-w-5xl scroll-mt-24 px-6 py-20">
            {/* header */}
            <div className="mb-6 flex items-center justify-between">
                <SectionLabel>cluster topology</SectionLabel>
                <div className="flex items-center gap-2">
          <span className="relative flex h-1.5 w-1.5">
            {live && (
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-live opacity-60" />
            )}
              <span className={`relative inline-flex h-1.5 w-1.5 rounded-full ${live ? 'bg-live' : 'bg-muted'}`} />
          </span>
                    <span className="font-mono text-[11px] text-muted">{live ? 'live' : 'offline'}</span>
                </div>
            </div>

            {/* graph */}
            <div className="h-[clamp(640px,78vh,900px)] overflow-hidden rounded-xl border border-border bg-bg">
                {loading ? (
                    <Loading />
                ) : (
                    <ReactFlow
                        nodes={nodes}
                        edges={edges}
                        nodeTypes={NODE_TYPES}
                        onNodesChange={onNodesChange}
                        onEdgesChange={onEdgesChange}
                        onNodeClick={handleNodeClick}
                        onInit={handleInit}
                        minZoom={0.4}
                        maxZoom={1.6}
                        panOnDrag
                        zoomOnScroll={false}
                        zoomOnPinch
                        preventScrolling={false}
                        nodesDraggable
                        nodesConnectable={false}
                        elementsSelectable
                        proOptions={{ hideAttribution: true }}
                    >
                        <Background variant={BackgroundVariant.Dots} gap={26} size={1} color={C.border} />
                        <Controls showInteractive={false} />
                    </ReactFlow>
                )}
            </div>

            {/* detail panel */}
            {selectedNode && (
                <TopologyPanel node={selectedNode} onClose={() => setSelectedId(null)} />
            )}

            {/* legend */}
            <div className="mt-4 flex flex-wrap items-center gap-x-6 gap-y-2">
                {LEGEND.map(({ color, label, dash }) => (
                    <div key={label} className="flex items-center gap-2">
                        <svg width="16" height="4" className="shrink-0">
                            <line x1="0" y1="2" x2="16" y2="2" stroke={color} strokeWidth="1.6"
                                  strokeDasharray={dash ? '4 3' : undefined} />
                        </svg>
                        <span className="font-mono text-[11px] text-muted">{label}</span>
                    </div>
                ))}
                <span className="ml-auto font-mono text-[11px] text-muted">
          drag · pinch · click for details
        </span>
            </div>
        </section>
    )
}

function Loading() {
    return (
        <div className="flex h-full items-center justify-center gap-3">
            <div className="relative h-1.5 w-1.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-live opacity-60" />
                <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-live" />
            </div>
            <span className="font-mono text-xs text-muted">fetching topology…</span>
        </div>
    )
}
