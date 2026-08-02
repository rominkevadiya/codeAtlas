import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { useAppStore } from '../store/useAppStore';
import { X, User, Settings, Shield, Trash2, LogOut, Sliders } from 'lucide-react';

export const SettingsModal: React.FC = () => {
  const { showSettingsModal, setShowSettingsModal, currentUser, logout, addToast } = useAppStore();
  const [activeTab, setActiveTab] = useState<'profile' | 'preferences' | 'danger'>('profile');

  // Visualization settings local state
  const [autoZoom, setAutoZoom] = useState(true);
  const [highQualityGraph, setHighQualityGraph] = useState(true);

  if (!showSettingsModal) return null;

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

  return createPortal(
    <div className="fixed inset-0 z-[90] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl max-w-xl w-full overflow-hidden flex flex-col max-h-[85vh] animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950/50">
          <div className="flex items-center gap-2.5 text-slate-100 font-semibold text-base">
            <Settings className="w-5 h-5 text-indigo-400" />
            Account & Settings
          </div>
          <button
            onClick={() => setShowSettingsModal(false)}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Layout */}
        <div className="flex flex-1 min-h-[360px] overflow-hidden">
          {/* Sidebar Tabs */}
          <div className="w-48 border-r border-slate-800 p-3 flex flex-col gap-1 bg-slate-950/30 shrink-0">
            <button
              onClick={() => setActiveTab('profile')}
              className={`flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium transition-all ${
                activeTab === 'profile'
                  ? 'bg-indigo-600/20 text-indigo-400 border border-white/10'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
              }`}
            >
              <User className="w-4 h-4" />
              Profile Details
            </button>
            <button
              onClick={() => setActiveTab('preferences')}
              className={`flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium transition-all ${
                activeTab === 'preferences'
                  ? 'bg-indigo-600/20 text-indigo-400 border border-white/10'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
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
                  : 'text-slate-400 hover:text-rose-300 hover:bg-slate-800/50'
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
                <div className="flex items-center gap-4 p-4 rounded-xl bg-slate-950/60 border border-slate-800">
                  <div className="w-14 h-14 rounded-full bg-white flex items-center justify-center text-xl font-bold text-black shadow-sm">
                    {userInitial}
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-100 text-base">{currentUser?.username || 'Authenticated User'}</h3>
                    <p className="text-xs text-slate-400 mt-0.5">{currentUser?.email || 'No email registered'}</p>
                    <span className="inline-block mt-2 px-2 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wider bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                      Active Developer
                    </span>
                  </div>
                </div>

                <div className="space-y-3">
                  <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Account Details</label>
                  <div className="grid grid-cols-2 gap-3 text-xs">
                    <div className="p-3 rounded-xl bg-slate-950/40 border border-slate-800/80">
                      <span className="text-slate-400">User ID</span>
                      <p className="font-mono text-slate-200 mt-1 truncate">{currentUser?.id || 'N/A'}</p>
                    </div>
                    <div className="p-3 rounded-xl bg-slate-950/40 border border-slate-800/80">
                      <span className="text-slate-400">Role</span>
                      <p className="font-medium text-slate-200 mt-1">Repository Architect</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'preferences' && (
              <div className="space-y-6">
                <div className="space-y-3">
                  <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Graph Engine Settings</h4>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3.5 rounded-xl bg-slate-950/40 border border-slate-800">
                      <div>
                        <p className="text-xs font-medium text-slate-200">Auto-Center Graph</p>
                        <p className="text-[11px] text-slate-400">Focus selected node automatically on search</p>
                      </div>
                      <button
                        onClick={() => setAutoZoom(!autoZoom)}
                        className={`w-10 h-5 rounded-full transition-colors relative flex items-center ${
                          autoZoom ? 'bg-indigo-600' : 'bg-slate-700'
                        }`}
                      >
                        <div
                          className={`w-4 h-4 rounded-full bg-white transition-transform ${
                            autoZoom ? 'translate-x-5' : 'translate-x-1'
                          }`}
                        />
                      </button>
                    </div>

                    <div className="flex items-center justify-between p-3.5 rounded-xl bg-slate-950/40 border border-slate-800">
                      <div>
                        <p className="text-xs font-medium text-slate-200">Enhanced Particle Physics</p>
                        <p className="text-[11px] text-slate-400">Smooth 60FPS force simulation</p>
                      </div>
                      <button
                        onClick={() => setHighQualityGraph(!highQualityGraph)}
                        className={`w-10 h-5 rounded-full transition-colors relative flex items-center ${
                          highQualityGraph ? 'bg-indigo-600' : 'bg-slate-700'
                        }`}
                      >
                        <div
                          className={`w-4 h-4 rounded-full bg-white transition-transform ${
                            highQualityGraph ? 'translate-x-5' : 'translate-x-1'
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
                      <p className="text-xs font-medium text-slate-200">Clear Local Application Cache</p>
                      <p className="text-[11px] text-slate-400 mt-0.5">Resets UI state without deleting repository data</p>
                    </div>
                    <button
                      onClick={handleClearCache}
                      className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium transition-colors flex items-center gap-1.5"
                    >
                      <Trash2 className="w-3.5 h-3.5 text-slate-400" />
                      Clear Cache
                    </button>
                  </div>

                  <div className="p-4 rounded-xl bg-rose-950/20 border border-rose-900/30 flex items-center justify-between mt-4">
                    <div>
                      <p className="text-xs font-medium text-rose-300">Sign Out of CodeAtlas</p>
                      <p className="text-[11px] text-slate-400 mt-0.5">Terminates active session token</p>
                    </div>
                    <button
                      onClick={handleLogout}
                      className="px-3.5 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-500 text-white text-xs font-medium transition-colors flex items-center gap-1.5 shadow-lg shadow-rose-600/20"
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
      </div>
    </div>,
    document.body
  );
};
