
import { z } from 'zod';
import { createField } from '@/shared/lib/admin/admin-generator';
import type { Category } from '@/features/category/category.schema';
import type { Tag } from '@/features/tag/tag.schema';


export const eventSchema = z.object({
  id: createField.string({ label: 'ID', readOnly: true }).optional(),
  name: createField.string({ label: 'Nom' }),
  image: createField.string({ label: 'Image', type: 'image' }).optional(),
  startDate: z.coerce.date().describe('Date de début'),
  endDate: z.coerce.date().describe('Date de fin'),
  location: createField.string({ label: 'Lieu' }),
  description: createField.textarea({ label: 'Description' }).optional(),
  createdAt: createField.string({ label: 'Créé le', display: { showInForm: false }, type: 'text' }).optional(),
  categoryId: createField.relation('categories', 'name', false, {
    label: 'Catégorie',
    display: { showInForm: true, widget: 'select' }
  }),
  tags: createField.relation('tags', 'name', true, {
    label: 'Tags',
    display: { showInForm: true, widget: 'tag' }
  }).optional()
});

export const eventCreateSchema = eventSchema.omit({ id: true, createdAt: true });
export const eventUpdateSchema = eventCreateSchema.partial();

export type Event = z.infer<typeof eventSchema> & {
  category?: Category | null;
  tags: Tag[];
};
export type EventWithId = Event & { id: string };
export type EventCreatePayload = z.infer<typeof eventCreateSchema>;
export type EventUpdatePayload = z.infer<typeof eventUpdateSchema>;
