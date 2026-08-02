import { create } from 'zustand';
import type { GraphData, GraphNode, ImpactData } from '../types/graph';
import { RepositoryService, AIService, AuthService, type Repository, type CurrentUser } from '../services/api';

export interface ToastItem {
 id: string;
 type: 'success' | 'error' | 'info';
 message: string;
}

interface AppState {
 // Global App State
 repoId: string | undefined;
 setRepoId: (id: string | undefined) => void;
 graphData: GraphData | null;
 setGraphData: (data: GraphData | null) => void;
 searchQuery: string;
 setSearchQuery: (query: string) => void;

 // Toast Notifications
 toasts: ToastItem[];
 addToast: (message: string, type?: 'success' | 'error' | 'info') => void;
 removeToast: (id: string) => void;

 // Settings Modal State
 showSettingsModal: boolean;
 setShowSettingsModal: (show: boolean) => void;

 // Auth State
 isAuthenticated: boolean;
 setAuth: (status: boolean) => void;
 logout: () => void;
 showAuthScreen: boolean;
 setShowAuthScreen: (show: boolean) => void;

 // Current User Profile
 currentUser: CurrentUser | null;
 setCurrentUser: (user: CurrentUser | null) => void;

 // Repository List (user's repos from DB)
 userRepos: Repository[];
 setUserRepos: (repos: Repository[]) => void;
 showRepoPanel: boolean;
 setShowRepoPanel: (show: boolean) => void;

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
 loadUserData: () => Promise<void>;
 switchRepo: (repoId: string) => Promise<void>;
 clearActiveRepo: () => void;
}

export const useAppStore = create<AppState>((set, get) => ({
 repoId: localStorage.getItem('last_repo_id') || undefined,
 setRepoId: (id) => {
  if (id) localStorage.setItem('last_repo_id', id);
  else localStorage.removeItem('last_repo_id');
  set({ repoId: id });
 },
 graphData: null,
 setGraphData: (data) => set({ graphData: data }),
 searchQuery: "",
 setSearchQuery: (query) => set({ searchQuery: query }),

 // Toast State Implementation
 toasts: [],
 addToast: (message, type = 'info') => {
  const id = Math.random().toString(36).substring(2, 9);
  set((state) => ({ toasts: [...state.toasts, { id, message, type }] }));
  setTimeout(() => {
   get().removeToast(id);
  }, 4000);
 },
 removeToast: (id) => {
  set((state) => ({ toasts: state.toasts.filter((t) => t.id !== id) }));
 },

 // Settings Modal Implementation
 showSettingsModal: false,
 setShowSettingsModal: (show) => set({ showSettingsModal: show }),

 // Auth State
 isAuthenticated: !!localStorage.getItem('access_token'),
 setAuth: (status) => set({ isAuthenticated: status, showAuthScreen: !status }),
 logout: () => {
  localStorage.removeItem('access_token');
  localStorage.removeItem('refresh_token');
  localStorage.removeItem('last_repo_id');
  set({
   isAuthenticated: false,
   repoId: undefined,
   graphData: null,
   showAuthScreen: false,
   currentUser: null,
   userRepos: [],
  });
 },
 showAuthScreen: false,
 setShowAuthScreen: (show) => set({ showAuthScreen: show }),

 // Current User
 currentUser: null,
 setCurrentUser: (user) => set({ currentUser: user }),

 // Repository List
 userRepos: [],
 setUserRepos: (repos) => set({ userRepos: repos }),
 showRepoPanel: false,
 setShowRepoPanel: (show) => set({ showRepoPanel: show }),

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
 },

 nodeSnippet: null,
 isLoadingSnippet: false,
 aiExplanation: null,
 isExplaining: false,
 impactData: null,
 isLoadingImpact: false,

 // Load current user profile AND repository list from the API
 loadUserData: async () => {
  try {
   const [meRes, reposRes] = await Promise.all([
    AuthService.getMe(),
    RepositoryService.getRepositories(),
   ]);
   set({ currentUser: meRes.data, userRepos: reposRes.data });

   // Auto-restore last active repo if it belongs to this user
   const lastRepoId = localStorage.getItem('last_repo_id');
   if (lastRepoId && reposRes.data.some(r => r.id === lastRepoId && r.status === 'READY')) {
    const { graphData } = get();
    if (!graphData) {
     // Only restore if we don't already have graph data loaded
     try {
      const graphRes = await RepositoryService.getGraph(lastRepoId);
      set({ graphData: graphRes.data, repoId: lastRepoId });
     } catch {
      // Repo exists but graph fetch failed — clear stale id
      localStorage.removeItem('last_repo_id');
      set({ repoId: undefined });
     }
    }
   } else if (lastRepoId && !reposRes.data.some(r => r.id === lastRepoId)) {
    localStorage.removeItem('last_repo_id');
    set({ repoId: undefined });
   }
  } catch (err) {
   console.error('Failed to load user data:', err);
  }
 },

 // Switch active repo and load its graph
 switchRepo: async (newRepoId: string) => {
  set({
   repoId: newRepoId,
   graphData: null,
   selectedNodeId: undefined,
   selectedNodeData: null,
   nodeSnippet: null,
   aiExplanation: null,
   impactData: null,
   showRepoPanel: false,
  });
  localStorage.setItem('last_repo_id', newRepoId);
  try {
   const res = await RepositoryService.getGraph(newRepoId);
   set({ graphData: res.data });
  } catch (err) {
   console.error('Failed to load graph for repo:', newRepoId, err);
  }
 },

 clearActiveRepo: () => {
  localStorage.removeItem('last_repo_id');
  set({
   repoId: undefined,
   graphData: null,
   selectedNodeId: undefined,
   selectedNodeData: null,
   nodeSnippet: null,
   aiExplanation: null,
   impactData: null,
  });
 },

 fetchNodeData: async () => {
  const { repoId, selectedNodeId, selectedNodeData } = get();

  const filePath = selectedNodeData?.file_path || (selectedNodeData?.type === 'file' ? selectedNodeData?.name : undefined);

  if (!selectedNodeId || !repoId || !filePath) {
   set({ nodeSnippet: null, aiExplanation: null, impactData: null });
   return;
  }

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
    filePath,
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
