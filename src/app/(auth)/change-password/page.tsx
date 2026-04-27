"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { authClient } from "@/lib/auth-client"
import { toast } from "sonner"

export default function ChangePasswordPage() {
  const [currentPassword, setCurrentPassword] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault()

    if (newPassword !== confirmPassword) {
      toast.error("两次输入的新密码不一致")
      return
    }

    if (newPassword.length < 6) {
      toast.error("新密码至少 6 位")
      return
    }

    setLoading(true)

    // 通过 Better Auth 内置的 /change-password 端点
    const { error } = await authClient.changePassword({
      currentPassword,
      newPassword,
      revokeOtherSessions: true,
    })

    if (error) {
      toast.error(error.message || "修改密码失败")
      setLoading(false)
      return
    }

    toast.success("密码修改成功")
    router.push("/chat")
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-bg px-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="text-4xl mb-2">🔑</div>
          <h1 className="text-xl font-semibold text-fg">修改密码</h1>
          <p className="text-sm text-fg-muted mt-1">修改后将退出其他设备</p>
        </div>
        <form onSubmit={handleChangePassword} className="flex flex-col gap-4">
          <input
            type="password"
            placeholder="当前密码"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            required
            className="rounded-xl border border-border bg-bg px-4 py-2.5 text-sm text-fg placeholder:text-fg-muted/50 outline-none focus:border-primary-300 focus:ring-1 focus:ring-primary-200 transition-colors"
          />
          <input
            type="password"
            placeholder="新密码"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
            minLength={6}
            className="rounded-xl border border-border bg-bg px-4 py-2.5 text-sm text-fg placeholder:text-fg-muted/50 outline-none focus:border-primary-300 focus:ring-1 focus:ring-primary-200 transition-colors"
          />
          <input
            type="password"
            placeholder="确认新密码"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            minLength={6}
            className="rounded-xl border border-border bg-bg px-4 py-2.5 text-sm text-fg placeholder:text-fg-muted/50 outline-none focus:border-primary-300 focus:ring-1 focus:ring-primary-200 transition-colors"
          />
          <button
            type="submit"
            disabled={loading}
            className="rounded-xl bg-primary-600 text-white py-2.5 text-sm font-medium hover:bg-primary-700 disabled:opacity-50 transition-colors"
          >
            {loading ? "修改中…" : "修改密码"}
          </button>
        </form>
        <p className="text-center text-sm text-fg-muted mt-6">
          <button
            type="button"
            onClick={() => router.push("/chat")}
            className="text-primary-600 hover:text-primary-700"
          >
            返回对话
          </button>
        </p>
      </div>
    </div>
  )
}
