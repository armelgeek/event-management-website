import { integer, pgTable, real, text, timestamp, uniqueIndex, varchar } from 'drizzle-orm/pg-core'
import { users } from './auth'

export const events = pgTable('event', {
  id: text('id').primaryKey(),
  name: varchar('name', { length: 255 }).notNull(),
  image: text('image'),
  startDate: timestamp('startDate', { withTimezone: true }).notNull(),
  endDate: timestamp('endDate', { withTimezone: true }).notNull(),
  location: varchar('location', { length: 255 }).notNull(),
  description: text('description'),
  createdAt: timestamp('createdAt', { withTimezone: true }).notNull(),
  updatedAt: timestamp('updatedAt', { withTimezone: true }).notNull(),
  creatorId: text('creatorId')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' })
})

export const tickets = pgTable('ticket', {
  id: text('id').primaryKey(),
  name: varchar('name', { length: 255 }).notNull(),
  price: real('price').notNull().default(0),
  quantity: integer('quantity').notNull(),
  eventId: text('eventId')
    .notNull()
    .references(() => events.id, { onDelete: 'cascade' }),
  createdAt: timestamp('createdAt', { withTimezone: true }).notNull(),
  updatedAt: timestamp('updatedAt', { withTimezone: true }).notNull()
})

export const bookings = pgTable('booking', {
  id: text('id').primaryKey(),
  eventId: text('eventId')
    .notNull()
    .references(() => events.id, { onDelete: 'cascade' }),
  userId: text('userId')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  ticketId: text('ticketId')
    .notNull()
    .references(() => tickets.id, { onDelete: 'cascade' }),
  createdAt: timestamp('createdAt', { withTimezone: true }).notNull(),
  updatedAt: timestamp('updatedAt', { withTimezone: true }).notNull()
})
