import { desc } from "drizzle-orm";

import { db } from "@/drizzle/config.db.server";
import { sales } from "@/drizzle/schemas/sales.db.server";
import { delay } from "@/lib/utils";

export async function getAllSales() {
  await delay(3000);
  throw new Error('failed to load sales data');
  const data = await db.select().from(sales).orderBy(desc(sales.id))

  return data.flat()
}
