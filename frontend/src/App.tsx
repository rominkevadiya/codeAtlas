import { useEffect } from 'react';
import { CodeGraph } from './features/graph/CodeGraph';
import { AnalysisPanel } from './features/analysis/AnalysisPanel';
import { ChatPanel } from './features/ai/ChatPanel';
import { UploadModal } from './features/upload/UploadModal';
import { RepositoryService } from './services/api';
import { useAppStore } from './store/useAppStore';
import { Box, Layers, Activity, Search, Command, Settings, FolderGit2, X, Loader2, Sparkles, FileCode2, MessageSquare, FileText } from 'lucide-react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import './index.css';
import { AutoDocPanel } from './features/ai/AutoDocPanel';
import { AuthScreen } from './features/auth/AuthScreen';
import { LandingPage } from './features/landing/LandingPage';
import { RepoPanel } from './features/repositories/RepoPanel';

export default function App() {
  const {
    repoId,
    graphData,
    searchQuery,
    setSearchQuery,
    showAnalysis,
    setShowAnalysis,
    showChat,
    setShowChat,
    showUpload,
    setShowUpload,
    showAutoDoc,
    setShowAutoDoc,
    showRepoPanel,
    setShowRepoPanel,
    selectedNodeId,
    selectedNodeData,
    setSelectedNode,
    nodeSnippet,
    isLoadingSnippet,
    aiExplanation,
    isExplaining,
    impactData,
    isLoadingImpact,
    fetchNodeData,
    explainSelectedNode,
    isAuthenticated,
    showAuthScreen,
    logout,
    currentUser,
    setUserRepos,
    loadUserData,
    switchRepo,
  } = useAppStore();

  const handleNodeClick = (nodeId: string, nodeData?: any) => {
    setSelectedNode(nodeId, nodeData);
  };

  // Load user profile and repo list when authenticated
  useEffect(() => {
    if (isAuthenticated) {
      loadUserData();
    }
  }, [isAuthenticated]);

  useEffect(() => {
    if (isAuthenticated) {
      fetchNodeData();
    }
  }, [selectedNodeId, repoId, selectedNodeData, fetchNodeData, isAuthenticated]);

  // Generate avatar initials from username
  const avatarInitials = currentUser?.username
    ? currentUser.username.slice(0, 2).toUpperCase()
    : 'ME';

  const handleExplainCode = async () => {
    await explainSelectedNode();
  };

  const getLanguage = (filePath: string | undefined) => {
    if (!filePath) return 'javascript';
    if (filePath.endsWith('.py')) return 'python';
    if (filePath.endsWith('.js')) return 'javascript';
    if (filePath.endsWith('.ts') || filePath.endsWith('.tsx')) return 'typescript';
    if (filePath.endsWith('.css')) return 'css';
    if (filePath.endsWith('.html')) return 'html';
    if (filePath.endsWith('.json')) return 'json';
    return 'javascript';
  };

  if (!isAuthenticated) {
    if (showAuthScreen) {
      return <AuthScreen />;
    }
    return <LandingPage />;
  }

  return (
    <div className="h-screen w-screen bg-[#050505] text-slate-200 overflow-hidden flex flex-col font-sans selection:bg-indigo-500/30">
      
      {/* Top Navbar */}
      <nav className="h-16 shrink-0 glass-panel border-b border-white/5 flex items-center justify-between px-6 z-40 relative">
        <div className="flex items-center gap-4">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/20">
            <Layers className="w-5 h-5 text-white" />
          </div>
          <h1 className="text-xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400">
            CodeAtlas <span className="text-indigo-400 font-normal">Pro</span>
          </h1>
        </div>

        <div className="flex-1 max-w-xl px-12 relative group">
          <div className="absolute inset-y-0 left-16 flex items-center pointer-events-none">
            <Search className="h-4 w-4 text-slate-500 group-focus-within:text-indigo-400 transition-colors" />
          </div>
          <input 
            type="text" 
            placeholder="Search nodes, functions, files... (Cmd + K)"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-[#111115] border border-white/10 rounded-full py-2 pl-10 pr-4 text-sm text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/50 transition-all shadow-inner"
          />
          <div className="absolute inset-y-0 right-16 flex items-center pointer-events-none gap-1">
            <kbd className="hidden sm:inline-block bg-[#222226] border border-white/10 rounded px-1.5 py-0.5 text-[10px] font-mono text-slate-400 font-semibold shadow-sm"><Command className="w-3 h-3 inline-block -mt-0.5"/> K</kbd>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button onClick={() => setShowAutoDoc(!showAutoDoc)} className={`p-2 rounded-lg transition-all duration-300 flex items-center gap-2 ${showAutoDoc ? 'bg-indigo-500/20 text-indigo-400 border border-indigo-500/30 shadow-[0_0_15px_rgba(99,102,241,0.2)]' : 'hover:bg-white/5 text-slate-400 border border-transparent'}`}>
            <FileText className="w-5 h-5" />
            <span className="text-sm font-medium pr-1">Auto-Doc</span>
          </button>
          <button onClick={() => setShowAnalysis(!showAnalysis)} className={`p-2 rounded-lg transition-all duration-300 flex items-center gap-2 ${showAnalysis ? 'bg-indigo-500/20 text-indigo-400 border border-indigo-500/30 shadow-[0_0_15px_rgba(99,102,241,0.2)]' : 'hover:bg-white/5 text-slate-400 border border-transparent'}`}>
            <Activity className="w-5 h-5" />
            <span className="text-sm font-medium pr-1">Metrics</span>
          </button>
          <div className="w-px h-6 bg-white/10 mx-2" />
          {/* Repo Switcher */}
          <button 
            onClick={() => setShowRepoPanel(!showRepoPanel)}
            className={`p-2 rounded-lg transition-all duration-300 ${showRepoPanel ? 'bg-indigo-500/20 text-indigo-400 border border-indigo-500/30' : 'hover:bg-white/5 text-slate-400 border border-transparent'}`}
            title="My Repositories"
          >
            <FolderGit2 className="w-5 h-5" />
          </button>
          {/* Dynamic User Avatar */}
          <button
            onClick={logout}
            className="w-8 h-8 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-600 flex items-center justify-center hover:opacity-80 transition-opacity shadow-lg shadow-indigo-500/20"
            title={`Logged in as ${currentUser?.username || '...'} — Click to logout`}
          >
            <span className="text-[10px] font-bold text-white">{avatarInitials}</span>
          </button>
        </div>
      </nav>

      <div className="flex-1 flex overflow-hidden relative">
        {/* Sidebar */}
        <aside className="w-16 shrink-0 glass-panel border-r border-white/5 flex flex-col items-center py-6 gap-6 z-30 relative">
          <button className="p-3 rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 hover:bg-indigo-500/20 transition-all group">
            <Box className="w-5 h-5 group-hover:scale-110 transition-transform" />
          </button>
          <button 
            onClick={() => setShowChat(!showChat)}
            className={`p-3 rounded-xl transition-all group ${showChat ? 'bg-purple-500/20 text-purple-400 border border-purple-500/30 shadow-[0_0_15px_rgba(168,85,247,0.2)]' : 'text-slate-500 hover:text-slate-300 hover:bg-white/5 border border-transparent'}`}
          >
            <MessageSquare className="w-5 h-5 group-hover:scale-110 transition-transform" />
          </button>
          
          <div className="mt-auto">
            <button className="p-3 rounded-xl text-slate-500 hover:text-slate-300 hover:bg-white/5 transition-all group">
              <Settings className="w-5 h-5 group-hover:rotate-45 transition-transform duration-300" />
            </button>
          </div>
        </aside>

        {/* Main Canvas Container */}
        <main className="flex-1 relative overflow-hidden bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-indigo-900/10 via-[#050505] to-[#050505]">
          
          {/* Decorative Grid */}
          <div className="absolute inset-0 z-0 opacity-[0.03] bg-[linear-gradient(to_right,#808080_1px,transparent_1px),linear-gradient(to_bottom,#808080_1px,transparent_1px)] bg-[size:4rem_4rem]"></div>

          <div className="absolute inset-0 z-10">
            {graphData ? (
              <CodeGraph 
                data={graphData} 
                selectedNodeId={selectedNodeId} 
                onNodeClick={handleNodeClick} 
                impactData={impactData}
              />
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center opacity-40">
                <Layers className="w-16 h-16 text-indigo-400 mb-6" />
                <p className="text-xl font-medium tracking-tight text-white mb-2">Workspace Empty</p>
                <p className="text-sm text-slate-400">Click the folder icon in the top navbar to upload a repository.</p>
              </div>
            )}
          </div>

          {/* Metrics Overlay */}
          {showAnalysis && (
            <div className="absolute top-6 right-6 bottom-6 w-96 z-50 animate-in slide-in-from-right-8 duration-300 fade-in shadow-2xl">
              <AnalysisPanel onClose={() => setShowAnalysis(false)} repositoryId={repoId} />
            </div>
          )}

          {/* Global Chat AI Overlay */}
          {showChat && (
            <div className="absolute top-6 left-24 bottom-6 w-[400px] z-50 animate-in slide-in-from-left-8 duration-300 fade-in shadow-2xl">
              <ChatPanel onClose={() => setShowChat(false)} repositoryId={repoId} />
            </div>
          )}

          {/* AutoDoc Overlay */}
          {showAutoDoc && repoId && (
            <div className="absolute top-6 right-[420px] bottom-6 z-50 animate-in slide-in-from-right-8 duration-300 fade-in shadow-2xl">
              <AutoDocPanel onClose={() => setShowAutoDoc(false)} repositoryId={repoId} />
            </div>
          )}

          {/* Node Inspector Overlay */}
          {selectedNodeId && (
            <div className="absolute bottom-8 left-8 w-[600px] glass-card rounded-2xl p-0 z-40 animate-in slide-in-from-bottom-8 duration-300 fade-in border border-indigo-500/20 shadow-[0_0_40px_rgba(99,102,241,0.1)] flex flex-col max-h-[80vh]">
              {/* Header */}
              <div className="p-5 border-b border-white/5 flex items-center justify-between shrink-0 bg-white/[0.02]">
                <div className="flex items-center gap-3 overflow-hidden pr-4">
                  <div className="w-8 h-8 rounded-lg bg-indigo-500/20 flex items-center justify-center shrink-0">
                    <FileCode2 className="w-4 h-4 text-indigo-400" />
                  </div>
                  <div className="truncate">
                    <h3 className="text-base font-semibold text-white tracking-tight truncate">
                      {selectedNodeData?.name || selectedNodeId}
                    </h3>
                    <p className="text-[11px] text-slate-400 font-mono truncate">
                      {selectedNodeData?.file_path || 'Unknown file'}
                    </p>
                  </div>
                </div>
                <button 
                  onClick={() => setSelectedNode(undefined)}
                  className="p-1.5 shrink-0 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Content */}
              <div className="p-5 overflow-y-auto flex-1 custom-scrollbar space-y-6">
                
                {/* Source Code */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-semibold text-slate-300 uppercase tracking-wider">Source Code</h4>
                    {selectedNodeData?.start_line && (
                      <span className="text-[10px] text-slate-500 font-mono">Lines {selectedNodeData.start_line} - {selectedNodeData.end_line}</span>
                    )}
                  </div>
                  
                  <div className="bg-[#0a0a0c] border border-white/5 rounded-xl p-4 overflow-x-auto relative min-h-[100px]">
                    {isLoadingSnippet ? (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <Loader2 className="w-5 h-5 text-indigo-500 animate-spin" />
                      </div>
                    ) : nodeSnippet ? (
                      <SyntaxHighlighter
                        language={getLanguage(selectedNodeData?.file_path)}
                        style={vscDarkPlus}
                        customStyle={{ margin: 0, padding: 0, background: 'transparent', fontSize: '12px', lineHeight: '1.6' }}
                        wrapLines={true}
                      >
                        {nodeSnippet}
                      </SyntaxHighlighter>
                    ) : (
                      <p className="text-sm text-slate-500 text-center italic mt-6">Source code not available.</p>
                    )}
                  </div>
                </div>

                {/* AI Explanation */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-semibold text-slate-300 uppercase tracking-wider flex items-center gap-2">
                      <Sparkles className="w-3.5 h-3.5 text-amber-400" /> AI Insights
                    </h4>
                  </div>
                  
                  {aiExplanation ? (
                    <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl p-4">
                      <p className="text-sm text-amber-200/90 leading-relaxed whitespace-pre-wrap">
                        {aiExplanation}
                      </p>
                    </div>
                  ) : (
                    <button 
                      onClick={handleExplainCode}
                      disabled={isExplaining || !nodeSnippet}
                      className="w-full relative overflow-hidden group bg-gradient-to-r from-indigo-500/10 to-purple-500/10 hover:from-indigo-500/20 hover:to-purple-500/20 border border-indigo-500/20 hover:border-indigo-500/40 rounded-xl p-4 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <div className="flex items-center justify-center gap-2">
                        {isExplaining ? (
                          <>
                            <Loader2 className="w-4 h-4 text-indigo-400 animate-spin" />
                            <span className="text-sm font-medium text-indigo-300">Analyzing syntax tree...</span>
                          </>
                        ) : (
                          <>
                            <Sparkles className="w-4 h-4 text-indigo-400 group-hover:scale-110 transition-transform" />
                            <span className="text-sm font-medium text-indigo-300 group-hover:text-indigo-200 transition-colors">Generate AI Documentation</span>
                          </>
                        )}
                      </div>
                    </button>
                  )}
                </div>

                {/* Blast Radius (Impact Analysis) */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-semibold text-slate-300 uppercase tracking-wider flex items-center gap-2">
                      <Activity className="w-3.5 h-3.5 text-rose-400" /> Blast Radius
                    </h4>
                  </div>
                  
                  <div className="bg-[#0a0a0c] border border-white/5 rounded-xl p-4 min-h-[100px] relative">
                    {isLoadingImpact ? (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <Loader2 className="w-5 h-5 text-rose-500 animate-spin" />
                      </div>
                    ) : impactData ? (
                      <div className="space-y-4">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-slate-400">Impact Score</span>
                          <span className="font-bold text-rose-400 text-lg">{impactData.impact_score}</span>
                        </div>
                        
                        {impactData.impacted_nodes?.length > 0 && (
                          <div>
                            <h5 className="text-xs font-semibold text-slate-500 mb-2 uppercase tracking-wider">Impacted Nodes ({impactData.impacted_nodes.length})</h5>
                            <div className="space-y-2 max-h-40 overflow-y-auto custom-scrollbar pr-2">
                              {impactData.impacted_nodes.slice(0, 10).map((node: any, idx: number) => (
                                <div key={idx} className="flex items-center gap-2 bg-rose-500/10 border border-rose-500/20 rounded-lg px-3 py-2">
                                  <div className="w-1.5 h-1.5 rounded-full bg-rose-500"></div>
                                  <span className="text-xs text-rose-200 truncate flex-1">{node.name}</span>
                                  <span className="text-[10px] text-rose-400/70 uppercase">{node.type}</span>
                                </div>
                              ))}
                              {impactData.impacted_nodes.length > 10 && (
                                <div className="text-center text-xs text-slate-500 pt-1">
                                  + {impactData.impacted_nodes.length - 10} more
                                </div>
                              )}
                            </div>
                          </div>
                        )}
                        
                        {impactData.dependency_nodes?.length > 0 && (
                          <div className="pt-2 border-t border-white/5">
                            <h5 className="text-xs font-semibold text-slate-500 mb-2 uppercase tracking-wider">Dependencies ({impactData.dependency_nodes.length})</h5>
                            <div className="space-y-2 max-h-40 overflow-y-auto custom-scrollbar pr-2">
                              {impactData.dependency_nodes.slice(0, 5).map((node: any, idx: number) => (
                                <div key={idx} className="flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/20 rounded-lg px-3 py-2">
                                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-500"></div>
                                  <span className="text-xs text-emerald-200 truncate flex-1">{node.name}</span>
                                  <span className="text-[10px] text-emerald-400/70 uppercase">{node.type}</span>
                                </div>
                              ))}
                              {impactData.dependency_nodes.length > 5 && (
                                <div className="text-center text-xs text-slate-500 pt-1">
                                  + {impactData.dependency_nodes.length - 5} more
                                </div>
                              )}
                            </div>
                          </div>
                        )}
                        
                        {impactData.impacted_nodes?.length === 0 && impactData.dependency_nodes?.length === 0 && (
                          <p className="text-sm text-slate-500 text-center italic">No dependencies found.</p>
                        )}
                      </div>
                    ) : (
                      <p className="text-sm text-slate-500 text-center italic mt-6">Impact analysis not available.</p>
                    )}
                  </div>
                </div>

              </div>
            </div>
          )}
        </main>
      </div>

      {/* Repo Panel Overlay */}
      {showRepoPanel && (
        <div className="absolute top-0 right-0 bottom-0 w-80 z-50 animate-in slide-in-from-right-8 duration-300 fade-in shadow-2xl p-4">
          <RepoPanel
            onClose={() => setShowRepoPanel(false)}
            onAddNew={() => { setShowRepoPanel(false); setShowUpload(true); }}
          />
        </div>
      )}

      {showUpload && (
        <UploadModal 
          onClose={() => setShowUpload(false)} 
          onUploadComplete={(newRepoId) => {
            setShowUpload(false);
            switchRepo(newRepoId);
            // Refresh repo list to include the new one
            RepositoryService.getRepositories().then(res => setUserRepos(res.data));
          }} 
        />
      )}
    </div>
  );
}
