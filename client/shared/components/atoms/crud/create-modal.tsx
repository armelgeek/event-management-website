"use client";
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/shared/components/atoms/ui/dialog';
import { Button } from '@/shared/components/atoms/ui/button';
import { Plus } from 'lucide-react';
import { DynamicForm } from '@/shared/components/atoms/ui/dynamic-form';
import { useEntityCrud } from '@/shared/hooks/use-entity-crud';
import type { CrudService, AdminConfig } from '@/shared/lib/admin/admin-generator';
import type { ZodSchema } from 'zod';

interface CreateModalProps<T extends Record<string, unknown>> {
  service: CrudService<T>;
  queryKey: string[];
  entityName: string;
  config: AdminConfig;
  schema: ZodSchema;
  title?: string;
  trigger?: React.ReactNode;
  onSuccess?: (data: T) => void;
  className?: string;
}

export function CreateModal<T extends Record<string, unknown> & { id?: string }>({
  service,
  queryKey,
  entityName,
  config,
  schema,
  title,
  trigger,
  onSuccess,
  className
}: CreateModalProps<T>) {
  const [isOpen, setIsOpen] = useState(false);
  
  const { create, isCreating } = useEntityCrud({
    service,
    queryKey,
    entityName,
    onSuccess: {
      create: (data) => {
        setIsOpen(false);
        onSuccess?.(data);
      }
    }
  });

  const handleCreate = async (data: Record<string, unknown>) => {
    create(data as Omit<T, 'id'>);
  };

  const defaultTrigger = (
    <Button className={className}>
      <Plus className="h-4 w-4 mr-2" />
      Créer {entityName}
    </Button>
  );

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {trigger || defaultTrigger}
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{title || `Créer un nouveau ${entityName}`}</DialogTitle>
        </DialogHeader>
        <DynamicForm
          config={config}
          schema={schema}
          onCreate={handleCreate}
          isSubmitting={isCreating}
          onSuccess={() => setIsOpen(false)}
        />
      </DialogContent>
    </Dialog>
  );
}
