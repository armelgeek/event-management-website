
import { createAdminEntity, registerAdminEntity } from '@/shared/lib/admin/admin-generator';
import { tagSchema } from './tag.schema';
import { safeTagCrudService } from './tag.service';

export const TagAdminConfig = createAdminEntity('Tag', tagSchema, {
  description: 'Gérez vos tags pour catégoriser les événements',
  icon: '🏷️',
  actions: { create: true, read: true, update: true, delete: true, bulk: true },
  services: safeTagCrudService,
  formFields: ['name', 'description'],
  queryKey: ['tags']
});

registerAdminEntity(
  'tags',
  TagAdminConfig,
  '/admin/tags',
  '🎉',
  3
)
