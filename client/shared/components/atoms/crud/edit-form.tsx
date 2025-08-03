"use client";

import React from 'react';
import { useRouter } from 'next/navigation';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { z } from 'zod';
import { Button } from '@/shared/components/atoms/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/atoms/ui/card';
import { Form } from '@/shared/components/atoms/ui/form';

interface EditFormProps<TSchema extends z.ZodType> {
  service: {
    update: (id: string, data: Partial<z.infer<TSchema>>) => Promise<{ data: unknown; success: boolean }>;
  };
  schema: TSchema;
  queryKey: string[];
  itemId: string;
  initialData: z.infer<TSchema>;
  title?: string;
  description?: string;
  onSuccess?: () => void;
  onCancel?: () => void;
  redirectTo?: string;
  className?: string;
  children: (form: ReturnType<typeof useForm<z.infer<TSchema>>>) => React.ReactNode;
}

export function EditForm<TSchema extends z.ZodType>({
  service,
  schema,
  queryKey,
  itemId,
  initialData,
  title = 'Modifier',
  description,
  onSuccess,
  onCancel,
  redirectTo,
  className,
  children
}: EditFormProps<TSchema>) {
  const router = useRouter();
  const queryClient = useQueryClient();

  const form = useForm<z.infer<TSchema>>({
    resolver: zodResolver(schema),
    defaultValues: initialData as z.infer<TSchema>
  });

  const updateMutation = useMutation({
    mutationFn: (data: Partial<z.infer<TSchema>>) => service.update(itemId, data),
    onSuccess: () => {
      toast.success('Élément modifié avec succès');
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
      toast.error(`Erreur lors de la modification: ${error.message}`);
    }
  });

  const handleSubmit = (data: z.infer<TSchema>) => {
    updateMutation.mutate(data);
  };

  const handleCancel = () => {
    if (onCancel) {
      onCancel();
    } else {
      router.back();
    }
  };

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        {description && <p className="text-sm text-muted-foreground">{description}</p>}
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
            {children(form)}
            
            <div className="flex gap-2 justify-end">
              <Button
                type="button"
                variant="outline"
                onClick={handleCancel}
                disabled={updateMutation.isPending}
              >
                Annuler
              </Button>
              <Button type="submit" disabled={updateMutation.isPending}>
                {updateMutation.isPending ? 'Modification...' : 'Modifier'}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
