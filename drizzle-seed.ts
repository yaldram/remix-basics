import { drizzle } from "drizzle-orm/better-sqlite3";
import Database from "better-sqlite3";

import { analytics } from "@/drizzle/schemas/analytics.db.server";
import { mails } from "@/drizzle/schemas/mails.db.server";
import { sales } from "@/drizzle/schemas/sales.db.server";
import { transactions } from "@/drizzle/schemas/transactions.db.server";

import analyticsData from "./seeds/analytics.json"
import mailsData from "./seeds/mails.json"
import salesData from "./seeds/sales.json"
import transactionsData from "./seeds/transactions.json"

async function main() {
  const betterSqlite = new Database("sqlite.db");
  const db = drizzle(betterSqlite);

  console.log("Seed start");

  try {
    console.log("started seeding database");
    await db.insert(analytics).values(analyticsData);
    await db.insert(mails).values(mailsData)
    await db.insert(sales).values(salesData)
    await db.insert(transactions).values(transactionsData);
    console.log("database seeded successfully")
    betterSqlite.close()
    process.exit();
  } catch (error) {
    console.log("Error seeding database", error);
    betterSqlite.close()
    process.exit(1);
  }
}

main();
