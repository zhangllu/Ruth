"use client"

import { useRef, useEffect, useState, useCallback } from "react"
import { useChatStore } from "@/lib/stores/chat-store"
import { ChatMessage } from "./chat-message"
import { Share2, X } from "lucide-react"
import { toast } from "sonner"
import { shareMessages, buildShareUrl } from "@/lib/share-utils"

export function ChatList() {
  const { currentConversationId, conversations, isStreaming, streamingContent } = useChatStore()
  const currentConv = conversations.find((c) => c.id === currentConversationId)
  const bottomRef = useRef<HTMLDivElement>(null)
  const scrollRef = useRef<HTMLDivElement>(null)
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set())

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [currentConv?.messages.length, streamingContent])

  // 切换对话时清空选中
  useEffect(() => {
    setSelectedIds(new Set())
  }, [currentConversationId])

  const toggleSelect = useCallback((id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }, [])

  const clearSelection = useCallback(() => {
    setSelectedIds(new Set())
  }, [])

  const handleShare = useCallback(async () => {
    if (!currentConv) return
    const ids = selectedIds.size > 0 ? selectedIds : new Set(currentConv.messages.map((m) => m.id))
    const selected = currentConv.messages.filter((m) => ids.has(m.id) && m.role !== "system")
    if (selected.length === 0) {
      toast.error("没有可分享的消息")
      return
    }
    try {
      const messages = selected.map((m) => ({ role: m.role as "user" | "assistant", content: m.content }))
      const id = await shareMessages(messages)
      const url = buildShareUrl(id)
      await navigator.clipboard.writeText(url)
      toast.success("分享链接已复制到剪贴板")
      clearSelection()
    } catch (e) {
      toast.error("分享失败，请稍后重试。")
    }
  }, [currentConv, selectedIds, clearSelection])

  const hasSelection = selectedIds.size > 0

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
    <>
      <div ref={scrollRef} className="flex-1 overflow-y-auto scrollbar-thin px-4 py-6">
        <div className="mx-auto max-w-3xl flex flex-col gap-4">
          {currentConv.messages.map((msg) => (
            <ChatMessage
              key={msg.id}
              message={msg}
              checked={selectedIds.has(msg.id)}
              onToggle={isStreaming ? undefined : () => toggleSelect(msg.id)}
            />
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

          {/* 流式加载指示器 */}
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

      {/* 选中浮层工具栏 */}
      {hasSelection && !isStreaming && (
        <div className="flex justify-center -mt-14 pb-2 relative z-10 pointer-events-none">
          <div className="pointer-events-auto flex items-center gap-3 rounded-full border border-border bg-bg-card px-4 py-2 shadow-lg">
            <span className="text-sm text-fg-muted whitespace-nowrap">
              已选择 <span className="font-medium text-fg">{selectedIds.size}</span> 条
            </span>
            <div className="w-px h-4 bg-border" />
            <button
              onClick={handleShare}
              className="flex items-center gap-1.5 text-sm text-primary-600 hover:text-primary-700 transition-colors"
            >
              <Share2 className="w-4 h-4" />
              分享
            </button>
            <button
              onClick={clearSelection}
              className="flex items-center gap-1.5 text-sm text-fg-muted hover:text-fg transition-colors"
            >
              <X className="w-4 h-4" />
              取消
            </button>
          </div>
        </div>
      )}
    </>
  )
}
