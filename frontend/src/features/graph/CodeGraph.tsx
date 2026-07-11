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
}

const getLayoutedElements = (nodes: Node[], edges: Edge[], direction = 'LR') => {
  const dagreGraph = new dagre.graphlib.Graph();
  dagreGraph.setDefaultEdgeLabel(() => ({}));
  
  const isHorizontal = direction === 'LR';
  dagreGraph.setGraph({ 
    rankdir: direction,
    ranksep: 150, // Space between ranks (layers)
    nodesep: 30,  // Space between nodes in the same rank
    edgesep: 15
  });

  nodes.forEach((node) => {
    // Tighter default size for calculation based on the updated node UI
    dagreGraph.setNode(node.id, { width: 220, height: 50 });
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
        x: nodeWithPosition.x - 220 / 2,
        y: nodeWithPosition.y - 50 / 2,
      },
    };
    return newNode;
  });

  return { nodes: layoutedNodes, edges };
};

export const CodeGraph = ({ data }: CodeGraphProps) => {
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);

  useEffect(() => {
    if (data && data.nodes && data.edges) {
      const initialNodes: Node[] = data.nodes.map((n) => ({
        id: n.id,
        type: 'entity',
        data: { id: n.id, name: n.name, type: n.type },
        position: { x: 0, y: 0 }, // will be layouted
      }));
      
      const initialEdges: Edge[] = data.edges.map((e, idx) => ({
        id: `e${idx}-${e.source}-${e.target}`,
        source: e.source,
        target: e.target,
        type: 'smoothstep',
        animated: e.type === 'imports',
        label: e.type === 'imports' ? 'imports' : '',
        style: { stroke: e.type === 'contains' ? '#94a3b8' : '#6366f1', strokeWidth: 1.5, opacity: 0.8 },
        markerEnd: {
          type: MarkerType.ArrowClosed,
          color: e.type === 'contains' ? '#94a3b8' : '#6366f1',
        },
      }));

      const { nodes: layoutedNodes, edges: layoutedEdges } = getLayoutedElements(
        initialNodes,
        initialEdges,
        'LR' // Change direction to Left-to-Right
      );
      
      setNodes(layoutedNodes);
      setEdges(layoutedEdges);
    }
  }, [data, setNodes, setEdges]);

  const onConnect = useCallback(
    (params: Connection | Edge) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  );

  if (!data) return null;

  return (
    <ReactFlow
      nodes={nodes}
      edges={edges}
      onNodesChange={onNodesChange}
      onEdgesChange={onEdgesChange}
      onConnect={onConnect}
      nodeTypes={nodeTypes}
      fitView
      className="bg-slate-50 dark:bg-slate-900"
    >
      <Background color="#cbd5e1" gap={16} />
      <Controls className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700" />
      <MiniMap 
        className="bg-white dark:bg-slate-800" 
        maskColor="rgba(0,0,0,0.1)"
      />
    </ReactFlow>
  );
};
