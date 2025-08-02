import { pgTable, text, varchar, integer, real, timestamp, uniqueIndex } from 'drizzle-orm/pg-core';

export const users = pgTable(
  'user',
  {
    id: text('id').primaryKey(),
    name: varchar('name', { length: 255 }).notNull(),
    email: varchar('email', { length: 255 }).notNull(),
    emailVerified: integer('emailVerified').notNull(),
    image: text('image'),
    createdAt: timestamp('createdAt', { withTimezone: true }).notNull(),
    updatedAt: timestamp('updatedAt', { withTimezone: true }).notNull(),
    role: varchar('role', { length: 50 }),
    banned: integer('banned'),
    banReason: text('banReason'),
    banExpires: timestamp('banExpires', { withTimezone: true })
  },
  (table) => ({
    emailIdx: uniqueIndex('user_email_idx').on(table.email)
  })
);

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
});

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
});

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
});
