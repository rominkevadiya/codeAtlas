import { useState, useRef, useEffect } from 'react';
import { X, Send, Bot, User, Sparkles, Loader2, Plus, Trash2, MessageSquare } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { ChatService, type ChatSession, type ChatMessage } from '../../services/api';

interface ChatPanelProps {
  onClose: () => void;
  repositoryId?: string;
}

const STARTER_PROMPTS = [
  "Explain the overall architecture of this codebase",
  "What are the main entry points?",
  "Which functions have the most dependencies?",
];

export const ChatPanel = ({ onClose, repositoryId }: ChatPanelProps) => {
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [activeSession, setActiveSession] = useState<ChatSession | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isLoadingSessions, setIsLoadingSessions] = useState(false);
  const [isDeletingSession, setIsDeletingSession] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });

  useEffect(() => { scrollToBottom(); }, [messages, isTyping]);

  // Load sessions when panel opens or repo changes
  useEffect(() => {
    if (!repositoryId) return;
    setIsLoadingSessions(true);
    setActiveSession(null);
    setMessages([]);

    ChatService.getSessions(repositoryId)
      .then(res => {
        setSessions(res.data);
        // Auto-open the most recent session if one exists
        if (res.data.length > 0) {
          openSession(res.data[0].id);
        }
      })
      .catch(err => console.error('Failed to load chat sessions:', err))
      .finally(() => setIsLoadingSessions(false));
  }, [repositoryId]);

  const openSession = async (sessionId: string) => {
    try {
      const res = await ChatService.getSession(sessionId);
      setActiveSession(res.data);
      setMessages(res.data.messages || []);
    } catch (err) {
      console.error('Failed to load session:', err);
    }
  };

  const createNewSession = async () => {
    if (!repositoryId) return;
    try {
      const res = await ChatService.createSession(repositoryId, 'New Chat');
      const newSession = res.data;
      setSessions(prev => [newSession, ...prev]);
      setActiveSession(newSession);
      setMessages([]);
    } catch (err) {
      console.error('Failed to create session:', err);
    }
  };

  const deleteSession = async (sessionId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setIsDeletingSession(sessionId);
    try {
      await ChatService.deleteSession(sessionId);
      setSessions(prev => prev.filter(s => s.id !== sessionId));
      if (activeSession?.id === sessionId) {
        setActiveSession(null);
        setMessages([]);
      }
    } catch (err) {
      console.error('Failed to delete session:', err);
    } finally {
      setIsDeletingSession(null);
    }
  };

  const handleSend = async (content?: string) => {
    const messageText = content || input.trim();
    if (!messageText || !repositoryId || isTyping) return;

    // Create a session if none exists
    let session = activeSession;
    if (!session) {
      try {
        const res = await ChatService.createSession(repositoryId, messageText.slice(0, 40));
        session = res.data;
        setSessions(prev => [session!, ...prev]);
        setActiveSession(session);
      } catch (err) {
        console.error('Failed to create session:', err);
        return;
      }
    }

    setInput('');
    setIsTyping(true);

    // Optimistically add user message to UI
    const tempUserMsg: ChatMessage = {
      id: `temp-${Date.now()}`,
      role: 'user',
      content: messageText,
      created_at: new Date().toISOString(),
    };
    setMessages(prev => [...prev, tempUserMsg]);

    try {
      const res = await ChatService.sendMessage(session.id, messageText);
      // Replace temp message with real one and add AI response
      setMessages(prev => [
        ...prev.filter(m => m.id !== tempUserMsg.id),
        res.data.user_message,
        res.data.assistant_message,
      ]);
      // Update session in list (for last_message preview)
      setSessions(prev => prev.map(s =>
        s.id === session!.id
          ? { ...s, message_count: (s.message_count || 0) + 2, last_message: { role: 'assistant', content: res.data.assistant_message.content.slice(0, 100) } }
          : s
      ));
    } catch (err) {
      console.error("Chat error:", err);
      setMessages(prev => [
        ...prev,
        { id: `err-${Date.now()}`, role: 'assistant', content: "Sorry, I encountered an error. Please try again.", created_at: new Date().toISOString() }
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="h-full flex flex-col glass-card border border-indigo-500/20 rounded-2xl shadow-[0_0_40px_rgba(99,102,241,0.1)] overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-white/5 bg-indigo-500/5 shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/20">
            <Sparkles className="w-4 h-4 text-white" />
          </div>
          <div>
            <h2 className="text-sm font-semibold text-white">CodeAtlas AI</h2>
            <p className="text-[10px] text-slate-400">
              {activeSession ? activeSession.title : 'Select or start a chat'}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-1.5">
          {repositoryId && (
            <button
              onClick={createNewSession}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
              title="New chat"
            >
              <Plus className="w-4 h-4" />
            </button>
          )}
          <button onClick={onClose} className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors">
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* No Repo Warning */}
      {!repositoryId && (
        <div className="flex-1 flex items-center justify-center p-6">
          <div className="text-center">
            <MessageSquare className="w-10 h-10 text-slate-600 mx-auto mb-3" />
            <p className="text-sm text-slate-400">Upload a repository first to start chatting.</p>
          </div>
        </div>
      )}

      {repositoryId && (
        <>
          {/* Session List (shown when no session is active) */}
          {!activeSession && (
            <div className="flex-1 overflow-y-auto custom-scrollbar p-3 space-y-2">
              {isLoadingSessions ? (
                <div className="flex items-center justify-center h-32">
                  <Loader2 className="w-5 h-5 text-indigo-400 animate-spin" />
                </div>
              ) : sessions.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full gap-4 py-8 text-center">
                  <MessageSquare className="w-10 h-10 text-slate-600" />
                  <div>
                    <p className="text-sm font-medium text-slate-300">No conversations yet</p>
                    <p className="text-xs text-slate-500 mt-1">Start a new chat below</p>
                  </div>
                  {/* Starter Prompts */}
                  <div className="space-y-2 w-full mt-2">
                    {STARTER_PROMPTS.map((prompt) => (
                      <button
                        key={prompt}
                        onClick={() => handleSend(prompt)}
                        className="w-full text-left text-xs text-slate-300 bg-white/5 hover:bg-indigo-500/10 hover:text-indigo-300 border border-white/5 hover:border-indigo-500/30 rounded-xl p-3 transition-all"
                      >
                        {prompt}
                      </button>
                    ))}
                  </div>
                </div>
              ) : (
                <>
                  <p className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold px-1 mb-2">Recent Conversations</p>
                  {sessions.map(session => (
                    <div
                      key={session.id}
                      onClick={() => openSession(session.id)}
                      className="group flex items-start gap-3 p-3 rounded-xl bg-white/[0.02] hover:bg-white/[0.05] border border-white/5 hover:border-white/10 cursor-pointer transition-all"
                    >
                      <div className="w-7 h-7 rounded-lg bg-indigo-500/10 flex items-center justify-center shrink-0 mt-0.5">
                        <MessageSquare className="w-3.5 h-3.5 text-indigo-400" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-semibold text-white truncate">{session.title}</p>
                        {session.last_message && (
                          <p className="text-[10px] text-slate-500 truncate mt-0.5">{session.last_message.content}</p>
                        )}
                        <p className="text-[9px] text-slate-600 mt-1">{session.message_count} messages</p>
                      </div>
                      <button
                        onClick={(e) => deleteSession(session.id, e)}
                        disabled={isDeletingSession === session.id}
                        className="p-1 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 opacity-0 group-hover:opacity-100 transition-all shrink-0"
                      >
                        {isDeletingSession === session.id ? <Loader2 className="w-3 h-3 animate-spin" /> : <Trash2 className="w-3 h-3" />}
                      </button>
                    </div>
                  ))}
                  {/* Starter Prompts for new session */}
                  <p className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold px-1 pt-4 mb-2">Quick Start</p>
                  {STARTER_PROMPTS.map((prompt) => (
                    <button
                      key={prompt}
                      onClick={() => handleSend(prompt)}
                      className="w-full text-left text-xs text-slate-400 hover:text-indigo-300 bg-white/[0.02] hover:bg-indigo-500/10 border border-white/5 hover:border-indigo-500/30 rounded-xl p-3 transition-all"
                    >
                      {prompt}
                    </button>
                  ))}
                </>
              )}
            </div>
          )}

          {/* Active Chat Messages */}
          {activeSession && (
            <>
              {/* Back to sessions */}
              <button
                onClick={() => { setActiveSession(null); setMessages([]); }}
                className="mx-3 mt-2 text-[10px] text-slate-500 hover:text-slate-300 transition-colors text-left px-2"
              >
                ← All conversations
              </button>

              <div className="flex-1 overflow-y-auto p-4 space-y-5 custom-scrollbar">
                {messages.length === 0 && (
                  <div className="flex flex-col items-center justify-center h-32 gap-3">
                    <Sparkles className="w-6 h-6 text-indigo-400/50" />
                    <p className="text-xs text-slate-500">Ask anything about the codebase</p>
                  </div>
                )}

                {messages.map((msg) => (
                  <div key={msg.id} className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                    <div className={`w-7 h-7 rounded-xl shrink-0 flex items-center justify-center ${msg.role === 'user' ? 'bg-slate-700/50 text-slate-300' : 'bg-indigo-500/20 text-indigo-400'}`}>
                      {msg.role === 'user' ? <User className="w-3.5 h-3.5" /> : <Bot className="w-3.5 h-3.5" />}
                    </div>
                    <div className={`max-w-[85%] rounded-2xl p-3.5 text-sm leading-relaxed ${msg.role === 'user' ? 'bg-slate-800/80 text-white rounded-tr-sm border border-white/5' : 'bg-[#111115] text-slate-300 rounded-tl-sm border border-indigo-500/10 shadow-lg'}`}>
                      {msg.role === 'user' ? msg.content : (
                        <div className="markdown-body">
                          <ReactMarkdown
                            components={{
                              p: ({ ...props }) => <p className="mb-3 last:mb-0" {...props} />,
                              pre: ({ ...props }) => <pre className="bg-[#0a0a0c] p-3 rounded-lg border border-white/10 my-3 overflow-x-auto text-xs" {...props} />,
                              code: ({ ...props }: any) => props.inline ? <code className="bg-white/10 px-1.5 py-0.5 rounded-md text-indigo-300 font-mono text-[11px]" {...props} /> : <code className="font-mono text-slate-300" {...props} />,
                              ul: ({ ...props }) => <ul className="list-disc pl-5 mb-3 space-y-1.5" {...props} />,
                              li: ({ ...props }) => <li className="text-slate-300" {...props} />,
                              strong: ({ ...props }) => <strong className="font-semibold text-white" {...props} />,
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
                    <div className="w-7 h-7 rounded-xl shrink-0 flex items-center justify-center bg-indigo-500/20 text-indigo-400">
                      <Bot className="w-3.5 h-3.5" />
                    </div>
                    <div className="rounded-2xl rounded-tl-sm p-3.5 bg-[#111115] border border-indigo-500/10 flex items-center gap-2">
                      <Loader2 className="w-4 h-4 text-indigo-400 animate-spin" />
                      <span className="text-sm text-slate-400">Thinking...</span>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>
            </>
          )}

          {/* Input Area */}
          <div className="p-3 bg-black/20 border-t border-white/5 shrink-0">
            <form onSubmit={(e) => { e.preventDefault(); handleSend(); }} className="relative flex items-center">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                disabled={isTyping}
                placeholder={activeSession ? "Ask about architecture, functions, logic..." : "Ask anything to start a new chat..."}
                className="w-full bg-[#111115] border border-white/10 rounded-xl py-3 pl-4 pr-12 text-sm text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/50 transition-all shadow-inner disabled:opacity-50"
              />
              <button
                type="submit"
                disabled={!input.trim() || isTyping}
                className="absolute right-2 p-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>
        </>
      )}
    </div>
  );
};
