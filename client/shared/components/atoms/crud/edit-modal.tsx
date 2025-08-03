"use client";
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/shared/components/atoms/ui/dialog';
import { Button } from '@/shared/components/atoms/ui/button';
import { Edit } from 'lucide-react';
import { DynamicForm } from '@/shared/components/atoms/ui/dynamic-form';
import { useEntityCrud } from '@/shared/hooks/use-entity-crud';
import { useFetchItem } from '@/shared/hooks/use-fetch-items';
import type { CrudService, AdminConfig } from '@/shared/lib/admin/admin-generator';
import type { ZodSchema } from 'zod';

interface EditModalProps<T extends Record<string, unknown>> {
  service: CrudService<T>;
  queryKey: string[];
  entityName: string;
  config: AdminConfig;
  schema: ZodSchema;
  itemId: string;
  title?: string;
  trigger?: React.ReactNode;
  onSuccess?: (data: T) => void;
  className?: string;
}

export function EditModal<T extends Record<string, unknown> & { id?: string }>({
  service,
  queryKey,
  entityName,
  config,
  schema,
  itemId,
  title,
  trigger,
  onSuccess,
  className
}: EditModalProps<T>) {
  const [isOpen, setIsOpen] = useState(false);
  
  const { data: itemData, isLoading: isLoadingItem } = useFetchItem({
    service,
    queryKey,
    id: itemId,
    enabled: isOpen
  });
  
  const { update, isUpdating } = useEntityCrud({
    service,
    queryKey,
    entityName,
    onSuccess: {
      update: (data) => {
        setIsOpen(false);
        onSuccess?.(data);
      }
    }
  });

  const handleUpdate = async (data: Record<string, unknown>) => {
    update({ id: itemId, data: data as Partial<T> });
  };

  const defaultTrigger = (
    <Button variant="outline" size="sm" className={className}>
      <Edit className="h-4 w-4 mr-2" />
      Modifier
    </Button>
  );

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {trigger || defaultTrigger}
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{title || `Modifier ${entityName}`}</DialogTitle>
        </DialogHeader>
        {isLoadingItem ? (
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        ) : (
          <DynamicForm
            config={config}
            schema={schema}
            initialData={itemData as T}
            onUpdate={handleUpdate}
            isSubmitting={isUpdating}
            onSuccess={() => setIsOpen(false)}
          />
        )}
      </DialogContent>
    </Dialog>
  );
}
