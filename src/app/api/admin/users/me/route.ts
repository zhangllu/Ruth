import { auth } from "@/lib/auth"
import { db } from "@/db"
import { user } from "@/db/schema"
import { eq } from "drizzle-orm"

export async function GET(req: Request) {
  const session = await auth.api.getSession({ headers: req.headers })
  if (!session) {
    return Response.json({ admin: false })
  }

  // 直接从数据库查 role，避免 session 数据不完整
  const [record] = await db
    .select({ role: user.role })
    .from(user)
    .where(eq(user.id, session.user.id))

  return Response.json({ admin: record?.role === "admin" })
}
