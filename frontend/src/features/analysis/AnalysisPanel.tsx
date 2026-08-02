import { X, AlertTriangle, ShieldAlert, Cpu, Loader2, Maximize2, Minimize2, Activity, Trash2 } from 'lucide-react';
import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { AnalysisService } from '../../services/api';

interface AnalysisPanelProps {
  onClose: () => void;
  repositoryId?: string;
}

export const AnalysisPanel = ({ onClose, repositoryId }: AnalysisPanelProps) => {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isExpanded, setIsExpanded] = useState(false);
  const [activeTabId, setActiveTabId] = useState('god_classes');

  useEffect(() => {
    if (repositoryId) {
      setLoading(true);
      AnalysisService.getMetrics(repositoryId).then((res) => {
        setData(res.data);
        setLoading(false);
      }).catch(err => {
        console.error("Failed to fetch analysis data", err);
        setLoading(false);
      });
    } else {
       setLoading(false);
    }
  }, [repositoryId]);

  if (loading) {
    return (
      <div className="h-full flex flex-col glass-card border border-white/10 rounded-2xl shadow-sm overflow-hidden items-center justify-center">
        <Loader2 className="w-8 h-8 text-indigo-500 animate-spin mb-4" />
        <p className="text-slate-400">Analyzing architecture...</p>
      </div>
    );
  }

  if (!data) {
     return (
      <div className="h-full flex flex-col glass-card border border-white/10 rounded-2xl shadow-sm overflow-hidden items-center justify-center p-8 text-center">
        <ShieldAlert className="w-8 h-8 text-slate-500 mb-4" />
        <p className="text-slate-400">No analysis data available. Please upload a repository first.</p>
      </div>
    );
  }

  const handleExpand = (tab: string) => {
    setActiveTabId(tab);
    setIsExpanded(true);
  };

  const tabs = [
    { id: 'god_classes', label: 'God Classes', icon: ShieldAlert, count: data.top_giant_files?.length || 0, color: 'text-rose-400', bg: 'bg-rose-500/20' },
    { id: 'circular_deps', label: 'Circular Dependencies', icon: AlertTriangle, count: data.circular_dependencies?.length || 0, color: 'text-amber-400', bg: 'bg-amber-500/20' },
    { id: 'coupling', label: 'High Coupling', icon: Cpu, count: data.top_coupled_files?.length || 0, color: 'text-indigo-400', bg: 'bg-indigo-500/20' },
    { id: 'hotspots', label: 'Architectural Hotspots', icon: Activity, count: data.architectural_hotspots?.length || 0, color: 'text-fuchsia-400', bg: 'bg-fuchsia-500/20' },
    { id: 'dead_code', label: 'Dead Code Candidates', icon: Trash2, count: data.dead_code_candidates?.length || 0, color: 'text-slate-400', bg: 'bg-slate-500/20' },
  ];

  const activeTab = tabs.find(t => t.id === activeTabId) || tabs[0];

  const panelContent = isExpanded ? (
    <div className="w-full h-full max-w-6xl max-h-[85vh] flex flex-col bg-[#0B0B0F] border border-white/10 rounded-2xl shadow-sm overflow-hidden mx-auto animate-in fade-in duration-200">
      {/* Expanded Header */}
      <div className="flex items-center justify-between p-6 border-b border-white/10 bg-indigo-500/5 shrink-0">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-indigo-500/20 flex items-center justify-center shadow-lg shadow-indigo-500/10">
            <Cpu className="w-6 h-6 text-indigo-400" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white tracking-tight">Codebase Intelligence</h2>
            <p className="text-sm text-slate-400 font-medium">Detailed Architectural Metrics</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsExpanded(false)}
            className="p-2.5 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
            title="Minimize"
          >
            <Minimize2 className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Expanded Content */}
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <div className="w-72 border-r border-white/10 bg-black/20 p-4 space-y-2 overflow-y-auto shrink-0 custom-scrollbar">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTabId(tab.id)}
                className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-xl text-left transition-all duration-200 ${
                  activeTabId === tab.id 
                  ? 'bg-indigo-500/20 text-white shadow-lg border border-white/10' 
                  : 'text-slate-400 hover:bg-white/5 hover:text-slate-200 border border-transparent'
                }`}
              >
                <tab.icon className={`w-5 h-5 ${tab.color}`} />
                <span className="text-sm font-medium flex-1">{tab.label}</span>
                <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${activeTabId === tab.id ? tab.bg : 'bg-black/50 text-slate-300'}`}>
                  {tab.count}
                </span>
              </button>
            ))}
        </div>
        
        {/* Main Area */}
        <div className="flex-1 overflow-y-auto p-8 bg-[#0a0a0c] custom-scrollbar">
          <div className="flex items-center gap-4 mb-8 pb-4 border-b border-white/5">
              <div className={`p-3 rounded-xl ${activeTab.bg}`}>
                <activeTab.icon className={`w-6 h-6 ${activeTab.color}`} />
              </div>
              <h3 className="text-2xl font-bold text-white tracking-tight">{activeTab.label}</h3>
          </div>

          {/* Content Rendering based on Tab */}
          {activeTabId === 'god_classes' && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {data.top_giant_files?.map((cls: any, idx: number) => (
                  <div key={idx} className="bg-white/5 border border-white/10 p-5 rounded-2xl flex flex-col justify-between hover:border-rose-500/40 transition-colors shadow-sm">
                    <p className="text-sm font-mono text-slate-300 break-all mb-5" title={cls.name}>{cls.name}</p>
                    <div className="flex items-center gap-6 mt-auto">
                      <div>
                        <p className="text-xs text-slate-500 uppercase tracking-wide font-semibold mb-1">Lines of Code</p>
                        <p className="text-xl font-bold text-rose-400">{cls.loc}</p>
                      </div>
                      <div className="w-px h-8 bg-white/10" />
                      <div>
                        <p className="text-xs text-slate-500 uppercase tracking-wide font-semibold mb-1">Functions/Classes</p>
                        <p className="text-xl font-bold text-rose-400">{cls.contains_count}</p>
                      </div>
                    </div>
                  </div>
                ))}
                {(!data.top_giant_files || data.top_giant_files.length === 0) && (
                    <p className="text-slate-400 col-span-full">No god classes detected.</p>
                )}
              </div>
          )}

          {activeTabId === 'circular_deps' && (
              <div className="space-y-4">
                {data.circular_dependencies?.map((cycle: string[], idx: number) => (
                  <div key={idx} className="bg-white/5 border border-white/10 p-6 rounded-2xl hover:border-amber-500/40 transition-colors shadow-sm">
                    <h4 className="text-sm font-semibold text-amber-400 mb-4 tracking-wide uppercase">Cycle #{idx + 1}</h4>
                    <div className="flex flex-col gap-3 relative pl-3">
                      <div className="absolute left-4 top-4 bottom-4 w-px bg-amber-500/20" />
                      {cycle.map((file, fileIdx) => (
                        <div key={fileIdx} className="flex items-center gap-4 relative z-10">
                          <div className="w-2.5 h-2.5 rounded-full bg-amber-500 ring-4 ring-[#16161D]" />
                          <span className="text-sm font-mono text-slate-300 break-all bg-black/20 px-3 py-1.5 rounded-lg border border-white/5">
                            {file}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
                {(!data.circular_dependencies || data.circular_dependencies.length === 0) && (
                    <p className="text-slate-400">No circular dependencies detected.</p>
                )}
              </div>
          )}

          {activeTabId === 'coupling' && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {data.top_coupled_files?.map((file: any, idx: number) => (
                  <div key={idx} className="bg-white/5 border border-white/10 p-5 rounded-2xl flex flex-col justify-between hover:border-white/10 transition-colors shadow-sm">
                    <p className="text-sm font-mono text-slate-300 break-all mb-5" title={file.name}>{file.name}</p>
                    <div className="flex items-center gap-6 mt-auto">
                      <div>
                        <p className="text-xs text-slate-500 uppercase tracking-wide font-semibold mb-1">Inbound Imports</p>
                        <p className="text-xl font-bold text-emerald-400">{file.inbound_imports}</p>
                      </div>
                      <div className="w-px h-8 bg-white/10" />
                      <div>
                        <p className="text-xs text-slate-500 uppercase tracking-wide font-semibold mb-1">Outbound Imports</p>
                        <p className="text-xl font-bold text-rose-400">{file.outbound_imports}</p>
                      </div>
                    </div>
                  </div>
                ))}
                {(!data.top_coupled_files || data.top_coupled_files.length === 0) && (
                    <p className="text-slate-400 col-span-full">No highly coupled files detected.</p>
                )}
              </div>
          )}

          {activeTabId === 'hotspots' && (
              <div className="grid grid-cols-1 gap-3">
                  {data.architectural_hotspots?.map((file: any, idx: number) => (
                      <div key={idx} className="bg-white/5 border border-white/10 p-5 rounded-2xl flex items-center justify-between hover:border-fuchsia-500/40 transition-colors shadow-sm">
                            <div className="flex items-center gap-4 min-w-0">
                              <div className="w-10 h-10 rounded-xl bg-fuchsia-500/10 border border-fuchsia-500/20 flex items-center justify-center shrink-0">
                                  <span className="text-fuchsia-400 font-bold">#{idx + 1}</span>
                              </div>
                              <p className="text-base font-mono text-slate-200 truncate">{file.name}</p>
                            </div>
                            <div className="text-right shrink-0 ml-4 bg-black/20 px-4 py-2 rounded-xl border border-white/5">
                              <p className="text-[10px] text-slate-500 uppercase font-semibold mb-0.5">Centrality Score</p>
                              <p className="text-xl font-bold text-fuchsia-400">{file.score}</p>
                            </div>
                      </div>
                  ))}
                  {(!data.architectural_hotspots || data.architectural_hotspots.length === 0) && (
                    <p className="text-slate-400">No architectural hotspots calculated.</p>
                  )}
              </div>
          )}

          {activeTabId === 'dead_code' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {data.dead_code_candidates?.map((file: any, idx: number) => (
                        <div key={idx} className="bg-white/5 border border-white/10 p-5 rounded-2xl flex items-center gap-4 hover:border-slate-500/40 transition-colors shadow-sm group">
                            <div className="w-10 h-10 rounded-xl bg-slate-800/80 border border-slate-700 flex items-center justify-center shrink-0 group-hover:bg-rose-500/10 group-hover:border-rose-500/30 transition-colors">
                                <Trash2 className="w-5 h-5 text-slate-500 group-hover:text-rose-400 transition-colors" />
                            </div>
                            <p className="text-sm font-mono text-slate-300 break-all">{file.name}</p>
                        </div>
                  ))}
                  {(!data.dead_code_candidates || data.dead_code_candidates.length === 0) && (
                    <p className="text-slate-400 col-span-full">No dead code candidates detected.</p>
                  )}
              </div>
          )}
          
        </div>
      </div>
    </div>
  ) : (
    <div className="h-full flex flex-col glass-card border border-white/10 rounded-2xl shadow-sm overflow-hidden">
      {/* Mini Header */}
      <div className="flex items-center justify-between p-5 border-b border-white/5 bg-indigo-500/5 backdrop-blur-md shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-indigo-500/20 flex items-center justify-center">
            <Cpu className="w-4 h-4 text-indigo-400" />
          </div>
          <div>
            <h2 className="text-base font-semibold text-white tracking-tight">Codebase Intelligence</h2>
            <p className="text-[11px] text-slate-400 font-medium">Real-time architecture metrics</p>
          </div>
        </div>
        <button
          onClick={onClose}
          className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-5 space-y-6 custom-scrollbar">
        
        {/* God Classes */}
        <section className="space-y-3">
          <div className="flex items-center gap-2 px-1">
            <ShieldAlert className="w-4 h-4 text-rose-400" />
            <h3 className="text-sm font-semibold text-slate-200">God Classes Detected</h3>
            <span className="ml-auto bg-rose-500/20 text-rose-400 text-[10px] font-bold px-2 py-0.5 rounded-full">{data.top_giant_files?.length || 0}</span>
            <button onClick={() => handleExpand('god_classes')} className="p-1 rounded-md text-slate-400 hover:text-white hover:bg-white/10 transition-colors ml-1" title="Expand God Classes">
              <Maximize2 className="w-3.5 h-3.5" />
            </button>
          </div>
          <div className="flex flex-col gap-2">
            {data.top_giant_files && data.top_giant_files.map((cls: any, idx: number) => (
              <div key={idx} className="bg-[#111115] border border-white/5 p-3 rounded-xl hover:border-rose-500/30 transition-colors group">
                <p className="text-xs font-mono text-slate-300 truncate mb-2" title={cls.name}>{cls.name.split('/').pop()}</p>
                <div className="flex items-center gap-4">
                  <div>
                    <p className="text-[10px] text-slate-500 uppercase tracking-wide font-semibold mb-0.5">Lines</p>
                    <p className="text-sm font-semibold text-rose-400 group-hover:text-rose-300">{cls.loc}</p>
                  </div>
                  <div className="w-px h-6 bg-white/5" />
                  <div>
                    <p className="text-[10px] text-slate-500 uppercase tracking-wide font-semibold mb-0.5">Functions</p>
                    <p className="text-sm font-semibold text-rose-400 group-hover:text-rose-300">{cls.contains_count}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        <div className="h-px w-full bg-gradient-to-r from-transparent via-white/10 to-transparent" />

        {/* Circular Dependencies */}
        <section className="space-y-3">
          <div className="flex items-center gap-2 px-1">
            <AlertTriangle className="w-4 h-4 text-amber-400" />
            <h3 className="text-sm font-semibold text-slate-200">Circular Dependencies</h3>
            <span className="ml-auto bg-amber-500/20 text-amber-400 text-[10px] font-bold px-2 py-0.5 rounded-full">{data.circular_dependencies?.length || 0}</span>
            <button onClick={() => handleExpand('circular_deps')} className="p-1 rounded-md text-slate-400 hover:text-white hover:bg-white/10 transition-colors ml-1" title="Expand Circular Dependencies">
              <Maximize2 className="w-3.5 h-3.5" />
            </button>
          </div>
          <div className="flex flex-col gap-2">
            {data.circular_dependencies && data.circular_dependencies.map((cycle: string[], idx: number) => (
              <div key={idx} className="bg-[#111115] border border-white/5 p-3 rounded-xl hover:border-amber-500/30 transition-colors">
                <div className="flex flex-col gap-1.5">
                  {cycle.map((file, fileIdx) => (
                    <div key={fileIdx} className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-amber-500/50" />
                      <span className="text-[11px] font-mono text-slate-400 truncate" title={file}>
                        {file.split('/').pop()}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        <div className="h-px w-full bg-gradient-to-r from-transparent via-white/10 to-transparent" />

        {/* Coupling */}
        <section className="space-y-3">
          <div className="flex items-center gap-2 px-1">
            <div className="w-1.5 h-4 bg-indigo-500 rounded-full" />
            <h3 className="text-sm font-semibold text-slate-200">High Coupling Modules</h3>
            <span className="ml-auto bg-indigo-500/20 text-indigo-400 text-[10px] font-bold px-2 py-0.5 rounded-full">{data.top_coupled_files?.length || 0}</span>
            <button onClick={() => handleExpand('coupling')} className="p-1 rounded-md text-slate-400 hover:text-white hover:bg-white/10 transition-colors ml-1" title="Expand Coupling">
              <Maximize2 className="w-3.5 h-3.5" />
            </button>
          </div>
          <div className="grid grid-cols-2 gap-2">
            {data.top_coupled_files && data.top_coupled_files.map((file: any, idx: number) => {
              const fileName = file.name.split('/').pop() || file.name;
              return (
                <div key={idx} className="bg-[#111115] border border-white/5 p-3 rounded-xl flex flex-col justify-between hover:border-white/10 transition-colors group">
                  <span className="text-[11px] font-mono text-slate-300 truncate mb-3" title={file.name}>{fileName}</span>
                  <div className="flex justify-between items-end mt-auto">
                    <div className="flex flex-col">
                      <span className="text-[9px] text-slate-500 uppercase font-semibold">In</span>
                      <span className="text-sm font-semibold text-emerald-400">{file.inbound_imports}</span>
                    </div>
                    <div className="flex flex-col text-right">
                      <span className="text-[9px] text-slate-500 uppercase font-semibold">Out</span>
                      <span className="text-sm font-semibold text-rose-400">{file.outbound_imports}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        <div className="h-px w-full bg-gradient-to-r from-transparent via-white/10 to-transparent" />

        {/* Architectural Hotspots */}
        <section className="space-y-3">
          <div className="flex items-center gap-2 px-1">
            <Activity className="w-4 h-4 text-fuchsia-400" />
            <h3 className="text-sm font-semibold text-slate-200">Architectural Hotspots</h3>
            <span className="ml-auto bg-fuchsia-500/20 text-fuchsia-400 text-[10px] font-bold px-2 py-0.5 rounded-full">{data.architectural_hotspots?.length || 0}</span>
            <button onClick={() => handleExpand('hotspots')} className="p-1 rounded-md text-slate-400 hover:text-white hover:bg-white/10 transition-colors ml-1" title="Expand Hotspots">
              <Maximize2 className="w-3.5 h-3.5" />
            </button>
          </div>
          <div className="flex flex-col gap-2">
            {data.architectural_hotspots && data.architectural_hotspots.slice(0, 5).map((file: any, idx: number) => (
               <div key={idx} className="bg-[#111115] border border-white/5 p-3 rounded-xl flex items-center justify-between hover:border-fuchsia-500/30 transition-colors group">
                  <span className="text-xs font-mono text-slate-300 truncate max-w-[150px]" title={file.name}>{file.name.split('/').pop()}</span>
                  <span className="text-xs font-bold text-fuchsia-400 bg-fuchsia-500/10 px-2 py-0.5 rounded-md">{file.score}</span>
               </div>
            ))}
          </div>
        </section>

        <div className="h-px w-full bg-gradient-to-r from-transparent via-white/10 to-transparent" />

        {/* Dead Code */}
        <section className="space-y-3 pb-4">
          <div className="flex items-center gap-2 px-1">
            <Trash2 className="w-4 h-4 text-slate-400" />
            <h3 className="text-sm font-semibold text-slate-200">Dead Code Candidates</h3>
            <span className="ml-auto bg-slate-500/20 text-slate-400 text-[10px] font-bold px-2 py-0.5 rounded-full">{data.dead_code_candidates?.length || 0}</span>
            <button onClick={() => handleExpand('dead_code')} className="p-1 rounded-md text-slate-400 hover:text-white hover:bg-white/10 transition-colors ml-1" title="Expand Dead Code">
              <Maximize2 className="w-3.5 h-3.5" />
            </button>
          </div>
          <div className="flex flex-col gap-2">
             {data.dead_code_candidates && data.dead_code_candidates.slice(0, 5).map((file: any, idx: number) => (
                <div key={idx} className="bg-[#111115] border border-white/5 p-3 rounded-xl flex items-center gap-2 hover:border-slate-500/30 transition-colors group">
                    <Trash2 className="w-3.5 h-3.5 text-slate-500 group-hover:text-slate-400 transition-colors shrink-0" />
                    <span className="text-xs font-mono text-slate-400 truncate" title={file.name}>{file.name.split('/').pop()}</span>
                </div>
             ))}
          </div>
        </section>

      </div>
    </div>
  );

  if (isExpanded) {
    return (
      <>
        <div className="h-full flex flex-col items-center justify-center p-6 text-center border border-white/10 rounded-2xl bg-indigo-500/5 shadow-sm">
          <Cpu className="w-8 h-8 text-indigo-400/50 mb-3" />
          <p className="text-sm text-slate-400">Analysis is opened in full screen</p>
          <button onClick={() => setIsExpanded(false)} className="mt-4 px-4 py-2 bg-white/5 hover:bg-white/10 text-xs text-white rounded-lg transition-colors">
            Close Full Screen
          </button>
        </div>
        {createPortal(
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-8 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
            {panelContent}
          </div>,
          document.body
        )}
      </>
    );
  }

  return panelContent;
};
