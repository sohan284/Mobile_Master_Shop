import axios from 'axios';

const BASE_URL =process.env.NEXT_PUBLIC_API_URL || 'https://save-co.lumivancelabs.com';

// Create axios instance
const apiClient = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor to include auth token
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor to handle auth errors
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid, clear auth data
      localStorage.removeItem('authToken');
      localStorage.removeItem('user');
      // Redirect to login page
      if (typeof window !== 'undefined') {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

// Common headers
export const jsonHeader = () => ({
  'Content-Type': 'application/json',
});

export const authHeader = (token) => ({
  'Authorization': `Bearer ${token}`,
  'Content-Type': 'application/json',
});

// Generic fetcher functions
export const apiFetcher = {
  // GET request
  get: async (url, config) => {
    const response = await apiClient.get(url, config);
    return response.data;
  },

  // POST request
  post: async (url, data, config) => {
    const response = await apiClient.post(url, data, config);
    return response.data;
  },

  // PATCH request
  patch: async (url, data, config) => {
    const response = await apiClient.patch(url, data, config);
    return response.data;
  },

  // PUT request
  put: async (url, data, config) => {
    const response = await apiClient.put(url, data, config);
    return response.data;
  },

  // DELETE request
  delete: async (url, config) => {
    const response = await apiClient.delete(url, config);
    return response.data;
  },
};

// Authentication API functions
export const loginUser = (credentials) => 
  apiFetcher.post('/auth/login/', credentials);

export const logoutUser = () => 
  apiFetcher.post('/auth/logout');

export const refreshToken = () => 
  apiFetcher.post('/auth/refresh');

export const getCurrentUser = () => 
  apiFetcher.get('/auth/me/');

// Signup API functions
export const sendOTP = (email) => 
  apiFetcher.post('/auth/send-otp/', { email });

export const verifyOTP = (email, otp) => 
  apiFetcher.post('/auth/verify-otp/', { email:email, code:otp });

export const createAccount = (userData) => 
  apiFetcher.post('/auth/set-credentials/', userData);

// Specific API functions
export const getBrands = () => apiFetcher.get('/api/repair/brands/');
export const getBrandById = (id) => apiFetcher.get(`/api/repair/brands/${id}/`);
export const createBrand = (data) => apiFetcher.post('/api/repair/brands/', data);
export const updateBrand = (id, data) => apiFetcher.patch(`/api/repair/brands/${id}/`, data);
export const deleteBrand = (id) => apiFetcher.delete(`/api/repair/brands/${id}/`);

// Model API functions
export const getModels = () => apiFetcher.get('/api/repair/models/');
export const getModelById = (id) => apiFetcher.get(`/api/repair/models/${id}/`);
export const createModel = (data) => apiFetcher.post('/api/repair/models/', data);
export const updateModel = (id, data) => apiFetcher.patch(`/api/repair/models/${id}/`, data);
export const deleteModel = (id) => apiFetcher.delete(`/api/repair/models/${id}/`);
// Service API functions
export const getServices = (modelId) => apiFetcher.get(`/api/repair/repair-prices/?model=${modelId}`);
export const getServiceById = (id) => apiFetcher.get(`/api/repair/repair-prices/${id}/`);
export const createService = (data) => apiFetcher.post('/api/repair/repair-prices/', data);
export const updateService = (id, data) => apiFetcher.patch(`/api/repair/repair-prices/${id}/`, data);
export const deleteService = (id) => apiFetcher.delete(`/api/repair/repair-prices/${id}/`);

// Problem API functions
export const getProblems = (modelId) => apiFetcher.get(`/api/repair/problems/?model=${modelId}`);
export const getProblemById = (id) => apiFetcher.get(`/api/repair/problems/${id}/`);
export const createProblem = (data) => apiFetcher.post('/api/repair/problems/', data);
export const updateProblem = (id, data) => apiFetcher.patch(`/api/repair/problems/${id}/`, data);
export const deleteProblem = (id) => apiFetcher.delete(`/api/repair/problems/${id}/`);

// Accessories API functions
export const getAccessories = () => apiFetcher.get('/api/accessories/products/');
export const getAccessoryById = (id) => apiFetcher.get(`/api/accessories/products/${id}/`);
export const createAccessory = (data) => apiFetcher.post('/api/accessories/products/', data);
export const updateAccessory = (id, data) => apiFetcher.patch(`/api/accessories/products/${id}/`, data);
export const deleteAccessory = (id) => apiFetcher.delete(`/api/accessories/products/${id}/`);

// Export the axios instance for custom requests
export { apiClient };
