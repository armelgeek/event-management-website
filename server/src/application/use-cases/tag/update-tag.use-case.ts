import type { Tag } from '@/domain/models/tag.model'
import type { TagRepositoryImpl } from '@/infrastructure/repositories/tag.repository'

export class UpdateTagUseCase {
  constructor(private readonly tagRepo: TagRepositoryImpl) {}

  async execute(id: string, data: Partial<Omit<Tag, 'id' | 'createdAt' | 'updatedAt'>>) {
    const tag = await this.tagRepo.update(id, data)
    if (!tag) return { success: false, error: 'Not found' }
    return { success: true, data: tag }
  }
}
