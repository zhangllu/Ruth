import { create } from "zustand"
import { persist, createJSONStorage } from "zustand/middleware"
import { v4 as uuidv4 } from "uuid"
import { MOCK_CONVERSATIONS, type Conversation, type Message } from "@/data/mock/conversations"

interface ChatState {
  conversations: Conversation[]
  currentConversationId: string | null
  isStreaming: boolean
  streamingContent: string

  createConversation: () => string
  deleteConversation: (id: string) => void
  setCurrentConversation: (id: string | null) => void
  addMessage: (conversationId: string, message: Omit<Message, "id" | "createdAt">) => void
  setStreaming: (streaming: boolean) => void
  setStreamingContent: (content: string) => void
  appendStreamingContent: (chunk: string) => void
  getCurrentConversation: () => Conversation | undefined
}

export const useChatStore = create<ChatState>()(
  persist(
    (set, get) => ({
      conversations: MOCK_CONVERSATIONS,
      currentConversationId: null,
      isStreaming: false,
      streamingContent: "",

      createConversation: () => {
        const id = uuidv4()
        const now = new Date().toISOString()
        const conv: Conversation = {
          id,
          title: "新对话",
          messages: [],
          createdAt: now,
          updatedAt: now,
        }
        set((s) => ({
          conversations: [conv, ...s.conversations],
          currentConversationId: id,
        }))
        return id
      },

      deleteConversation: (id) => {
        set((s) => ({
          conversations: s.conversations.filter((c) => c.id !== id),
          currentConversationId:
            s.currentConversationId === id ? null : s.currentConversationId,
        }))
      },

      setCurrentConversation: (id) => set({ currentConversationId: id }),

      addMessage: (conversationId, message) => {
        const msg: Message = {
          ...message,
          id: uuidv4(),
          createdAt: new Date().toISOString(),
        }
        set((s) => ({
          conversations: s.conversations.map((c) => {
            if (c.id !== conversationId) return c
            const title =
              c.messages.length === 0 ? message.content.slice(0, 30) + (message.content.length > 30 ? "…" : "") : c.title
            return {
              ...c,
              title,
              messages: [...c.messages, msg],
              updatedAt: new Date().toISOString(),
            }
          }),
        }))
      },

      setStreaming: (streaming) => set({ isStreaming: streaming }),

      setStreamingContent: (content) => set({ streamingContent: content }),

      appendStreamingContent: (chunk) =>
        set((s) => ({ streamingContent: s.streamingContent + chunk })),

      getCurrentConversation: () => {
        const { conversations, currentConversationId } = get()
        return conversations.find((c) => c.id === currentConversationId)
      },
    }),
    {
      name: "ask-kelly-chat",
      storage: createJSONStorage(() => localStorage),
      // 只持久化对话数据
      partialize: (state) => ({
        conversations: state.conversations,
        currentConversationId: state.currentConversationId,
      }),
      // 确保流式状态永远从初始值开始，不受 localStorage 影响
      merge: (persisted, current) => ({
        ...current,
        ...(persisted as Partial<ChatState>),
        isStreaming: false,
        streamingContent: "",
      }),
    }
  )
)
