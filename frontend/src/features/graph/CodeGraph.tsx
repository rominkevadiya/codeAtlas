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

interface GraphData {
  nodes: any[];
  edges: any[];
}

interface CodeGraphProps {
  data: GraphData | null;
  selectedNodeId?: string | null;
  onNodeClick?: (nodeId: string, nodeData: any) => void;
  impactData?: {
    impacted_nodes: { id: string, name: string, type: string }[];
    dependency_nodes: { id: string, name: string, type: string }[];
    impact_score: number;
  } | null;
}

const getLayoutedElements = (nodes: Node[], edges: Edge[], direction = 'LR') => {
  const dagreGraph = new dagre.graphlib.Graph();
  dagreGraph.setDefaultEdgeLabel(() => ({}));
  
  const isHorizontal = direction === 'LR';
  dagreGraph.setGraph({ 
    rankdir: direction,
    ranksep: 200,
    nodesep: 60,
    edgesep: 20
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

      const initialNodes: Node[] = filteredNodesData.map((n) => {
        const isImpacted = impactData?.impacted_nodes.some(node => node.id === n.id);
        const isDependency = impactData?.dependency_nodes.some(node => node.id === n.id);
        const isImpactRoot = impactData && selectedNodeId === n.id;
        const isFaded = selectedNodeId && !isImpacted && !isDependency && !isImpactRoot;
        
        return {
          id: n.id,
          type: 'entity',
          data: { ...n, isSelected: selectedNodeId === n.id, isFaded, isImpacted, isDependency, isImpactRoot },
          position: { x: 0, y: 0 },
        };
      });
      
      const initialEdges: Edge[] = filteredEdgesData.map((e: any, idx: number) => {
        const isContains = e.type === 'contains';
        
        let isAnimated = false;
        let strokeColor = isContains ? '#64748b' : '#a855f7'; // Lighter purple for better dark mode visibility
        let strokeWidth = isContains ? 2 : 3;
        let opacity = isContains ? 0.5 : 0.95;

        if (impactData) {
          const isImpactPath = impactData.impacted_nodes.some(n => n.id === e.target) && 
                              (impactData.impacted_nodes.some(n => n.id === e.source) || e.source === selectedNodeId);
                              
          const isDepPath = impactData.dependency_nodes.some(n => n.id === e.source) && 
                            (impactData.dependency_nodes.some(n => n.id === e.target) || e.target === selectedNodeId);

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
            opacity = 0.05;
          }
        } else if (selectedNodeId) {
          if (e.source === selectedNodeId || e.target === selectedNodeId) {
             strokeWidth = 3;
             opacity = 1;
          } else {
             opacity = 0.05;
          }
        }

        return {
          id: `e${idx}-${e.source}-${e.target}`,
          source: e.source,
          target: e.target,
          type: 'default', // standard bezier curve which looks best in Dagre
          animated: isAnimated,
          label: (!isContains && opacity > 0.5) ? e.type : '',
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
      });

      const { nodes: layoutedNodes, edges: layoutedEdges } = getLayoutedElements(
        initialNodes,
        initialEdges,
        'LR'
      );
      
      setNodes(layoutedNodes);
      setEdges(layoutedEdges);
    }
  }, [data, selectedNodeId, searchQuery, visibleTypes, setNodes, setEdges]);

  const onConnect = useCallback(
    (params: Connection | Edge) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  );
  
  const handleNodeClick = useCallback((_: React.MouseEvent, node: Node) => {
    if (onNodeClick) {
      onNodeClick(node.id, node.data);
    }
  }, [onNodeClick]);

  if (!data) return null;

  if (data.nodes && data.nodes.length === 0) {
    return (
      <div className="flex-1 w-full h-full min-h-[500px] flex flex-col items-center justify-center bg-slate-50 dark:bg-[#030712] text-slate-500">
        <div className="p-8 rounded-3xl border border-slate-200 dark:border-slate-800/60 bg-white/50 dark:bg-slate-900/50 backdrop-blur-xl shadow-xl flex flex-col items-center max-w-md text-center">
          <Layers className="w-16 h-16 mb-4 text-slate-400" />
          <p className="text-xl font-bold text-slate-800 dark:text-slate-200">No supported files found</p>
          <p className="text-sm mt-3 text-slate-500 dark:text-slate-400 leading-relaxed">
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
      <Panel position="top-left" className="glass-card p-3 rounded-xl flex flex-col gap-3 min-w-[280px] m-6 border-white/10 shadow-[0_4px_30px_rgba(0,0,0,0.5)]">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-white font-semibold text-sm">
            <Filter className="w-4 h-4 text-indigo-400" />
            Filter & Search
          </div>
          <button
            onClick={() => {
              const flowViewport = document.querySelector('.react-flow__viewport') as HTMLElement;
              if (flowViewport) {
                toPng(flowViewport, { backgroundColor: '#050505' })
                  .then((dataUrl) => {
                    const a = document.createElement('a');
                    a.setAttribute('download', 'code-atlas-graph.png');
                    a.setAttribute('href', dataUrl);
                    a.click();
                  });
              }
            }}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
            title="Download PNG"
          >
            <Download className="w-4 h-4" />
          </button>
        </div>
        <div className="relative">
          <Search className="w-4 h-4 absolute left-2.5 top-2 text-slate-400" />
          <input
            type="text"
            placeholder="Search nodes..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-[#111115] border border-white/10 rounded-lg pl-8 pr-3 py-1.5 text-sm text-slate-200 focus:outline-none focus:border-indigo-500/50 transition-colors placeholder:text-slate-500"
          />
        </div>
        <div className="flex flex-wrap gap-2 mt-1">
          {['file', 'class', 'function', 'module'].map(type => (
            <button
              key={type}
              onClick={() => toggleType(type)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-300 ${
                visibleTypes.has(type)
                  ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30'
                  : 'bg-white/5 text-slate-400 border border-white/5 hover:bg-white/10'
              }`}
            >
              {type.charAt(0).toUpperCase() + type.slice(1)}
            </button>
          ))}
        </div>
      </Panel>
      <Controls 
        className="glass-panel border-white/10 rounded-xl overflow-hidden shadow-2xl !bg-[#111115]" 
        showInteractive={false}
      />
      <MiniMap 
        className="glass-card border-white/10 rounded-xl overflow-hidden shadow-[0_4px_30px_rgba(0,0,0,0.5)] !bg-[#050505]" 
        maskColor="rgba(5, 5, 5, 0.7)"
        nodeColor={(node) => {
          switch (node.data?.type) {
            case 'file': return '#34d399'; // emerald-400
            case 'class': return '#fbbf24'; // amber-400
            case 'function': return '#a78bfa'; // violet-400
            case 'module': return '#38bdf8'; // sky-400
            default: return '#94a3b8'; // slate-400
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
