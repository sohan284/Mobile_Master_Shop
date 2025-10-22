import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiFetcher  } from '@/lib/api.js';

// Generic GET hook
export const useApiGet = (queryKey, queryFn, options) => {
  return useQuery({
    queryKey,
    queryFn,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
    retry: 2,
    refetchOnWindowFocus: false,
    ...options,
  });
};

// Generic POST hook
export const useApiPost = (options) => {
  return useMutation({
    mutationFn: async (variables) => {
      const { url, data, config } = variables;
      return apiFetcher.post(url, data, config);
    },
    ...options,
  });
};

// Generic PATCH hook
export const useApiPatch = (options) => {
  return useMutation({
    mutationFn: async (variables) => {
      const { url, data, config } = variables;
      return apiFetcher.patch(url, data, config);
    },
    ...options,
  });
};
