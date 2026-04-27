"use client"

import { useState, useMemo } from "react"
import Link from "next/link"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import {
  MOCK_KNOWLEDGE_ENTRIES,
  KNOWLEDGE_CATEGORIES,
} from "@/data/mock/knowledge"
import {
  Search,
  Lightbulb,
  BookText,
  Wrench,
  GitBranch,
  FileText,
  Bookmark,
  ArrowRight,
} from "lucide-react"

const CATEGORY_ICONS: Record<string, typeof Lightbulb> = {
  核心理论: Lightbulb,
  基本概念: BookText,
  应用方法: Wrench,
  相关理论: GitBranch,
  原著文献: FileText,
  术语表: Bookmark,
}

export default function KnowledgePage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [activeCategory, setActiveCategory] = useState<string | null>(null)

  const filteredEntries = useMemo(() => {
    let entries = MOCK_KNOWLEDGE_ENTRIES
    if (activeCategory) {
      entries = entries.filter((e) => e.category === activeCategory)
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase()
      entries = entries.filter(
        (e) =>
          e.title.toLowerCase().includes(q) ||
          e.concept.toLowerCase().includes(q) ||
          e.definition.toLowerCase().includes(q) ||
          e.tags.some((t) => t.toLowerCase().includes(q))
      )
    }
    return entries
  }, [searchQuery, activeCategory])

  const selectedCategory = activeCategory
    ? KNOWLEDGE_CATEGORIES.find((c) => c.name === activeCategory)
    : null

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1">
        <div className="mx-auto max-w-4xl px-4 py-12">
          {/* 页面标题 */}
          <div className="mb-10">
            <h1 className="text-3xl font-bold text-fg mb-2">知识库</h1>
            <p className="text-fg-muted">
              系统化的凯利个人建构心理学知识体系
            </p>
          </div>

          {/* 搜索框 */}
          <div className="relative mb-10">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-fg-muted" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value)
                setActiveCategory(null)
              }}
              placeholder="搜索知识库……"
              className="w-full h-11 pl-10 pr-4 rounded-xl border border-border bg-bg-card text-sm text-fg placeholder:text-fg-muted/50 outline-none focus:border-primary-300 focus:ring-1 focus:ring-primary-200 transition-colors"
            />
          </div>

          {/* 分类网格 */}
          {!searchQuery && !activeCategory && (
            <div className="grid gap-4 sm:grid-cols-3 mb-12">
              {KNOWLEDGE_CATEGORIES.map((cat) => {
                const Icon = CATEGORY_ICONS[cat.name] || BookText
                return (
                  <button
                    key={cat.id}
                    onClick={() => setActiveCategory(cat.name)}
                    className="group rounded-xl border border-border bg-bg-card p-5 text-left hover:border-primary-200 hover:shadow-sm transition-all"
                  >
                    <div className="w-10 h-10 rounded-lg bg-primary-50 flex items-center justify-center mb-3 group-hover:bg-primary-100 transition-colors">
                      <Icon className="w-5 h-5 text-primary-600" />
                    </div>
                    <h3 className="font-semibold text-fg group-hover:text-primary-600 transition-colors mb-1">
                      {cat.name}
                    </h3>
                    <p className="text-xs text-fg-muted">{cat.count} 条目</p>
                  </button>
                )
              })}
            </div>
          )}

          {/* 当前分类/搜索结果标题 */}
          {(activeCategory || searchQuery) && (
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-fg">
                {activeCategory
                  ? activeCategory
                  : `搜索结果"${searchQuery}"`}
              </h2>
              <button
                onClick={() => {
                  setActiveCategory(null)
                  setSearchQuery("")
                }}
                className="text-sm text-primary-600 hover:text-primary-700"
              >
                清除筛选
              </button>
            </div>
          )}

          {/* 知识条目列表 */}
          {filteredEntries.length === 0 ? (
            <div className="text-center py-16">
              <BookText className="w-12 h-12 text-fg-muted/30 mx-auto mb-4" />
              <p className="text-fg-muted">
                {searchQuery
                  ? "未找到相关内容，试试其他关键词"
                  : "该分类暂无内容"}
              </p>
            </div>
          ) : (
            <div className="grid gap-4">
              {filteredEntries.map((entry) => (
                <Link
                  key={entry.id}
                  href={`/knowledge/${entry.slug}`}
                  className="group rounded-xl border border-border bg-bg-card p-5 hover:border-primary-200 hover:shadow-sm transition-all"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-fg group-hover:text-primary-600 transition-colors mb-1">
                        {entry.title}
                      </h3>
                      <p className="text-sm text-fg-muted leading-relaxed line-clamp-2">
                        {entry.definition}
                      </p>
                      <div className="flex gap-2 mt-2">
                        <span className="text-xs px-2 py-0.5 rounded-full bg-bg-muted text-fg-muted">
                          {entry.category}
                        </span>
                        {entry.source && (
                          <span className="text-xs px-2 py-0.5 rounded-full bg-bg-muted text-fg-muted">
                            有来源
                          </span>
                        )}
                      </div>
                    </div>
                    <ArrowRight className="w-5 h-5 text-fg-muted/30 group-hover:text-primary-600 group-hover:translate-x-0.5 transition-all mt-1 flex-shrink-0" />
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  )
}
