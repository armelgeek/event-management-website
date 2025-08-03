import { eq, inArray } from 'drizzle-orm'
import { categories, events, eventTags, tags } from '@/infrastructure/database/schema/schema'
import { db } from '../database/db'

export class EventRepository {
 
  async findById(id: string) {
    const event = await db.query.events.findFirst({ where: eq(events.id, id) })
    if (!event) return null

    let category = null
    if (event.categoryId) {
      category = await db.query.categories.findFirst({ where: eq(categories.id, event.categoryId) })
    }

    const eventTagRows = await db.query.eventTags.findMany({ where: eq(eventTags.eventId, id) })
    let tagList: any[] = []
    if (eventTagRows.length > 0) {
      const tagIds = eventTagRows.map((et) => et.tagId)
      tagList = await db.query.tags.findMany({ where: inArray(tags.id, tagIds) })
    }

    return {
      ...event,
      category,
      tags: tagList
    }
  }

  findAll({ skip = 0, limit = 20 } = {}) {
    return db.query.events.findMany({ offset: skip, limit })
  }

  async create(
    data: Omit<typeof events.$inferInsert, 'id' | 'createdAt' | 'updatedAt'> & { id?: string; tags?: string[] }
  ) {
    const now = new Date()
    const event = {
      ...data,
      id: data.id ?? crypto.randomUUID(),
      createdAt: now,
      updatedAt: now
    }
    await db.insert(events).values(event)
    // Ajout des tags associés si fournis
    if (data.tags && data.tags.length > 0) {
      const tagRows = data.tags.map((tagId) => ({ eventId: event.id, tagId }))
      await db.insert(eventTags).values(tagRows)
    }
    return event
  }

  async update(
    id: string,
    data: Partial<Omit<typeof events.$inferInsert, 'id' | 'createdAt' | 'updatedAt'>> & { tags?: string[] }
  ) {
    const now = new Date()
    await db
      .update(events)
      .set({ ...data, updatedAt: now })
      .where(eq(events.id, id))
    if (data.tags) {
      await db.delete(eventTags).where(eq(eventTags.eventId, id))
      if (data.tags.length > 0) {
        const tagRows = data.tags.map((tagId) => ({ eventId: id, tagId }))
        await db.insert(eventTags).values(tagRows)
      }
    }
    return this.findById(id)
  }

  async delete(id: string) {
    await db.delete(events).where(eq(events.id, id))
    return true
  }
}
