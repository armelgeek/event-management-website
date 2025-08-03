
import { z } from 'zod'
import { createField } from '@/shared/lib/admin/admin-generator'


export const tagSchema = z.object({
  id: createField.string({ label: 'ID', display: { showInForm: false, showInTable: false } }).optional(),
  name: createField.string({ label: 'Nom'}),
  description: createField.textarea({ label: 'Description' }),
  createdAt: createField.date({ label: 'Créé le', display: { showInForm: false } }).optional(),
  updatedAt: createField.date({ label: 'Modifié le', display: { showInForm: false } }).optional()
})

export type Tag = z.infer<typeof tagSchema>
