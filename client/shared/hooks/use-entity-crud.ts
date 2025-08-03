"use client";
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import type { CrudService } from '@/shared/lib/admin/admin-generator';

interface UseEntityCrudOptions<T extends Record<string, unknown>> {
  service: CrudService<T>;
  queryKey: string[];
  entityName: string;
  onSuccess?: {
    create?: (data: T) => void;
    update?: (data: T) => void;
    delete?: (id: string) => void;
  };
  onError?: {
    create?: (error: Error) => void;
    update?: (error: Error) => void;
    delete?: (error: Error) => void;
  };
}

export function useEntityCrud<T extends Record<string, unknown> & { id?: string }>({
  service,
  queryKey,
  entityName,
  onSuccess,
  onError
}: UseEntityCrudOptions<T>) {
  const queryClient = useQueryClient();

  const invalidateQueries = () => {
    queryClient.invalidateQueries({ queryKey });
  };

  const createMutation = useMutation({
    mutationFn: (data: Omit<T, 'id'>) => service.createItem(data as T),
    onSuccess: (data: T) => {
      toast.success(`${entityName} créé avec succès`);
      invalidateQueries();
      onSuccess?.create?.(data);
    },
    onError: (error: Error) => {
      toast.error(`Erreur lors de la création du ${entityName}: ${error.message}`);
      onError?.create?.(error);
    }
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<T> }) => 
      service.updateItem(id, data),
    onSuccess: (data: T) => {
      toast.success(`${entityName} modifié avec succès`);
      invalidateQueries();
      onSuccess?.update?.(data);
    },
    onError: (error: Error) => {
      toast.error(`Erreur lors de la modification du ${entityName}: ${error.message}`);
      onError?.update?.(error);
    }
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => service.deleteItem(id),
    onSuccess: (_, id) => {
      toast.success(`${entityName} supprimé avec succès`);
      invalidateQueries();
      onSuccess?.delete?.(id);
    },
    onError: (error: Error) => {
      toast.error(`Erreur lors de la suppression du ${entityName}: ${error.message}`);
      onError?.delete?.(error);
    }
  });

  return {
    create: createMutation.mutate,
    update: updateMutation.mutate,
    delete: deleteMutation.mutate,
    isCreating: createMutation.isPending,
    isUpdating: updateMutation.isPending,
    isDeleting: deleteMutation.isPending,
    isLoading: createMutation.isPending || updateMutation.isPending || deleteMutation.isPending,
    invalidateQueries
  };
}
