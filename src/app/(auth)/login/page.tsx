"use client"

import { useState, useRef } from "react"
import { authClient } from "@/lib/auth-client"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { toast } from "sonner"

type LoginMode = "password" | "otp"

export default function LoginPage() {
  const [mode, setMode] = useState<LoginMode>("password")
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
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { error } = await (authClient as any).sendVerificationOTP({
      email,
      type: "sign-in",
    })
    setLoading(false)
    if (error) {
      toast.error(error.message || "发送验证码失败")
      return
    }
    setOtpSent(true)
    startCountdown()
    toast.success("验证码已发送")
  }

  const handleOtpLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!otp) {
      toast.error("请输入验证码")
      return
    }
    setLoading(true)
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { error } = await (authClient as any).signIn.emailOTP({
      email,
      otp,
    })
    if (error) {
      toast.error(error.message || "登录失败")
      setLoading(false)
      return
    }
    toast.success("登录成功")
    router.push("/chat")
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

  const switchMode = (m: LoginMode) => {
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

        {/* 登录方式切换 */}
        <div className="flex rounded-xl border border-border p-1 mb-6">
          <button
            type="button"
            onClick={() => switchMode("password")}
            className={`flex-1 py-2 text-sm rounded-lg transition-colors ${
              mode === "password"
                ? "bg-primary-600 text-white font-medium"
                : "text-fg-muted hover:text-fg"
            }`}
          >
            密码登录
          </button>
          <button
            type="button"
            onClick={() => switchMode("otp")}
            className={`flex-1 py-2 text-sm rounded-lg transition-colors ${
              mode === "otp"
                ? "bg-primary-600 text-white font-medium"
                : "text-fg-muted hover:text-fg"
            }`}
          >
            验证码登录
          </button>
        </div>

        {mode === "password" ? (
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
        ) : (
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
        )}

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
