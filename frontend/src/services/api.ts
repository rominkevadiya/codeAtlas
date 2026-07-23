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

// Interceptor for attaching auth tokens, handling errors globally, etc.
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error.response?.data || error.message);
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
  getGraph: (id: string) => api.get(`/repositories/${id}/graph/`),
};

export const AIService = {
  query: (repository_id: string, query: string) =>
    api.post('/ai/query/', { repository_id, query }),
};
