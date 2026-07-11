import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { RepositoryService } from '../services/api';

export const Home = () => {
  const [file, setFile] = useState<File | null>(null);
  const [repoName, setRepoName] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
    }
  };

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file || !repoName) {
      setError('Please provide a repository name and select a zip file.');
      return;
    }
    
    setIsUploading(true);
    setError('');
    
    try {
      const response = await RepositoryService.uploadRepository(repoName, file);
      const repoId = response.data.id;
      // Navigate to the repository detail view after successful upload
      navigate(`/repository/${repoId}`);
    } catch (err: any) {
      console.error(err);
      setError(err.response?.data?.error || 'Failed to upload repository');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-8">
      <div className="text-center space-y-4 max-w-2xl">
        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-slate-900 dark:text-white">
          Understand Codebases <br className="hidden md:block"/> at a Glance.
        </h1>
        <p className="text-xl text-slate-600 dark:text-slate-400">
          Parse your repositories, visualize architectures with interactive graphs, and ask AI natural language questions about your code.
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-4xl mt-8">
        <div className="border border-slate-200 dark:border-slate-800 rounded-xl p-6 bg-white dark:bg-slate-900 shadow-sm hover:shadow-md transition-shadow">
          <h2 className="text-xl font-bold mb-2">My Repositories</h2>
          <p className="text-slate-500 dark:text-slate-400 mb-4">
            Manage your parsed repositories and explore existing graphs.
          </p>
          <Link to="/repository/demo-id" className="text-blue-600 dark:text-blue-400 font-medium hover:underline">
            View Example Repo &rarr;
          </Link>
        </div>
        <div className="border border-slate-200 dark:border-slate-800 rounded-xl p-6 bg-white dark:bg-slate-900 shadow-sm hover:shadow-md transition-shadow">
          <h2 className="text-xl font-bold mb-2">Add New Repository</h2>
          <p className="text-slate-500 dark:text-slate-400 mb-4">
            Upload a Repository ZIP to begin extracting ASTs and building the knowledge graph.
          </p>
          <form onSubmit={handleUpload} className="space-y-3 flex flex-col">
            <input 
              type="text" 
              placeholder="Repository Name" 
              className="px-3 py-2 border border-slate-300 dark:border-slate-700 rounded-md bg-transparent"
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
            {error && <p className="text-red-500 text-sm">{error}</p>}
            <button 
              type="submit" 
              disabled={isUploading || !file || !repoName}
              className="bg-blue-600 text-white px-4 py-2 rounded-md font-medium hover:bg-blue-700 transition-colors disabled:opacity-50 mt-2"
            >
              {isUploading ? 'Uploading...' : 'Upload & Extract'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
