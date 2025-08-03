import { BaseServiceImpl, type ResourceEndpoints } from '@/shared/domain/base.service';
import { API_ENDPOINTS } from '@/shared/config/api';
import type { Event, EventWithId } from './event.schema';
import { Filter } from '@/shared/lib/types/filter';

class EventServiceImpl extends BaseServiceImpl<EventWithId, Event> {
  protected endpoints: ResourceEndpoints = {
    base: API_ENDPOINTS.event.base,
    list: (qs: string) => `${API_ENDPOINTS.event.base}?${qs}`,
    create: API_ENDPOINTS.event.base,
    detail: (id: string) => `${API_ENDPOINTS.event.base}/${id}`,
    update: (id: string) => `${API_ENDPOINTS.event.base}/${id}`,
    delete: (id: string) => `${API_ENDPOINTS.event.base}/${id}`
  };

  protected serializeParams(filter: Filter): string {
    const params = new URLSearchParams();
    
    if (filter.page) {
      params.append('page', filter.page.toString());
    }
    if (filter.pageSize) {
      params.append('limit', filter.pageSize.toString());
    }
    if (filter.search) {
      params.append('search', filter.search);
    }
    if (filter.sortBy) {
      params.append('sortBy', filter.sortBy);
    }
    if (filter.sortDir) {
      params.append('sortOrder', filter.sortDir);
    }
    
    return params.toString();
  }
}

// Export d'une instance unique
export const eventApiService = new EventServiceImpl();
