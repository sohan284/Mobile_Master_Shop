import { useQuery, useMutation, useQueryClient, UseQueryOptions, UseMutationOptions } from '@tanstack/react-query';
import { apiFetcher, getBrands, getBrandById } from '@/lib/api';

// Generic GET hook
export const useApiGet = <T>(
  queryKey: (string | number)[],
  queryFn: () => Promise<T>,
  options?: Omit<UseQueryOptions<T>, 'queryKey' | 'queryFn'>
) => {
  return useQuery<T>({
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
export const useApiPost = <TData = any, TVariables = any>(
  options?: UseMutationOptions<TData, Error, TVariables>
) => {
  return useMutation<TData, Error, TVariables>({
    mutationFn: async (variables: TVariables) => {
      const { url, data, config } = variables as any;
      return apiFetcher.post<TData>(url, data, config);
    },
    ...options,
  });
};

// Generic PATCH hook
export const useApiPatch = <TData = any, TVariables = any>(
  options?: UseMutationOptions<TData, Error, TVariables>
) => {
  return useMutation<TData, Error, TVariables>({
    mutationFn: async (variables: TVariables) => {
      const { url, data, config } = variables as any;
      return apiFetcher.patch<TData>(url, data, config);
    },
    ...options,
  });
};