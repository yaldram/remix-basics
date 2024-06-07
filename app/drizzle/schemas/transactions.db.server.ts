import { sqliteTable, integer, text } from "drizzle-orm/sqlite-core";

export const transactions = sqliteTable('transactions', {
  id: integer('id', { mode: "number" }).primaryKey({ autoIncrement: true }),
  customer: text('customer', { length: 256 }).notNull(),
  email: text('email', { length: 256 }).notNull(),
  amount: text('amount', { length: 256 }).notNull()
});

export type Transaction = typeof transactions.$inferSelect
export type CreateTransaction = typeof transactions.$inferInsert
