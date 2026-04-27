import { create } from "zustand"
import { persist, createJSONStorage } from "zustand/middleware"
import { MOCK_ARTICLES, type Article } from "@/data/mock/articles"

interface ArticleState {
  articles: Article[]
  currentSlug: string | null
  activeTag: string | null

  setActiveTag: (tag: string | null) => void
  setCurrentSlug: (slug: string | null) => void
  getFilteredArticles: () => Article[]
  getRelatedArticles: (slug: string) => Article[]
  getArticleBySlug: (slug: string) => Article | undefined
  getAllTags: () => string[]
}

export const useArticleStore = create<ArticleState>()(
  persist(
    (set, get) => ({
      articles: MOCK_ARTICLES,
      currentSlug: null,
      activeTag: null,

      setActiveTag: (tag) => set({ activeTag: tag }),
      setCurrentSlug: (slug) => set({ currentSlug: slug }),

      getFilteredArticles: () => {
        const { articles, activeTag } = get()
        if (!activeTag) return articles
        return articles.filter((a) => a.tags.includes(activeTag))
      },

      getRelatedArticles: (slug) => {
        const { articles } = get()
        const current = articles.find((a) => a.slug === slug)
        if (!current) return []
        return articles
          .filter(
            (a) =>
              a.slug !== slug &&
              a.tags.some((t) => current.tags.includes(t))
          )
          .slice(0, 3)
      },

      getArticleBySlug: (slug) => {
        return get().articles.find((a) => a.slug === slug)
      },

      getAllTags: () => {
        const tags = new Set<string>()
        get().articles.forEach((a) => a.tags.forEach((t) => tags.add(t)))
        return Array.from(tags)
      },
    }),
    {
      name: "ask-kelly-articles",
      storage: createJSONStorage(() => localStorage),
    }
  )
)
