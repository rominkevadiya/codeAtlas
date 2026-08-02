import { useState, useEffect } from 'react';
import { X, FileText, Loader2, Download, Copy, Check, RefreshCw, Maximize2, Minimize2 } from 'lucide-react';
import { createPortal } from 'react-dom';
import ReactMarkdown from 'react-markdown';
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
  const [isExpanded, setIsExpanded] = useState(false);
  const { addToast } = useAppStore();

  useEffect(() => {
    loadOrGenerateDoc();
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
    } catch {
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

  const panelContent = (
    <div className={`flex flex-col bg-[#000000] shadow-2xl overflow-hidden animate-in duration-200 ${isExpanded ? 'w-full h-full max-w-5xl max-h-[85vh] rounded-2xl mx-auto border border-white/10 fade-in' : 'w-[32rem] h-full border-l border-white/5 z-50 slide-in-from-right-8'}`}>
      <div className="flex justify-between items-center p-4 border-b border-white/5 bg-transparent shrink-0">
        <div className="flex items-center gap-2 text-zinc-300 font-semibold text-sm">
          <FileText className="w-4 h-4" />
          AI Architect Auto-Doc
        </div>
        <div className="flex items-center gap-1.5">
          {doc && !loading && (
            <>
              <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
                title={isExpanded ? "Minimize" : "Expand Full Screen"}
              >
                {isExpanded ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
              </button>
              <button
                onClick={generateDoc}
                className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
                title="Regenerate Document"
              >
                <RefreshCw className="w-4 h-4" />
              </button>
              <button
                onClick={handleCopy}
                className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
                title="Copy Markdown"
              >
                {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
              </button>
              <button
                onClick={handleDownload}
                className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
                title="Download .md"
              >
                <Download className="w-4 h-4" />
              </button>
            </>
          )}
          {isExpanded ? null : (
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors ml-1"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto bg-transparent p-6 relative">
        {loading ? (
          <div className="flex flex-col items-center justify-center h-full text-zinc-400 gap-4">
            <Loader2 className="w-8 h-8 animate-spin text-zinc-500" />
            <div className="text-center">
              <p className="font-medium text-zinc-300 text-sm">Analyzing Repository Architecture</p>
              <p className="text-xs text-zinc-500 mt-1">Extracting modules, patterns, and entry points...</p>
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
          <div className="w-full">
            <ReactMarkdown
              components={{
                h1: ({...props}) => <h1 className="text-3xl font-bold text-white mb-6 border-b border-zinc-800 pb-3 mt-8 first:mt-0" {...props} />,
                h2: ({...props}) => <h2 className="text-2xl font-semibold text-white mb-4 mt-8 pb-2 border-b border-zinc-800/50" {...props} />,
                h3: ({...props}) => <h3 className="text-xl font-semibold text-zinc-200 mb-3 mt-6" {...props} />,
                p: ({...props}) => <p className="text-base text-zinc-300 mb-4 leading-relaxed" {...props} />,
                ul: ({...props}) => <ul className="list-disc pl-6 space-y-2 mb-4 text-base text-zinc-300" {...props} />,
                ol: ({...props}) => <ol className="list-decimal pl-6 space-y-2 mb-4 text-base text-zinc-300" {...props} />,
                li: ({...props}) => <li className="text-zinc-300" {...props} />,
                pre: ({...props}) => <pre className="bg-[#0A0A0A] p-4 rounded-md border border-zinc-800 my-4 overflow-x-auto text-sm" {...props} />,
                code: ({...props}: any) => props.inline ? <code className="bg-zinc-800 px-1.5 py-0.5 rounded-sm text-zinc-200 font-mono text-sm" {...props} /> : <code className="font-mono text-zinc-300 text-sm" {...props} />,
                strong: ({...props}) => <strong className="font-semibold text-white" {...props} />,
                blockquote: ({...props}) => <blockquote className="border-l-4 border-zinc-700 pl-4 py-1 my-4 text-zinc-400 bg-zinc-900/50 rounded-r-md italic" {...props} />,
              }}
            >
              {doc}
            </ReactMarkdown>
          </div>
        ) : null}
      </div>
    </div>
  );

  if (isExpanded) {
    return (
      <>
        <div className="w-[32rem] h-full border-l border-white/5 bg-black flex flex-col items-center justify-center p-6 text-center shadow-2xl z-50">
          <FileText className="w-8 h-8 text-zinc-600 mb-3" />
          <p className="text-sm text-zinc-400">Documentation is opened in full screen</p>
          <button onClick={() => setIsExpanded(false)} className="mt-4 px-4 py-2 bg-white/5 hover:bg-white/10 text-xs text-white rounded-md transition-colors">
            Close Full Screen
          </button>
        </div>
        {createPortal(
          <div className="fixed top-16 left-16 right-0 bottom-0 z-[100] flex items-center justify-center p-4 md:p-8 bg-black/40 animate-in fade-in duration-200 pointer-events-auto">
            {panelContent}
          </div>,
          document.body
        )}
      </>
    );
  }

  return panelContent;
};

