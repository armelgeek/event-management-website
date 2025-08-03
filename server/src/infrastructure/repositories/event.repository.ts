import { eq } from 'drizzle-orm'
import { events } from '@/infrastructure/database/schema/schema'
import { db } from '../database/db'

export class EventRepository {
  findById(id: string) {
    return db.query.events.findFirst({ where: eq(events.id, id) })
  }

  findAll({ skip = 0, limit = 20 } = {}) {
    return db.query.events.findMany({ offset: skip, limit })
  }

  async create(data: Omit<typeof events.$inferInsert, 'id' | 'createdAt' | 'updatedAt'> & { id?: string }) {
    const now = new Date()
    const event = {
      ...data,
      id: data.id ?? crypto.randomUUID(),
      createdAt: now,
      updatedAt: now
    }
    await db.insert(events).values(event)
    return event
  }

  async update(id: string, data: Partial<Omit<typeof events.$inferInsert, 'id' | 'createdAt' | 'updatedAt'>>) {
    const now = new Date()
    await db
      .update(events)
      .set({ ...data, updatedAt: now })
      .where(eq(events.id, id))
    return this.findById(id)
  }

  async delete(id: string) {
    await db.delete(events).where(eq(events.id, id))
    return true
  }
}
