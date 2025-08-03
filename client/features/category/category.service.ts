import { createApiService } from '@/shared/lib/admin/admin-generator';
import { API_ENDPOINTS } from '@/shared/config/api';

import type { Category } from '../../../shared/src/types/category';

const categoryCrudService = createApiService<Category & Record<string, unknown>>(API_ENDPOINTS.category.base);

export const safeCategoryCrudService = {
  async fetchItems(filters?: Record<string, string | number | undefined>) {
    const res = await categoryCrudService.fetchItems(filters);
    return {
      ...res,
      data: Array.isArray(res.data) ? res.data : [],
    };
  },
  fetchItem: categoryCrudService.fetchItem,
  createItem: categoryCrudService.createItem,
  updateItem: categoryCrudService.updateItem,
  deleteItem: categoryCrudService.deleteItem,
};

