import { neon } from "@neondatabase/serverless"
import { drizzle } from "drizzle-orm/neon-http"
import * as schema from "../src/db/schema.ts"
import { eq } from "drizzle-orm"

const sql = neon(process.env.DATABASE_URL)
const db = drizzle(sql, { schema })

// 将第一个用户设为 admin
const [user] = await db.update(schema.user)
  .set({ role: "admin" })
  .where(eq(schema.user.email, "1162543155@qq.com"))
  .returning()

console.log("已设为管理员:", user.email, "→", user.role)
