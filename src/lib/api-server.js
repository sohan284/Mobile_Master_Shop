/**
 * Server-side API utilities for Next.js Server Components
 * This version doesn't use localStorage or browser APIs
 */

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://save-co.lumivancelabs.com';

/**
 * Server-side fetch wrapper for API calls
 * @param {string} url - API endpoint
 * @param {object} options - Fetch options (headers, method, body, etc.)
 * @returns {Promise} - Response data
 */
async function serverFetch(url, options = {}) {
  const fullUrl = url.startsWith('http') ? url : `${BASE_URL}${url}`;
  
 
  
  const defaultHeaders = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  try {
    const response = await fetch(fullUrl, {
      ...options,
      headers: defaultHeaders,
      // Add cache configuration for better performance
      next: {
        revalidate: 60, // Revalidate every 60 seconds
        ...options.next,
      },
    });

 
    if (!response.ok) {
      // Don't throw for 404s, let the component handle it
      if (response.status === 404) {
        return null;
      }
      const errorText = await response.text();
      console.error('❌ [Server API] Error response:', errorText);
      throw new Error(`API Error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();

    if (data && typeof data === 'object') {
   
    }
    return data;
  } catch (error) {
    console.error('❌ [Server API] Error for:', fullUrl);
    console.error('❌ [Server API] Error message:', error?.message);
    console.error('❌ [Server API] Error stack:', error?.stack);
    throw error;
  }
}

/**
 * Server-side API fetcher (similar to apiFetcher but for server components)
 */
export const serverApiFetcher = {
  // GET request
  get: async (url, config = {}) => {
    return serverFetch(url, {
      method: 'GET',
      ...config,
    });
  },

  // POST request
  post: async (url, data, config = {}) => {
    return serverFetch(url, {
      method: 'POST',
      body: JSON.stringify(data),
      ...config,
    });
  },

  // PATCH request
  patch: async (url, data, config = {}) => {
    return serverFetch(url, {
      method: 'PATCH',
      body: JSON.stringify(data),
      ...config,
    });
  },

  // PUT request
  put: async (url, data, config = {}) => {
    return serverFetch(url, {
      method: 'PUT',
      body: JSON.stringify(data),
      ...config,
    });
  },

  // DELETE request
  delete: async (url, config = {}) => {
    return serverFetch(url, {
      method: 'DELETE',
      ...config,
    });
  },
};

// Server-side API functions for common endpoints
export const getBrandsServer = () => serverApiFetcher.get('/api/repair/brands/');
export const getBrandByIdServer = (id) => serverApiFetcher.get(`/api/repair/brands/${id}/`);

export const getNewPhoneBrandsServer = () => serverApiFetcher.get('/api/brandnew/brands/');
export const getPhoneModelsByBrandServer = (brandName) => 
  serverApiFetcher.get(`/api/brandnew/models/?brand=${encodeURIComponent(brandName)}`);
export const getPhoneModelByIdServer = (id) => 
  serverApiFetcher.get(`/api/brandnew/models/${id}/`);

export const getAccessoriesServer = () => serverApiFetcher.get('/api/accessories/products/');
export const getAccessoryByIdServer = (id) => serverApiFetcher.get(`/api/accessories/products/${id}/`);

export const getPhoneReviewsServer = (phoneId) => 
  serverApiFetcher.get(`/api/brandnew/review/?phone_model=${phoneId}`);

// Repair API functions
export const getRepairModelsByBrandServer = (brandName) => 
  serverApiFetcher.get(`/api/repair/models/?brand=${encodeURIComponent(brandName)}`);
export const getRepairModelByIdServer = (id) => 
  serverApiFetcher.get(`/api/repair/models/${id}/`);
export const getRepairServicesByModelServer = (phoneModelId) => 
  serverApiFetcher.get(`/api/repair/repair-prices/?phone_model=${phoneModelId}`);
export const getRepairReviewsServer = (phoneModelId) => 
  serverApiFetcher.get(`/api/repair/review/?phone_model=${phoneModelId}`);

