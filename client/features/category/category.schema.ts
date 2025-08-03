
import { z } from 'zod';
import { createField } from '@/shared/lib/admin/admin-generator';

export const categorySchema = z.object({
  id: createField.string({ label: 'ID', display: { showInForm: false, showInTable: false } }).optional(),
  name: createField.string({ label: 'Nom', placeholder: 'Nom de la catégorie' }).min(2, 'Le nom doit faire au moins 2 caractères').max(100, '100 caractères max'),
  description: createField.textarea({ label: 'Description', placeholder: 'Description (optionnel)' }).max(500, '500 caractères max').optional(),
  createdAt: createField.string({ label: 'Créé le', display: { showInForm: false } }).optional(),
  updatedAt: createField.string({ label: 'Modifié le', display: { showInForm: false } }).optional(),
});

export type Category = z.infer<typeof categorySchema>;
