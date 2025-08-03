import { count, eq } from 'drizzle-orm'
import { db } from '@/infrastructure/database/db'
import { tags } from '@/infrastructure/database/schema/schema'
import type { Tag } from '@/domain/models/tag.model'

export class TagRepositoryImpl {
  async findAll({ skip = 0, limit = 10 } = {}): Promise<{ items: Tag[]; total: number }> {
    const [totalResult] = await db.select({ value: count() }).from(tags)
    const total = Number(totalResult?.value ?? 0)
    const rows = await db.select().from(tags).offset(skip).limit(limit)
    const items = rows.map((row) => ({
      ...row,
      description: row.description ?? undefined
    }))
    return { items, total }
  }

  async findById(id: string): Promise<Tag | null> {
    const [row] = await db.select().from(tags).where(eq(tags.id, id))
    if (!row) return null
    return { ...row, description: row.description ?? undefined }
  }

  async create(data: Omit<Tag, 'id' | 'createdAt' | 'updatedAt'>): Promise<Tag> {
    const now = new Date()
    const [row] = await db
      .insert(tags)
      .values({ ...data, id: crypto.randomUUID(), createdAt: now, updatedAt: now })
      .returning()
    return { ...row, description: row.description ?? undefined }
  }

  async update(id: string, data: Partial<Omit<Tag, 'id' | 'createdAt' | 'updatedAt'>>): Promise<Tag | null> {
    const [row] = await db
      .update(tags)
      .set({ ...data, updatedAt: new Date() })
      .where(eq(tags.id, id))
      .returning()
    if (!row) return null
    return { ...row, description: row.description ?? undefined }
  }

  async delete(id: string): Promise<boolean> {
    const [row] = await db.delete(tags).where(eq(tags.id, id)).returning()
    return !!row
  }
}
