import axios from 'axios';

const BASE_URL = 'http://save-co.lumivancelabs.com';

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
      localStorage.removeItem('userData');
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

// Export the axios instance for custom requests
export { apiClient };
