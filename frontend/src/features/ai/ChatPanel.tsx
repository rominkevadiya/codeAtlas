import { useState, useRef, useEffect } from 'react';
import { X, Send, Bot, User, Sparkles, Loader2 } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { AIService } from '../../services/api';

interface ChatPanelProps {
  onClose: () => void;
  repositoryId?: string;
}

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
}

export const ChatPanel = ({ onClose, repositoryId }: ChatPanelProps) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: 'Hello! I am your AI assistant. You can ask me anything about this codebase, its architecture, or specific functions.',
    }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || !repositoryId) return;

    const userMessage = input.trim();
    setInput('');
    
    setMessages(prev => [...prev, { id: Date.now().toString(), role: 'user', content: userMessage }]);
    setIsTyping(true);

    try {
      const res = await AIService.query(repositoryId, userMessage);
      const answer = res.data.answer || "I'm not sure how to answer that.";
      setMessages(prev => [...prev, { id: (Date.now() + 1).toString(), role: 'assistant', content: answer }]);
    } catch (err) {
      console.error("Chat error:", err);
      setMessages(prev => [...prev, { id: (Date.now() + 1).toString(), role: 'assistant', content: "Sorry, I encountered an error communicating with the backend." }]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="h-full flex flex-col glass-card border border-indigo-500/20 rounded-2xl shadow-[0_0_40px_rgba(99,102,241,0.1)] overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between p-5 border-b border-white/5 bg-indigo-500/5 backdrop-blur-md shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/20">
            <Sparkles className="w-4 h-4 text-white" />
          </div>
          <div>
            <h2 className="text-base font-semibold text-white tracking-tight">CodeAtlas AI</h2>
            <p className="text-[11px] text-slate-400 font-medium">Ask questions about your codebase</p>
          </div>
        </div>
        <button
          onClick={onClose}
          className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-5 space-y-6 custom-scrollbar">
        {!repositoryId && (
          <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl p-4 mb-4">
            <p className="text-sm text-amber-200/90 text-center">
              Please upload a repository first to start chatting.
            </p>
          </div>
        )}

        {messages.map((msg) => (
          <div key={msg.id} className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
            <div className={`w-8 h-8 rounded-xl shrink-0 flex items-center justify-center ${
              msg.role === 'user' ? 'bg-slate-700/50 text-slate-300' : 'bg-indigo-500/20 text-indigo-400'
            }`}>
              {msg.role === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
            </div>
            <div className={`max-w-[85%] rounded-2xl p-4 text-sm leading-relaxed ${
              msg.role === 'user' 
                ? 'bg-slate-800/80 text-white rounded-tr-sm border border-white/5' 
                : 'bg-[#111115] text-slate-300 rounded-tl-sm border border-indigo-500/10 shadow-lg'
            }`}>
              {msg.role === 'user' ? (
                msg.content
              ) : (
                <div className="markdown-body">
                  <ReactMarkdown
                    components={{
                      p: ({node, ...props}) => <p className="mb-3 last:mb-0" {...props} />,
                      pre: ({node, ...props}) => <pre className="bg-[#0a0a0c] p-3 rounded-lg border border-white/10 my-3 overflow-x-auto text-xs" {...props} />,
                      code: ({node, inline, ...props}: any) => inline ? <code className="bg-white/10 px-1.5 py-0.5 rounded-md text-indigo-300 font-mono text-[11px]" {...props} /> : <code className="font-mono text-slate-300" {...props} />,
                      ul: ({node, ...props}) => <ul className="list-disc pl-5 mb-3 space-y-1.5" {...props} />,
                      ol: ({node, ...props}) => <ol className="list-decimal pl-5 mb-3 space-y-1.5" {...props} />,
                      li: ({node, ...props}) => <li className="text-slate-300" {...props} />,
                      strong: ({node, ...props}) => <strong className="font-semibold text-white" {...props} />,
                      h1: ({node, ...props}) => <h1 className="text-lg font-bold text-white mb-2" {...props} />,
                      h2: ({node, ...props}) => <h2 className="text-base font-bold text-white mb-2 mt-4" {...props} />,
                      h3: ({node, ...props}) => <h3 className="text-sm font-bold text-white mb-2 mt-3" {...props} />,
                    }}
                  >
                    {msg.content}
                  </ReactMarkdown>
                </div>
              )}
            </div>
          </div>
        ))}

        {isTyping && (
          <div className="flex gap-3">
            <div className="w-8 h-8 rounded-xl shrink-0 flex items-center justify-center bg-indigo-500/20 text-indigo-400">
              <Bot className="w-4 h-4" />
            </div>
            <div className="max-w-[80%] rounded-2xl rounded-tl-sm p-4 bg-[#111115] border border-indigo-500/10 flex items-center gap-2">
              <Loader2 className="w-4 h-4 text-indigo-400 animate-spin" />
              <span className="text-sm text-slate-400">Thinking...</span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-4 bg-black/20 border-t border-white/5 shrink-0">
        <form onSubmit={handleSend} className="relative flex items-center">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={!repositoryId || isTyping}
            placeholder={repositoryId ? "Ask about architecture, functions, logic..." : "Upload a repository first"}
            className="w-full bg-[#111115] border border-white/10 rounded-xl py-3 pl-4 pr-12 text-sm text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/50 transition-all shadow-inner disabled:opacity-50"
          />
          <button
            type="submit"
            disabled={!input.trim() || !repositoryId || isTyping}
            className="absolute right-2 p-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
};
