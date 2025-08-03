

import { createApiService } from '@/shared/lib/admin/admin-generator';
import { API_ENDPOINTS } from '@/shared/config/api';
import type { Tag } from './tag.schema';


const tagCrudService = createApiService<Tag>(API_ENDPOINTS.tags.base);

export const safeTagCrudService = {
	async fetchItems(filters?: Record<string, string | number | undefined>) {
		const res = await tagCrudService.fetchItems(filters);
		return {
			...res,
			data: Array.isArray(res.data) ? res.data : [],
		};
	},
	fetchItem: tagCrudService.fetchItem,
	createItem: tagCrudService.createItem,
	updateItem: tagCrudService.updateItem,
	deleteItem: tagCrudService.deleteItem,
};

