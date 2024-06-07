import { desc, eq } from "drizzle-orm";

import { db } from "@/drizzle/config.db.server";
import { CreateRepository, repositories } from "@/drizzle/schemas/repositories.db.server";

export function getAllRepositories() {
  return db.select().from(repositories).orderBy(desc(repositories.id))
}

export function insertRepository(repository: CreateRepository) {
  return db.insert(repositories).values(repository)
}

export function deleteRepository(repositoryId: string) {
  return db.delete(repositories).where(eq(repositories.id, parseInt(repositoryId)))
}
