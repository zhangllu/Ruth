"use client"

import { useState } from "react"
import { authClient } from "@/lib/auth-client"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { toast } from "sonner"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    const { error } = await authClient.signIn.email({ email, password })
    if (error) {
      toast.error(error.message || "登录失败")
      setLoading(false)
      return
    }
    toast.success("登录成功")
    router.push("/chat")
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-bg px-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="text-4xl mb-2">🧑‍🏫</div>
          <h1 className="text-xl font-semibold text-fg">登录问凯利</h1>
          <p className="text-sm text-fg-muted mt-1">登录后对话将保存在你的账户中</p>
        </div>
        <form onSubmit={handleLogin} className="flex flex-col gap-4">
          <input
            type="email"
            placeholder="邮箱"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="rounded-xl border border-border bg-bg px-4 py-2.5 text-sm text-fg placeholder:text-fg-muted/50 outline-none focus:border-primary-300 focus:ring-1 focus:ring-primary-200 transition-colors"
          />
          <input
            type="password"
            placeholder="密码"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="rounded-xl border border-border bg-bg px-4 py-2.5 text-sm text-fg placeholder:text-fg-muted/50 outline-none focus:border-primary-300 focus:ring-1 focus:ring-primary-200 transition-colors"
          />
          <button
            type="submit"
            disabled={loading}
            className="rounded-xl bg-primary-600 text-white py-2.5 text-sm font-medium hover:bg-primary-700 disabled:opacity-50 transition-colors"
          >
            {loading ? "登录中…" : "登录"}
          </button>
        </form>
        <p className="text-center text-sm text-fg-muted mt-6">
          还没有账号？{" "}
          <Link href="/register" className="text-primary-600 hover:text-primary-700">
            注册
          </Link>
        </p>
      </div>
    </div>
  )
}
