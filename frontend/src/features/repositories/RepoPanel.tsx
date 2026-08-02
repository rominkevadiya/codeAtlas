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
    READY: { label: 'Ready', color: 'text-emerald-300 bg-emerald-950/30 border-emerald-900/50', icon: <CheckCircle2 className="w-3 h-3" /> },
    PENDING: { label: 'Pending', color: 'text-amber-300 bg-amber-950/30 border-amber-900/50', icon: <Clock className="w-3 h-3" /> },
    PARSING: { label: 'Parsing', color: 'text-slate-300 bg-slate-950/30 border-slate-800', icon: <Loader2 className="w-3 h-3 animate-spin" /> },
    EXTRACTING: { label: 'Extracting', color: 'text-blue-300 bg-blue-950/30 border-blue-900/50', icon: <Loader2 className="w-3 h-3 animate-spin" /> },
    BUILDING_GRAPH: { label: 'Building', color: 'text-violet-300 bg-violet-950/30 border-violet-900/50', icon: <Loader2 className="w-3 h-3 animate-spin" /> },
    FAILED: { label: 'Failed', color: 'text-rose-300 bg-rose-950/30 border-rose-900/50', icon: <AlertCircle className="w-3 h-3" /> },
 };
 const s = map[status] || map.PENDING;
 return (
  <span className={`inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[10px] font-semibold ${s.color}`}>
   {s.icon} {s.label}
  </span>
 );
};

const getInitials = (name: string) => name.slice(0, 2).toUpperCase();

const REPO_COLORS = [
 'bg-zinc-800 text-zinc-200',
 'bg-zinc-700 text-zinc-200',
 'bg-zinc-950 text-zinc-200 border border-zinc-800',
 'bg-zinc-900 text-zinc-200 border border-zinc-800',
];

const getRepoColor = (id: string) => {
 const charSum = id.split('').reduce((acc, c) => acc + c.charCodeAt(0), 0);
 return REPO_COLORS[charSum % REPO_COLORS.length];
};

export const RepoPanel: React.FC<RepoPanelProps> = ({ onClose, onAddNew }) => {
 const { userRepos, setUserRepos, repoId, switchRepo, clearActiveRepo } = useAppStore();
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
   if (id === repoId) {
    clearActiveRepo();
   }
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
    <div className="flex h-full flex-col overflow-hidden rounded-[24px] border border-zinc-800 bg-zinc-950 shadow-[0_24px_80px_rgba(0,0,0,0.35)]">
     <div className="flex shrink-0 items-center justify-between border-b border-zinc-800 bg-black p-5">
    <div className="flex items-center gap-3">
    <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-zinc-800 text-zinc-300 border border-zinc-700">
      <FolderGit2 className="h-5 w-5" />
     </div>
     <div>
    <h2 className="text-base font-semibold text-zinc-200">My repositories</h2>
    <p className="text-[11px] text-zinc-500">{userRepos.length} repository{userRepos.length !== 1 ? 'ies' : 'y'} tracked</p>
     </div>
    </div>
    <div className="flex items-center gap-2">
    <button onClick={handleRefresh} disabled={isRefreshing} className="rounded-xl p-1.5 text-zinc-400 transition hover:bg-zinc-800 hover:text-zinc-200 disabled:opacity-50" title="Refresh list">
      <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
     </button>
    <button onClick={onClose} className="rounded-xl p-1.5 text-zinc-400 transition hover:bg-zinc-800 hover:text-zinc-200">
      <X className="h-4 w-4" />
     </button>
    </div>
   </div>

    <div className="flex-1 space-y-2 overflow-y-auto p-3">
    {userRepos.length === 0 ? (
     <div className="flex h-full flex-col items-center justify-center gap-4 py-12 text-center">
    <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-zinc-900 text-zinc-500">
       <FolderGit2 className="h-8 w-8" />
      </div>
      <div>
    <p className="text-sm font-semibold text-zinc-200">No repositories yet</p>
    <p className="mt-1 text-xs text-zinc-500">Add your first repo to get started</p>
      </div>
    <button onClick={onAddNew} className="flex items-center gap-2 rounded-2xl border border-zinc-800 bg-zinc-900 px-4 py-2 text-sm font-semibold text-zinc-200 transition hover:bg-black hover:text-zinc-200">
       <Plus className="h-4 w-4" /> Add repository
      </button>
     </div>
    ) : (
     userRepos.map((repo) => {
      const isActive = repo.id === repoId;
      const isDeleting = deletingId === repo.id;
      const canOpen = repo.status === 'READY';

      return (
    <div key={repo.id} onClick={() => handleSelect(repo)} className={`group relative flex items-center gap-3 rounded-[18px] border p-3.5 transition-all duration-200 ${isActive ? 'border-zinc-400 bg-zinc-900 shadow-sm' : canOpen ? 'border-transparent bg-transparent hover:border-zinc-800 hover:bg-zinc-900 cursor-pointer' : 'border-transparent cursor-default opacity-60'}`}>
        <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl ${getRepoColor(repo.id)} font-bold text-xs`}>
         {getInitials(repo.name)}
        </div>

        <div className="min-w-0 flex-1">
         <div className="mb-1 flex items-center gap-2">
          <p className="truncate text-sm font-semibold text-zinc-200">{repo.name}</p>
          {isActive && <span className="rounded-full bg-zinc-200 px-1.5 py-0.5 text-[9px] font-semibold uppercase tracking-[0.2em] text-zinc-300">Active</span>}
         </div>
         <div className="flex items-center gap-2">
          <StatusBadge status={repo.status} />
          {isGitHub(repo.url) && <span className="flex items-center gap-1 text-[10px] text-zinc-500"><GitBranch className="h-2.5 w-2.5" /> GitHub</span>}
          {!isGitHub(repo.url) && repo.url !== 'local://uploaded' && <span className="flex items-center gap-1 text-[10px] text-zinc-500"><GitBranch className="h-2.5 w-2.5" /> Local</span>}
         </div>
         {repo.error_message && <p className="mt-1 truncate text-[10px] text-rose-400">{repo.error_message}</p>}
        </div>

        <div className="flex shrink-0 items-center gap-1 opacity-0 transition-opacity group-hover:opacity-100">
         {isGitHub(repo.url) && (
           <a href={repo.url} target="_blank" rel="noopener noreferrer" onClick={(e) => e.stopPropagation()} className="rounded-xl p-1.5 text-zinc-400 transition hover:bg-zinc-800 hover:text-zinc-200" title="Open on GitHub">
           <ExternalLink className="h-3.5 w-3.5" />
          </a>
         )}
         <button onClick={(e) => handleDelete(repo.id, e)} disabled={isDeleting} className="rounded-xl p-1.5 text-zinc-400 transition hover:bg-rose-950/30 hover:text-rose-300 disabled:opacity-50" title="Delete repository">
          {isDeleting ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Trash2 className="h-3.5 w-3.5" />}
         </button>
        </div>
       </div>
      );
     })
    )}
   </div>

    <div className="shrink-0 border-t border-zinc-800 p-3">
     <button onClick={onAddNew} className="flex w-full items-center justify-center gap-2 rounded-2xl bg-zinc-800 border border-zinc-700 px-4 py-2.5 text-sm font-semibold text-zinc-300 transition hover:bg-zinc-700 hover:text-zinc-200">
     <Plus className="h-4 w-4" /> Add new repository
    </button>
   </div>
  </div>
 );
};
