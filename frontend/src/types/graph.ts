export interface GraphNode {
 id: string;
 type: string;
 name: string;
 file_path?: string;
 start_line?: number;
 end_line?: number;
 [key: string]: any;
}

export interface GraphEdge {
 source: string;
 target: string;
 type: string;
 [key: string]: any;
}

export interface GraphData {
 nodes: GraphNode[];
 edges?: GraphEdge[];
 links?: GraphEdge[]; // For legacy compatibility if needed
}

export interface ImpactData {
 impacted_nodes: GraphNode[];
 dependency_nodes: GraphNode[];
 impact_score: number;
}
