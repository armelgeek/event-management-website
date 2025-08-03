import { eventApiService } from './event.api-service';
import type { Event } from './event.schema';
import type { CrudService } from '@/shared/lib/admin/admin-generator';

// Adapter pour rendre eventApiService compatible avec CrudService
export const adaptedEventService: CrudService<Event> = {
  fetchItems: async (filters?: Record<string, string | number | undefined>) => {
    // Convertir le format des filtres
    const filterObj = {
      search: filters?.search?.toString(),
      page: filters?.page ? Number(filters.page) : undefined,
      pageSize: filters?.pageSize ? Number(filters.pageSize) : undefined,
      sortBy: filters?.sortBy?.toString(),
      sortDir: filters?.sortDir?.toString(),
      ...filters
    };
    
    const result = await eventApiService.list(filterObj);
    return {
      data: result.data || [],
      meta: {
        total: result.total || 0,
        page: filterObj.page || 1,
        pageSize: filterObj.pageSize || 10,
        totalPages: Math.ceil((result.total || 0) / (filterObj.pageSize || 10))
      }
    };
  },

  fetchItem: async (id: string): Promise<Event> => {
    const item = await eventApiService.detail(id);
    // Convertir EventWithId vers Event en supprimant l'id si nécessaire
    return {
      name: item.name,
      startDate: item.startDate,
      endDate: item.endDate,
      location: item.location,
      description: item.description,
      image: item.image,
      id: item.id,
      createdAt: item.createdAt
    } as Event;
  },

  createItem: async (data: Event): Promise<Event> => {
    const response = await eventApiService.create(data);
    if (!response.data) {
      throw new Error('Aucune donnée retournée lors de la création');
    }
    // Convertir EventWithId vers Event
    return {
      name: response.data.name,
      startDate: response.data.startDate,
      endDate: response.data.endDate,
      location: response.data.location,
      description: response.data.description,
      image: response.data.image,
      id: response.data.id,
      createdAt: response.data.createdAt
    } as Event;
  },

  updateItem: async (id: string, data: Partial<Event>): Promise<Event> => {
    // S'assurer que les champs obligatoires sont présents ou récupérer l'élément existant
    const fullData = data as Event; // Assumer que les données partielles sont suffisantes
    const response = await eventApiService.update(id, fullData);
    if (!response.data) {
      throw new Error('Aucune donnée retournée lors de la mise à jour');
    }
    // Convertir EventWithId vers Event
    return {
      name: response.data.name,
      startDate: response.data.startDate,
      endDate: response.data.endDate,
      location: response.data.location,
      description: response.data.description,
      image: response.data.image,
      id: response.data.id,
      createdAt: response.data.createdAt
    } as Event;
  },

  deleteItem: async (id: string): Promise<void> => {
    await eventApiService.remove(id);
  }
};
