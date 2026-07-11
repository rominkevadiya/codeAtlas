import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { RepositoryService } from '@/services/api';
import { CodeGraph } from '@/features/graph/CodeGraph';
import { Loader2 } from 'lucide-react';

export const RepositoryDashboard = () => {
  const { id } = useParams<{ id: string }>();
  const [graphData, setGraphData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    
    setLoading(true);
    RepositoryService.getGraph(id)
      .then((res) => {
        setGraphData(res.data);
        setError(null);
      })
      .catch((err) => {
        setError(err.response?.data?.error || 'Failed to load knowledge graph');
        setGraphData(null);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [id]);

  return (
    <div className="h-[calc(100vh-64px)] flex flex-col space-y-4 pt-4 pb-4 px-4 overflow-hidden">
      <div className="flex justify-between items-center border-b border-slate-200 dark:border-slate-800 pb-4 shrink-0">
        <div>
          <h1 className="text-2xl font-bold">Repository Explorer</h1>
          <p className="text-sm text-slate-500">ID: {id}</p>
        </div>
        <div className="flex gap-2">
          <button className="px-3 py-1.5 bg-slate-100 dark:bg-slate-800 rounded text-sm font-medium hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors cursor-pointer">
            Ask AI
          </button>
        </div>
      </div>
      
      <div className="flex-1 min-h-[500px] border border-slate-200 dark:border-slate-800 rounded-xl bg-slate-50 dark:bg-slate-900/50 flex items-center justify-center relative overflow-hidden">
        {loading ? (
          <div className="flex flex-col items-center gap-2 text-slate-500">
            <Loader2 className="w-8 h-8 animate-spin" />
            <p>Loading graph data...</p>
          </div>
        ) : error ? (
          <div className="text-red-500 p-4 bg-red-50 dark:bg-red-950/30 rounded-lg border border-red-200 dark:border-red-900/50 text-center">
            <p className="font-semibold mb-1">Error</p>
            <p className="text-sm opacity-90">{error}</p>
          </div>
        ) : (
          <CodeGraph data={graphData} />
        )}
      </div>
    </div>
  );
};
