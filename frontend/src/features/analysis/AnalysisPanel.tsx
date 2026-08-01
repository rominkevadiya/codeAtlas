import { X, AlertTriangle, ShieldAlert, Cpu, Loader2 } from 'lucide-react';
import { useState, useEffect } from 'react';
import { AnalysisService } from '../../services/api';

interface AnalysisPanelProps {
  onClose: () => void;
  repositoryId?: string; // Optional so it satisfies lint, but we won't use it
}

export const AnalysisPanel = ({ onClose, repositoryId }: AnalysisPanelProps) => {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

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
      <div className="h-full flex flex-col glass-card border border-indigo-500/20 rounded-2xl shadow-[0_0_40px_rgba(99,102,241,0.1)] overflow-hidden items-center justify-center">
        <Loader2 className="w-8 h-8 text-indigo-500 animate-spin mb-4" />
        <p className="text-slate-400">Analyzing architecture...</p>
      </div>
    );
  }

  if (!data) {
     return (
      <div className="h-full flex flex-col glass-card border border-indigo-500/20 rounded-2xl shadow-[0_0_40px_rgba(99,102,241,0.1)] overflow-hidden items-center justify-center p-8 text-center">
        <ShieldAlert className="w-8 h-8 text-slate-500 mb-4" />
        <p className="text-slate-400">No analysis data available. Please upload a repository first.</p>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col glass-card border border-indigo-500/20 rounded-2xl shadow-[0_0_40px_rgba(99,102,241,0.1)] overflow-hidden">
      {/* Header */}
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

      <div className="flex-1 overflow-y-auto p-5 space-y-6">
        
        {/* God Classes */}
        <section className="space-y-3">
          <div className="flex items-center gap-2 px-1">
            <ShieldAlert className="w-4 h-4 text-rose-400" />
            <h3 className="text-sm font-semibold text-slate-200">God Classes Detected</h3>
            <span className="ml-auto bg-rose-500/20 text-rose-400 text-[10px] font-bold px-2 py-0.5 rounded-full">{data.top_giant_files?.length || 0}</span>
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
        <section className="space-y-3 pb-4">
          <div className="flex items-center gap-2 px-1">
            <div className="w-1.5 h-4 bg-indigo-500 rounded-full" />
            <h3 className="text-sm font-semibold text-slate-200">High Coupling Modules</h3>
          </div>
          <div className="grid grid-cols-2 gap-2">
            {data.top_coupled_files && data.top_coupled_files.map((file: any, idx: number) => {
              const fileName = file.name.split('/').pop() || file.name;
              return (
                <div key={idx} className="bg-[#111115] border border-white/5 p-3 rounded-xl flex flex-col justify-between hover:border-indigo-500/30 transition-colors group">
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

      </div>
    </div>
  );
};
