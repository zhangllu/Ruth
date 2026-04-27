"use client"

import { useChatStore } from "@/lib/stores/chat-store"
import { ChatList } from "@/components/chat/chat-list"
import { ChatInput } from "@/components/chat/chat-input"
import { Button } from "@/components/ui/button"
import { Sidebar, MessageSquarePlus, Trash2 } from "lucide-react"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { useState, useEffect } from "react"
import { useSession, signOut } from "@/lib/auth-client"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { toast } from "sonner"

function ConversationSidebar({
  onSelect,
  onClose,
  usedTokens = 0,
  totalTokens = 100000,
}: {
  onSelect: () => void
  onClose: () => void
  usedTokens?: number
  totalTokens?: number
}) {
  const { conversations, currentConversationId, createConversation, setCurrentConversation, deleteConversation } =
    useChatStore()

  const handleNew = () => {
    createConversation()
    onSelect()
  }

  const handleSelect = (id: string) => {
    setCurrentConversation(id)
    onSelect()
  }

  const handleDelete = (e: React.MouseEvent, id: string) => {
    e.stopPropagation()
    deleteConversation(id)
  }

  const handleLogout = async () => {
    await signOut()
    toast.success("已退出登录")
  }

  return (
    <div className="flex flex-col h-full">
      <div className="p-3 border-b border-border">
        <Button
          variant="outline"
          className="w-full gap-2 text-sm"
          onClick={handleNew}
        >
          <MessageSquarePlus className="w-4 h-4" />
          新建对话
        </Button>
      </div>
      <div className="flex-1 overflow-y-auto scrollbar-thin">
        {conversations.length === 0 ? (
          <div className="p-4 text-center text-sm text-fg-muted">
            暂无对话
          </div>
        ) : (
          conversations.map((conv) => (
            <button
              key={conv.id}
              onClick={() => handleSelect(conv.id)}
              className={`w-full text-left px-3 py-2.5 text-sm transition-colors flex items-center justify-between group ${
                conv.id === currentConversationId
                  ? "bg-primary-50 text-primary-700"
                  : "text-fg-muted hover:bg-bg-muted hover:text-fg"
              }`}
            >
              <span className="truncate flex-1">{conv.title}</span>
              <button
                onClick={(e) => handleDelete(e, conv.id)}
                className="opacity-0 group-hover:opacity-100 p-1 hover:text-destructive transition-all"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </button>
          ))
        )}
      </div>
      <div className="border-t border-border p-3 space-y-2">
        <div className="px-3 py-1.5">
          <div className="flex items-center justify-between text-xs text-fg-muted mb-1">
            <span>剩余配额</span>
            <span>{Math.max(0, totalTokens - usedTokens).toLocaleString()} / {totalTokens.toLocaleString()}</span>
          </div>
          <div className="w-full h-1.5 bg-bg-muted rounded-full overflow-hidden">
            <div
              className="h-full bg-primary-400 rounded-full transition-all"
              style={{ width: `${Math.min(100, (usedTokens / totalTokens) * 100)}%` }}
            />
          </div>
        </div>
        <Link
          href="/change-password"
          className="block w-full text-left px-3 py-2 text-sm text-fg-muted hover:text-fg hover:bg-bg-muted rounded-md transition-colors"
        >
          修改密码
        </Link>
        <button
          onClick={handleLogout}
          className="w-full text-left px-3 py-2 text-sm text-fg-muted hover:text-destructive hover:bg-destructive/5 rounded-md transition-colors"
        >
          退出登录
        </button>
      </div>
    </div>
  )
}

export default function ChatPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const { data: session, isPending, refetch } = useSession()
  const router = useRouter()

  useEffect(() => {
    if (!isPending && !session) {
      router.replace("/login")
    }
  }, [session, isPending, router])

  // 每 15 秒刷新会话数据（更新 token 配额显示）
  useEffect(() => {
    if (!session) return
    const id = setInterval(() => {
      refetch()
    }, 15000)
    return () => clearInterval(id)
  }, [session, refetch])

  if (isPending) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-bg">
        <div className="text-sm text-fg-muted">加载中…</div>
      </div>
    )
  }

  if (!session) return null

  return (
    <div className="flex flex-col h-screen">
      {/* 桌面端使用完整布局 */}
      <div className="hidden md:flex flex-col h-full">
        <Header />
        <div className="flex flex-1 overflow-hidden">
          {/* 桌面端侧边栏 */}
          <aside className="w-64 border-r border-border bg-bg-card flex-shrink-0">
            <ConversationSidebar
              onSelect={() => {}}
              onClose={() => {}}
              usedTokens={(session.user as Record<string, unknown>).usedTokens as number}
              totalTokens={(session.user as Record<string, unknown>).totalTokens as number}
            />
          </aside>

          {/* 对话主区域 */}
          <div className="flex-1 flex flex-col">
            <div className="flex items-center justify-between px-4 py-2 border-b border-border bg-bg-card">
              <span className="text-sm font-medium text-fg">
                {useChatStore.getState().getCurrentConversation()?.title || "新对话"}
              </span>
            </div>
            <ChatList />
            <ChatInput />
          </div>
        </div>
      </div>

      {/* 移动端布局 */}
      <div className="md:hidden flex flex-col h-full">
        <header className="flex items-center justify-between px-4 py-2.5 border-b border-border bg-bg-card">
          <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
            <SheetTrigger className="flex items-center justify-center h-9 w-9">
              <Sidebar className="w-5 h-5" />
            </SheetTrigger>
            <SheetContent side="left" className="w-72 p-0">
              <ConversationSidebar
                onSelect={() => setSidebarOpen(false)}
                onClose={() => setSidebarOpen(false)}
                usedTokens={(session.user as Record<string, unknown>).usedTokens as number}
                totalTokens={(session.user as Record<string, unknown>).totalTokens as number}
              />
            </SheetContent>
          </Sheet>
          <span className="text-sm font-medium text-fg truncate px-2">
            {useChatStore.getState().getCurrentConversation()?.title || "问凯利"}
          </span>
          <div className="w-9" />
        </header>
        <ChatList />
        <ChatInput />
      </div>
    </div>
  )
}
