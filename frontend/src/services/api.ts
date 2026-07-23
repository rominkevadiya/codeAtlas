import axios from 'axios';

// Read API base URL from env, fall back to localhost for local development
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api/v1';

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
    // Handle specific errors like 401 Unauthorized
    console.error('API Error:', error.response?.data || error.message);
    return Promise.reject(error);
  }
);

export const RepositoryService = {
  getRepositories: () => api.get('/repositories/'),
  uploadRepository: (name: string, file: File) => {
    const formData = new FormData();
    formData.append('name', name);
    formData.append('file', file);
    return api.post('/repositories/upload/', formData, {
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
