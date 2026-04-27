import { create } from "zustand"
import { persist, createJSONStorage } from "zustand/middleware"
import {
  MOCK_KNOWLEDGE_ENTRIES,
  KNOWLEDGE_CATEGORIES,
  type KnowledgeEntry,
} from "@/data/mock/knowledge"

interface KnowledgeState {
  entries: KnowledgeEntry[]
  activeCategory: string | null
  searchQuery: string

  setActiveCategory: (category: string | null) => void
  setSearchQuery: (query: string) => void
  getFilteredEntries: () => KnowledgeEntry[]
  getEntryBySlug: (slug: string) => KnowledgeEntry | undefined
  getEntriesByCategory: (category: string) => KnowledgeEntry[]
}

export const useKnowledgeStore = create<KnowledgeState>()(
  persist(
    (set, get) => ({
      entries: MOCK_KNOWLEDGE_ENTRIES,
      activeCategory: null,
      searchQuery: "",

      setActiveCategory: (category) => {
        set({ activeCategory: category })
      },

      setSearchQuery: (query) => {
        set({ searchQuery: query })
      },

      getFilteredEntries: () => {
        const { entries, searchQuery, activeCategory } = get()
        let filtered = entries
        if (activeCategory) {
          filtered = filtered.filter((e) => e.category === activeCategory)
        }
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase()
          filtered = filtered.filter(
            (e) =>
              e.title.toLowerCase().includes(q) ||
              e.concept.toLowerCase().includes(q) ||
              e.definition.toLowerCase().includes(q)
          )
        }
        return filtered
      },

      getEntryBySlug: (slug) => {
        return get().entries.find((e) => e.slug === slug)
      },

      getEntriesByCategory: (category) => {
        return get().entries.filter((e) => e.category === category)
      },
    }),
    {
      name: "ask-kelly-knowledge",
      storage: createJSONStorage(() => localStorage),
    }
  )
)

export { KNOWLEDGE_CATEGORIES }
