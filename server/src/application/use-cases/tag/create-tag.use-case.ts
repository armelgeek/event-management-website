import type { Tag } from '@/domain/models/tag.model'
import type { TagRepositoryImpl } from '@/infrastructure/repositories/tag.repository'

export class CreateTagUseCase {
  constructor(private readonly tagRepo: TagRepositoryImpl) {}

  async execute(data: Omit<Tag, 'id' | 'createdAt' | 'updatedAt'>) {
    const tag = await this.tagRepo.create(data)
    return { success: true, data: tag }
  }
}
