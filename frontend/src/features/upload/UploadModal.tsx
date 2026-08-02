import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { X, UploadCloud, FileArchive, Loader2, AlertCircle, GitBranch } from 'lucide-react';
import { RepositoryService } from '../../services/api';

interface UploadModalProps {
 onClose: () => void;
 onUploadComplete: (repoId: string) => void;
}

export const UploadModal = React.forwardRef<HTMLDivElement, UploadModalProps>(({ onClose, onUploadComplete }, ref) => {
 const [file, setFile] = useState<File | null>(null);
 const [repoName, setRepoName] = useState('');
 const [githubUrl, setGithubUrl] = useState('');
 const [uploadMode, setUploadMode] = useState<'zip' | 'github'>('github');
 const [isUploading, setIsUploading] = useState(false);
 const [uploadError, setUploadError] = useState('');

 const [progressState, setProgressState] = useState({ status: '', progress: 0, message: '' });

 const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  if (e.target.files && e.target.files.length > 0) {
   setFile(e.target.files[0]);
  }
 };

 const _connectWebSocket = (repoId: string) => {
  const wsProtocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
  const wsHost = window.location.hostname || 'localhost';
  const token = localStorage.getItem('access_token') || '';
  const ws = new WebSocket(`${wsProtocol}//${wsHost}:8000/ws/repositories/${repoId}/progress/?token=${token}`);

  ws.onmessage = (event) => {
   try {
    const data = JSON.parse(event.data);
    setProgressState({ status: data.status, progress: data.progress || 0, message: data.message || '' });

    if (data.status === 'READY') {
     ws.close();
     setTimeout(() => { onUploadComplete(repoId); }, 800);
    } else if (data.status === 'FAILED') {
     ws.close();
     setUploadError(data.error || 'Processing failed.');
     setIsUploading(false);
    }
   } catch (err) {
    console.error('Error parsing WebSocket message:', err);
   }
  };

  ws.onerror = (err) => {
   console.error('WebSocket error:', err);
   setUploadError('Connection to progress stream failed.');
   setIsUploading(false);
  };

  ws.onclose = () => {
   setProgressState(prev => {
    if (prev.status !== 'READY' && prev.status !== 'FAILED') {
     setUploadError('WebSocket connection closed unexpectedly.');
     setIsUploading(false);
     return { ...prev, status: 'FAILED' };
    }
    return prev;
   });
  };
 };

 const handleUpload = async (e: React.FormEvent) => {
  e.preventDefault();

  if (uploadMode === 'zip' && (!file || !repoName)) {
   setUploadError('Please provide a repository name and select a zip file.');
   return;
  }

  if (uploadMode === 'github' && !githubUrl) {
   setUploadError('Please provide a GitHub URL.');
   return;
  }

  setIsUploading(true);
  setUploadError('');
  setProgressState({ status: 'UPLOADING', progress: 12, message: uploadMode === 'zip' ? 'Preparing archive for analysis...' : 'Preparing repository import...' });

  try {
   const response = uploadMode === 'zip' 
     ? await RepositoryService.uploadRepository(repoName, file!) 
     : await RepositoryService.importGithub(githubUrl);

   const repoId = response.data.id;

   setProgressState({
    status: response.data.status || 'PENDING',
    progress: 24,
    message: uploadMode === 'zip' ? 'Archive received. Waiting for processing...' : 'Import request accepted. Waiting for processing...',
   });

   // Connect to progress stream
   _connectWebSocket(repoId);

  } catch (err: any) {
   console.error(err);
   setUploadError(err.response?.data?.error || 'Failed to process repository');
   setIsUploading(false);
  }
 };

 return (
   <motion.div
    ref={ref}
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm"
   >
     <motion.div 
      initial={{ scale: 0.95, opacity: 0, y: 20 }}
      animate={{ scale: 1, opacity: 1, y: 0 }}
      exit={{ scale: 0.95, opacity: 0, y: 20 }}
      transition={{ type: 'spring', damping: 25, stiffness: 300 }}
      className="w-full max-w-md overflow-hidden rounded-[28px] border border-zinc-800 bg-zinc-950 shadow-[0_24px_80px_rgba(0,0,0,0.35)]"
     >
        <div className="flex items-center justify-between border-b border-zinc-800 bg-black p-5">
     <div className="flex items-center gap-3">
    <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-zinc-800 text-zinc-300 border border-zinc-700">
       <UploadCloud className="h-5 w-5" />
      </div>
      <motion.div>
             <h2 className="text-base font-semibold text-zinc-200">Add repository</h2>
             <p className="text-xs text-zinc-500">Import public code or upload a ZIP</p>
      </motion.div>
     </div>
     {!isUploading && (
            <button onClick={onClose} className="rounded-xl p-2 text-zinc-400 transition hover:bg-zinc-800 hover:text-zinc-200">
       <X className="h-4 w-4" />
      </button>
     )}
    </div>

    <div className="p-6">
     {isUploading ? (
      <div className="flex flex-col items-center justify-center gap-6 py-8">
    <div className="relative flex h-16 w-16 items-center justify-center rounded-full bg-zinc-200/10">
     <Loader2 className="absolute h-8 w-8 animate-spin text-zinc-200" />
     <FileArchive className="h-5 w-5 text-zinc-200" />
       </div>
       <div className="w-full space-y-3 text-center">
        <div className="flex items-center justify-between px-1 text-xs font-semibold uppercase tracking-[0.2em] text-zinc-500">
         <span>{progressState.message || 'Processing repository...'}</span>
         <span className="text-zinc-200">{progressState.progress}%</span>
        </div>
        <div className="h-2 w-full overflow-hidden rounded-full bg-zinc-800">
         <div className="h-full rounded-full bg-zinc-200 transition-all duration-300" style={{ width: `${Math.max(12, progressState.progress)}%` }} />
        </div>
       </div>
      </div>
     ) : (
      <form onSubmit={handleUpload} className="space-y-5">
    <div className="flex rounded-2xl border border-zinc-800 bg-black p-1">
     <button type="button" onClick={() => setUploadMode('github')} className={`flex-1 rounded-xl px-3 py-2 text-sm font-medium transition ${uploadMode === 'github' ? 'bg-zinc-950 text-zinc-200 shadow-sm' : 'text-zinc-400'}`}>
         <div className="flex items-center justify-center gap-2"><GitBranch className="h-4 w-4" /> GitHub / GitLab</div>
        </button>
        <button type="button" onClick={() => setUploadMode('zip')} className={`flex-1 rounded-xl px-3 py-2 text-sm font-medium transition ${uploadMode === 'zip' ? 'bg-zinc-950 text-zinc-200 shadow-sm' : 'text-zinc-400'}`}>
         <div className="flex items-center justify-center gap-2"><FileArchive className="h-4 w-4" /> ZIP archive</div>
        </button>
       </div>

       {uploadMode === 'github' ? (
        <div className="space-y-2">
         <label className="block text-xs font-semibold uppercase tracking-[0.2em] text-zinc-500">Repository URL</label>
         <input type="url" placeholder="https://github.com/user/repo" value={githubUrl} onChange={(e) => setGithubUrl(e.target.value)} className="w-full rounded-2xl border border-zinc-800 bg-zinc-900 px-4 py-3 text-sm text-zinc-200 outline-none transition focus:border-zinc-400" />
         <p className="text-xs text-zinc-500">Public repositories only. Example: https://github.com/facebook/react</p>
        </div>
       ) : (
        <div className="space-y-4">
         <div>
          <label className="mb-2 block text-xs font-semibold uppercase tracking-[0.2em] text-zinc-500">Repository name</label>
          <input type="text" placeholder="CodeAtlas Core" value={repoName} onChange={(e) => setRepoName(e.target.value)} className="w-full rounded-2xl border border-zinc-800 bg-zinc-900 px-4 py-3 text-sm text-zinc-200 outline-none transition focus:border-zinc-400" />
         </div>
         <div>
          <label className="mb-2 block text-xs font-semibold uppercase tracking-[0.2em] text-zinc-500">Archive (.zip)</label>
          <div className="relative cursor-pointer">
           <input type="file" accept=".zip" onChange={handleFileChange} className="absolute inset-0 h-full w-full cursor-pointer opacity-0" />
           <div className={`rounded-[20px] border-2 border-dashed p-6 text-center transition ${file ? 'border-zinc-400 bg-zinc-200/10' : 'border-zinc-800 bg-zinc-900 hover:border-zinc-400'}`}>
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-zinc-800 text-zinc-300 border border-zinc-700 shadow-sm">
             <FileArchive className="h-5 w-5" />
            </div>
            <p className="mt-4 text-sm font-semibold text-zinc-200">{file ? file.name : 'Click or drag a ZIP file here'}</p>
            <p className="mt-2 text-xs text-zinc-500">{file ? `${(file.size / (1024 * 1024)).toFixed(2)} MB` : 'Maximum file size: 50MB'}</p>
           </div>
          </div>
         </div>
        </div>
       )}

       {uploadError && (
        <div className="flex items-start gap-2 rounded-2xl border border-rose-900/50 bg-rose-950/30 p-3 text-sm text-rose-300">
         <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
         <span>{uploadError}</span>
        </div>
       )}

    <button type="submit" disabled={(uploadMode === 'zip' && (!file || !repoName)) || (uploadMode === 'github' && !githubUrl)} className="flex w-full items-center justify-center gap-2 rounded-2xl bg-zinc-800 border border-zinc-700 px-4 py-3 text-sm font-semibold text-zinc-300 transition hover:bg-zinc-700 hover:text-zinc-200 disabled:cursor-not-allowed disabled:opacity-70">
        {uploadMode === 'zip' ? 'Upload & Process' : 'Import & Process'}
       </button>
      </form>
     )}
     </div>
    </motion.div>
   </motion.div>
  );
});
