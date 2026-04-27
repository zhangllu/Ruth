"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useSession } from "@/lib/auth-client"
import Link from "next/link"

interface UserRecord {
  id: string
  name: string
  email: string
  role: string
  usedTokens: number
  totalTokens: number
  createdAt: string
}

export default function AdminPage() {
  const { data: session, isPending } = useSession()
  const router = useRouter()
  const [users, setUsers] = useState<UserRecord[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (isPending) return
    if (!session) {
      router.replace("/login")
      return
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    if ((session.user as any).role !== "admin") {
      router.replace("/chat")
      return
    }
    fetchUsers()
  }, [session, isPending, router])

  const fetchUsers = async () => {
    try {
      const res = await fetch("/api/admin/users")
      const data = await res.json()
      if (res.ok) setUsers(data.users)
    } catch (err) {
      console.error("获取用户列表失败:", err)
    }
    setLoading(false)
  }

  if (isPending || !session) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-bg">
        <div className="text-sm text-fg-muted">加载中…</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-bg">
      <header className="border-b border-border bg-bg-card">
        <div className="mx-auto max-w-5xl flex items-center justify-between px-4 h-14">
          <div className="flex items-center gap-3">
            <Link href="/chat" className="text-sm text-fg-muted hover:text-fg transition-colors">
              ← 返回对话
            </Link>
            <h1 className="text-lg font-semibold text-fg">管理员面板</h1>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-4 py-8">
        <h2 className="text-base font-medium text-fg mb-4">用户列表</h2>

        {loading ? (
          <div className="text-sm text-fg-muted">加载中…</div>
        ) : (
          <div className="overflow-x-auto rounded-xl border border-border">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-bg-muted border-b border-border">
                  <th className="text-left px-4 py-3 text-fg-muted font-medium">邮箱</th>
                  <th className="text-left px-4 py-3 text-fg-muted font-medium">昵称</th>
                  <th className="text-left px-4 py-3 text-fg-muted font-medium">角色</th>
                  <th className="text-right px-4 py-3 text-fg-muted font-medium">Token 用量</th>
                  <th className="text-right px-4 py-3 text-fg-muted font-medium">注册时间</th>
                </tr>
              </thead>
              <tbody>
                {users.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="text-center px-4 py-8 text-fg-muted">
                      暂无用户
                    </td>
                  </tr>
                ) : (
                  users.map((u) => (
                    <tr key={u.id} className="border-b border-border last:border-b-0 hover:bg-bg-muted/50 transition-colors">
                      <td className="px-4 py-3 text-fg">{u.email}</td>
                      <td className="px-4 py-3 text-fg">{u.name || "-"}</td>
                      <td className="px-4 py-3">
                        <span className={`inline-block px-2 py-0.5 rounded text-xs font-medium ${
                          u.role === "admin"
                            ? "bg-primary-100 text-primary-700"
                            : "bg-bg-muted text-fg-muted"
                        }`}>
                          {u.role}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-right text-fg">
                        {u.usedTokens.toLocaleString()} / {u.totalTokens.toLocaleString()}
                        <div className="w-24 h-1 bg-bg-muted rounded-full overflow-hidden ml-auto mt-1">
                          <div
                            className="h-full bg-primary-400 rounded-full"
                            style={{ width: `${Math.min(100, (u.usedTokens / u.totalTokens) * 100)}%` }}
                          />
                        </div>
                      </td>
                      <td className="px-4 py-3 text-right text-fg-muted text-xs">
                        {new Date(u.createdAt).toLocaleDateString("zh-CN")}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </main>
    </div>
  )
}
