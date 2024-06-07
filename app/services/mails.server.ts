import { desc, eq, like } from "drizzle-orm";

import { db } from "@/drizzle/config.db.server";
import { mails } from "@/drizzle/schemas/mails.db.server";

export function getMails(search: string | null) {
  return search
    ? db.select().from(mails).where(like(mails.name, `%${search}%`)).orderBy(desc(mails.id))
    : db.select().from(mails).orderBy(desc(mails.id));
}

export function getMailById(mailId: number) {
  return db.select().from(mails).where(eq(mails.id, mailId))
}
