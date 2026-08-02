import axios from 'axios';

// Read API base URL from env, fall back to localhost for local development
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api/v1';

export interface Repository {
  id: string;
  name: string;
  url: string;
  owner: string | null;
  is_cloned: boolean;
  local_path: string;
  default_branch: string;
  status: 'PENDING' | 'EXTRACTING' | 'PARSING' | 'BUILDING_GRAPH' | 'READY' | 'FAILED';
  error_message?: string | null;
  created_at: string;
  updated_at: string;
  websocket_url?: string;
}

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor for attaching auth tokens
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('access_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Interceptor for handling errors globally
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error.response?.data || error.message);
    if (error.response?.status === 401) {
      // Optional: Handle token refresh or logout here
      // localStorage.removeItem('access_token');
      // window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export const RepositoryService = {
  getRepositories: () => api.get<Repository[]>('/repositories/'),
  uploadRepository: (name: string, file: File) => {
    const formData = new FormData();
    formData.append('name', name);
    formData.append('file', file);
    return api.post<Repository>('/repositories/upload/', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },
  importGithub: (githubUrl: string) => 
    api.post('/repositories/import_github/', { github_url: githubUrl }),
    
  getImpactAnalysis: (id: string, nodeId: string) =>
    api.get(`/analysis/${id}/impact/?node_id=${encodeURIComponent(nodeId)}`),
  getGraph: (id: string) => api.get(`/repositories/${id}/graph/`),
  getNodeSnippet: (id: string, file_path: string, start_line?: number, end_line?: number) => {
    let url = `/repositories/${id}/node_snippet/?file_path=${encodeURIComponent(file_path)}`;
    if (start_line !== undefined) url += `&start_line=${start_line}`;
    if (end_line !== undefined) url += `&end_line=${end_line}`;
    return api.get(url);
  },
};

export const AIService = {
  query: (repository_id: string, query: string) =>
    api.post('/ai/query/', { repository_id, query }),
  explainNode: (repository_id: string, node_name: string, node_type: string, snippet: string) =>
    api.post('/ai/explain/', { repository_id, node_name, node_type, snippet }),
};

export const AnalysisService = {
  getMetrics: (repository_id: string) =>
    api.get(`/analysis/${repository_id}/`),
};
