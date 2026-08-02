import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { RepositoryService, type Repository } from '../services/api';
import { Loader2, GitFork, AlertCircle } from 'lucide-react';

export const Home = () => {
 const [file, setFile] = useState<File | null>(null);
 const [repoName, setRepoName] = useState('');
 const [isUploading, setIsUploading] = useState(false);
 const [uploadError, setUploadError] = useState('');
 const navigate = useNavigate();

 // Real-time processing progress state
 const [progressState, setProgressState] = useState<{
  repoId: string | null;
  status: string;
  progress: number;
  message: string;
 }>({
  repoId: null,
  status: '',
  progress: 0,
  message: '',
 });

 const [repos, setRepos] = useState<Repository[]>([]);
 const [reposLoading, setReposLoading] = useState(true);

 // Load existing repositories on mount
 useEffect(() => {
  RepositoryService.getRepositories()
   .then((res) => setRepos(res.data))
   .catch(() => setRepos([]))
   .finally(() => setReposLoading(false));
 }, []);

 const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  if (e.target.files && e.target.files.length > 0) {
   setFile(e.target.files[0]);
  }
 };

 const handleUpload = async (e: React.FormEvent) => {
  e.preventDefault();
  if (!file || !repoName) {
   setUploadError('Please provide a repository name and select a zip file.');
   return;
  }

  setIsUploading(true);
  setUploadError('');
  setProgressState({ repoId: null, status: 'UPLOADING', progress: 10, message: 'Uploading archive...' });

  try {
   const response = await RepositoryService.uploadRepository(repoName, file);
   const repoId = response.data.id;

   setProgressState({
    repoId,
    status: response.data.status || 'PENDING',
    progress: 20,
    message: 'Uploaded archive. Connecting to progress stream...',
   });

   // Connect WebSocket for real-time progress updates
   const wsProtocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
   const wsHost = window.location.hostname || 'localhost';
   const wsUrl = `${wsProtocol}//${wsHost}:8000/ws/repositories/${repoId}/progress/`;

   const ws = new WebSocket(wsUrl);

   ws.onmessage = (event) => {
    try {
     const data = JSON.parse(event.data);
     setProgressState({
      repoId,
      status: data.status,
      progress: data.progress || 0,
      message: data.message || '',
     });

     if (data.status === 'READY') {
      ws.close();
      setTimeout(() => {
       navigate(`/repository/${repoId}`);
      }, 800);
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
    // Fallback: poll or navigate directly
    setTimeout(() => navigate(`/repository/${repoId}`), 2000);
   };

  } catch (err: any) {
   console.error(err);
   setUploadError(err.response?.data?.error || 'Failed to upload repository');
   setIsUploading(false);
  }
 };

 const getStatusBadge = (status: string) => {
  switch (status) {
   case 'READY':
    return <span className="text-xs px-2 py-0.5 rounded bg-emerald-100 text-emerald-700 font-medium">Ready</span>;
   case 'FAILED':
    return <span className="text-xs px-2 py-0.5 rounded bg-red-100 text-red-700 font-medium">Failed</span>;
   default:
    return <span className="text-xs px-2 py-0.5 rounded bg-amber-100 text-amber-700 font-medium animate-pulse">{status || 'Processing'}</span>;
  }
 };

 return (
  <div className="flex flex-col items-center justify-start min-h-[60vh] space-y-10 pt-10 pb-16 px-4 max-w-4xl mx-auto">
   {/* Hero */}
   <div className="text-center space-y-4 max-w-2xl">
    <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-zinc-900 ">
     Understand Codebases <br className="hidden md:block" /> at a Glance.
    </h1>
    <p className="text-xl text-zinc-600 ">
     Parse your repositories, visualize architectures with interactive graphs, and ask AI natural language questions about your code.
    </p>
   </div>

   <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
    {/* Repository List */}
    <div className="border border-zinc-200 rounded-xl p-6 bg-zinc-950 shadow-sm flex flex-col gap-4">
     <h2 className="text-xl font-bold">My Repositories</h2>
     <p className="text-zinc-500 text-sm">
      Your previously uploaded and parsed codebases.
     </p>

     {reposLoading ? (
      <div className="flex items-center gap-2 text-zinc-400 text-sm py-4">
       <Loader2 className="w-4 h-4 animate-spin" />
       Loading repositories...
      </div>
     ) : repos.length === 0 ? (
      <p className="text-zinc-400 text-sm py-4 italic">
       No repositories yet. Upload one to get started!
      </p>
     ) : (
      <ul className="flex flex-col gap-2">
       {repos.map((repo) => (
        <li key={repo.id}>
         <Link
          to={`/repository/${repo.id}`}
          className="flex items-center gap-3 p-3 rounded-lg border border-zinc-100 hover:border-blue-300 :border-blue-700 hover:bg-zinc-900 :bg-blue-950/20 transition-all group"
         >
          <GitFork className="w-4 h-4 text-zinc-400 group-hover:text-blue-500 transition-colors shrink-0" />
          <div className="flex flex-col overflow-hidden">
           <div className="flex items-center gap-2">
            <span className="font-medium text-sm text-zinc-800 truncate">
             {repo.name}
            </span>
            {getStatusBadge(repo.status)}
           </div>
           <span className="text-xs text-zinc-400 truncate">
            {new Date(repo.created_at).toLocaleDateString()}
           </span>
          </div>
          <span className="ml-auto text-xs text-blue-500 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
           Explore →
          </span>
         </Link>
        </li>
       ))}
      </ul>
     )}
    </div>

    {/* Upload Form */}
    <div className="border border-zinc-200 rounded-xl p-6 bg-zinc-950 shadow-sm hover:shadow-md transition-shadow">
     <h2 className="text-xl font-bold mb-2">Add New Repository</h2>
     <p className="text-zinc-500 mb-4 text-sm">
      Upload a Repository ZIP to begin extracting ASTs and building the knowledge graph.
      Max file size: <strong>50MB</strong>.
     </p>

     {isUploading ? (
      <div className="py-6 flex flex-col gap-4">
       <div className="flex items-center justify-between text-sm font-medium">
        <span className="flex items-center gap-2 text-zinc-700 ">
         <Loader2 className="w-4 h-4 animate-spin text-blue-500" />
         {progressState.message || 'Processing repository...'}
        </span>
        <span className="text-white font-bold">{progressState.progress}%</span>
       </div>

       {/* Progress Bar Container */}
       <div className="w-full bg-zinc-100 rounded-full h-2.5 overflow-hidden">
        <div
         className="bg-white h-2.5 rounded-full transition-all duration-500 ease-out"
         style={{ width: `${progressState.progress}%` }}
        />
       </div>

       <div className="flex justify-between text-xs text-zinc-400">
        <span>Upload</span>
        <span>Extract</span>
        <span>Parse AST</span>
        <span>Graph</span>
       </div>
      </div>
     ) : (
      <form onSubmit={handleUpload} className="space-y-3 flex flex-col">
       <input
        type="text"
        placeholder="Repository Name"
        className="px-3 py-2 border border-zinc-300 rounded-md bg-transparent text-sm"
        value={repoName}
        onChange={(e) => setRepoName(e.target.value)}
        disabled={isUploading}
       />
       <input
        type="file"
        accept=".zip"
        className="text-sm text-zinc-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-zinc-900 file:text-zinc-200 hover:file:bg-zinc-800 :bg-zinc-800 :text-blue-400"
        onChange={handleFileChange}
        disabled={isUploading}
       />
       {uploadError && (
        <div className="flex items-center gap-2 text-red-500 text-sm bg-red-50 /40 p-2.5 rounded-md border border-red-200 ">
         <AlertCircle className="w-4 h-4 shrink-0" />
         <span>{uploadError}</span>
        </div>
       )}
       <button
        type="submit"
        disabled={isUploading || !file || !repoName}
        className="bg-white text-black px-4 py-2 rounded-md font-medium hover:bg-zinc-200 transition-colors disabled:opacity-50 mt-2 flex items-center justify-center gap-2"
       >
        Upload & Extract
       </button>
      </form>
     )}
    </div>
   </div>
  </div>
 );
};
