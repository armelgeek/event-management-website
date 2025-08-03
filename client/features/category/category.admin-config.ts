
import { createAdminEntity, registerAdminEntity } from '@/shared/lib/admin/admin-generator';

import { safeCategoryCrudService } from './category.service';
import { categorySchema } from './category.schema';

export const categoryAdminConfig = createAdminEntity('Catégorie', categorySchema, {
  description: 'Gérez vos catégories d’événements',
  actions: { create: true, read: true, update: true, delete: true, bulk: false },
  services: safeCategoryCrudService,
  formFields: ['name', 'description'],
  queryKey: ['categories']
});
registerAdminEntity(
  'categories',
  categoryAdminConfig,
  '/admin/categories',
  '📂',
  1
);
