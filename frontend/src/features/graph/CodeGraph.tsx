import React, { useEffect, useCallback } from 'react';
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
} from '@xyflow/react';
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
    ranksep: 200, // Increased space between layers for a wider, cleaner look
    nodesep: 40,  // Increased space between nodes in the same rank
    edgesep: 20
  });

  nodes.forEach((node) => {
    // Tighter default size for calculation based on the updated node UI
    dagreGraph.setNode(node.id, { width: 260, height: 80 });
  });

  edges.forEach((edge) => {
    dagreGraph.setEdge(edge.source, edge.target);
  });

  dagre.layout(dagreGraph);

  const layoutedNodes = nodes.map((node) => {
    const nodeWithPosition = dagreGraph.node(node.id);
    const newNode = {
      ...node,
      targetPosition: isHorizontal ? 'left' : 'top',
      sourcePosition: isHorizontal ? 'right' : 'bottom',
      position: {
        x: nodeWithPosition.x - 260 / 2,
        y: nodeWithPosition.y - 80 / 2,
      },
    };
    return newNode;
  });

  return { nodes: layoutedNodes, edges };
};

export const CodeGraph = ({ data, selectedNodeId, onNodeClick }: CodeGraphProps) => {
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);

  useEffect(() => {
    const edgesData = data?.edges || (data as any)?.links;
    if (data && data.nodes && edgesData) {
      // Find connected nodes if there is a selected node
      const connectedNodeIds = new Set<string>();
      if (selectedNodeId) {
        connectedNodeIds.add(selectedNodeId);
        edgesData.forEach((e: any) => {
          if (e.source === selectedNodeId) connectedNodeIds.add(e.target);
          if (e.target === selectedNodeId) connectedNodeIds.add(e.source);
        });
      }

      const initialNodes: Node[] = data.nodes.map((n) => {
        const isSelected = selectedNodeId === n.id;
        const isConnected = selectedNodeId ? connectedNodeIds.has(n.id) : true;
        
        return {
          id: n.id,
          type: 'entity',
          data: { ...n, isSelected, isFaded: !isConnected },
          position: { x: 0, y: 0 }, // will be layouted
        };
      });
      
      const initialEdges: Edge[] = edgesData.map((e: any, idx: number) => {
        const isContains = e.type === 'contains';
        const isConnectedToSelected = selectedNodeId 
          ? (e.source === selectedNodeId || e.target === selectedNodeId) 
          : false;
          
        let strokeColor = isContains ? '#475569' : '#8b5cf6'; // Slate 600 vs Violet 500
        let strokeWidth = isContains ? 1.5 : 2.5;
        let opacity = isContains ? 0.4 : 0.9;
        
        // Blast radius styling
        if (selectedNodeId) {
          if (isConnectedToSelected) {
            strokeColor = e.source === selectedNodeId ? '#f43f5e' : '#10b981'; // Outbound=Rose, Inbound=Emerald
            strokeWidth = 3;
            opacity = 1;
          } else {
            opacity = 0.05; // Fade out unrelated edges heavily
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
  }, [data, selectedNodeId, setNodes, setEdges]);

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
          <div className="w-16 h-16 mb-4 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400">
            <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m3.75 9v6m3-3H9m1.5-12H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
            </svg>
          </div>
          <p className="text-xl font-bold text-slate-800 dark:text-slate-200">No supported files found</p>
          <p className="text-sm mt-3 text-slate-500 dark:text-slate-400 leading-relaxed">
            The parser currently supports Python (<code>.py</code>), JavaScript/TypeScript (<code>.js</code>, <code>.jsx</code>, <code>.ts</code>, <code>.tsx</code>), JSON, and EJS files. The uploaded repository appears to have no supported source code or all parsing failed, so the knowledge graph is empty.
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
