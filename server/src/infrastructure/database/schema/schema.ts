import { relations } from 'drizzle-orm'
import { integer, pgTable, real, text, timestamp, uniqueIndex, varchar } from 'drizzle-orm/pg-core'
import { users } from './auth'

export const categories = pgTable('category', {
  id: text('id').primaryKey(),
  name: varchar('name', { length: 100 }).notNull(),
  description: text('description'),
  createdAt: timestamp('createdAt', { withTimezone: true }).notNull(),
  updatedAt: timestamp('updatedAt', { withTimezone: true }).notNull()
})

export const tags = pgTable('tag', {
  id: text('id').primaryKey(),
  name: varchar('name', { length: 100 }).notNull(),
  description: text('description'),
  createdAt: timestamp('createdAt', { withTimezone: true }).notNull(),
  updatedAt: timestamp('updatedAt', { withTimezone: true }).notNull()
})

export const eventTags = pgTable(
  'event_tag',
  {
    eventId: text('eventId')
      .notNull()
      .references(() => events.id, { onDelete: 'cascade' }),
    tagId: text('tagId')
      .notNull()
      .references(() => tags.id, { onDelete: 'cascade' })
  },
  (table) => ({
    pk: uniqueIndex('event_tag_pk').on(table.eventId, table.tagId)
  })
)

export const events = pgTable('event', {
  id: text('id').primaryKey(),
  title: varchar('title', { length: 255 }).notNull(),
  description: text('description'),
  organizer: varchar('organizer', { length: 255 }),
  startDate: timestamp('startDate', { withTimezone: true }).notNull(),
  endDate: timestamp('endDate', { withTimezone: true }).notNull(),
  location: varchar('location', { length: 255 }).notNull(),
  price: real('price').notNull().default(0),
  maxAttendees: integer('maxAttendees').notNull().default(0),
  currentAttendees: integer('currentAttendees').notNull().default(0),
  imageUrl: text('imageUrl'),
  status: varchar('status', { length: 50 }).notNull().default('draft'),
  categoryId: text('categoryId').references(() => categories.id, { onDelete: 'set null' }),
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

export const eventsRelations = relations(events, ({ many, one }) => ({
  tickets: many(tickets),
  bookings: many(bookings),
  creator: one(users, {
    fields: [events.creatorId],
    references: [users.id]
  }),
  category: one(categories, {
    fields: [events.categoryId],
    references: [categories.id]
  })
}))

export const ticketsRelations = relations(tickets, ({ one, many }) => ({
  event: one(events, {
    fields: [tickets.eventId],
    references: [events.id]
  }),
  bookings: many(bookings)
}))

export const bookingsRelations = relations(bookings, ({ one }) => ({
  event: one(events, {
    fields: [bookings.eventId],
    references: [events.id]
  }),
  user: one(users, {
    fields: [bookings.userId],
    references: [users.id]
  }),
  ticket: one(tickets, {
    fields: [bookings.ticketId],
    references: [tickets.id]
  })
}))
