import React, { useEffect, useState } from 'react';
import { AnalysisService } from '@/services/api';
import { 
  X, AlertTriangle, FileText, Activity, 
  RefreshCw, Server, ShieldAlert
} from 'lucide-react';

interface AnalysisPanelProps {
  repositoryId: string;
  onClose: () => void;
}

export const AnalysisPanel: React.FC<AnalysisPanelProps> = ({ repositoryId, onClose }) => {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchMetrics();
  }, [repositoryId]);

  const fetchMetrics = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await AnalysisService.getMetrics(repositoryId);
      setData(res.data);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to load analysis metrics.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="absolute top-20 right-8 bottom-8 w-[28rem] bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl shadow-2xl flex flex-col z-50 overflow-hidden animate-in slide-in-from-right-8 duration-200">
      {/* Header */}
      <div className="flex justify-between items-center p-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50 shrink-0">
        <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400 font-semibold">
          <Activity className="w-5 h-5" />
          Codebase Architecture
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={fetchMetrics}
            className="text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors p-1"
            title="Refresh Metrics"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors p-1"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4 bg-slate-50/30 dark:bg-slate-950">
        {loading && !data ? (
          <div className="flex flex-col items-center justify-center h-full text-slate-500 gap-3">
            <RefreshCw className="w-6 h-6 animate-spin text-indigo-500" />
            <p className="text-sm">Analyzing architecture...</p>
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center h-full gap-3 p-6 text-center">
            <AlertTriangle className="w-8 h-8 text-red-500" />
            <div className="text-red-600 text-sm">{error}</div>
            <button 
              onClick={fetchMetrics}
              className="mt-2 px-4 py-2 bg-slate-200 dark:bg-slate-800 rounded-lg text-sm font-medium hover:bg-slate-300 dark:hover:bg-slate-700 transition-colors"
            >
              Try Again
            </button>
          </div>
        ) : data ? (
          <div className="flex flex-col gap-6">
            {/* Circular Dependencies */}
            {data.circular_dependencies && data.circular_dependencies.length > 0 && (
              <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-900/50 rounded-xl p-4">
                <div className="flex items-center gap-2 text-red-700 dark:text-red-400 font-semibold mb-3">
                  <ShieldAlert className="w-5 h-5" />
                  Circular Dependencies ({data.circular_dependencies.length})
                </div>
                <div className="flex flex-col gap-2 max-h-48 overflow-y-auto pr-1">
                  {data.circular_dependencies.map((cycle: string[], idx: number) => (
                    <div key={idx} className="text-xs font-mono bg-white dark:bg-slate-950 border border-red-100 dark:border-red-900/30 p-2 rounded text-slate-700 dark:text-slate-300">
                      {cycle.join(' → ')} → {cycle[0]}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* God Classes */}
            <div>
              <div className="flex items-center gap-2 text-slate-800 dark:text-slate-200 font-semibold mb-3">
                <Server className="w-4 h-4 text-orange-500" />
                God Classes (Top Largest)
              </div>
              <div className="flex flex-col gap-2">
                {data.god_classes.map((cls: any, idx: number) => (
                  <div key={idx} className="flex justify-between items-center p-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg shadow-sm">
                    <div className="flex flex-col overflow-hidden mr-2">
                      <span className="text-sm font-medium text-slate-800 dark:text-slate-200 truncate" title={cls.file_path}>
                        {cls.file_path.split('/').pop()}
                      </span>
                      <span className="text-xs text-slate-500 truncate">{cls.file_path}</span>
                    </div>
                    <div className="shrink-0 flex gap-2">
                      <div className="bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded text-xs text-slate-600 dark:text-slate-400 font-mono flex items-center gap-1">
                        <FileText className="w-3 h-3" /> {cls.lines_of_code} loc
                      </div>
                    </div>
                  </div>
                ))}
                {data.god_classes.length === 0 && (
                  <div className="text-sm text-slate-500 italic p-4 text-center border border-dashed border-slate-200 dark:border-slate-800 rounded-lg">
                    No exceptionally large files detected.
                  </div>
                )}
              </div>
            </div>

            {/* Most Coupled */}
            <div>
              <div className="flex items-center gap-2 text-slate-800 dark:text-slate-200 font-semibold mb-3">
                <Activity className="w-4 h-4 text-blue-500" />
                Highly Coupled Files
              </div>
              <div className="flex flex-col gap-2">
                {data.most_coupled.map((cls: any, idx: number) => (
                  <div key={idx} className="flex justify-between items-center p-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg shadow-sm">
                    <div className="flex flex-col overflow-hidden mr-2">
                      <span className="text-sm font-medium text-slate-800 dark:text-slate-200 truncate" title={cls.file_path}>
                        {cls.file_path.split('/').pop()}
                      </span>
                      <span className="text-xs text-slate-500 truncate">Total Coupling Score: {cls.total_coupling}</span>
                    </div>
                    <div className="shrink-0 flex flex-col gap-1 items-end">
                      <div className="text-xs text-green-600 dark:text-green-400 font-medium flex items-center gap-1" title="Inbound dependencies">
                        ↓ {cls.inbound_deps}
                      </div>
                      <div className="text-xs text-orange-600 dark:text-orange-400 font-medium flex items-center gap-1" title="Outbound dependencies">
                        ↑ {cls.outbound_deps}
                      </div>
                    </div>
                  </div>
                ))}
                {data.most_coupled.length === 0 && (
                  <div className="text-sm text-slate-500 italic p-4 text-center border border-dashed border-slate-200 dark:border-slate-800 rounded-lg">
                    No significant coupling detected.
                  </div>
                )}
              </div>
            </div>

          </div>
        ) : null}
      </div>
    </div>
  );
};
