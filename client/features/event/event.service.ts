
import { API_ENDPOINTS } from '@/shared/config/api';
import { createApiService } from '@/shared/lib/admin/admin-generator';
import type { Event, EventWithId } from './event.schema';
import type { CrudService } from '@/shared/lib/admin/admin-generator';

// Service avec typage correct
export const eventService = createApiService<Event>(API_ENDPOINTS.event.base);

// Service compatible avec l'interface CrudService pour les pages CRUD
export const eventCrudService: CrudService<EventWithId> & {
  // Méthodes supplémentaires pour les nouveaux composants CRUD
  detail: (id: string) => Promise<EventWithId>;
  list: (filters: Record<string, unknown>) => Promise<{ data: EventWithId[]; total: number }>;
  create: (data: Partial<EventWithId>) => Promise<{ data: EventWithId; success: boolean }>;
  update: (id: string, data: Partial<EventWithId>) => Promise<{ data: EventWithId; success: boolean }>;
  remove: (id: string) => Promise<{ success: boolean }>;
} = {
  // Méthodes originales pour l'admin generator
  fetchItems: async (filters?: Record<string, string | number | undefined>) => {
    const result = await eventService.fetchItems(filters);
    return {
      data: result.data.map(item => ({ ...item, id: item.id! })) as EventWithId[],
      meta: result.meta
    };
  },
  fetchItem: async (id: string) => {
    const result = await eventService.fetchItem(id);
    return { ...result, id: result.id! } as EventWithId;
  },
  createItem: eventService.createItem as (data: EventWithId) => Promise<EventWithId>,
  updateItem: eventService.updateItem as (id: string, data: Partial<EventWithId>) => Promise<EventWithId>,
  deleteItem: eventService.deleteItem,

  // Nouvelles méthodes pour les composants CRUD séparés
  detail: async (id: string) => {
    const result = await eventService.fetchItem(id);
    return { ...result, id: result.id! } as EventWithId;
  },
  
  list: async (filters: Record<string, unknown>) => {
    const sanitizedFilters = Object.fromEntries(
      Object.entries(filters).map(([key, value]) => [
        key,
        typeof value === 'string' || typeof value === 'number' || value === undefined
          ? value
          : String(value)
      ])
    ) as Record<string, string | number | undefined>;
    
    const result = await eventService.fetchItems(sanitizedFilters);
    return {
      data: result.data.map(item => ({ ...item, id: item.id! })) as EventWithId[],
      total: result.meta?.total || 0
    };
  },
  
  create: async (data: Partial<EventWithId>) => {
    const result = await eventService.createItem(data as EventWithId);
    return {
      data: { ...result, id: result.id! } as EventWithId,
      success: true
    };
  },
  
  update: async (id: string, data: Partial<EventWithId>) => {
    const result = await eventService.updateItem(id, data);
    return {
      data: { ...result, id: result.id! } as EventWithId,
      success: true
    };
  },
  
  remove: async (id: string) => {
    await eventService.deleteItem(id);
    return { success: true };
  }
};
