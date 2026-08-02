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

export interface CurrentUser {
 id: string;
 username: string;
 email: string;
 date_joined: string;
}

export interface ChatMessage {
 id: string;
 role: 'user' | 'assistant';
 content: string;
 created_at: string;
}

export interface ChatSession {
 id: string;
 title: string;
 repository_id: string;
 message_count: number;
 last_message: { role: string; content: string } | null;
 messages?: ChatMessage[];
 created_at: string;
 updated_at: string;
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

// Interceptor for handling 401 errors with auto-refresh
api.interceptors.response.use(
 (response) => response,
 async (error) => {
  const originalRequest = error.config;

  // If it's a 401 error and we haven't retried this request yet
  if (error.response?.status === 401 && !originalRequest._retry) {
   originalRequest._retry = true;

   try {
    const refreshToken = localStorage.getItem('refresh_token');
    if (refreshToken) {
     const response = await axios.post(`${API_BASE_URL}/auth/token/refresh/`, {
      refresh: refreshToken
     });

     const newAccessToken = response.data.access;
     localStorage.setItem('access_token', newAccessToken);

     originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
     return api(originalRequest);
    }
   } catch {
    // Refresh failed — clear storage and redirect to home
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    window.location.href = '/';
   }
  }

  console.error('API Error:', error.response?.data || error.message);
  return Promise.reject(error);
 }
);

export const AuthService = {
 getMe: () => api.get<CurrentUser>('/auth/me/'),
};

export const RepositoryService = {
 getRepositories: () => api.get<Repository[]>('/repositories/'),
 uploadRepository: (name: string, file: File) => {
  const formData = new FormData();
  formData.append('name', name);
  formData.append('file', file);
  return api.post<Repository>('/repositories/upload/', formData, {
   headers: { 'Content-Type': 'multipart/form-data' },
  });
 },
 importGithub: (githubUrl: string) =>
  api.post('/repositories/import_github/', { github_url: githubUrl }),
 deleteRepository: (id: string) =>
  api.delete(`/repositories/${id}/`),
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
 getAutoDoc: (repository_id: string) =>
  api.get<{ content: string | null; updated_at?: string }>(`/ai/autodoc/${repository_id}/`),
 generateAutoDoc: (repository_id: string) =>
  api.post<{ content: string; updated_at: string }>(`/ai/autodoc/${repository_id}/`),
};

export const ChatService = {
 getSessions: (repository_id: string) =>
  api.get<ChatSession[]>(`/ai/chat/?repository_id=${repository_id}`),
 createSession: (repository_id: string, title: string = 'New Chat') =>
  api.post<ChatSession>('/ai/chat/', { repository_id, title }),
 getSession: (session_id: string) =>
  api.get<ChatSession>(`/ai/chat/${session_id}/`),
 deleteSession: (session_id: string) =>
  api.delete(`/ai/chat/${session_id}/`),
 sendMessage: (session_id: string, content: string) =>
  api.post<{ user_message: ChatMessage; assistant_message: ChatMessage }>(
   `/ai/chat/${session_id}/send/`,
   { content }
  ),
};

export const AnalysisService = {
 getMetrics: (repository_id: string) =>
  api.get(`/analysis/${repository_id}/`),
};
