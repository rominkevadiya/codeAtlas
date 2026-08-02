import { create } from 'zustand';
import type { GraphData, GraphNode, ImpactData } from '../types/graph';
import { RepositoryService, AIService } from '../services/api';

interface AppState {
  // Global App State
  repoId: string | undefined;
  setRepoId: (id: string | undefined) => void;
  graphData: GraphData | null;
  setGraphData: (data: GraphData | null) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;

  // Auth State
  isAuthenticated: boolean;
  setAuth: (status: boolean) => void;
  logout: () => void;
  showAuthScreen: boolean;
  setShowAuthScreen: (show: boolean) => void;

  // UI Overlays
  showAnalysis: boolean;
  setShowAnalysis: (show: boolean) => void;
  showChat: boolean;
  setShowChat: (show: boolean) => void;
  showUpload: boolean;
  setShowUpload: (show: boolean) => void;
  showAutoDoc: boolean;
  setShowAutoDoc: (show: boolean) => void;

  // Node Selection & Inspector
  selectedNodeId: string | undefined;
  selectedNodeData: GraphNode | null;
  setSelectedNode: (id: string | undefined, data?: GraphNode | null) => void;
  
  // Data linked to selected node
  nodeSnippet: string | null;
  isLoadingSnippet: boolean;
  aiExplanation: string | null;
  isExplaining: boolean;
  impactData: ImpactData | null;
  isLoadingImpact: boolean;

  // Actions
  fetchNodeData: () => Promise<void>;
  explainSelectedNode: () => Promise<void>;
}

export const useAppStore = create<AppState>((set, get) => ({
  repoId: undefined,
  setRepoId: (id) => set({ repoId: id }),
  graphData: null,
  setGraphData: (data) => set({ graphData: data }),
  searchQuery: "",
  setSearchQuery: (query) => set({ searchQuery: query }),

  // Auth State
  isAuthenticated: !!localStorage.getItem('access_token'),
  setAuth: (status) => set({ isAuthenticated: status, showAuthScreen: !status }),
  logout: () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    set({ isAuthenticated: false, repoId: undefined, graphData: null, showAuthScreen: false });
  },
  showAuthScreen: false,
  setShowAuthScreen: (show) => set({ showAuthScreen: show }),

  showAnalysis: false,
  setShowAnalysis: (show) => set({ showAnalysis: show }),
  showChat: false,
  setShowChat: (show) => set({ showChat: show }),
  showUpload: false,
  setShowUpload: (show) => set({ showUpload: show }),
  showAutoDoc: false,
  setShowAutoDoc: (show) => set({ showAutoDoc: show }),

  selectedNodeId: undefined,
  selectedNodeData: null,
  setSelectedNode: (id, data = null) => {
    if (get().selectedNodeId === id) {
      set({ selectedNodeId: undefined, selectedNodeData: null });
    } else {
      set({ selectedNodeId: id, selectedNodeData: data });
    }
    // Note: To automatically fetch node data on select, you could call get().fetchNodeData() here, 
    // but React's useEffect in App or a watcher component might be better to decouple side-effects.
  },

  nodeSnippet: null,
  isLoadingSnippet: false,
  aiExplanation: null,
  isExplaining: false,
  impactData: null,
  isLoadingImpact: false,

  fetchNodeData: async () => {
    const { repoId, selectedNodeId, selectedNodeData } = get();
    
    if (!selectedNodeId || !repoId || !selectedNodeData?.file_path) {
      set({
        nodeSnippet: null,
        aiExplanation: null,
        impactData: null,
      });
      return;
    }

    // Reset UI before fetch
    set({
      nodeSnippet: null,
      aiExplanation: null,
      isLoadingSnippet: true,
      impactData: null,
      isLoadingImpact: true,
    });

    try {
      const snippetRes = await RepositoryService.getNodeSnippet(
        repoId,
        selectedNodeData.file_path,
        selectedNodeData.start_line,
        selectedNodeData.end_line
      );
      set({ nodeSnippet: snippetRes.data.snippet, isLoadingSnippet: false });
    } catch (err) {
      console.error("Failed to fetch snippet:", err);
      set({ nodeSnippet: "Error loading source code.", isLoadingSnippet: false });
    }

    try {
      const impactRes = await RepositoryService.getImpactAnalysis(repoId, selectedNodeId);
      set({ impactData: impactRes.data, isLoadingImpact: false });
    } catch (err) {
      console.error("Failed to fetch impact analysis:", err);
      set({ isLoadingImpact: false });
    }
  },

  explainSelectedNode: async () => {
    const { repoId, selectedNodeData, nodeSnippet } = get();
    if (!repoId || !selectedNodeData || !nodeSnippet) return;

    set({ isExplaining: true });
    try {
      const res = await AIService.explainNode(repoId, selectedNodeData.name, selectedNodeData.type, nodeSnippet);
      set({ aiExplanation: res.data.explanation || "No explanation provided." });
    } catch (err) {
      console.error("AI Error:", err);
      set({ aiExplanation: "Failed to generate AI explanation." });
    } finally {
      set({ isExplaining: false });
    }
  }
}));
