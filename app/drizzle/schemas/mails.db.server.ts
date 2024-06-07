import { blob, integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const mails = sqliteTable('mails', {
  id: integer('id', { mode: "number" }).primaryKey({ autoIncrement: true }),
  name: text('name', { length: 256 }).notNull(),
  email: text('email', { length: 256 }).notNull(),
  subject: text('subject', { length: 256 }).notNull(),
  text: text('text').notNull(),
  date: text('date').notNull(),
  read: integer('read', { mode: 'boolean' }).notNull(),
  labels: blob('labels', { mode: 'json' }).$type<string[]>()
})

export type Mail = typeof mails.$inferSelect
export type CreateMail = typeof mails.$inferInsert
