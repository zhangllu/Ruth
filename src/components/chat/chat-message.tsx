"use client"

import { Check } from "lucide-react"

export function ChatMessage({
  message,
  checked,
  onToggle,
}: {
  message: { id: string; role: string; content: string }
  checked?: boolean
  onToggle?: () => void
}) {
  const isUser = message.role === "user"

  if (message.role === "system") return null

  return (
    <div className={`group flex gap-3 items-start ${isUser ? "flex-row-reverse" : ""}`}>
      {/* 勾选框 */}
      {onToggle && (
        <button
          onClick={onToggle}
          className={`flex-shrink-0 mt-2.5 w-5 h-5 rounded border-2 flex items-center justify-center transition-all duration-150 ${
            checked
              ? "border-primary-500 bg-primary-500 text-white opacity-100"
              : "border-fg-muted/30 opacity-0 group-hover:opacity-100 hover:border-fg-muted/60"
          }`}
          aria-label={checked ? "取消选择" : "选择此消息"}
        >
          {checked && <Check className="w-3 h-3" strokeWidth={3} />}
        </button>
      )}

      <div
        className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-sm ${
          isUser
            ? "bg-primary-100 text-primary-700"
            : "bg-accent-100 text-accent-700"
        }`}
      >
        {isUser ? (
          <span className="text-xs">🧑</span>
        ) : (
          <span className="text-xs">🧑‍🏫</span>
        )}
      </div>
      <div
        className={`max-w-[80%] rounded-2xl px-4 py-2.5 transition-colors duration-150 ${
          isUser
            ? checked
              ? "bg-primary-500 text-white rounded-tr-md ring-2 ring-primary-300"
              : "bg-primary-600 text-white rounded-tr-md"
            : checked
              ? "bg-bg-muted text-fg rounded-tl-md ring-2 ring-primary-300"
              : "bg-bg-muted text-fg rounded-tl-md"
        }`}
      >
        <div className="prose-kelly text-sm whitespace-pre-wrap [&_strong]:font-semibold">
          {message.content}
        </div>
      </div>
    </div>
  )
}
