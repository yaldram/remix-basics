import { sqliteTable, integer, text } from "drizzle-orm/sqlite-core";

export const repositories = sqliteTable('repositories', {
  id: integer('id', { mode: "number" }).primaryKey({ autoIncrement: true }),
  name: text('name', { length: 256 }).notNull(),
  link: text('link', { length: 256 }).notNull(),
  organization: text('organization', { length: 256 }).notNull()
})

export type Respository = typeof repositories.$inferSelect
export type CreateRepository = typeof repositories.$inferInsert
