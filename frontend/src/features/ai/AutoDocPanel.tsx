import { useState, useEffect } from 'react';
import { X, FileText, Loader2, Download, Copy, Check, RefreshCw } from 'lucide-react';
import { AIService } from '../../services/api';
import { useAppStore } from '../../store/useAppStore';

interface AutoDocPanelProps {
  onClose: () => void;
  repositoryId: string;
}

export const AutoDocPanel = ({ onClose, repositoryId }: AutoDocPanelProps) => {
  const [doc, setDoc] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const { addToast } = useAppStore();

  useEffect(() => {
    loadOrGenerateDoc();
  }, [repositoryId]);

  const loadOrGenerateDoc = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await AIService.getAutoDoc(repositoryId);
      if (res.data.content) {
        setDoc(res.data.content);
        setLoading(false);
      } else {
        await generateDoc();
      }
    } catch (err: any) {
      // If fetching fails, attempt generation
      await generateDoc();
    }
  };

  const generateDoc = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await AIService.generateAutoDoc(repositoryId);
      setDoc(res.data.content);
      addToast('Architecture document generated successfully!', 'success');
    } catch (err: any) {
      const errorMsg = err.response?.data?.error || 'Failed to generate documentation.';
      setError(errorMsg);
      addToast(errorMsg, 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    if (doc) {
      navigator.clipboard.writeText(doc);
      setCopied(true);
      addToast('Copied documentation to clipboard', 'info');
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
      addToast('Downloaded ARCHITECTURE.md', 'success');
    }
  };

  return (
    <div className="w-[32rem] h-full bg-slate-900 border-l border-slate-800 shadow-2xl flex flex-col z-50 overflow-hidden animate-in slide-in-from-right-8 duration-200">
      {/* Header */}
      <div className="flex justify-between items-center p-4 border-b border-slate-800 bg-slate-950/80 shrink-0">
        <div className="flex items-center gap-2 text-indigo-400 font-semibold text-sm">
          <FileText className="w-4 h-4" />
          AI Architect Auto-Doc
        </div>
        <div className="flex items-center gap-1.5">
          {doc && !loading && (
            <>
              <button
                onClick={generateDoc}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                title="Regenerate Document"
              >
                <RefreshCw className="w-4 h-4" />
              </button>
              <button
                onClick={handleCopy}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                title="Copy Markdown"
              >
                {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
              </button>
              <button
                onClick={handleDownload}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                title="Download .md"
              >
                <Download className="w-4 h-4" />
              </button>
            </>
          )}
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors ml-1"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto bg-slate-950/50 p-6 relative">
        {loading ? (
          <div className="flex flex-col items-center justify-center h-full text-slate-400 gap-4">
            <Loader2 className="w-8 h-8 animate-spin text-indigo-500" />
            <div className="text-center">
              <p className="font-medium text-slate-200 text-sm">Analyzing Repository Architecture</p>
              <p className="text-xs text-slate-400 mt-1">Extracting modules, patterns, and entry points...</p>
            </div>
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center h-full">
            <div className="text-rose-400 p-4 bg-rose-950/30 rounded-xl border border-rose-900/50 text-center max-w-sm">
              <p className="font-semibold text-sm mb-2">Analysis Failed</p>
              <p className="text-xs text-rose-300 mb-3">{error}</p>
              <button 
                onClick={generateDoc}
                className="px-4 py-2 bg-rose-900/40 text-rose-300 rounded-lg text-xs font-medium hover:bg-rose-900/60 transition-colors"
              >
                Try Again
              </button>
            </div>
          </div>
        ) : doc ? (
          <div className="prose prose-sm prose-invert max-w-none">
            <pre className="text-xs font-mono whitespace-pre-wrap leading-relaxed text-slate-300 bg-transparent border-0 p-0 m-0">
              {doc}
            </pre>
          </div>
        ) : null}
      </div>
    </div>
  );
};

