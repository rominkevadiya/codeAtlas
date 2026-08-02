import React, { useState } from 'react';

import { motion, AnimatePresence } from 'framer-motion';
import { useAppStore } from '../store/useAppStore';
import { X, User, Settings, Shield, Trash2, LogOut, Sliders } from 'lucide-react';

export const SettingsModal = React.forwardRef<HTMLDivElement, any>((props, ref) => {
 const { showSettingsModal, setShowSettingsModal, currentUser, logout, addToast } = useAppStore();
 const [activeTab, setActiveTab] = useState<'profile' | 'preferences' | 'danger'>('profile');

 // Visualization settings local state
 const [autoZoom, setAutoZoom] = useState(true);
 const [highQualityGraph, setHighQualityGraph] = useState(true);

 const handleClearCache = () => {
  const activeRepo = localStorage.getItem('last_repo_id');
  const token = localStorage.getItem('access_token');
  const refresh = localStorage.getItem('refresh_token');
  localStorage.clear();
  if (activeRepo) localStorage.setItem('last_repo_id', activeRepo);
  if (token) localStorage.setItem('access_token', token);
  if (refresh) localStorage.setItem('refresh_token', refresh);
  addToast('Application cache cleared successfully', 'success');
 };

 const handleLogout = () => {
  setShowSettingsModal(false);
  logout();
  addToast('Signed out successfully', 'info');
 };

 const userInitial = currentUser?.username ? currentUser.username.charAt(0).toUpperCase() : 'U';

 return (
  <AnimatePresence>
   {showSettingsModal && (
    <motion.div
     ref={ref}
     {...props}
     initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
     className="fixed inset-0 z-[90] flex items-center justify-center p-4 bg-zinc-950/80 backdrop-blur-sm"
    >
     <motion.div 
      initial={{ scale: 0.95, opacity: 0, y: 20 }}
      animate={{ scale: 1, opacity: 1, y: 0 }}
      exit={{ scale: 0.95, opacity: 0, y: 20 }}
      transition={{ type: 'spring', damping: 25, stiffness: 300 }}
      className="bg-zinc-900 border border-zinc-800 rounded-2xl shadow-2xl max-w-xl w-full overflow-hidden flex flex-col max-h-[85vh]"
     >
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-800 bg-zinc-950/50">
       <div className="flex items-center gap-2.5 text-zinc-200 font-semibold text-base">
        <Settings className="w-5 h-5 text-zinc-200" />
        Account & Settings
       </div>
       <button
        onClick={() => setShowSettingsModal(false)}
        className="p-1.5 rounded-lg text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800 transition-colors"
       >
        <X className="w-5 h-5" />
       </button>
      </div>

      {/* Content Layout */}
      <div className="flex flex-1 min-h-[360px] overflow-hidden">
       {/* Sidebar Tabs */}
       <div className="w-48 border-r border-zinc-800 p-3 flex flex-col gap-1 bg-zinc-950/30 shrink-0">
        <button
         onClick={() => setActiveTab('profile')}
         className={`flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium transition-all ${
          activeTab === 'profile'
           ? 'bg-zinc-950/10 text-zinc-200 border border-zinc-400/10'
           : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/50'
         }`}
        >
         <User className="w-4 h-4" />
         Profile Details
        </button>
        <button
         onClick={() => setActiveTab('preferences')}
         className={`flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium transition-all ${
          activeTab === 'preferences'
           ? 'bg-zinc-950/10 text-zinc-200 border border-zinc-400/10'
           : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/50'
         }`}
        >
         <Sliders className="w-4 h-4" />
         Preferences
        </button>
        <button
         onClick={() => setActiveTab('danger')}
         className={`flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium transition-all ${
          activeTab === 'danger'
           ? 'bg-rose-600/20 text-rose-400 border border-rose-500/30'
           : 'text-zinc-400 hover:text-rose-300 hover:bg-zinc-800/50'
         }`}
        >
         <Shield className="w-4 h-4" />
         Account & Danger
        </button>
       </div>

       {/* Tab Content Body */}
       <div className="flex-1 p-6 overflow-y-auto">
        {activeTab === 'profile' && (
         <div className="space-y-6">
          <div className="flex items-center gap-4 p-4 rounded-xl bg-zinc-950/60 border border-zinc-800">
           <div className="w-14 h-14 rounded-full bg-zinc-950 flex items-center justify-center text-xl font-bold text-zinc-300 shadow-sm">
            {userInitial}
           </div>
           <div>
            <h3 className="font-semibold text-zinc-200 text-base">{currentUser?.username || 'Authenticated User'}</h3>
            <p className="text-xs text-zinc-400 mt-0.5">{currentUser?.email || 'No email registered'}</p>
            <span className="inline-block mt-2 px-2 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wider bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
             Active Developer
            </span>
           </div>
          </div>

          <div className="space-y-3">
           <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">Account Details</label>
           <div className="grid grid-cols-2 gap-3 text-xs">
            <div className="p-3 rounded-xl bg-zinc-950/40 border border-zinc-800/80">
             <span className="text-zinc-400">User ID</span>
             <p className="font-mono text-zinc-200 mt-1 truncate">{currentUser?.id || 'N/A'}</p>
            </div>
            <div className="p-3 rounded-xl bg-zinc-950/40 border border-zinc-800/80">
             <span className="text-zinc-400">Role</span>
             <p className="font-medium text-zinc-200 mt-1">Repository Architect</p>
            </div>
           </div>
          </div>
         </div>
        )}

        {activeTab === 'preferences' && (
         <div className="space-y-6">
          <div className="space-y-3">
           <h4 className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">Graph Engine Settings</h4>
           <div className="space-y-3">
            <div className="flex items-center justify-between p-3.5 rounded-xl bg-zinc-950/40 border border-zinc-800">
             <div>
              <p className="text-xs font-medium text-zinc-200">Auto-Center Graph</p>
              <p className="text-[11px] text-zinc-400">Focus selected node automatically on search</p>
             </div>
             <button
              onClick={() => setAutoZoom(!autoZoom)}
              className={`w-10 h-5 rounded-full transition-colors relative flex items-center ${
               autoZoom ? 'bg-zinc-950' : 'bg-zinc-700'
              }`}
             >
              <div
               className={`w-4 h-4 rounded-full transition-transform ${
                autoZoom ? 'translate-x-5 bg-black' : 'translate-x-1 bg-zinc-950'
               }`}
              />
             </button>
            </div>

            <div className="flex items-center justify-between p-3.5 rounded-xl bg-zinc-950/40 border border-zinc-800">
             <div>
              <p className="text-xs font-medium text-zinc-200">Enhanced Particle Physics</p>
              <p className="text-[11px] text-zinc-400">Smooth 60FPS force simulation</p>
             </div>
             <button
              onClick={() => setHighQualityGraph(!highQualityGraph)}
              className={`w-10 h-5 rounded-full transition-colors relative flex items-center ${
               highQualityGraph ? 'bg-zinc-950' : 'bg-zinc-700'
              }`}
             >
              <div
               className={`w-4 h-4 rounded-full transition-transform ${
                highQualityGraph ? 'translate-x-5 bg-black' : 'translate-x-1 bg-zinc-950'
               }`}
              />
             </button>
            </div>
           </div>
          </div>
         </div>
        )}

        {activeTab === 'danger' && (
         <div className="space-y-6">
          <div className="space-y-3">
           <h4 className="text-xs font-semibold text-rose-400 uppercase tracking-wider">System Maintenance</h4>
           <div className="p-4 rounded-xl bg-rose-950/20 border border-rose-900/30 flex items-center justify-between">
            <div>
             <p className="text-xs font-medium text-zinc-200">Clear Local Application Cache</p>
             <p className="text-[11px] text-zinc-400 mt-0.5">Resets UI state without deleting repository data</p>
            </div>
            <button
             onClick={handleClearCache}
             className="px-3 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-medium transition-colors flex items-center gap-1.5"
            >
             <Trash2 className="w-3.5 h-3.5 text-zinc-400" />
             Clear Cache
            </button>
           </div>

           <div className="p-4 rounded-xl bg-rose-950/20 border border-rose-900/30 flex items-center justify-between mt-4">
            <div>
             <p className="text-xs font-medium text-rose-300">Sign Out of CodeAtlas</p>
             <p className="text-[11px] text-zinc-400 mt-0.5">Terminates active session token</p>
            </div>
            <button
             onClick={handleLogout}
             className="px-3.5 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-500 text-zinc-200 text-xs font-medium transition-colors flex items-center gap-1.5 shadow-lg shadow-rose-600/20"
            >
             <LogOut className="w-3.5 h-3.5" />
             Sign Out
            </button>
           </div>
          </div>
         </div>
        )}
       </div>
      </div>
     </motion.div>
    </motion.div>
   )}
  </AnimatePresence>
 );
});
