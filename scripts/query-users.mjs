import { neon } from "@neondatabase/serverless"
import { drizzle } from "drizzle-orm/neon-http"
import * as schema from "../src/db/schema.ts"

const sql = neon(process.env.DATABASE_URL)
const db = drizzle(sql, { schema })

const users = await db.select().from(schema.user).orderBy(schema.user.createdAt)
for (const u of users) {
  console.log(`${u.id.slice(0,8)}... | ${(u.email || "").padEnd(28)} | ${(u.role || "").padEnd(8)} | used:${u.usedTokens}/${u.totalTokens} | ${u.createdAt}`)
}
