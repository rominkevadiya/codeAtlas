import { useEffect, useCallback, useState } from 'react';
import {
 ReactFlow,
 useNodesState,
 useEdgesState,
 addEdge,
 Controls,
 MiniMap,
 MarkerType,
 Panel,
 Position
} from '@xyflow/react';
import { Search, Filter, Layers, Download } from 'lucide-react';
import { toPng } from 'html-to-image';
import type { Connection, Edge, Node } from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import dagre from 'dagre';
import { EntityNode } from './nodes/EntityNode';
import { CommandPalette } from './CommandPalette';

const nodeTypes = {
 entity: EntityNode,
};

import type { GraphData, GraphNode, ImpactData } from '../../types/graph';

interface CodeGraphProps {
 data: GraphData | null;
 selectedNodeId?: string | null;
 onNodeClick?: (nodeId: string, nodeData: GraphNode) => void;
 impactData?: ImpactData | null;
}

const getLayoutedElements = (nodes: Node[], edges: Edge[], direction = 'LR') => {
 const dagreGraph = new dagre.graphlib.Graph();
 dagreGraph.setDefaultEdgeLabel(() => ({}));
 
 const isHorizontal = direction === 'LR';
 dagreGraph.setGraph({ 
  rankdir: direction,
  ranksep: 250,
  nodesep: 100,
  edgesep: 40
 });

 nodes.forEach((node) => {
  dagreGraph.setNode(node.id, { width: 180, height: 40 });
 });

 edges.forEach((edge) => {
  dagreGraph.setEdge(edge.source, edge.target);
 });

 dagre.layout(dagreGraph);

 const layoutedNodes = nodes.map((node) => {
  const nodeWithPosition = dagreGraph.node(node.id);
  return {
   ...node,
   targetPosition: isHorizontal ? Position.Left : Position.Top,
   sourcePosition: isHorizontal ? Position.Right : Position.Bottom,
   position: {
    x: nodeWithPosition.x - 180 / 2,
    y: nodeWithPosition.y - 40 / 2,
   },
  };
 });

 return { nodes: layoutedNodes, edges };
};

