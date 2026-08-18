import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
  timeout: 60000,
  headers: { 'Content-Type': 'application/json' }
});

// Request interceptor for auth token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      if (window.location.pathname !== '/login' && window.location.pathname !== '/register' && window.location.pathname !== '/') {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

// Auth
export const authAPI = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
  logout: () => api.post('/auth/logout'),
  getMe: () => api.get('/auth/me'),
  updateProfile: (data) => api.put('/auth/profile', data),
  deleteAccount: (password) => api.delete('/auth/account', { data: { password } })
};

// Analyses
export const analysisAPI = {
  create: (url) => api.post('/analyses', { url }),
  getAll: (page = 1, limit = 20) => api.get(`/analyses?page=${page}&limit=${limit}`),
  getOne: (id) => api.get(`/analyses/${id}`),
  delete: (id) => api.delete(`/analyses/${id}`),
  getLeaderboard: (page = 1, limit = 20, language = '', search = '') => 
    api.get(`/analyses/leaderboard?page=${page}&limit=${limit}&language=${encodeURIComponent(language)}&search=${encodeURIComponent(search)}`),
  compare: (ids) => api.post('/analyses/compare', { ids }),
  exportData: () => api.get('/analyses/export', { responseType: 'blob' })
};

// Favorites
export const favoritesAPI = {
  getAll: () => api.get('/favorites'),
  create: (analysisId) => api.post('/favorites', { analysisId }),
  delete: (id) => api.delete(`/favorites/${id}`)
};

export default api;

