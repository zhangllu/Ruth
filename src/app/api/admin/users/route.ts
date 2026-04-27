import { auth } from "@/lib/auth"
import { db } from "@/db"
import { user } from "@/db/schema"
import { desc } from "drizzle-orm"

export async function GET(req: Request) {
  try {
    const session = await auth.api.getSession({ headers: req.headers })
    if (!session) {
      return Response.json({ error: "未登录" }, { status: 401 })
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    if ((session.user as any).role !== "admin") {
      return Response.json({ error: "无权限" }, { status: 403 })
    }

    const users = await db
      .select({
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        usedTokens: user.usedTokens,
        totalTokens: user.totalTokens,
        createdAt: user.createdAt,
      })
      .from(user)
      .orderBy(desc(user.createdAt))

    return Response.json({ users })
  } catch (error) {
    console.error("获取用户列表失败:", error)
    return Response.json({ error: "服务器错误" }, { status: 500 })
  }
}
