import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CodeGraph } from './features/graph/CodeGraph';
import { AnalysisPanel } from './features/analysis/AnalysisPanel';
import { ChatPanel } from './features/ai/ChatPanel';
import { UploadModal } from './features/upload/UploadModal';
import { RepositoryService } from './services/api';
import { useAppStore } from './store/useAppStore';
import { Layers, Activity, Search, Command, Settings, FolderGit2, X, Loader2, Sparkles, FileCode2, MessageSquare, FileText, Maximize2, Minimize2 } from 'lucide-react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { prism } from 'react-syntax-highlighter/dist/esm/styles/prism';
import './index.css';
import { AutoDocPanel } from './features/ai/AutoDocPanel';
import { AuthScreen } from './features/auth/AuthScreen';
import { LandingPage } from './features/landing/LandingPage';
import { RepoPanel } from './features/repositories/RepoPanel';
import { ToastContainer } from './components/ToastContainer';
import { SettingsModal } from './components/SettingsModal';

export default function App() {
 const [isInspectorExpanded, setIsInspectorExpanded] = useState(false);
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
  currentUser,
  setUserRepos,
  loadUserData,
  switchRepo,
  setShowSettingsModal,
 } = useAppStore();

 const handleNodeClick = (nodeId: string, nodeData?: any) => {
  setSelectedNode(nodeId, nodeData);
 };

 useEffect(() => {
  if (isAuthenticated) {
   loadUserData();
  }
 }, [isAuthenticated, loadUserData]);

 useEffect(() => {
  if (isAuthenticated) {
   fetchNodeData();
  }
 }, [selectedNodeId, repoId, selectedNodeData, fetchNodeData, isAuthenticated]);

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
   return (
    <AnimatePresence mode="wait">
     {showAuthScreen ? (
      <AuthScreen key="auth" />
     ) : (
      <LandingPage key="landing" />
     )}
    </AnimatePresence>
   );
  }

 // Determine what is shown in the right panel
 const activeRightPanel = showAnalysis ? 'analysis' : showAutoDoc ? 'autodoc' : showChat ? 'chat' : selectedNodeId ? 'inspector' : null;

 const renderInspector = (isExpanded: boolean) => (
  <motion.div 
   layoutId="inspector-panel"
   className={`flex flex-col bg-zinc-950 ${isExpanded ? 'w-full h-full rounded-2xl overflow-hidden border border-zinc-800 shadow-2xl' : 'h-full'}`}
  >
   {/* Header */}
   <div className="p-4 border-b border-zinc-800 flex items-center justify-between bg-black">
    <div className="flex items-center gap-3 overflow-hidden">
     <div className="w-8 h-8 rounded border border-zinc-800 bg-zinc-950 flex items-center justify-center shrink-0 shadow-sm">
      <FileCode2 className="w-4 h-4 text-zinc-200" />
     </div>
     <div className="truncate">
      <h3 className="text-sm font-bold text-zinc-200 tracking-tight truncate">
       {selectedNodeData?.name || selectedNodeId}
      </h3>
      <p className="text-xs text-zinc-500 font-mono truncate">
       {selectedNodeData?.file_path || (selectedNodeData?.type === 'file' ? selectedNodeData?.name : 'Unknown file')}
      </p>
     </div>
    </div>
    <div className="flex items-center gap-1 shrink-0">
      <button
       onClick={() => setIsInspectorExpanded(!isExpanded)}
       className="p-1.5 rounded text-slate-400 hover:text-zinc-200 hover:bg-zinc-800 transition-colors"
       title={isExpanded ? "Minimize" : "Maximize"}
      >
       {isExpanded ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
      </button>
      <button 
       onClick={() => {
        setSelectedNode(undefined);
        setIsInspectorExpanded(false);
       }}
       className="p-1.5 shrink-0 rounded text-slate-400 hover:text-zinc-200 hover:bg-zinc-800 transition-colors"
      >
       <X className="w-4 h-4" />
      </button>
    </div>
   </div>

   {/* Content */}
   <div className="flex-1 overflow-y-auto p-5 space-y-8 custom-scrollbar">
    {/* Source Code */}
    <div className="space-y-2">
     <div className="flex items-center justify-between mb-1">
      <h4 className="text-xs font-bold text-zinc-200 uppercase tracking-wider">Source Code</h4>
      {selectedNodeData?.start_line && (
       <span className="text-[10px] text-zinc-500 font-mono bg-zinc-900 px-2 py-0.5 rounded border border-zinc-800">L{selectedNodeData.start_line}-{selectedNodeData.end_line}</span>
      )}
     </div>
     
     <div className="bg-black border border-zinc-800 rounded-lg p-4 overflow-x-auto relative min-h-[120px] shadow-inner">
      {isLoadingSnippet ? (
       <div className="absolute inset-0 flex items-center justify-center">
        <Loader2 className="w-5 h-5 text-zinc-200 animate-spin" />
       </div>
      ) : nodeSnippet ? (
       <SyntaxHighlighter
        language={getLanguage(selectedNodeData?.file_path || selectedNodeData?.name)}
        style={prism}
        customStyle={{ margin: 0, padding: 0, background: 'transparent', fontSize: '12px', lineHeight: '1.6' }}
        wrapLines={true}
       >
        {nodeSnippet}
       </SyntaxHighlighter>
      ) : (
       <p className="text-sm text-zinc-500 text-center italic mt-6">Source code not available.</p>
      )}
     </div>
    </div>

    {/* AI Explanation */}
    <div className="space-y-2">
     <div className="flex items-center justify-between mb-1">
      <h4 className="text-xs font-bold text-zinc-200 uppercase tracking-wider flex items-center gap-2">
       <Sparkles className="w-3.5 h-3.5 text-zinc-200" /> AI Insights
      </h4>
     </div>
     
     {aiExplanation ? (
      <div className="bg-zinc-900/50 border border-blue-100 rounded-lg p-4 shadow-sm">
       <p className="text-sm text-zinc-200 leading-relaxed whitespace-pre-wrap">
        {aiExplanation}
       </p>
      </div>
     ) : (
      <button 
       onClick={handleExplainCode}
       disabled={isExplaining || !nodeSnippet}
       className="w-full bg-zinc-950 hover:bg-black border border-zinc-800 rounded-lg p-3 transition-colors disabled:opacity-50 shadow-sm group"
      >
       <div className="flex items-center justify-center gap-2">
        {isExplaining ? (
         <>
          <Loader2 className="w-4 h-4 text-zinc-200 animate-spin" />
          <span className="text-sm font-medium text-zinc-200">Analyzing syntax tree...</span>
         </>
        ) : (
         <>
          <Sparkles className="w-4 h-4 text-slate-400 group-hover:text-zinc-200 transition-colors" />
          <span className="text-sm font-medium text-zinc-200">Generate AI Documentation</span>
         </>
        )}
       </div>
      </button>
     )}
    </div>

    {/* Blast Radius (Impact Analysis) */}
    <div className="space-y-2">
     <div className="flex items-center justify-between mb-1">
      <h4 className="text-xs font-bold text-zinc-200 uppercase tracking-wider flex items-center gap-2">
       <Activity className="w-3.5 h-3.5 text-rose-500" /> Blast Radius
      </h4>
     </div>
     
     <div className="bg-zinc-950 border border-zinc-800 rounded-lg p-4 min-h-[100px] relative shadow-sm">
      {isLoadingImpact ? (
       <div className="absolute inset-0 flex items-center justify-center">
        <Loader2 className="w-5 h-5 text-rose-500 animate-spin" />
       </div>
      ) : impactData ? (
       <div className="space-y-5">
        <div className="flex items-center justify-between">
         <span className="text-sm font-medium text-zinc-400">Impact Score</span>
         <span className="font-bold text-rose-400 bg-rose-500/10 px-2 py-0.5 rounded border border-rose-500/20">{impactData.impact_score}</span>
        </div>
        
        {impactData.impacted_nodes?.length > 0 && (
         <div>
          <h5 className="text-[10px] font-bold text-slate-400 mb-2 uppercase tracking-wider">Impacted Nodes ({impactData.impacted_nodes.length})</h5>
          <div className="space-y-2 max-h-40 overflow-y-auto custom-scrollbar pr-2">
           {impactData.impacted_nodes.slice(0, 10).map((node: any, idx: number) => (
            <div key={idx} className="flex items-center gap-2 bg-rose-500/10 border border-rose-500/20 rounded-md p-2">
             <div className="w-1.5 h-1.5 rounded-full bg-rose-500 shrink-0"></div>
             <span className="text-xs text-zinc-200 font-medium truncate flex-1">{node.name}</span>
             <span className="text-[9px] text-slate-400 uppercase font-bold shrink-0">{node.type}</span>
            </div>
           ))}
           {impactData.impacted_nodes.length > 10 && (
            <div className="text-center text-xs text-zinc-500 pt-1 font-medium">
             + {impactData.impacted_nodes.length - 10} more
            </div>
           )}
          </div>
         </div>
        )}
        
        {impactData.dependency_nodes?.length > 0 && (
         <div className="pt-4 border-t border-slate-100">
          <h5 className="text-[10px] font-bold text-slate-400 mb-2 uppercase tracking-wider">Dependencies ({impactData.dependency_nodes.length})</h5>
          <div className="space-y-2 max-h-40 overflow-y-auto custom-scrollbar pr-2">
           {impactData.dependency_nodes.slice(0, 5).map((node: any, idx: number) => (
            <div key={idx} className="flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/20 rounded-md p-2">
             <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0"></div>
             <span className="text-xs text-zinc-200 font-medium truncate flex-1">{node.name}</span>
             <span className="text-[9px] text-slate-400 uppercase font-bold shrink-0">{node.type}</span>
            </div>
           ))}
           {impactData.dependency_nodes.length > 5 && (
            <div className="text-center text-xs text-zinc-500 pt-1 font-medium">
             + {impactData.dependency_nodes.length - 5} more
            </div>
           )}
          </div>
         </div>
        )}
        
        {impactData.impacted_nodes?.length === 0 && impactData.dependency_nodes?.length === 0 && (
         <p className="text-sm text-zinc-500 text-center italic py-2">No dependencies found.</p>
        )}
       </div>
      ) : (
       <p className="text-sm text-zinc-500 text-center italic py-4">Select to run impact analysis.</p>
      )}
     </div>
    </div>
   </div>
  </motion.div>
 );

 return (
  <div className="h-screen w-screen bg-black text-zinc-200 overflow-hidden flex flex-col font-sans selection:bg-zinc-800">
   
   {/* GLOBAL NAVIGATION (Top Navbar) */}
   <nav className="h-14 shrink-0 bg-zinc-950 border-b border-zinc-800 flex items-center justify-between px-4 z-40 relative shadow-sm">
    <div className="flex items-center gap-4">
     <div className="w-8 h-8 rounded bg-zinc-200 flex items-center justify-center text-zinc-300 shadow-sm">
      <Layers className="w-5 h-5" />
     </div>
     <h1 className="text-lg font-bold tracking-tight text-zinc-200 hidden sm:block">
      CodeAtlas <span className="text-slate-400 font-normal">Workspace</span>
     </h1>
    </div>

    <div className="flex-1 max-w-2xl px-8 relative group">
     <div className="absolute inset-y-0 left-12 flex items-center pointer-events-none">
      <Search className="h-4 w-4 text-slate-400 group-focus-within:text-zinc-200 transition-colors" />
     </div>
     <input 
      type="text" 
      placeholder="Search nodes, functions, files... (Cmd + K)"
      value={searchQuery}
      onChange={(e) => setSearchQuery(e.target.value)}
      className="w-full bg-black border border-zinc-800 rounded-md py-1.5 pl-10 pr-4 text-sm text-zinc-200 placeholder:text-slate-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all shadow-sm"
     />
     <div className="absolute inset-y-0 right-10 flex items-center pointer-events-none gap-1">
      <kbd className="hidden sm:inline-block bg-zinc-950 border border-zinc-800 rounded px-1.5 py-0.5 text-[10px] font-mono text-zinc-500 font-semibold shadow-sm"><Command className="w-3 h-3 inline-block -mt-0.5"/> K</kbd>
     </div>
    </div>

    <div className="flex items-center gap-2">
     {/* Repo Switcher Trigger */}
     <button 
      onClick={() => setShowRepoPanel(!showRepoPanel)}
      className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${showRepoPanel ? 'bg-zinc-900 text-zinc-200 border border-zinc-700' : 'bg-zinc-950 text-zinc-400 border border-zinc-800 hover:bg-black'}`}
     >
      <FolderGit2 className="w-4 h-4" />
      <span className="hidden sm:inline">Repositories</span>
     </button>
     
     <div className="w-px h-6 bg-zinc-800 mx-1" />
     
     <button
      onClick={() => setShowSettingsModal(true)}
      className="w-8 h-8 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center hover:bg-zinc-800 transition-colors ml-1"
      title={`Logged in as ${currentUser?.username || '...'}`}
     >
      <span className="text-xs font-bold text-zinc-200">{avatarInitials}</span>
     </button>
    </div>
   </nav>

   <div className="flex-1 flex overflow-hidden relative">
    
    {/* LEFT SIDEBAR (Context & Tools) */}
    <aside className="w-16 md:w-64 shrink-0 bg-zinc-950 border-r border-zinc-800 flex flex-col z-30 shadow-[4px_0_24px_rgba(0,0,0,0.02)]">
     <div className="p-4 flex flex-col gap-2">
      <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2 px-2 hidden md:block">Analysis Tools</div>
      
      <button 
       onClick={() => { setShowAutoDoc(true); setShowAnalysis(false); setShowChat(false); }}
       className={`flex items-center gap-3 p-2 rounded-lg transition-colors ${showAutoDoc ? 'bg-zinc-900 text-zinc-200' : 'text-zinc-400 hover:bg-black'}`}
      >
       <FileText className="w-5 h-5 shrink-0" />
       <span className="text-sm font-medium hidden md:block">Auto-Doc</span>
      </button>
      
      <button 
       onClick={() => { setShowAnalysis(true); setShowAutoDoc(false); setShowChat(false); }}
       className={`flex items-center gap-3 p-2 rounded-lg transition-colors ${showAnalysis ? 'bg-zinc-900 text-zinc-200' : 'text-zinc-400 hover:bg-black'}`}
      >
       <Activity className="w-5 h-5 shrink-0" />
       <span className="text-sm font-medium hidden md:block">Metrics</span>
      </button>
      
      <button 
       onClick={() => { setShowChat(true); setShowAutoDoc(false); setShowAnalysis(false); }}
       className={`flex items-center gap-3 p-2 rounded-lg transition-colors ${showChat ? 'bg-zinc-900 text-zinc-200' : 'text-zinc-400 hover:bg-black'}`}
      >
       <MessageSquare className="w-5 h-5 shrink-0" />
       <span className="text-sm font-medium hidden md:block">AI Assistant</span>
      </button>
     </div>
     
     <div className="mt-auto p-4 border-t border-slate-100">
      <button 
       onClick={() => setShowSettingsModal(true)}
       className="flex items-center gap-3 p-2 rounded-lg text-zinc-400 hover:bg-black w-full transition-colors"
      >
       <Settings className="w-5 h-5 shrink-0" />
       <span className="text-sm font-medium hidden md:block">Settings</span>
      </button>
     </div>
    </aside>

    {/* MAIN WORKSPACE (Graph / Content) */}
    <main className="flex-1 relative overflow-hidden bg-slate-900 flex">
     <div className="absolute inset-0 z-0 opacity-20 bg-[linear-gradient(to_right,#4f46e5_1px,transparent_1px),linear-gradient(to_bottom,#4f46e5_1px,transparent_1px)] bg-[size:4rem_4rem]"></div>
     
     <div className="flex-1 relative z-10">
      {graphData ? (
       <CodeGraph 
        data={graphData} 
        selectedNodeId={selectedNodeId} 
        onNodeClick={handleNodeClick} 
        impactData={impactData}
       />
      ) : (
       <div className="w-full h-full flex flex-col items-center justify-center bg-zinc-950 z-20 absolute inset-0">
        <div className="w-20 h-20 bg-zinc-900 rounded-2xl flex items-center justify-center mb-6 border border-blue-100">
         <Layers className="w-10 h-10 text-zinc-200" />
        </div>
        <p className="text-2xl font-bold tracking-tight text-zinc-200 mb-2">Workspace Empty</p>
        <p className="text-zinc-500 mb-8 max-w-md text-center">Select a repository from the top navigation to analyze its architecture and begin exploring.</p>
        <button 
         onClick={() => setShowUpload(true)}
         className="bg-zinc-800 text-zinc-300 border border-zinc-700 px-6 py-2.5 rounded-lg font-medium hover:bg-zinc-700 hover:text-zinc-200 transition-colors shadow-sm"
        >
         Connect Repository
        </button>
       </div>
      )}
     </div>
    </main>

    {/* RIGHT CONTEXT PANEL (Detail Inspector, AutoDoc, Chat, Metrics) */}
    <AnimatePresence mode="wait">
    {activeRightPanel && (
     <motion.aside 
      key={activeRightPanel}
      initial={{ x: 400, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: 400, opacity: 0 }}
      transition={{ type: 'spring', damping: 25, stiffness: 200 }}
      className="w-96 shrink-0 bg-zinc-950 border-l border-zinc-800 shadow-[-4px_0_24px_rgba(0,0,0,0.02)] flex flex-col z-30 relative"
     >
      {activeRightPanel === 'analysis' && (
       <div className="h-full relative [&>div]:h-full [&>div]:shadow-none [&>div]:border-0 [&>div]:rounded-none">
         <AnalysisPanel onClose={() => setShowAnalysis(false)} repositoryId={repoId} />
       </div>
      )}
      
      {activeRightPanel === 'autodoc' && repoId && (
       <div className="h-full relative [&>div]:h-full [&>div]:shadow-none [&>div]:border-0 [&>div]:rounded-none">
         <AutoDocPanel onClose={() => setShowAutoDoc(false)} repositoryId={repoId} />
       </div>
      )}
      
      {activeRightPanel === 'chat' && (
       <div className="h-full relative [&>div]:h-full [&>div]:shadow-none [&>div]:border-0 [&>div]:rounded-none">
         <ChatPanel onClose={() => setShowChat(false)} repositoryId={repoId} />
       </div>
      )}
      
      {activeRightPanel === 'inspector' && !isInspectorExpanded && (
       <div className="h-full relative [&>div]:h-full [&>div]:shadow-none [&>div]:border-0 [&>div]:rounded-none">
        {renderInspector(false)}
       </div>
      )}
     </motion.aside>
    )}
    </AnimatePresence>
   </div>

   {/* Repo Panel Overlay */}
   <AnimatePresence>
   {showRepoPanel && (
    <>
     <motion.div 
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="absolute inset-0 bg-slate-900/20 backdrop-blur-sm z-40" 
      onClick={() => setShowRepoPanel(false)} 
     />
     <motion.div 
      initial={{ opacity: 0, y: -20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -20, scale: 0.95 }}
      transition={{ type: 'spring', damping: 25, stiffness: 300 }}
      className="absolute top-14 left-1/2 -translate-x-1/2 md:translate-x-0 md:left-64 mt-2 w-80 z-50"
     >
      <RepoPanel
       onClose={() => setShowRepoPanel(false)}
       onAddNew={() => { setShowRepoPanel(false); setShowUpload(true); }}
      />
     </motion.div>
    </>
   )}
   </AnimatePresence>

   <AnimatePresence>
   {showUpload && (
    <UploadModal 
     onClose={() => setShowUpload(false)} 
     onUploadComplete={(newRepoId) => {
      setShowUpload(false);
      switchRepo(newRepoId);
      RepositoryService.getRepositories().then(res => setUserRepos(res.data));
     }} 
    />
   )}
   </AnimatePresence>

   <ToastContainer />
   <SettingsModal />

   {/* Expanded Inspector Overlay */}
   <AnimatePresence>
    {activeRightPanel === 'inspector' && isInspectorExpanded && (
     <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 md:p-12"
     >
      <motion.div
       initial={{ opacity: 0 }}
       animate={{ opacity: 1 }}
       exit={{ opacity: 0 }}
       transition={{ duration: 0.3 }}
       className="absolute inset-0 bg-black/60 backdrop-blur-sm"
       onClick={() => setIsInspectorExpanded(false)}
      />
      <div className="relative w-full max-w-7xl h-full flex items-center justify-center z-10">
       {renderInspector(true)}
      </div>
     </motion.div>
    )}
   </AnimatePresence>
  </div>
 );
}
