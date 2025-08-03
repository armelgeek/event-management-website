"use client";
import { useEntityCrud } from './use-entity-crud';
import { useFetchItems } from './use-fetch-items';
import type { CrudService } from '@/shared/lib/admin/admin-generator';

interface UseEntityOptions<T extends Record<string, unknown>> {
  service: CrudService<T>;
  queryKey: string[];
  entityName: string;
  filters?: Record<string, string | number | undefined>;
  enabled?: boolean;
}

export function useEntity<T extends Record<string, unknown> & { id?: string }>({
  service,
  queryKey,
  entityName,
  filters = {},
  enabled = true
}: UseEntityOptions<T>) {
  
  const fetchHook = useFetchItems({
    service,
    queryKey,
    filters,
    enabled
  });
  
  const crudHook = useEntityCrud({
    service,
    queryKey,
    entityName
  });

  return {
    // Data fetching
    items: fetchHook.data,
    meta: fetchHook.meta,
    isLoading: fetchHook.isLoading,
    isError: fetchHook.isError,
    error: fetchHook.error,
    refetch: fetchHook.refetch,
    isFetching: fetchHook.isFetching,
    
    // CRUD operations
    create: crudHook.create,
    update: crudHook.update,
    delete: crudHook.delete,
    isCreating: crudHook.isCreating,
    isUpdating: crudHook.isUpdating,
    isDeleting: crudHook.isDeleting,
    isMutating: crudHook.isLoading,
    invalidateQueries: crudHook.invalidateQueries
  };
}
