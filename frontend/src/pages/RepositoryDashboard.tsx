import { useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import { RepositoryService, AIService } from '@/services/api';
import { CodeGraph } from '@/features/graph/CodeGraph';
import { AnalysisPanel } from '@/features/analysis/AnalysisPanel';
import { Loader2, MessageSquare, X, Send, User, Bot, Sparkles, Activity, FileText } from 'lucide-react';
import { AutoDocPanel } from '@/features/ai/AutoDocPanel';

// ── Types ──────────────────────────────────────────────────────────────────
interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

// ── Component ──────────────────────────────────────────────────────────────
export const RepositoryDashboard = () => {
  const { id } = useParams<{ id: string }>();
  const [graphData, setGraphData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // AI Panel State
  const [isAiPanelOpen, setIsAiPanelOpen] = useState(false);
  const [isAnalysisPanelOpen, setIsAnalysisPanelOpen] = useState(false);
  const [isAutoDocPanelOpen, setIsAutoDocPanelOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [aiLoading, setAiLoading] = useState(false);
  const [aiError, setAiError] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Source Code Panel State
  const [selectedNode, setSelectedNode] = useState<any>(null);
  const [nodeSnippet, setNodeSnippet] = useState<string | null>(null);
  const [snippetLoading, setSnippetLoading] = useState(false);
  const [snippetError, setSnippetError] = useState<string | null>(null);

  // Scroll to bottom whenever messages update
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, aiLoading]);

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
  
  const handleNodeClick = (nodeId: string, nodeData: any) => {
    if (selectedNode?.id === nodeId) {
      setSelectedNode(null);
      return;
    }
    
    setSelectedNode(nodeData);
    setNodeSnippet(null);
    setSnippetError(null);
    
    const filePath = nodeData.type === 'file' ? nodeData.id : nodeData.file_path;
    
    if (filePath && id) {
      setSnippetLoading(true);
      RepositoryService.getNodeSnippet(id, filePath, nodeData.start_line, nodeData.end_line)
        .then(res => setNodeSnippet(res.data.snippet))
        .catch(err => setSnippetError(err.response?.data?.error || 'Failed to load source code'))
        .finally(() => setSnippetLoading(false));
    } else {
      setSnippetError("Source code not available for this node.");
    }
  };

  const executeAiQuery = async (prompt: string, displayMessage: string) => {
    if (!id) return;
    setIsAiPanelOpen(true);
    setMessages((prev) => [...prev, { role: 'user', content: displayMessage }]);
    setAiLoading(true);
    setAiError(null);

    try {
      const res = await AIService.query(id, prompt);
      setMessages((prev) => [...prev, { role: 'assistant', content: res.data.answer }]);
    } catch (err: any) {
      const errMsg = err.response?.data?.error || 'Failed to get a response from AI.';
      setAiError(errMsg);
    } finally {
      setAiLoading(false);
    }
  };

  const handleAskAI = () => {
    const trimmedQuery = query.trim();
    if (!trimmedQuery || !id) return;
    setQuery('');
    executeAiQuery(trimmedQuery, trimmedQuery);
  };

  const handleExplainCode = () => {
    if (!selectedNode || !nodeSnippet) return;
    const prompt = `Please explain the following code snippet from ${selectedNode.name}:\n\n\`\`\`\n${nodeSnippet}\n\`\`\`\n\nProvide a clear, concise explanation of what this code does.`;
    executeAiQuery(prompt, `Explain the code for ${selectedNode.name}`);
  };

  return (
    <div className="h-[calc(100vh-64px)] flex flex-col space-y-4 pt-4 pb-4 px-4 overflow-hidden relative">
      {/* Header */}
      <div className="flex justify-between items-center border-b border-slate-200 dark:border-slate-800 pb-4 shrink-0">
        <div>
          <h1 className="text-2xl font-bold">Repository Explorer</h1>
          <p className="text-sm text-slate-500">ID: {id}</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => {
              setIsAutoDocPanelOpen(!isAutoDocPanelOpen);
              if (isAiPanelOpen) setIsAiPanelOpen(false);
              if (isAnalysisPanelOpen) setIsAnalysisPanelOpen(false);
            }}
            className="flex items-center gap-2 px-4 py-2 bg-slate-50 dark:bg-slate-900 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 rounded-lg text-sm font-medium hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors shadow-sm cursor-pointer"
          >
            <FileText className="w-4 h-4" />
            Auto-Doc
          </button>
          <button
            onClick={() => {
              setIsAnalysisPanelOpen(!isAnalysisPanelOpen);
              if (isAiPanelOpen) setIsAiPanelOpen(false);
              if (isAutoDocPanelOpen) setIsAutoDocPanelOpen(false);
            }}
            className="flex items-center gap-2 px-4 py-2 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800 rounded-lg text-sm font-medium hover:bg-indigo-100 dark:hover:bg-indigo-900/50 transition-colors shadow-sm cursor-pointer"
          >
            <Activity className="w-4 h-4" />
            Metrics
          </button>
          <button
            onClick={() => {
              setIsAiPanelOpen(!isAiPanelOpen);
              if (isAnalysisPanelOpen) setIsAnalysisPanelOpen(false);
              if (isAutoDocPanelOpen) setIsAutoDocPanelOpen(false);
            }}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors shadow-sm cursor-pointer"
          >
            <MessageSquare className="w-4 h-4" />
            Ask AI
          </button>
        </div>
      </div>

      {/* Graph Canvas */}
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
          <CodeGraph 
            data={graphData} 
            selectedNodeId={selectedNode?.id} 
            onNodeClick={handleNodeClick} 
          />
        )}
      </div>

      {/* Source Code Panel */}
      {selectedNode && (
        <div className="absolute top-24 left-8 bottom-8 w-[28rem] bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl shadow-2xl flex flex-col z-40 overflow-hidden animate-in slide-in-from-left-8 duration-200">
          <div className="flex justify-between items-center p-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50 shrink-0">
            <div className="flex flex-col overflow-hidden">
              <span className="text-sm font-semibold text-slate-800 dark:text-slate-200 truncate">
                {selectedNode.name}
              </span>
              <span className="text-xs text-slate-500 dark:text-slate-400 font-mono truncate">
                {selectedNode.type === 'file' ? selectedNode.id : selectedNode.file_path}
              </span>
            </div>
            <div className="flex items-center gap-2 shrink-0 ml-4">
              {nodeSnippet && !snippetLoading && (
                <button
                  onClick={handleExplainCode}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400 rounded-lg text-xs font-medium hover:bg-purple-200 dark:hover:bg-purple-900/50 transition-colors"
                  title="Explain this code with AI"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  Explain
                </button>
              )}
              <button
                onClick={() => setSelectedNode(null)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>
          
          <div className="flex-1 overflow-auto p-4 bg-slate-50/50 dark:bg-[#0d1117]">
            {snippetLoading ? (
              <div className="flex flex-col items-center justify-center h-full text-slate-500 gap-2">
                <Loader2 className="w-6 h-6 animate-spin" />
                <p className="text-sm">Loading source code...</p>
              </div>
            ) : snippetError ? (
              <div className="text-red-500 text-sm p-4 bg-red-50 dark:bg-red-950/30 rounded-lg border border-red-200 dark:border-red-900/50">
                {snippetError}
              </div>
            ) : nodeSnippet ? (
              <pre className="text-[13px] font-mono leading-relaxed text-slate-800 dark:text-slate-300">
                <code>{nodeSnippet}</code>
              </pre>
            ) : (
              <div className="text-slate-500 text-sm text-center mt-10">
                No source code available.
              </div>
            )}
          </div>
        </div>
      )}

      {/* AI Assistant Panel */}
      {isAiPanelOpen && (
        <div className="absolute top-20 right-8 bottom-8 w-[22rem] bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl shadow-2xl flex flex-col z-50 overflow-hidden animate-in slide-in-from-right-8 duration-200">
          {/* Panel Header */}
          <div className="flex justify-between items-center p-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50 shrink-0">
            <div className="flex items-center gap-2 text-blue-600 dark:text-blue-500 font-semibold">
              <MessageSquare className="w-5 h-5" />
              CodeAtlas AI
            </div>
            <button
              onClick={() => setIsAiPanelOpen(false)}
              className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Chat History */}
          <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-3">
            {messages.length === 0 ? (
              <div className="flex-1 flex items-center justify-center text-slate-400 text-sm text-center px-8 py-12">
                Ask a natural language question about this codebase.
                <br /><br />
                <span className="text-xs italic">e.g. "What classes are defined?" or "Which file imports os?"</span>
              </div>
            ) : (
              messages.map((msg, idx) => (
                <div
                  key={idx}
                  className={`flex gap-2.5 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  {msg.role === 'assistant' && (
                    <div className="shrink-0 w-7 h-7 rounded-full bg-blue-100 dark:bg-blue-900/40 flex items-center justify-center mt-0.5">
                      <Bot className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                    </div>
                  )}
                  <div
                    className={`max-w-[80%] px-3 py-2 rounded-xl text-sm leading-relaxed whitespace-pre-wrap break-words ${
                      msg.role === 'user'
                        ? 'bg-blue-600 text-white rounded-tr-none'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 rounded-tl-none border border-slate-200 dark:border-slate-700'
                    }`}
                  >
                    {msg.content}
                  </div>
                  {msg.role === 'user' && (
                    <div className="shrink-0 w-7 h-7 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center mt-0.5">
                      <User className="w-4 h-4 text-slate-500 dark:text-slate-400" />
                    </div>
                  )}
                </div>
              ))
            )}

            {/* AI Typing indicator */}
            {aiLoading && (
              <div className="flex gap-2.5 justify-start">
                <div className="shrink-0 w-7 h-7 rounded-full bg-blue-100 dark:bg-blue-900/40 flex items-center justify-center">
                  <Bot className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                </div>
                <div className="px-3 py-2 rounded-xl rounded-tl-none bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center gap-1.5">
                  <Loader2 className="w-3.5 h-3.5 animate-spin text-blue-500" />
                  <span className="text-sm text-slate-500">Analyzing...</span>
                </div>
              </div>
            )}

            {/* Error banner */}
            {aiError && (
              <div className="text-red-600 text-sm p-3 bg-red-50 dark:bg-red-950/30 rounded-lg border border-red-200 dark:border-red-900/50">
                {aiError}
              </div>
            )}

            {/* Scroll anchor */}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Row */}
          <div className="p-3 border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 shrink-0">
            <div className="flex gap-2">
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && handleAskAI()}
                placeholder="Ask anything about this repo..."
                className="flex-1 px-3 py-2 bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                disabled={aiLoading}
              />
              <button
                onClick={handleAskAI}
                disabled={aiLoading || !query.trim()}
                className="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Analysis Panel */}
      {isAnalysisPanelOpen && id && (
        <AnalysisPanel repositoryId={id} onClose={() => setIsAnalysisPanelOpen(false)} />
      )}

      {/* AutoDoc Panel */}
      {isAutoDocPanelOpen && id && (
        <AutoDocPanel repositoryId={id} onClose={() => setIsAutoDocPanelOpen(false)} />
      )}
    </div>
  );
};
