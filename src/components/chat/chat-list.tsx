"use client"

import { useRef, useEffect } from "react"
import { useChatStore } from "@/lib/stores/chat-store"
import { ChatMessage } from "./chat-message"
import { ScrollArea } from "@/components/ui/scroll-area"

export function ChatList() {
  const { currentConversationId, conversations, isStreaming, streamingContent } = useChatStore()
  const currentConv = conversations.find((c) => c.id === currentConversationId)
  const bottomRef = useRef<HTMLDivElement>(null)
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [currentConv?.messages.length, streamingContent])

  if (!currentConv || currentConv.messages.length === 0) {
    return (
      <div className="flex-1 flex items-center justify-center px-4">
        <div className="max-w-md text-center">
          <div className="text-4xl mb-4">🧑‍🏫</div>
          <h2 className="text-xl font-semibold text-fg mb-2">
            你好，我是乔治·凯利
          </h2>
          <p className="text-sm text-fg-muted leading-relaxed mb-6">
            欢迎来到问凯利。在这里，你可以向我提出任何你感兴趣的问题——
            关于我的理论，或者你生活中的困惑。
          </p>
          <div className="flex flex-col gap-2">
            <p className="text-xs text-fg-muted mb-1">试试问：</p>
            <button
              className="suggestion-btn text-center"
              onClick={() => {
                const input = document.querySelector<HTMLTextAreaElement>(
                  'textarea[placeholder*="提问"]'
                )
                if (input) {
                  input.value = "什么是个人建构心理学？"
                  input.dispatchEvent(
                    new Event("input", { bubbles: true })
                  )
                }
              }}
            >
              "什么是个人建构心理学？"
            </button>
            <button
              className="suggestion-btn text-center"
              onClick={() => {
                const input = document.querySelector<HTMLTextAreaElement>(
                  'textarea[placeholder*="提问"]'
                )
                if (input) {
                  input.value = "如何应对焦虑？"
                  input.dispatchEvent(
                    new Event("input", { bubbles: true })
                  )
                }
              }}
            >
              "如何应对焦虑？"
            </button>
            <button
              className="suggestion-btn text-center"
              onClick={() => {
                const input = document.querySelector<HTMLTextAreaElement>(
                  'textarea[placeholder*="提问"]'
                )
                if (input) {
                  input.value = "CPC 循环如何帮助决策？"
                  input.dispatchEvent(
                    new Event("input", { bubbles: true })
                  )
                }
              }}
            >
              "CPC 循环如何帮助决策？"
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div ref={scrollRef} className="flex-1 overflow-y-auto scrollbar-thin px-4 py-6">
      <div className="mx-auto max-w-3xl flex flex-col gap-4">
        {currentConv.messages.map((msg) => (
          <ChatMessage key={msg.id} message={msg} />
        ))}

        {/* 流式回复气泡 */}
        {isStreaming && streamingContent && (
          <ChatMessage
            message={{
              id: "streaming",
              role: "assistant",
              content: streamingContent,
            }}
          />
        )}

        {/* 流式加载指示器（刚启动还未收到内容时） */}
        {isStreaming && !streamingContent && (
          <div className="flex gap-3">
            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-accent-100 flex items-center justify-center">
              <span className="text-xs">🧑‍🏫</span>
            </div>
            <div className="bg-bg-muted rounded-2xl rounded-tl-md px-4 py-3">
              <div className="flex gap-1">
                <span className="typing-dot w-2 h-2 rounded-full bg-fg-muted" />
                <span className="typing-dot w-2 h-2 rounded-full bg-fg-muted" />
                <span className="typing-dot w-2 h-2 rounded-full bg-fg-muted" />
              </div>
            </div>
          </div>
        )}

        <div ref={bottomRef} />
      </div>
    </div>
  )
}
