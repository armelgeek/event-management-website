import type { Tag } from '@/domain/models/tag.model'
import type { TagRepositoryImpl } from '@/infrastructure/repositories/tag.repository'

export class GetAllTagsUseCase {
  constructor(private readonly tagRepo: TagRepositoryImpl) {}

  async execute(page = 1, limit = 10) {
    const skip = (page - 1) * limit
    const { items, total } = await this.tagRepo.findAll({ skip, limit })
    return {
      success: true,
      data: items,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit)
    }
  }
}
