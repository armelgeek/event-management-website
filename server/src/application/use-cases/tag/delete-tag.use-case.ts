import type { TagRepositoryImpl } from '@/infrastructure/repositories/tag.repository'

export class DeleteTagUseCase {
  constructor(private readonly tagRepo: TagRepositoryImpl) {}

  async execute(id: string) {
    const ok = await this.tagRepo.delete(id)
    if (!ok) return { success: false, error: 'Not found' }
    return { success: true }
  }
}
