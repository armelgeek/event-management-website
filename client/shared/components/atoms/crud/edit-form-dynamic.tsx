"use client";

import { z } from 'zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { toast } from 'sonner';
import { DynamicForm } from '../ui/dynamic-form';
import type { AdminConfigWithChild } from '@/shared/lib/admin/admin-generator';
import type { BaseService } from '@/shared/domain/base.service';

export interface EditFormDynamicProps<TSchema extends z.ZodType> {
  schema: TSchema;
  config: AdminConfigWithChild<z.infer<TSchema>>;
  service: BaseService<z.infer<TSchema>, z.infer<TSchema>>;
  queryKey: string[];
  itemId: string;
  initialData: z.infer<TSchema>;
  title?: string;
  description?: string;
  className?: string;
  redirectTo?: string;
  onSuccess?: () => void;
  onCancel?: () => void;
}

export function EditFormDynamic<TSchema extends z.ZodType>({
  schema,
  config,
  service,
  queryKey,
  itemId,
  initialData,
  title,
  description,
  className,
  redirectTo,
  onSuccess
}: EditFormDynamicProps<TSchema>) {
  const router = useRouter();
  const queryClient = useQueryClient();

  const updateMutation = useMutation({
    mutationFn: (data: z.infer<TSchema>) => service.update(itemId, data),
    onError: (error: Error) => {
      console.error('Erreur lors de la modification:', error);
    }
  });

  const handleSubmit = async (data: Record<string, unknown>) => {
    try {
      const response = await service.update(itemId, data as z.infer<TSchema>);
      if (response.status >= 200 && response.status < 300) {
        toast.success('Élément modifié avec succès');
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
      toast.error(`Erreur lors de la modification: ${errorMessage}`);
    }
  };


  const resolvedTitle = title ?? config.title ?? "Modifier l'élément";
  const resolvedDescription = description ?? config.description;

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>{resolvedTitle}</CardTitle>
        {resolvedDescription && <p className="text-sm text-muted-foreground">{resolvedDescription}</p>}
      </CardHeader>
      <CardContent>
        <DynamicForm
          schema={schema}
          config={config}
          initialData={initialData}
          onUpdate={handleSubmit}
          isSubmitting={updateMutation.isPending}
        />
      </CardContent>
    </Card>
  );
}