export const CodeGraph = ({ data, selectedNodeId, onNodeClick, impactData }: CodeGraphProps) => {
 const [nodes, setNodes, onNodesChange] = useNodesState<Node>([]);
 const [edges, setEdges, onEdgesChange] = useEdgesState<Edge>([]);
 const [rfInstance, setRfInstance] = useState<any>(null);
 const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);
 
 // Filtering and Search State
 const [searchQuery, setSearchQuery] = useState('');
 const [visibleTypes, setVisibleTypes] = useState(new Set(['file', 'class', 'function'])); // Excluded 'module' by default to hide external dependencies

 useEffect(() => {
  const handleKeyDown = (e: KeyboardEvent) => {
   if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
    e.preventDefault();
    setIsCommandPaletteOpen(true);
   }
  };
  window.addEventListener('keydown', handleKeyDown);
  return () => window.removeEventListener('keydown', handleKeyDown);
 }, []);

 const handleCommandPaletteSelect = useCallback((nodeId: string) => {
  if (onNodeClick && data && data.nodes) {
   const nodeData = data.nodes.find((n: any) => n.id === nodeId);
   if (nodeData) onNodeClick(nodeId, nodeData);
  }
  
  // Pan to node
  if (rfInstance) {
   const node = rfInstance.getNode(nodeId);
   if (node) {
    rfInstance.setCenter(node.position.x + 100, node.position.y + 20, { zoom: 1.2, duration: 800 });
   }
  }
 }, [onNodeClick, data, rfInstance]);

 const toggleType = (type: string) => {
  const newTypes = new Set(visibleTypes);
  if (newTypes.has(type)) {
   newTypes.delete(type);
  } else {
   newTypes.add(type);
  }
  setVisibleTypes(newTypes);
 };

 // 1. Structure and Layout Effect
 useEffect(() => {
  if (data && data.nodes && (data.edges || (data as any).links)) {
   const edgesData = data.edges || (data as any).links;
   
   // Normalize legacy data: if a node has no type (was created implicitly by an import), treat it as an external module
   const normalizedNodes = data.nodes.map(n => ({
    ...n,
    type: n.type || 'module',
    name: n.name || n.id
   }));

   // 1. Filter Nodes
   let filteredNodesData = normalizedNodes.filter(n => visibleTypes.has(n.type));
   
   if (searchQuery.trim()) {
    const query = searchQuery.toLowerCase();
    filteredNodesData = filteredNodesData.filter(n => 
     n.name?.toLowerCase().includes(query) || 
     n.file_path?.toLowerCase().includes(query)
    );
   }
   
   const filteredNodeIds = new Set(filteredNodesData.map(n => n.id));
   
   // 2. Filter Edges
   const filteredEdgesData = edgesData.filter((e: any) => 
    filteredNodeIds.has(e.source) && filteredNodeIds.has(e.target)
   );

   // Calculate node degrees for dynamic sizing based on connections
   const nodeDegrees = new Map<string, number>();
   filteredEdgesData.forEach((e: any) => {
    nodeDegrees.set(e.source, (nodeDegrees.get(e.source) || 0) + 1);
    nodeDegrees.set(e.target, (nodeDegrees.get(e.target) || 0) + 1);
   });

   const initialNodes: Node[] = filteredNodesData.map((n) => {
    // Base scale: Leaves are 0.95x, hubs scale up to 1.3x based on connection count
    const degree = nodeDegrees.get(n.id) || 0;
    const scale = Math.min(0.95 + (degree * 0.05), 1.3);

    return {
     id: n.id,
     type: 'entity',
     data: { ...n, scale }, // Basic data, selection applied later
     position: { x: 0, y: 0 },
     width: 180,
     height: 40,
     style: { width: 180, height: 40 },
    };
   });
   
   const initialEdges: Edge[] = filteredEdgesData.map((e: any, idx: number) => {
    const isContains = e.type === 'contains';
    return {
     id: `e${idx}-${e.source}-${e.target}`,
     source: e.source,
     target: e.target,
     type: 'smoothstep', // Technical/Architectural routing
     data: { originalType: e.type, isContains }
    };
   });

   const { nodes: layoutedNodes, edges: layoutedEdges } = getLayoutedElements(
    initialNodes,
    initialEdges,
    'LR'
   );
   
   setNodes(layoutedNodes);
   setEdges(layoutedEdges);
  }
 }, [data, searchQuery, visibleTypes, setNodes, setEdges]);

 // 2. Styling Effect (Selection & Impact)
 useEffect(() => {
  setNodes((currentNodes) => 
   currentNodes.map((n) => {
    const isImpacted = impactData?.impacted_nodes.some((node: any) => node.id === n.id);
    const isDependency = impactData?.dependency_nodes.some((node: any) => node.id === n.id);
    const isImpactRoot = impactData && selectedNodeId === n.id;
    const isFaded = selectedNodeId && !isImpacted && !isDependency && !isImpactRoot;

    return {
     ...n,
     data: {
      ...n.data,
      isSelected: selectedNodeId === n.id,
      isFaded,
      isImpacted,
      isDependency,
      isImpactRoot,
     }
    };
   })
  );

  setEdges((currentEdges) => 
   currentEdges.map((e) => {
    const isContains = e.data?.isContains;
    const originalType = e.data?.originalType;
    
    let isAnimated = false;
    let strokeColor = isContains ? '#475569' : '#818cf8'; // Slate-600 for contains, Indigo-400 for imports/calls
    let strokeWidth = isContains ? 1.5 : 2;
    let opacity = isContains ? 0.4 : 0.7; // Base visibility increased

    if (impactData) {
     const isImpactPath = impactData.impacted_nodes.some((n: any) => n.id === e.target) && 
               (impactData.impacted_nodes.some((n: any) => n.id === e.source) || e.source === selectedNodeId);
               
     const isDepPath = impactData.dependency_nodes.some((n: any) => n.id === e.source) && 
              (impactData.dependency_nodes.some((n: any) => n.id === e.target) || e.target === selectedNodeId);

     if (isImpactPath) {
      strokeColor = '#f43f5e';
      strokeWidth = 3;
      isAnimated = true;
      opacity = 1;
     } else if (isDepPath) {
      strokeColor = '#10b981';
      strokeWidth = 3;
      isAnimated = true;
      opacity = 1;
     } else {
      opacity = 0.08;
     }
    } else if (selectedNodeId) {
     if (e.source === selectedNodeId || e.target === selectedNodeId) {
       strokeColor = isContains ? '#94a3b8' : '#c084fc';
       strokeWidth = 3;
       opacity = 1;
     } else {
       opacity = 0.08;
     }
    }

    return {
     ...e,
     animated: isAnimated,
     label: (!isContains && opacity > 0.5) ? (originalType as string) : '',
     labelStyle: { fill: '#94a3b8', fontWeight: 500, fontSize: 10, letterSpacing: '0.05em', textTransform: 'uppercase' },
     labelBgStyle: { fill: 'transparent' },
     style: { 
      stroke: strokeColor, 
      strokeWidth: strokeWidth, 
      opacity: opacity,
      transition: 'all 0.3s ease',
     },
     markerEnd: {
      type: MarkerType.ArrowClosed,
      color: strokeColor,
      width: 20,
      height: 20,
     },
    };
   })
  );
 }, [selectedNodeId, impactData, setNodes, setEdges]);

 const onConnect = useCallback(
  (params: Connection | Edge) => setEdges((eds) => addEdge(params, eds)),
  [setEdges]
 );
 
 const handleNodeClick = useCallback((_: React.MouseEvent, node: Node) => {
  if (onNodeClick) {
   onNodeClick(node.id, node.data as unknown as GraphNode);
  }
 }, [onNodeClick]);

 if (!data) return null;

 if (data.nodes && data.nodes.length === 0) {
  return (
   <div className="flex-1 w-full h-full min-h-[500px] flex flex-col items-center justify-center bg-black text-zinc-500">
    <div className="p-8 rounded-3xl border border-zinc-800 bg-zinc-950 shadow-xl flex flex-col items-center max-w-md text-center">
     <Layers className="w-16 h-16 mb-4 text-slate-400" />
     <p className="text-xl font-bold text-zinc-200">No supported files found</p>
     <p className="text-sm mt-3 text-zinc-500 leading-relaxed">
      The parser currently supports Python, JavaScript/TypeScript, JSON, and EJS files. The repository has no supported source code.
     </p>
    </div>
   </div>
  );
 }

 return (
  <>
   <ReactFlow
    nodes={nodes}
    edges={edges}
    onNodesChange={onNodesChange}
    onEdgesChange={onEdgesChange}
    onConnect={onConnect}
    onNodeClick={handleNodeClick}
    onInit={setRfInstance}
    nodeTypes={nodeTypes}
    fitView
   fitViewOptions={{ padding: 0.3 }}
   className="!bg-transparent"
   colorMode="dark"
   minZoom={0.05}
   maxZoom={2}
  >
   <Panel position="top-left" className="bg-zinc-950 p-4 rounded-xl flex flex-col gap-3 min-w-[280px] m-6 border border-zinc-800 shadow-sm">
    <div className="flex items-center justify-between">
     <div className="flex items-center gap-2 text-white font-bold text-sm">
      <Filter className="w-4 h-4 text-zinc-300" />
      Filter & Search
     </div>
     <button
      onClick={() => {
       const flowViewport = document.querySelector('.react-flow__viewport') as HTMLElement;
       if (flowViewport) {
        toPng(flowViewport, { backgroundColor: '#09090b' })
         .then((dataUrl) => {
          const a = document.createElement('a');
          a.setAttribute('download', 'code-atlas-graph.png');
          a.setAttribute('href', dataUrl);
          a.click();
         });
       }
      }}
      className="p-1.5 rounded-lg text-zinc-500 hover:text-white hover:bg-zinc-900 transition-colors border border-transparent hover:border-zinc-800"
      title="Download PNG"
     >
      <Download className="w-4 h-4" />
     </button>
    </div>
    <div className="relative">
     <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
     <input
      type="text"
      placeholder="Search nodes..."
      value={searchQuery}
      onChange={(e) => setSearchQuery(e.target.value)}
      className="w-full bg-black border border-zinc-800 rounded-lg pl-9 pr-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors placeholder:text-slate-400"
     />
    </div>
    <div className="flex flex-wrap gap-2 mt-2">
     {['file', 'class', 'function', 'module'].map(type => (
      <button
       key={type}
       onClick={() => toggleType(type)}
       className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-all duration-200 border ${
        visibleTypes.has(type)
         ? 'bg-zinc-900 text-zinc-200 border-zinc-700 shadow-sm'
         : 'bg-zinc-950 text-zinc-500 border-zinc-800 hover:bg-black hover:text-zinc-300'
       }`}
      >
       {type.charAt(0).toUpperCase() + type.slice(1)}
      </button>
     ))}
    </div>
   </Panel>
   <Controls 
    className="bg-zinc-950 border-zinc-800 rounded-xl overflow-hidden shadow-sm" 
    showInteractive={false}
   />
   <MiniMap 
    className="rounded-xl overflow-hidden shadow-sm"
    pannable
    zoomable
    nodeBorderRadius={4}
    nodeColor={(node) => {
     switch (node.data?.type) {
      case 'file': return '#34d399';
      case 'class': return '#fbbf24';
      case 'function': return '#a78bfa';
      case 'module': return '#38bdf8';
      default: return '#94a3b8';
     }
    }}
   />
   </ReactFlow>
   
   <CommandPalette 
    isOpen={isCommandPaletteOpen}
    onClose={() => setIsCommandPaletteOpen(false)}
    nodes={data.nodes || []}
    onSelectNode={handleCommandPaletteSelect}
   />
  </>
 );
};
