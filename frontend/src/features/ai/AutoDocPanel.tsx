import { useState, useEffect } from 'react';
import { X, FileText, Loader2, Download, Copy, Check } from 'lucide-react';
import { AIService } from '../../services/api';

interface AutoDocPanelProps {
  onClose: () => void;
  repositoryId: string;
}

export const AutoDocPanel = ({ onClose, repositoryId }: AutoDocPanelProps) => {
  const [doc, setDoc] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    generateDoc();
  }, [repositoryId]);

  const generateDoc = async () => {
    setLoading(true);
    setError(null);
    try {
      const prompt = `You are an expert Software Architect. Analyze the provided repository graph data and write a comprehensive, high-level ARCHITECTURE.md document. Summarize the main domain modules, key entry points, architectural patterns, and dependencies. Format entirely in professional Markdown with clear headings. Do not output anything except the Markdown document.`;
      const res = await AIService.query(repositoryId, prompt);
      setDoc(res.data.answer);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to generate documentation.');
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    if (doc) {
      navigator.clipboard.writeText(doc);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleDownload = () => {
    if (doc) {
      const blob = new Blob([doc], { type: 'text/markdown' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'ARCHITECTURE.md';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }
  };

  return (
    <div className="w-[32rem] h-full bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl shadow-2xl flex flex-col z-50 overflow-hidden animate-in slide-in-from-right-8 duration-200">
      {/* Header */}
      <div className="flex justify-between items-center p-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50 shrink-0">
        <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400 font-semibold">
          <FileText className="w-5 h-5" />
          AI Architect Auto-Doc
        </div>
        <div className="flex items-center gap-2">
          {doc && !loading && (
            <>
              <button
                onClick={handleCopy}
                className="p-1.5 rounded-lg text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors"
                title="Copy Markdown"
              >
                {copied ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
              </button>
              <button
                onClick={handleDownload}
                className="p-1.5 rounded-lg text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors"
                title="Download .md"
              >
                <Download className="w-4 h-4" />
              </button>
            </>
          )}
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors ml-2"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto bg-slate-50/50 dark:bg-[#0d1117] p-6 relative">
        {loading ? (
          <div className="flex flex-col items-center justify-center h-full text-slate-500 gap-4">
            <Loader2 className="w-8 h-8 animate-spin text-indigo-500" />
            <div className="text-center">
              <p className="font-semibold text-slate-700 dark:text-slate-300">Generating Documentation</p>
              <p className="text-sm mt-1">Analyzing architecture patterns and modules...</p>
            </div>
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center h-full">
            <div className="text-red-500 p-4 bg-red-50 dark:bg-red-950/30 rounded-xl border border-red-200 dark:border-red-900/50 text-center max-w-sm">
              <p className="font-semibold mb-2">Analysis Failed</p>
              <p className="text-sm">{error}</p>
              <button 
                onClick={generateDoc}
                className="mt-4 px-4 py-2 bg-red-100 dark:bg-red-900/40 text-red-700 dark:text-red-400 rounded-lg text-sm font-medium hover:bg-red-200 dark:hover:bg-red-900/60 transition-colors"
              >
                Try Again
              </button>
            </div>
          </div>
        ) : doc ? (
          <div className="prose prose-sm dark:prose-invert prose-indigo max-w-none">
            <pre className="text-sm font-mono whitespace-pre-wrap leading-relaxed text-slate-700 dark:text-slate-300 bg-transparent border-0 p-0 m-0">
              {doc}
            </pre>
          </div>
        ) : null}
      </div>
    </div>
  );
};
