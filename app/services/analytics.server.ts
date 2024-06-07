import { desc } from "drizzle-orm";

import { db } from "@/drizzle/config.db.server";
import { analytics } from "@/drizzle/schemas/analytics.db.server";
import { delay } from "@/lib/utils";

export async function getAllAnalytics() {
  await delay(1000);
  const data = await db.select().from(analytics).orderBy(desc(analytics.id))

  return data.flat()
}
