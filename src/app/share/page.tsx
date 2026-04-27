"use client"

import { useSearchParams } from "next/navigation"
import { useEffect, useState, Suspense } from "react"
import { decodeShareData, type SharedMessage } from "@/lib/share-utils"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"

function ShareContent() {
  const searchParams = useSearchParams()
  const [messages, setMessages] = useState<SharedMessage[] | null>(null)
  const [error, setError] = useState(false)

  useEffect(() => {
    const data = searchParams.get("d")
    if (!data) {
      setError(true)
      return
    }
    decodeShareData(data)
      .then((msgs) => setMessages(msgs))
      .catch(() => setError(true))
  }, [searchParams])

  if (error) {
    return (
      <div className="flex-1 flex items-center justify-center px-4">
        <div className="max-w-md text-center">
          <div className="text-6xl mb-4">🧑‍🏫</div>
          <h1 className="text-lg font-semibold text-fg mb-2">分享内容不存在</h1>
          <p className="text-sm text-fg-muted mb-6">链接可能已失效或格式不正确。</p>
          <Link
            href="/chat"
            className="inline-flex items-center gap-1.5 text-sm text-primary-600 hover:text-primary-700 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            去和凯利对话
          </Link>
        </div>
      </div>
    )
  }

  if (!messages) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="flex gap-1">
          <span className="typing-dot w-2.5 h-2.5 rounded-full bg-fg-muted" />
          <span className="typing-dot w-2.5 h-2.5 rounded-full bg-fg-muted" />
          <span className="typing-dot w-2.5 h-2.5 rounded-full bg-fg-muted" />
        </div>
      </div>
    )
  }

  return (
    <div className="flex-1 overflow-y-auto px-4 py-6">
      <div className="mx-auto max-w-2xl">
        {/* 顶部信息 */}
        <div className="text-center mb-8">
          <div className="text-3xl mb-2">🧑‍🏫</div>
          <h1 className="text-base font-semibold text-fg">凯利的对话</h1>
          <p className="text-xs text-fg-muted mt-1">
            基于乔治·凯利个人建构心理学
          </p>
        </div>

        {/* 消息列表 */}
        <div className="flex flex-col gap-4">
          {messages.map((msg, i) => {
            const isUser = msg.role === "user"
            return (
              <div key={i} className={`flex gap-3 items-start ${isUser ? "flex-row-reverse" : ""}`}>
                <div
                  className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-sm ${
                    isUser
                      ? "bg-primary-100 text-primary-700"
                      : "bg-accent-100 text-accent-700"
                  }`}
                >
                  {isUser ? <span className="text-xs">🧑</span> : <span className="text-xs">🧑‍🏫</span>}
                </div>
                <div
                  className={`max-w-[80%] rounded-2xl px-4 py-2.5 ${
                    isUser
                      ? "bg-primary-600 text-white rounded-tr-md"
                      : "bg-bg-muted text-fg rounded-tl-md"
                  }`}
                >
                  <div className="prose-kelly text-sm whitespace-pre-wrap [&_strong]:font-semibold">
                    {msg.content}
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        {/* 底部行动 */}
        <div className="text-center mt-8 pb-8">
          <Link
            href="/chat"
            className="inline-flex items-center gap-1.5 text-sm text-primary-600 hover:text-primary-700 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            去和凯利对话
          </Link>
        </div>
      </div>
    </div>
  )
}

export default function SharePage() {
  return (
    <div className="flex flex-col h-screen bg-bg">
      <Suspense
        fallback={
          <div className="flex-1 flex items-center justify-center">
            <div className="flex gap-1">
              <span className="typing-dot w-2.5 h-2.5 rounded-full bg-fg-muted" />
              <span className="typing-dot w-2.5 h-2.5 rounded-full bg-fg-muted" />
              <span className="typing-dot w-2.5 h-2.5 rounded-full bg-fg-muted" />
            </div>
          </div>
        }
      >
        <ShareContent />
      </Suspense>
    </div>
  )
}
