"use client"

import { useState, useRef, useEffect } from "react"
import { useChatStore } from "@/lib/stores/chat-store"
import { streamMockResponse } from "@/lib/mock/ai-responses"
import { Button } from "@/components/ui/button"
import { Send, Square } from "lucide-react"

export function ChatInput() {
  const [input, setInput] = useState("")
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const { currentConversationId, createConversation, addMessage, setStreaming, isStreaming } = useChatStore()

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

    // 模拟 AI 回复
    setStreaming(true)
    let aiContent = ""
    try {
      for await (const char of streamMockResponse(content)) {
        aiContent += char
        // Update the last assistant message in real-time
        // For mock mode, we update after streaming completes
      }
      // Add the complete response
      addMessage(convId, { role: "assistant", content: aiContent })
    } catch {
      addMessage(convId, {
        role: "assistant",
        content: "抱歉，凯利似乎在思考……请稍后再试。",
      })
    }
    setStreaming(false)
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
          onClick={isStreaming ? () => {} : handleSend}
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
