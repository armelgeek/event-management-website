"use client";

import React from 'react';
import { useRouter } from 'next/navigation';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { z } from 'zod';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/atoms/ui/card';
import { DynamicForm } from '@/shared/components/atoms/ui/dynamic-form';
import type { AdminConfigWithChild } from '@/shared/lib/admin/admin-generator';
import type { BaseService } from '@/shared/domain/base.service';

interface CreateFormProps<TSchema extends z.ZodType> {
  service: BaseService<z.infer<TSchema>, z.infer<TSchema>>;
  schema: TSchema;
  config: AdminConfigWithChild<z.infer<TSchema>>;
  queryKey: string[];
  title?: string;
  description?: string;
  onSuccess?: () => void;
  onCancel?: () => void;
  redirectTo?: string;
  className?: string;
}

export function CreateForm<TSchema extends z.ZodType>({
  service,
  schema,
  config,
  queryKey,
  title,
  description,
  onSuccess,
  redirectTo,
  className
}: CreateFormProps<TSchema>) {
  const router = useRouter();
  const queryClient = useQueryClient();

  const createMutation = useMutation({
    mutationFn: (data: z.infer<TSchema>) => service.create(data),
    onSuccess: () => {
      toast.success('Élément créé avec succès');
      queryClient.invalidateQueries({ queryKey });

      if (onSuccess) {
        onSuccess();
      } else if (redirectTo) {
        router.push(redirectTo);
      } else {
        router.back();
      }
    },
    onError: (error: Error) => {
      toast.error(`Erreur lors de la création: ${error.message}`);
    }
  });

  const handleSubmit = async (data: Record<string, unknown>) => {
    try {
      const response = await service.create(data as z.infer<TSchema>);
      if (response.status >= 200 && response.status < 300) {
        toast.success('Élément créé avec succès');
        queryClient.invalidateQueries({ queryKey });

        if (onSuccess) {
          onSuccess();
        } else if (redirectTo) {
          router.push(redirectTo);
        } else {
          router.back();
        }
      }
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Une erreur est survenue';
      toast.error(`Erreur lors de la création: ${errorMessage}`);
    }
  };


  const resolvedTitle = title ?? config.title ?? 'Créer';
  const resolvedDescription = description ?? config.description;

  return (
    <div className={className}>
      <h3 className='font-bold'>{resolvedTitle}</h3>
      {resolvedDescription && <p className="text-sm text-muted-foreground">{resolvedDescription}</p>}

      <DynamicForm
        schema={schema}
        config={config}
        maxHeight='max-h-full'
        overflowY='hidden'
        onCreate={handleSubmit}
        isSubmitting={createMutation.isPending}
      />
    </div>
  );
}
