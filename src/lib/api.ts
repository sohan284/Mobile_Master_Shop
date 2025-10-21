import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';

const BASE_URL = 'http://save-co.lumivancelabs.com/api';

// Create axios instance
const apiClient = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Common headers
export const jsonHeader = () => ({
  'Content-Type': 'application/json',
});

export const authHeader = (token: string) => ({
  'Authorization': `Bearer ${token}`,
  'Content-Type': 'application/json',
});

// Generic fetcher functions
export const apiFetcher = {
  // GET request
  get: async <T>(url: string, config?: AxiosRequestConfig): Promise<T> => {
    const response: AxiosResponse<T> = await apiClient.get(url, config);
    return response.data;
  },

  // POST request
  post: async <T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> => {
    const response: AxiosResponse<T> = await apiClient.post(url, data, config);
    return response.data;
  },

  // PATCH request
  patch: async <T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> => {
    const response: AxiosResponse<T> = await apiClient.patch(url, data, config);
    return response.data;
  },

  // PUT request
  put: async <T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> => {
    const response: AxiosResponse<T> = await apiClient.put(url, data, config);
    return response.data;
  },

  // DELETE request
  delete: async <T>(url: string, config?: AxiosRequestConfig): Promise<T> => {
    const response: AxiosResponse<T> = await apiClient.delete(url, config);
    return response.data;
  },
};

// Specific API functions
export const getBrands = () => apiFetcher.get('/brands/');
export const getBrandById = (id: number) => apiFetcher.get(`/brands/${id}/`);
export const createBrand = (data: any) => apiFetcher.post('/brands/', data);
export const updateBrand = (id: number, data: any) => apiFetcher.patch(`/brands/${id}/`, data);
export const deleteBrand = (id: number) => apiFetcher.delete(`/brands/${id}/`);

// Export the axios instance for custom requests
export { apiClient };
