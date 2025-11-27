import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:2000/api';

export const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 5000, // 5 second timeout
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = sessionStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle auth errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      sessionStorage.removeItem('token');
      sessionStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Real API only - no mock data

// Real API calls
export const apiService = {
  login: (credentials) => {
    return api.post('/auth/login', credentials);
  },

  verifyToken: (username) => {
    return api.get(`/auth/me?username=${username}`);
  },

  register: (userData) => {
    return api.post('/auth/register', userData);
  },

  getUsers: () => api.get('/users'),
  getProducts: () => api.get('/products'),
  getSuppliers: () => api.get('/suppliers'),
  getDashboardStats: () => api.get('/dashboard/stats'),

  // Product CRUD
  createProduct: (product) => {
    const user = JSON.parse(sessionStorage.getItem('user') || '{}');
    return api.post(`/products?username=${user.username}`, product);
  },
  updateProduct: (id, product) => {
    const user = JSON.parse(sessionStorage.getItem('user') || '{}');
    return api.put(`/products/${id}?username=${user.username}`, product);
  },
  deleteProduct: (id) => api.delete(`/products/${id}`),

  // Supplier CRUD
  createSupplier: (supplier) => api.post('/suppliers', supplier),
  updateSupplier: (id, supplier) => api.put(`/suppliers/${id}`, supplier),
  deleteSupplier: (id) => api.delete(`/suppliers/${id}`),

  // User CRUD (Admin only)
  createUser: (user) => api.post('/users', user),
  updateUser: (id, user) => api.put(`/users/${id}`, user),
  deleteUser: (id) => api.delete(`/users/${id}`),

  // Task CRUD
  createTask: (task, createdBy, assignedTo) => api.post(`/tasks?createdBy=${createdBy}&assignedTo=${assignedTo}`, task),
  getTasks: () => api.get('/tasks'),
  getTasksByAssignedUser: (username) => api.get(`/tasks/assigned/${username}`),
  getTasksByCreatedUser: (username) => api.get(`/tasks/created/${username}`),
  getTaskById: (id) => api.get(`/tasks/${id}`),
  updateTask: (id, task, username) => api.put(`/tasks/${id}?username=${username}`, task),
  deleteTask: (id, username) => api.delete(`/tasks/${id}?username=${username}`),
  getOverdueTasks: (username) => api.get(`/tasks/overdue/${username}`),
  getTaskStats: (username) => api.get(`/tasks/stats/${username}`),
  getStaffMembers: () => api.get('/tasks/staff')
};

// Production API only - no mock data