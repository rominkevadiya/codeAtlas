import { useEffect, useCallback, useState } from 'react';
import {
  ReactFlow,
  useNodesState,
  useEdgesState,
  addEdge,
  Background,
  Controls,
  MiniMap,
  MarkerType,
  BackgroundVariant,
  Panel
} from '@xyflow/react';
import { Search, Filter, Layers } from 'lucide-react';
import type { Connection, Edge, Node } from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import dagre from 'dagre';
import { EntityNode } from './nodes/EntityNode';

const nodeTypes = {
  entity: EntityNode,
};

interface CodeGraphProps {
  data: {
    nodes: any[];
    edges: any[];
  } | null;
  selectedNodeId?: string | null;
  onNodeClick?: (nodeId: string, nodeData: any) => void;
}

const getLayoutedElements = (nodes: Node[], edges: Edge[], direction = 'LR') => {
  const dagreGraph = new dagre.graphlib.Graph();
  dagreGraph.setDefaultEdgeLabel(() => ({}));
  
  const isHorizontal = direction === 'LR';
  dagreGraph.setGraph({ 
    rankdir: direction,
    ranksep: 200,
    nodesep: 40,
    edgesep: 20
  });

  nodes.forEach((node) => {
    dagreGraph.setNode(node.id, { width: 260, height: 80 });
  });

  edges.forEach((edge) => {
    dagreGraph.setEdge(edge.source, edge.target);
  });

  dagre.layout(dagreGraph);

  const layoutedNodes = nodes.map((node) => {
    const nodeWithPosition = dagreGraph.node(node.id);
    return {
      ...node,
      targetPosition: isHorizontal ? 'left' : 'top',
      sourcePosition: isHorizontal ? 'right' : 'bottom',
      position: {
        x: nodeWithPosition.x - 260 / 2,
        y: nodeWithPosition.y - 80 / 2,
      },
    };
  });

  return { nodes: layoutedNodes, edges };
};

export const CodeGraph = ({ data, selectedNodeId, onNodeClick }: CodeGraphProps) => {
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  
  // Filtering and Search State
  const [searchQuery, setSearchQuery] = useState('');
  const [visibleTypes, setVisibleTypes] = useState(new Set(['file', 'class', 'function', 'module']));

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
      
      // 1. Filter Nodes
      let filteredNodesData = data.nodes.filter(n => visibleTypes.has(n.type || 'file'));
      
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

      // 3. Blast Radius styling prep
      const connectedNodeIds = new Set<string>();
      if (selectedNodeId && filteredNodeIds.has(selectedNodeId)) {
        connectedNodeIds.add(selectedNodeId);
        filteredEdgesData.forEach((e: any) => {
          if (e.source === selectedNodeId) connectedNodeIds.add(e.target);
          if (e.target === selectedNodeId) connectedNodeIds.add(e.source);
        });
      }

      const initialNodes: Node[] = filteredNodesData.map((n) => {
        const isSelected = selectedNodeId === n.id;
        const isConnected = selectedNodeId ? connectedNodeIds.has(n.id) : true;
        
        return {
          id: n.id,
          type: 'entity',
          data: { ...n, isSelected, isFaded: !isConnected },
          position: { x: 0, y: 0 },
        };
      });
      
      const initialEdges: Edge[] = filteredEdgesData.map((e: any, idx: number) => {
        const isContains = e.type === 'contains';
        const isConnectedToSelected = selectedNodeId 
          ? (e.source === selectedNodeId || e.target === selectedNodeId) 
          : false;
          
        let strokeColor = isContains ? '#475569' : '#8b5cf6';
        let strokeWidth = isContains ? 1.5 : 2.5;
        let opacity = isContains ? 0.4 : 0.9;
        
        if (selectedNodeId) {
          if (isConnectedToSelected) {
            strokeColor = e.source === selectedNodeId ? '#f43f5e' : '#10b981';
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
          type: 'smoothstep',
          animated: !isContains && (selectedNodeId ? isConnectedToSelected : true),
          label: !isContains ? e.type : '',
          labelStyle: { fill: '#94a3b8', fontWeight: 500, fontSize: 10, letterSpacing: '0.05em', textTransform: 'uppercase', opacity: selectedNodeId && !isConnectedToSelected ? 0 : 1 },
          labelBgStyle: { fill: 'transparent' },
          style: { 
            stroke: strokeColor, 
            strokeWidth: strokeWidth, 
            opacity: opacity,
            transition: 'all 0.3s ease'
          },
          markerEnd: {
            type: MarkerType.ArrowClosed,
            color: strokeColor,
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
    <ReactFlow
      nodes={nodes}
      edges={edges}
      onNodesChange={onNodesChange}
      onEdgesChange={onEdgesChange}
      onConnect={onConnect}
      onNodeClick={handleNodeClick}
      nodeTypes={nodeTypes}
      fitView
      className="bg-slate-50 dark:bg-[#030712]"
    >
      <Panel position="top-left" className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-md p-3 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col gap-3 min-w-[240px] m-4">
        <div className="flex items-center gap-2 text-slate-800 dark:text-slate-200 font-semibold text-sm">
          <Filter className="w-4 h-4" />
          Filter & Search
        </div>
        <div className="relative">
          <Search className="w-4 h-4 absolute left-2.5 top-2 text-slate-400" />
          <input
            type="text"
            placeholder="Search nodes..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-100 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg pl-8 pr-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50"
          />
        </div>
        <div className="flex flex-wrap gap-2 mt-1">
          {['file', 'class', 'function', 'module'].map(type => (
            <button
              key={type}
              onClick={() => toggleType(type)}
              className={`px-2 py-1 rounded text-xs font-medium transition-colors ${
                visibleTypes.has(type)
                  ? 'bg-slate-800 text-white dark:bg-slate-200 dark:text-slate-900'
                  : 'bg-slate-200 text-slate-600 dark:bg-slate-800 dark:text-slate-400 hover:bg-slate-300 dark:hover:bg-slate-700'
              }`}
            >
              {type.charAt(0).toUpperCase() + type.slice(1)}
            </button>
          ))}
        </div>
      </Panel>
      <Background 
        color="#64748b" 
        gap={24} 
        size={2} 
        variant={BackgroundVariant.Dots} 
        style={{ opacity: 0.15 }} 
      />
      <Controls 
        className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden shadow-lg" 
        showInteractive={false}
      />
      <MiniMap 
        className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden shadow-xl" 
        maskColor="rgba(15, 23, 42, 0.4)"
        nodeColor={(node) => {
          switch (node.data?.type) {
            case 'file': return '#10b981'; // emerald-500
            case 'class': return '#f59e0b'; // amber-500
            case 'function': return '#8b5cf6'; // violet-500
            case 'module': return '#38bdf8'; // sky-400
            default: return '#64748b'; // slate-500
          }
        }}
      />
    </ReactFlow>
  );
};
