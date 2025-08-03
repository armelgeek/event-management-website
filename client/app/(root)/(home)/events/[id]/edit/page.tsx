"use client";

import { useQuery } from '@tanstack/react-query';
import { Skeleton } from '@/shared/components/atoms/ui/skeleton';
import { EditFormDynamic } from '@/shared/components/atoms/crud';
import { eventCrudService } from '@/features/event/event.service';
import { eventSchema } from '@/features/event/event.schema';
import { EventAdminConfig } from '@/features/event/event.admin-config';
import { use } from 'react';

export default function EditEventPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { data: event, isLoading, error } = useQuery({
    queryKey: ['events', id],
    queryFn: () => eventCrudService.detail(id)
  });

  if (isLoading) {
    return (
      <div className="container mx-auto py-6 max-w-2xl">
        <div className="space-y-6">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-4 w-64" />
          <div className="space-y-4">
            <Skeleton className="h-10 w-full" />
            <div className="grid grid-cols-2 gap-4">
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
            </div>
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-24 w-full" />
            <Skeleton className="h-10 w-full" />
          </div>
        </div>
      </div>
    );
  }

  if (error || !event) {
    return (
      <div className="container mx-auto py-6 max-w-2xl">
        <div className="text-center">
          <p className="text-muted-foreground mb-4">
            {error ? `Erreur: ${(error as Error).message}` : 'Événement non trouvé'}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6 max-w-2xl">
      <EditFormDynamic
        schema={eventSchema}
        config={EventAdminConfig}
        queryKey={['events']}
        itemId={id}
        initialData={event}
        title="Modifier l'événement"
        description="Modifiez les informations de votre événement"
        redirectTo="/admin/events-crud"
      />
    </div>
  );
}
