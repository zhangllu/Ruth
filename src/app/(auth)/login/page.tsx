"use client"

import { useState, useRef } from "react"
import { authClient } from "@/lib/auth-client"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { toast } from "sonner"

type LoginMode = "otp" | "password"

export default function LoginPage() {
  const [mode, setMode] = useState<LoginMode>("otp")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [otp, setOtp] = useState("")
  const [loading, setLoading] = useState(false)
  const [otpSent, setOtpSent] = useState(false)
  const [countdown, setCountdown] = useState(0)
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const router = useRouter()

  const startCountdown = () => {
    setCountdown(60)
    timerRef.current = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timerRef.current!)
          timerRef.current = null
          return 0
        }
        return prev - 1
      })
    }, 1000)
  }

  const handleSendOtp = async () => {
    if (!email) {
      toast.error("请输入邮箱")
      return
    }
    setLoading(true)
    try {
      const res = await fetch("/api/auth/email-otp/send-verification-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, type: "sign-in" }),
      })
      const data = await res.json()
      if (!res.ok || data.error) {
        toast.error(data.error || data.message || "发送验证码失败")
        setLoading(false)
        return
      }
      setOtpSent(true)
      startCountdown()
      toast.success("验证码已发送")
    } catch {
      toast.error("发送验证码失败")
    }
    setLoading(false)
  }

  const handleOtpLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!otp) {
      toast.error("请输入验证码")
      return
    }
    setLoading(true)
    try {
      const res = await fetch("/api/auth/sign-in/email-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp }),
      })
      const data = await res.json()
      if (!res.ok || data.error) {
        toast.error(data.error || data.message || "登录失败")
        setLoading(false)
        return
      }
      toast.success("登录成功")
      router.push("/chat")
    } catch {
      toast.error("登录失败")
    }
    setLoading(false)
  }

  const handlePasswordLogin = async (e: React.FormEvent) => {
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

  const switchTo = (m: LoginMode) => {
    setMode(m)
    setOtp("")
    setOtpSent(false)
    if (timerRef.current) {
      clearInterval(timerRef.current)
      timerRef.current = null
    }
    setCountdown(0)
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-bg px-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="text-4xl mb-2">🧑‍🏫</div>
          <h1 className="text-xl font-semibold text-fg">登录问凯利</h1>
          <p className="text-sm text-fg-muted mt-1">登录后对话将保存在你的账户中</p>
        </div>

        {mode === "otp" ? (
          <form onSubmit={handleOtpLogin} className="flex flex-col gap-4">
            <input
              type="email"
              placeholder="邮箱"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={otpSent}
              className="rounded-xl border border-border bg-bg px-4 py-2.5 text-sm text-fg placeholder:text-fg-muted/50 outline-none focus:border-primary-300 focus:ring-1 focus:ring-primary-200 transition-colors disabled:opacity-50"
            />
            {otpSent && (
              <input
                type="text"
                inputMode="numeric"
                placeholder="输入验证码"
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))}
                required
                autoFocus
                className="rounded-xl border border-border bg-bg px-4 py-2.5 text-sm text-fg placeholder:text-fg-muted/50 outline-none focus:border-primary-300 focus:ring-1 focus:ring-primary-200 transition-colors tracking-widest text-center text-lg"
              />
            )}
            {!otpSent ? (
              <button
                type="button"
                onClick={handleSendOtp}
                disabled={loading}
                className="rounded-xl bg-primary-600 text-white py-2.5 text-sm font-medium hover:bg-primary-700 disabled:opacity-50 transition-colors"
              >
                {loading ? "发送中…" : "发送验证码"}
              </button>
            ) : (
              <div className="flex flex-col gap-3">
                <button
                  type="submit"
                  disabled={loading || otp.length < 6}
                  className="rounded-xl bg-primary-600 text-white py-2.5 text-sm font-medium hover:bg-primary-700 disabled:opacity-50 transition-colors"
                >
                  {loading ? "验证中…" : "登录"}
                </button>
                <button
                  type="button"
                  onClick={handleSendOtp}
                  disabled={countdown > 0}
                  className="text-sm text-fg-muted hover:text-primary-600 transition-colors disabled:opacity-40"
                >
                  {countdown > 0 ? `${countdown}s 后重新发送` : "重新发送验证码"}
                </button>
              </div>
            )}
          </form>
        ) : (
          <form onSubmit={handlePasswordLogin} className="flex flex-col gap-4">
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
        )}

        {/* 底部链接区 */}
        <div className="mt-6 flex items-center justify-center gap-4 text-sm text-fg-muted">
          <button
            type="button"
            onClick={() => switchTo(mode === "otp" ? "password" : "otp")}
            className="hover:text-primary-600 transition-colors"
          >
            {mode === "otp" ? "使用密码登录" : "使用验证码登录"}
          </button>
          <span className="text-border">|</span>
          <Link href="/register" className="hover:text-primary-600 transition-colors">
            没有账号？注册
          </Link>
        </div>
      </div>
    </div>
  )
}
