import type { Tag } from '@/domain/models/tag.model'
import type { TagRepositoryImpl } from '@/infrastructure/repositories/tag.repository'

export class GetTagByIdUseCase {
  constructor(private readonly tagRepo: TagRepositoryImpl) {}

  async execute(id: string) {
    const tag = await this.tagRepo.findById(id)
    if (!tag) return { success: false, error: 'Not found' }
    return { success: true, data: tag }
  }
}
