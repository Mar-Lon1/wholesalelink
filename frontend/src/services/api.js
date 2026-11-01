import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:5001',
  withCredentials: true, // Required for HttpOnly cookies
  headers: { 'Content-Type': 'application/json' },
});

// Request interceptor to attach Bearer token if present (for cross-domain resilience)
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('wl_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor for consistent error messages
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const message =
      error.response?.data?.message || error.message || 'An unexpected error occurred';
    return Promise.reject(new Error(message));
  }
);

// ── Auth ──────────────────────────────────────────────────────────────────
export const authAPI = {
  register: (data) => api.post('/api/v1/auth/register', data),
  login: (data) => api.post('/api/v1/auth/login', data),
  logout: () => api.post('/api/v1/auth/logout'),
  me: () => api.get('/api/v1/auth/me'),
};

// ── Users ─────────────────────────────────────────────────────────────────
export const usersAPI = {
  getMe: () => api.get('/api/v1/users/me'),
  updateMe: (data) => api.patch('/api/v1/users/me', data),
};

// ── Suppliers ─────────────────────────────────────────────────────────────
export const suppliersAPI = {
  list: (params) => api.get('/api/v1/suppliers', { params }),
  getById: (id) => api.get(`/api/v1/suppliers/${id}`),
};

// ── Products ──────────────────────────────────────────────────────────────
export const productsAPI = {
  list: (params) => api.get('/api/v1/products', { params }),
  getById: (id) => api.get(`/api/v1/products/${id}`),
  myListings: (params) => api.get('/api/v1/products/my/listings', { params }),
  create: (data) => api.post('/api/v1/products', data),
  update: (id, data) => api.patch(`/api/v1/products/${id}`, data),
  deactivate: (id) => api.delete(`/api/v1/products/${id}`),
};

// ── Orders ────────────────────────────────────────────────────────────────
export const ordersAPI = {
  create: (data) => api.post('/api/v1/orders', data),
  list: (params) => api.get('/api/v1/orders', { params }),
  getById: (id) => api.get(`/api/v1/orders/${id}`),
  updateStatus: (id, status) => api.patch(`/api/v1/orders/${id}/status`, { status }),
  reorder: (id) => api.post(`/api/v1/orders/${id}/reorder`),
};

export default api;
