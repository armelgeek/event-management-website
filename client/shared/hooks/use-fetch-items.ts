"use client";
import { useQuery } from '@tanstack/react-query';
import type { CrudService } from '@/shared/lib/admin/admin-generator';

interface UseFetchItemsOptions<T extends Record<string, unknown>> {
  service: CrudService<T>;
  queryKey: string[];
  filters?: Record<string, string | number | undefined>;
  enabled?: boolean;
  staleTime?: number;
  refetchOnMount?: boolean;
  refetchOnWindowFocus?: boolean;
}

export function useFetchItems<T extends Record<string, unknown>>({
  service,
  queryKey,
  filters = {},
  enabled = true,
  staleTime = 0,
  refetchOnMount = true,
  refetchOnWindowFocus = true
}: UseFetchItemsOptions<T>) {
  
  const queryKeyWithFilters = [...queryKey, 'list', filters];
  
  const query = useQuery({
    queryKey: queryKeyWithFilters,
    queryFn: () => service.fetchItems(filters),
    enabled,
    staleTime,
    refetchOnMount,
    refetchOnWindowFocus
  });

  return {
    data: query.data?.data || [],
    meta: query.data?.meta,
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
    refetch: query.refetch,
    isFetching: query.isFetching
  };
}

interface UseFetchItemOptions<T extends Record<string, unknown>> {
  service: CrudService<T>;
  queryKey: string[];
  id: string;
  enabled?: boolean;
}

export function useFetchItem<T extends Record<string, unknown>>({
  service,
  queryKey,
  id,
  enabled = true
}: UseFetchItemOptions<T>) {
  
  const query = useQuery({
    queryKey: [...queryKey, 'detail', id],
    queryFn: () => service.fetchItem(id),
    enabled: enabled && !!id
  });

  return {
    data: query.data,
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
    refetch: query.refetch
  };
}
