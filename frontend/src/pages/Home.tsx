import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { RepositoryService } from '../services/api';
import { Loader2, GitFork } from 'lucide-react';

interface Repository {
  id: string;
  name: string;
  created_at: string;
}

export const Home = () => {
  const [file, setFile] = useState<File | null>(null);
  const [repoName, setRepoName] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState('');
  const navigate = useNavigate();

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

    try {
      const response = await RepositoryService.uploadRepository(repoName, file);
      const repoId = response.data.id;
      navigate(`/repository/${repoId}`);
    } catch (err: any) {
      console.error(err);
      setUploadError(err.response?.data?.error || 'Failed to upload repository');
    } finally {
      setIsUploading(false);
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
                      <span className="font-medium text-sm text-slate-800 dark:text-slate-200 truncate">
                        {repo.name}
                      </span>
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
            {uploadError && <p className="text-red-500 text-sm">{uploadError}</p>}
            <button
              type="submit"
              disabled={isUploading || !file || !repoName}
              className="bg-blue-600 text-white px-4 py-2 rounded-md font-medium hover:bg-blue-700 transition-colors disabled:opacity-50 mt-2 flex items-center justify-center gap-2"
            >
              {isUploading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Uploading & Parsing...
                </>
              ) : (
                'Upload & Extract'
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
