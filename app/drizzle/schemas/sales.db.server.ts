import { sqliteTable, integer, text } from "drizzle-orm/sqlite-core";

export const sales = sqliteTable('sales', {
  id: integer('id', { mode: "number" }).primaryKey({ autoIncrement: true }),
  customer: text('customer', { length: 256 }).notNull(),
  email: text('email', { length: 256 }).notNull(),
  amount: text('amount', { length: 256 }).notNull(),
  avatar: text('avatar', { length: 256 }).notNull()
});

export type Sales = typeof sales.$inferSelect
export type CreateSales = typeof sales.$inferInsert
