import { useEffect, useMemo } from 'react'
import {
  ReactFlow,
  Background,
  BackgroundVariant,
  Panel,
  useNodesState,
  useEdgesState,
  useReactFlow,
} from '@xyflow/react'
import { ZoomIn, ZoomOut, Scan } from 'lucide-react'
import '@xyflow/react/dist/style.css'
import { buildNodes, buildEdges } from './layout'
import WorkloadNode from './WorkloadNode'
import NamespaceGroup from './NamespaceGroup'
import ExternalNode from './ExternalNode'
import LabeledEdge from './LabeledEdge'

const NODE_TYPES = { workload: WorkloadNode, namespace: NamespaceGroup, external: ExternalNode }
const EDGE_TYPES = { labeled: LabeledEdge }
const FIT_OPTIONS = { padding: 0.1 }

function ZoomControls() {
  const { zoomIn, zoomOut, fitView } = useReactFlow()
  const btn =
    'flex h-8 w-8 items-center justify-center rounded-md border border-border bg-surface text-muted transition-colors duration-200 hover:border-border-bright hover:text-ink cursor-pointer focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent'
  return (
    <Panel position="bottom-right" className="flex gap-1.5">
      <button type="button" aria-label="Zoom in" className={btn} onClick={() => zoomIn({ duration: 150 })}>
        <ZoomIn className="h-4 w-4" />
      </button>
      <button type="button" aria-label="Zoom out" className={btn} onClick={() => zoomOut({ duration: 150 })}>
        <ZoomOut className="h-4 w-4" />
      </button>
      <button type="button" aria-label="Fit view" className={btn} onClick={() => fitView({ ...FIT_OPTIONS, duration: 250 })}>
        <Scan className="h-4 w-4" />
      </button>
    </Panel>
  )
}

// Re-fit when the canvas jumps between inline and fullscreen.
function RefitOnResize({ trigger }) {
  const { fitView } = useReactFlow()
  useEffect(() => {
    const t = setTimeout(() => fitView({ ...FIT_OPTIONS, duration: 250 }), 60)
    return () => clearTimeout(t)
  }, [trigger, fitView])
  return null
}

/**
 * The live topology canvas. Layout is built exactly once (useNodesState
 * initial value); every refresh merges live data into node.data by id and
 * never touches positions, so dragged nodes stay where the visitor put them.
 */
export default function Canvas({ workloads, selectedId, onSelect, fullscreen }) {
  const [nodes, setNodes, onNodesChange] = useNodesState(useMemo(buildNodes, []))
  const [edges] = useEdgesState(useMemo(buildEdges, []))

  useEffect(() => {
    setNodes((nds) =>
      nds.map((n) =>
        n.type === 'workload'
          ? { ...n, selected: n.id === selectedId, data: { ...n.data, live: workloads[n.id] } }
          : n,
      ),
    )
  }, [workloads, selectedId, setNodes])

  return (
    <ReactFlow
      nodes={nodes}
      edges={edges}
      onNodesChange={onNodesChange}
      nodeTypes={NODE_TYPES}
      edgeTypes={EDGE_TYPES}
      fitView
      fitViewOptions={FIT_OPTIONS}
      minZoom={0.35}
      maxZoom={1.75}
      zoomOnScroll={false}
      preventScrolling={false}
      zoomOnPinch
      zoomOnDoubleClick={false}
      nodesConnectable={false}
      deleteKeyCode={null}
      edgesFocusable={false}
      onNodeClick={(_, node) => node.type === 'workload' && onSelect(node.id)}
      onPaneClick={() => onSelect(null)}
      proOptions={{ hideAttribution: true }}
    >
      <Background variant={BackgroundVariant.Dots} gap={28} size={1} color="#2a2d3a" />
      <ZoomControls />
      <RefitOnResize trigger={fullscreen} />
    </ReactFlow>
  )
}
