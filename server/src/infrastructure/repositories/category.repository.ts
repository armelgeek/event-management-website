import { eq } from 'drizzle-orm'
import type { CategoryType } from '@/domain/models/category.model'
import type { CategoryRepositoryInterface } from '@/domain/repositories/category.repository.interface'
import { categories } from '../database/schema'
import { BaseRepository } from './base.repository'

interface CategoryCreateData {
  name: string
  description?: string
  createdAt?: string | Date
  updatedAt?: string | Date
}

interface CategoryUpdateData {
  name?: string
  description?: string
  updatedAt?: string | Date
}

export class CategoryRepositoryImpl
  extends BaseRepository<CategoryType, CategoryCreateData, CategoryUpdateData>
  implements CategoryRepositoryInterface
{
  constructor() {
    super(categories)
  }

  // Implémentation de l'interface CategoryRepositoryInterface
  async update(id: string, data: Partial<CategoryType>): Promise<CategoryType | null> {
    return await this.updateEntity(id, data as CategoryUpdateData)
  }
}
