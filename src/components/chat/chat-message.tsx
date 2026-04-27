"use client"

import { useChatStore } from "@/lib/stores/chat-store"
import { Bot, User } from "lucide-react"

export function ChatMessage({ message }: { message: { id: string; role: string; content: string } }) {
  const isUser = message.role === "user"

  if (message.role === "system") return null

  return (
    <div className={`flex gap-3 ${isUser ? "flex-row-reverse" : ""}`}>
      <div
        className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-sm ${
          isUser
            ? "bg-primary-100 text-primary-700"
            : "bg-accent-100 text-accent-700"
        }`}
      >
        {isUser ? (
          <User className="w-4 h-4" />
        ) : (
          <span className="text-xs">🧑‍🏫</span>
        )}
      </div>
      <div
        className={`max-w-[80%] rounded-2xl px-4 py-2.5 ${
          isUser
            ? "bg-primary-600 text-white rounded-tr-md"
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
