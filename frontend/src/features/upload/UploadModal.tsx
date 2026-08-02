import React, { useState } from 'react';
import { X, UploadCloud, FileArchive, Loader2, AlertCircle, GitBranch } from 'lucide-react';
import { RepositoryService } from '../../services/api';

interface UploadModalProps {
  onClose: () => void;
  onUploadComplete: (repoId: string) => void;
}

export const UploadModal = ({ onClose, onUploadComplete }: UploadModalProps) => {
  const [file, setFile] = useState<File | null>(null);
  const [repoName, setRepoName] = useState('');
  const [githubUrl, setGithubUrl] = useState('');
  const [uploadMode, setUploadMode] = useState<'zip' | 'github'>('github');
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState('');
  
  const [progressState, setProgressState] = useState({
    status: '',
    progress: 0,
    message: ''
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
    }
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
    setProgressState({ status: 'UPLOADING', progress: 10, message: uploadMode === 'zip' ? 'Uploading archive...' : 'Initiating import...' });

    try {
      let response;
      if (uploadMode === 'zip') {
        response = await RepositoryService.uploadRepository(repoName, file!);
      } else {
        response = await RepositoryService.importGithub(githubUrl);
      }
      
      const repoId = response.data.id;

      setProgressState({
        status: response.data.status || 'PENDING',
        progress: 20,
        message: uploadMode === 'zip' ? 'Uploaded archive. Connecting to progress stream...' : 'Import started. Connecting to progress stream...',
      });

      const wsProtocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
      const wsHost = window.location.hostname || 'localhost';
      const token = localStorage.getItem('access_token') || '';
      const wsUrl = `${wsProtocol}//${wsHost}:8000/ws/repositories/${repoId}/progress/?token=${token}`;

      const ws = new WebSocket(wsUrl);

      ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          setProgressState({
            status: data.status,
            progress: data.progress || 0,
            message: data.message || '',
          });

          if (data.status === 'READY') {
            ws.close();
            setTimeout(() => {
              onUploadComplete(repoId);
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

    } catch (err: any) {
      console.error(err);
      setUploadError(err.response?.data?.error || 'Failed to process repository');
      setIsUploading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-300">
      <div className="w-full max-w-md bg-[#0a0a0f] border border-white/10 rounded-2xl shadow-sm overflow-hidden">
        
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-white/5 bg-white/5">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-indigo-500/20 flex items-center justify-center">
              <UploadCloud className="w-4 h-4 text-indigo-400" />
            </div>
            <div>
              <h2 className="text-base font-semibold text-white tracking-tight">Add Repository</h2>
              <p className="text-[11px] text-slate-400 font-medium">Import or upload codebase</p>
            </div>
          </div>
          {!isUploading && (
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Content */}
        <div className="p-6">
          {isUploading ? (
            <div className="py-8 flex flex-col items-center justify-center gap-6">
              <div className="relative flex items-center justify-center w-16 h-16 rounded-full bg-indigo-500/10">
                <Loader2 className="w-8 h-8 text-indigo-500 animate-spin absolute" />
                <FileArchive className="w-4 h-4 text-indigo-400" />
              </div>
              
              <div className="w-full space-y-2 text-center">
                <div className="flex justify-between items-center text-xs font-semibold px-1">
                  <span className="text-slate-300">{progressState.message || 'Processing...'}</span>
                  <span className="text-indigo-400">{progressState.progress}%</span>
                </div>
                <div className="w-full bg-zinc-900 rounded-full h-1.5 mb-2 overflow-hidden">
                  <div 
                    className="h-full bg-white rounded-full transition-all duration-300"
                    style={{ width: `${Math.max(5, progressState.progress)}%` }}
                  />
                </div>
              </div>
            </div>
          ) : (
            <form onSubmit={handleUpload} className="space-y-5">
              
              {/* Mode Toggle */}
              <div className="flex bg-[#111115] rounded-xl p-1 border border-white/5">
                <button
                  type="button"
                  onClick={() => setUploadMode('github')}
                  className={`flex-1 flex items-center justify-center gap-2 py-2 text-xs font-medium rounded-lg transition-colors ${uploadMode === 'github' ? 'bg-indigo-500/20 text-indigo-400' : 'text-slate-400 hover:text-slate-300'}`}
                >
                  <GitBranch className="w-4 h-4" />
                  GitHub URL
                </button>
                <button
                  type="button"
                  onClick={() => setUploadMode('zip')}
                  className={`flex-1 flex items-center justify-center gap-2 py-2 text-xs font-medium rounded-lg transition-colors ${uploadMode === 'zip' ? 'bg-indigo-500/20 text-indigo-400' : 'text-slate-400 hover:text-slate-300'}`}
                >
                  <FileArchive className="w-4 h-4" />
                  ZIP Archive
                </button>
              </div>

              {uploadMode === 'github' ? (
                <div className="space-y-1.5 animate-in slide-in-from-right-4 duration-300">
                  <label className="text-xs font-medium text-slate-400 uppercase tracking-wide px-1">GitHub / GitLab URL</label>
                  <input
                    type="url"
                    placeholder="https://github.com/user/repo"
                    value={githubUrl}
                    onChange={(e) => setGithubUrl(e.target.value)}
                    className="w-full bg-[#111115] border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-white/10 focus:ring-1 focus:ring-indigo-500/50 transition-all placeholder:text-slate-600"
                  />
                  <p className="text-[10px] text-slate-500 px-1 mt-1">
                    Public repositories only. Example: https://github.com/facebook/react
                  </p>
                </div>
              ) : (
                <div className="space-y-5 animate-in slide-in-from-left-4 duration-300">
                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-slate-400 uppercase tracking-wide px-1">Repository Name</label>
                    <input
                      type="text"
                      placeholder="e.g., CodeAtlas Core"
                      value={repoName}
                      onChange={(e) => setRepoName(e.target.value)}
                      className="w-full bg-[#111115] border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-white/10 focus:ring-1 focus:ring-indigo-500/50 transition-all placeholder:text-slate-600"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-slate-400 uppercase tracking-wide px-1">Archive (.zip)</label>
                    <div className="relative group cursor-pointer">
                      <input
                        type="file"
                        accept=".zip"
                        onChange={handleFileChange}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                      />
                      <div className={`w-full border-2 border-dashed rounded-xl p-6 flex flex-col items-center justify-center gap-3 transition-colors ${file ? 'border-white/10 bg-indigo-500/5' : 'border-white/10 bg-[#111115] group-hover:border-white/20 group-hover:bg-white/5'}`}>
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${file ? 'bg-indigo-500/20' : 'bg-white/5'}`}>
                          <FileArchive className={`w-5 h-5 ${file ? 'text-indigo-400' : 'text-slate-400'}`} />
                        </div>
                        <div className="text-center">
                          <p className="text-sm font-medium text-slate-200">
                            {file ? file.name : 'Click or drag ZIP file here'}
                          </p>
                          <p className="text-xs text-slate-500 mt-1">
                            {file ? `${(file.size / (1024 * 1024)).toFixed(2)} MB` : 'Maximum file size: 50MB'}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {uploadError && (
                <div className="flex items-start gap-2 p-3 rounded-lg bg-rose-500/10 border border-rose-500/20">
                  <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                  <p className="text-xs text-rose-300">{uploadError}</p>
                </div>
              )}

              <button
                type="submit"
                disabled={(uploadMode === 'zip' && (!file || !repoName)) || (uploadMode === 'github' && !githubUrl)}
                className="w-full py-3 rounded-md bg-white text-black font-semibold text-sm hover:bg-zinc-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
              >
                {uploadMode === 'zip' ? 'Upload & Process' : 'Import & Process'}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
