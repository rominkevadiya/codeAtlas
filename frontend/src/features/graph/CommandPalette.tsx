import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, FileCode2, Box, FunctionSquare, PackageOpen, ChevronRight } from 'lucide-react';

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
  nodes: any[];
  onSelectNode: (nodeId: string) => void;
}

export const CommandPalette = ({ isOpen, onClose, nodes, onSelectNode }: CommandPaletteProps) => {
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setQuery('');
      setSelectedIndex(0);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isOpen]);

  const filteredNodes = nodes
    .filter(n => 
      (n.name || n.id).toLowerCase().includes(query.toLowerCase()) || 
      (n.file_path || '').toLowerCase().includes(query.toLowerCase())
    )
    .slice(0, 8); // Show top 8 results max

  useEffect(() => {
    setSelectedIndex(0);
  }, [query]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;

      switch (e.key) {
        case 'ArrowDown':
          e.preventDefault();
          setSelectedIndex(prev => (prev + 1) % Math.max(1, filteredNodes.length));
          break;
        case 'ArrowUp':
          e.preventDefault();
          setSelectedIndex(prev => (prev - 1 + filteredNodes.length) % Math.max(1, filteredNodes.length));
          break;
        case 'Enter':
          e.preventDefault();
          if (filteredNodes.length > 0) {
            onSelectNode(filteredNodes[selectedIndex].id);
            onClose();
          }
          break;
        case 'Escape':
          e.preventDefault();
          onClose();
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, filteredNodes, selectedIndex, onClose, onSelectNode]);

  const getIcon = (type: string) => {
    switch (type) {
      case 'file': return <FileCode2 className="w-4 h-4 text-emerald-400" />;
      case 'class': return <Box className="w-4 h-4 text-amber-400" />;
      case 'function': return <FunctionSquare className="w-4 h-4 text-violet-400" />;
      case 'module': return <PackageOpen className="w-4 h-4 text-sky-400" />;
      default: return <FileCode2 className="w-4 h-4 text-slate-400" />;
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="fixed inset-0 z-[100] bg-slate-900/40 backdrop-blur-sm"
            onClick={onClose}
          />
          <div className="fixed inset-0 z-[101] flex items-start justify-center pt-[15vh] pointer-events-none">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: -20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -20 }}
              transition={{ duration: 0.15, ease: "easeOut" }}
              className="w-full max-w-xl bg-[#0a0a0f] border border-white/10 rounded-2xl shadow-2xl overflow-hidden pointer-events-auto flex flex-col"
            >
              <div className="flex items-center gap-3 px-4 py-4 border-b border-white/5">
                <Search className="w-5 h-5 text-indigo-400 shrink-0" />
                <input
                  ref={inputRef}
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search files, classes, or functions..."
                  className="flex-1 bg-transparent border-none text-slate-200 placeholder:text-slate-500 focus:outline-none focus:ring-0 text-lg"
                />
                <div className="flex gap-1 shrink-0">
                  <kbd className="px-2 py-1 bg-white/5 border border-white/10 rounded text-xs text-slate-400 font-mono">esc</kbd>
                </div>
              </div>

              {filteredNodes.length > 0 ? (
                <div className="max-h-[60vh] overflow-y-auto p-2">
                  {filteredNodes.map((node, idx) => {
                    const isSelected = idx === selectedIndex;
                    return (
                      <div
                        key={node.id}
                        onMouseEnter={() => setSelectedIndex(idx)}
                        onClick={() => {
                          onSelectNode(node.id);
                          onClose();
                        }}
                        className={`flex items-center justify-between px-4 py-3 rounded-xl cursor-pointer transition-colors ${
                          isSelected ? 'bg-indigo-500/10 border-indigo-500/20' : 'hover:bg-white/5'
                        } border border-transparent`}
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <div className={`p-2 rounded-lg ${isSelected ? 'bg-indigo-500/20' : 'bg-white/5'}`}>
                            {getIcon(node.type)}
                          </div>
                          <div className="flex flex-col min-w-0">
                            <span className={`font-medium truncate ${isSelected ? 'text-indigo-200' : 'text-slate-200'}`}>
                              {node.name || node.id}
                            </span>
                            {node.file_path && (
                              <span className="text-xs text-slate-500 truncate font-mono mt-0.5">
                                {node.file_path}
                              </span>
                            )}
                          </div>
                        </div>
                        {isSelected && (
                          <ChevronRight className="w-4 h-4 text-indigo-400 shrink-0" />
                        )}
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="p-8 text-center text-slate-500 flex flex-col items-center gap-3">
                  <Search className="w-8 h-8 text-slate-600 opacity-50" />
                  <p>No results found for "{query}"</p>
                </div>
              )}
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
};
