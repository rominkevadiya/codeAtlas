import React, { useState } from 'react';
import {
  X, FolderGit2, Clock, CheckCircle2, AlertCircle,
  Loader2, Trash2, Plus, RefreshCw, ExternalLink, GitBranch
} from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';
import { RepositoryService, type Repository } from '../../services/api';

interface RepoPanelProps {
  onClose: () => void;
  onAddNew: () => void;
}

const StatusBadge = ({ status }: { status: Repository['status'] }) => {
  const map: Record<string, { label: string; color: string; icon: React.ReactNode }> = {
    READY: { label: 'Ready', color: 'text-emerald-400 bg-emerald-400/10 border-emerald-400/20', icon: <CheckCircle2 className="w-3 h-3" /> },
    PENDING: { label: 'Pending', color: 'text-amber-400 bg-amber-400/10 border-amber-400/20', icon: <Clock className="w-3 h-3" /> },
    PARSING: { label: 'Parsing', color: 'text-indigo-400 bg-indigo-400/10 border-indigo-400/20', icon: <Loader2 className="w-3 h-3 animate-spin" /> },
    EXTRACTING: { label: 'Extracting', color: 'text-blue-400 bg-blue-400/10 border-blue-400/20', icon: <Loader2 className="w-3 h-3 animate-spin" /> },
    BUILDING_GRAPH: { label: 'Building', color: 'text-purple-400 bg-purple-400/10 border-purple-400/20', icon: <Loader2 className="w-3 h-3 animate-spin" /> },
    FAILED: { label: 'Failed', color: 'text-rose-400 bg-rose-400/10 border-rose-400/20', icon: <AlertCircle className="w-3 h-3" /> },
  };
  const s = map[status] || map.PENDING;
  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold border ${s.color}`}>
      {s.icon} {s.label}
    </span>
  );
};

const getInitials = (name: string) => name.slice(0, 2).toUpperCase();

const REPO_COLORS = [
  'from-indigo-500 to-purple-600',
  'from-emerald-500 to-teal-600',
  'from-rose-500 to-pink-600',
  'from-amber-500 to-orange-600',
  'from-sky-500 to-blue-600',
];

const getRepoColor = (id: string) => {
  const charSum = id.split('').reduce((acc, c) => acc + c.charCodeAt(0), 0);
  return REPO_COLORS[charSum % REPO_COLORS.length];
};

export const RepoPanel: React.FC<RepoPanelProps> = ({ onClose, onAddNew }) => {
  const { userRepos, setUserRepos, repoId, switchRepo } = useAppStore();
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      const res = await RepositoryService.getRepositories();
      setUserRepos(res.data);
    } catch (err) {
      console.error('Failed to refresh repos:', err);
    } finally {
      setIsRefreshing(false);
    }
  };

  const handleDelete = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!confirm('Delete this repository? This cannot be undone.')) return;
    setDeletingId(id);
    try {
      await RepositoryService.deleteRepository(id);
      setUserRepos(userRepos.filter(r => r.id !== id));
    } catch (err) {
      console.error('Failed to delete repo:', err);
    } finally {
      setDeletingId(null);
    }
  };

  const handleSelect = (repo: Repository) => {
    if (repo.status !== 'READY') return;
    switchRepo(repo.id);
  };

  const isGitHub = (url: string) => url.startsWith('https://github.com') || url.startsWith('https://gitlab.com');

  return (
    <div className="h-full flex flex-col glass-card border border-white/10 rounded-2xl shadow-2xl overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between p-5 border-b border-white/5 bg-white/[0.02] shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-indigo-500/20 flex items-center justify-center">
            <FolderGit2 className="w-4 h-4 text-indigo-400" />
          </div>
          <div>
            <h2 className="text-base font-semibold text-white tracking-tight">My Repositories</h2>
            <p className="text-[11px] text-slate-400">{userRepos.length} repo{userRepos.length !== 1 ? 's' : ''} analysed</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors disabled:opacity-50"
            title="Refresh list"
          >
            <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
          </button>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Repo List */}
      <div className="flex-1 overflow-y-auto custom-scrollbar p-3 space-y-2">
        {userRepos.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full gap-4 py-12 text-center">
            <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center">
              <FolderGit2 className="w-8 h-8 text-slate-500" />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-300">No repositories yet</p>
              <p className="text-xs text-slate-500 mt-1">Add your first repo to get started</p>
            </div>
            <button
              onClick={onAddNew}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-500/20 text-indigo-400 border border-indigo-500/30 text-sm font-medium hover:bg-indigo-500/30 transition-colors"
            >
              <Plus className="w-4 h-4" /> Add Repository
            </button>
          </div>
        ) : (
          userRepos.map((repo) => {
            const isActive = repo.id === repoId;
            const isDeleting = deletingId === repo.id;
            const canOpen = repo.status === 'READY';

            return (
              <div
                key={repo.id}
                onClick={() => handleSelect(repo)}
                className={`group relative flex items-center gap-3 p-3.5 rounded-xl border transition-all duration-200 ${
                  isActive
                    ? 'bg-indigo-500/10 border-indigo-500/30 shadow-[0_0_20px_rgba(99,102,241,0.1)]'
                    : canOpen
                    ? 'bg-white/[0.02] border-white/5 hover:bg-white/[0.05] hover:border-white/10 cursor-pointer'
                    : 'bg-white/[0.01] border-white/5 cursor-default opacity-70'
                }`}
              >
                {/* Repo Icon */}
                <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${getRepoColor(repo.id)} flex items-center justify-center shrink-0 shadow-lg text-white font-bold text-xs`}>
                  {getInitials(repo.name)}
                </div>

                {/* Repo Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <p className="text-sm font-semibold text-white truncate">{repo.name}</p>
                    {isActive && (
                      <span className="text-[9px] font-bold text-indigo-400 uppercase tracking-wider bg-indigo-500/10 px-1.5 py-0.5 rounded-md border border-indigo-500/20">
                        Active
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <StatusBadge status={repo.status} />
                    {isGitHub(repo.url) && (
                      <span className="text-[10px] text-slate-500 flex items-center gap-1">
                        <GitBranch className="w-2.5 h-2.5" /> GitHub
                      </span>
                    )}
                    {!isGitHub(repo.url) && repo.url !== 'local://uploaded' && (
                      <span className="text-[10px] text-slate-500 flex items-center gap-1">
                        <GitBranch className="w-2.5 h-2.5" /> Local
                      </span>
                    )}
                  </div>
                  {repo.error_message && (
                    <p className="text-[10px] text-rose-400 mt-1 truncate">{repo.error_message}</p>
                  )}
                </div>

                {/* Actions */}
                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
                  {isGitHub(repo.url) && (
                    <a
                      href={repo.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(e) => e.stopPropagation()}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
                      title="Open on GitHub"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  )}
                  <button
                    onClick={(e) => handleDelete(repo.id, e)}
                    disabled={isDeleting}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition-colors disabled:opacity-50"
                    title="Delete repository"
                  >
                    {isDeleting ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Trash2 className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Footer - Add New */}
      <div className="p-3 border-t border-white/5 shrink-0">
        <button
          onClick={onAddNew}
          className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 text-slate-300 hover:text-white text-sm font-medium transition-all duration-200"
        >
          <Plus className="w-4 h-4" />
          Add New Repository
        </button>
      </div>
    </div>
  );
};
