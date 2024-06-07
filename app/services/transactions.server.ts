import { desc } from "drizzle-orm";

import { db } from "@/drizzle/config.db.server";
import { transactions } from "@/drizzle/schemas/transactions.db.server";
import { delay } from "@/lib/utils";

export async function getAllTransactions() {
  await delay(4000);
  const data = await db.select().from(transactions).orderBy(desc(transactions.id))

  return data.flat()
}
