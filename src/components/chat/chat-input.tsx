"use client"

import { useState, useRef, useEffect } from "react"
import { useChatStore } from "@/lib/stores/chat-store"
import { Button } from "@/components/ui/button"
import { Send, Square } from "lucide-react"

export function ChatInput() {
  const [input, setInput] = useState("")
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const abortRef = useRef<AbortController | null>(null)
  const {
    currentConversationId,
    createConversation,
    addMessage,
    setStreaming,
    setStreamingContent,
    appendStreamingContent,
    isStreaming,
  } = useChatStore()

  // Auto-resize textarea
  useEffect(() => {
    const ta = textareaRef.current
    if (ta) {
      ta.style.height = "auto"
      ta.style.height = Math.min(ta.scrollHeight, 160) + "px"
    }
  }, [input])

  const handleSend = async () => {
    const content = input.trim()
    if (!content || isStreaming) return

    let convId = currentConversationId
    if (!convId) {
      convId = createConversation()
    }

    addMessage(convId, { role: "user", content })
    setInput("")

    setStreaming(true)
    setStreamingContent("")

    // 调用智谱 API
    abortRef.current = new AbortController()
    const conversationHistory = useChatStore.getState().conversations
      .find((c) => c.id === convId)
      ?.messages.slice(0, -1) // 排除刚添加的用户消息
      .map((m) => ({ role: m.role, content: m.content })) ?? []

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: content,
          conversationHistory,
        }),
        signal: abortRef.current.signal,
      })

      if (!response.ok) {
        throw new Error(`API 错误: ${response.status}`)
      }

      const reader = response.body!.getReader()
      const decoder = new TextDecoder()
      let aiContent = ""

      while (true) {
        const { done, value } = await reader.read()
        if (done) break

        const chunk = decoder.decode(value, { stream: true })
        const lines = chunk.split("\n")

        for (const line of lines) {
          try {
            const parsed = JSON.parse(line)
            if (parsed.text) {
              aiContent += parsed.text
              appendStreamingContent(parsed.text)
            }
          } catch {
            // 跳过非 JSON 行
          }
        }
      }

      addMessage(convId, { role: "assistant", content: aiContent })
    } catch (err: unknown) {
      if (err instanceof Error && err.name === "AbortError") return
      console.error("对话请求失败:", err)
      addMessage(convId, {
        role: "assistant",
        content: "抱歉，凯利似乎在思考……请稍后再试。",
      })
    } finally {
      setStreaming(false)
      setStreamingContent("")
      abortRef.current = null
    }
  }

  const handleStop = () => {
    abortRef.current?.abort()
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  return (
    <div className="border-t border-border bg-bg-card px-4 py-3">
      <div className="mx-auto flex max-w-3xl items-end gap-2">
        <textarea
          ref={textareaRef}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="请向凯利提问……"
          rows={1}
          disabled={isStreaming}
          className="flex-1 min-h-[44px] max-h-40 rounded-xl border border-border bg-bg px-4 py-3 text-sm text-fg placeholder:text-fg-muted/50 resize-none outline-none focus:border-primary-300 focus:ring-1 focus:ring-primary-200 transition-colors disabled:opacity-50"
        />
        <Button
          onClick={isStreaming ? handleStop : handleSend}
          disabled={!input.trim() && !isStreaming}
          size="icon"
          className={`h-11 w-11 rounded-xl shrink-0 ${
            isStreaming ? "bg-fg-muted" : ""
          }`}
        >
          {isStreaming ? (
            <Square className="w-4 h-4 fill-current" />
          ) : (
            <Send className="w-4 h-4" />
          )}
        </Button>
      </div>
    </div>
  )
}
