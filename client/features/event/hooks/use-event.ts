import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { eventService } from '../event.service';
import type { EventCreatePayload, EventUpdatePayload } from '../event.schema';

export function useEvents(params?: { skip?: number; limit?: number }) {
  return useQuery({
    queryKey: ['events', params],
    queryFn: () => eventService.fetchItems(params),
  });
}

export function useEvent(id: string) {
  return useQuery({
    queryKey: ['event', id],
    queryFn: () => eventService.fetchItem(id),
    enabled: !!id,
  });
}

export function useCreateEvent() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: EventCreatePayload) => eventService.createItem(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['events'] });
    },
  });
}

export function useUpdateEvent() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, ...data }: { id: string } & EventUpdatePayload) => eventService.updateItem(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['events'] });
    },
  });
}

export function useDeleteEvent() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => eventService.deleteItem(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['events'] });
    },
  });
}
