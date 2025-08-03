import { z } from 'zod'

export const TagSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string().optional(),
  createdAt: z.date(),
  updatedAt: z.date()
})

export type Tag = z.infer<typeof TagSchema>
