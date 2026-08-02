import React from 'react';
import { useAppStore } from '../store/useAppStore';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const ToastContainer: React.FC = () => {
 const { toasts, removeToast } = useAppStore();

 return (
  <div className="fixed bottom-6 right-6 z-[100] flex flex-col gap-2 max-w-sm w-full pointer-events-none">
   <AnimatePresence>
    {toasts.map((toast) => {
     let bg = 'bg-zinc-900/90 border-zinc-700 text-zinc-200';
     let icon = <Info className="w-4 h-4 text-sky-400 shrink-0" />;

     if (toast.type === 'success') {
      bg = 'bg-zinc-900/95 border-emerald-500/30 text-zinc-200 shadow-sm';
      icon = <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />;
     } else if (toast.type === 'error') {
      bg = 'bg-zinc-900/95 border-rose-500/30 text-zinc-200 shadow-sm';
      icon = <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />;
     }

     return (
      <motion.div
       key={toast.id}
       layout
       initial={{ opacity: 0, y: 50, scale: 0.95 }}
       animate={{ opacity: 1, y: 0, scale: 1 }}
       exit={{ opacity: 0, scale: 0.95, transition: { duration: 0.2 } }}
       transition={{ type: 'spring', damping: 25, stiffness: 300 }}
       className={`pointer-events-auto flex items-center justify-between gap-3 p-3.5 rounded-xl border glass-card backdrop-blur-xl ${bg}`}
      >
       <div className="flex items-center gap-2.5 min-w-0">
        {icon}
        <p className="text-xs font-medium truncate">{toast.message}</p>
       </div>
       <button
        onClick={() => removeToast(toast.id)}
        className="p-1 text-zinc-400 hover:text-zinc-200 rounded-lg transition-colors shrink-0"
       >
        <X className="w-3.5 h-3.5" />
       </button>
      </motion.div>
     );
    })}
   </AnimatePresence>
  </div>
 );
};
