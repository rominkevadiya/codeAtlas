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
        return <span className="text-xs px-2 py-0.5 rounded bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 font-medium">Ready</span>;
      case 'FAILED':
        return <span className="text-xs px-2 py-0.5 rounded bg-red-100 dark:bg-red-950 text-red-700 dark:text-red-300 font-medium">Failed</span>;
      default:
        return <span className="text-xs px-2 py-0.5 rounded bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300 font-medium animate-pulse">{status || 'Processing'}</span>;
    }
  };

  return (
    <div className="flex flex-col items-center justify-start min-h-[60vh] space-y-10 pt-10 pb-16 px-4 max-w-4xl mx-auto">
      {/* Hero */}
      <div className="text-center space-y-4 max-w-2xl">
        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-slate-900 dark:text-white">
          Understand Codebases <br className="hidden md:block" /> at a Glance.
        </h1>
        <p className="text-xl text-slate-600 dark:text-slate-400">
          Parse your repositories, visualize architectures with interactive graphs, and ask AI natural language questions about your code.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
        {/* Repository List */}
        <div className="border border-slate-200 dark:border-slate-800 rounded-xl p-6 bg-white dark:bg-slate-900 shadow-sm flex flex-col gap-4">
          <h2 className="text-xl font-bold">My Repositories</h2>
          <p className="text-slate-500 dark:text-slate-400 text-sm">
            Your previously uploaded and parsed codebases.
          </p>

          {reposLoading ? (
            <div className="flex items-center gap-2 text-slate-400 text-sm py-4">
              <Loader2 className="w-4 h-4 animate-spin" />
              Loading repositories...
            </div>
          ) : repos.length === 0 ? (
            <p className="text-slate-400 text-sm py-4 italic">
              No repositories yet. Upload one to get started!
            </p>
          ) : (
            <ul className="flex flex-col gap-2">
              {repos.map((repo) => (
                <li key={repo.id}>
                  <Link
                    to={`/repository/${repo.id}`}
                    className="flex items-center gap-3 p-3 rounded-lg border border-slate-100 dark:border-slate-800 hover:border-blue-300 dark:hover:border-blue-700 hover:bg-blue-50 dark:hover:bg-blue-950/20 transition-all group"
                  >
                    <GitFork className="w-4 h-4 text-slate-400 group-hover:text-blue-500 transition-colors shrink-0" />
                    <div className="flex flex-col overflow-hidden">
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-sm text-slate-800 dark:text-slate-200 truncate">
                          {repo.name}
                        </span>
                        {getStatusBadge(repo.status)}
                      </div>
                      <span className="text-xs text-slate-400 truncate">
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
        <div className="border border-slate-200 dark:border-slate-800 rounded-xl p-6 bg-white dark:bg-slate-900 shadow-sm hover:shadow-md transition-shadow">
          <h2 className="text-xl font-bold mb-2">Add New Repository</h2>
          <p className="text-slate-500 dark:text-slate-400 mb-4 text-sm">
            Upload a Repository ZIP to begin extracting ASTs and building the knowledge graph.
            Max file size: <strong>50MB</strong>.
          </p>

          {isUploading ? (
            <div className="py-6 flex flex-col gap-4">
              <div className="flex items-center justify-between text-sm font-medium">
                <span className="flex items-center gap-2 text-slate-700 dark:text-slate-200">
                  <Loader2 className="w-4 h-4 animate-spin text-blue-500" />
                  {progressState.message || 'Processing repository...'}
                </span>
                <span className="text-blue-600 font-bold">{progressState.progress}%</span>
              </div>

              {/* Progress Bar Container */}
              <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-2.5 overflow-hidden">
                <div
                  className="bg-blue-600 h-2.5 rounded-full transition-all duration-500 ease-out"
                  style={{ width: `${progressState.progress}%` }}
                />
              </div>

              <div className="flex justify-between text-xs text-slate-400">
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
                className="px-3 py-2 border border-slate-300 dark:border-slate-700 rounded-md bg-transparent text-sm"
                value={repoName}
                onChange={(e) => setRepoName(e.target.value)}
                disabled={isUploading}
              />
              <input
                type="file"
                accept=".zip"
                className="text-sm text-slate-500 dark:text-slate-400 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 dark:file:bg-slate-800 dark:file:text-blue-400"
                onChange={handleFileChange}
                disabled={isUploading}
              />
              {uploadError && (
                <div className="flex items-center gap-2 text-red-500 text-sm bg-red-50 dark:bg-red-950/40 p-2.5 rounded-md border border-red-200 dark:border-red-900">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{uploadError}</span>
                </div>
              )}
              <button
                type="submit"
                disabled={isUploading || !file || !repoName}
                className="bg-blue-600 text-white px-4 py-2 rounded-md font-medium hover:bg-blue-700 transition-colors disabled:opacity-50 mt-2 flex items-center justify-center gap-2"
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
