import {
  sqliteTable,
  text,
  integer,
  real,
  uniqueIndex
} from 'drizzle-orm/sqlite-core';

export const users = sqliteTable('user', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  email: text('email').notNull(),
  emailVerified: integer('emailVerified', { mode: 'boolean' }).notNull(),
  image: text('image'),
  createdAt: integer('createdAt', { mode: 'timestamp' }).notNull(),
  updatedAt: integer('updatedAt', { mode: 'timestamp' }).notNull(),
  role: text('role'),
  banned: integer('banned', { mode: 'boolean' }),
  banReason: text('banReason'),
  banExpires: integer('banExpires', { mode: 'timestamp' }),
},
  (table) => ({
    emailIdx: uniqueIndex('user_email_idx').on(table.email),
  })
);

export const events = sqliteTable('event', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  image: text('image'),
  startDate: integer('startDate', { mode: 'timestamp' }).notNull(),
  endDate: integer('endDate', { mode: 'timestamp' }).notNull(),
  location: text('location').notNull(),
  description: text('description'),
  createdAt: integer('createdAt', { mode: 'timestamp' }).notNull(),
  updatedAt: integer('updatedAt', { mode: 'timestamp' }).notNull(),
  creatorId: text('creatorId').notNull().references(() => users.id, { onDelete: 'cascade' }),
});

export const tickets = sqliteTable('ticket', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  price: real('price').notNull().default(0),
  quantity: integer('quantity').notNull(),
  eventId: text('eventId').notNull().references(() => events.id, { onDelete: 'cascade' }),
  createdAt: integer('createdAt', { mode: 'timestamp' }).notNull(),
  updatedAt: integer('updatedAt', { mode: 'timestamp' }).notNull(),
});

export const bookings = sqliteTable('booking', {
  id: text('id').primaryKey(),
  eventId: text('eventId').notNull().references(() => events.id, { onDelete: 'cascade' }),
  userId: text('userId').notNull().references(() => users.id, { onDelete: 'cascade' }),
  ticketId: text('ticketId').notNull().references(() => tickets.id, { onDelete: 'cascade' }),
  createdAt: integer('createdAt', { mode: 'timestamp' }).notNull(),
  updatedAt: integer('updatedAt', { mode: 'timestamp' }).notNull(),
});
