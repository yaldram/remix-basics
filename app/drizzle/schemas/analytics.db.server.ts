import { sqliteTable, integer, text } from "drizzle-orm/sqlite-core";

export const analytics = sqliteTable('analytics', {
  id: integer('id', { mode: "number" }).primaryKey({ autoIncrement: true }),
  title: text('title', { length: 256 }).notNull(),
  value: text('value', { length: 256 }).notNull(),
  change: text('change', { length: 256 }).notNull()
});

export type Analytics = typeof analytics.$inferSelect
export type CreateAnalytics = typeof analytics.$inferInsert
