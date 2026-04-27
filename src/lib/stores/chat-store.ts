import { create } from "zustand"
import { persist, createJSONStorage } from "zustand/middleware"
import { v4 as uuidv4 } from "uuid"
import { MOCK_CONVERSATIONS, type Conversation, type Message } from "@/data/mock/conversations"

interface ChatState {
  conversations: Conversation[]
  currentConversationId: string | null
  useMockMode: boolean
  isStreaming: boolean

  createConversation: () => string
  deleteConversation: (id: string) => void
  setCurrentConversation: (id: string | null) => void
  addMessage: (conversationId: string, message: Omit<Message, "id" | "createdAt">) => void
  setStreaming: (streaming: boolean) => void
  setMockMode: (mock: boolean) => void
  getCurrentConversation: () => Conversation | undefined
}

export const useChatStore = create<ChatState>()(
  persist(
    (set, get) => ({
      conversations: MOCK_CONVERSATIONS,
      currentConversationId: null,
      useMockMode: true,
      isStreaming: false,

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

      setMockMode: (mock) => set({ useMockMode: mock }),

      getCurrentConversation: () => {
        const { conversations, currentConversationId } = get()
        return conversations.find((c) => c.id === currentConversationId)
      },
    }),
    {
      name: "ask-kelly-chat",
      storage: createJSONStorage(() => localStorage),
    }
  )
)
