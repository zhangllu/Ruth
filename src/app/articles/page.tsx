"use client"

import { useState } from "react"
import Link from "next/link"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { MOCK_ARTICLES } from "@/data/mock/articles"
import { ArrowRight, BookOpen } from "lucide-react"

const ALL_TAGS = Array.from(new Set(MOCK_ARTICLES.flatMap((a) => a.tags)))

export default function ArticlesPage() {
  const [activeTag, setActiveTag] = useState<string | null>(null)

  const filtered = activeTag
    ? MOCK_ARTICLES.filter((a) => a.tags.includes(activeTag))
    : MOCK_ARTICLES

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1">
        <div className="mx-auto max-w-4xl px-4 py-12">
          {/* 页面标题 */}
          <div className="mb-10">
            <h1 className="text-3xl font-bold text-fg mb-2">文章</h1>
            <p className="text-fg-muted">
              凯利个人建构心理学的深度解读、读书笔记与应用思考
            </p>
          </div>

          {/* 标签筛选 */}
          <div className="flex flex-wrap gap-2 mb-8">
            <button
              onClick={() => setActiveTag(null)}
              className={`px-3 py-1.5 text-sm rounded-full transition-colors ${
                activeTag === null
                  ? "bg-primary-600 text-white"
                  : "bg-bg-muted text-fg-muted hover:text-fg hover:bg-primary-50"
              }`}
            >
              全部
            </button>
            {ALL_TAGS.map((tag) => (
              <button
                key={tag}
                onClick={() => setActiveTag(tag)}
                className={`px-3 py-1.5 text-sm rounded-full transition-colors ${
                  activeTag === tag
                    ? "bg-primary-600 text-white"
                    : "bg-bg-muted text-fg-muted hover:text-fg hover:bg-primary-50"
                }`}
              >
                {tag}
              </button>
            ))}
          </div>

          {/* 文章列表 */}
          {filtered.length === 0 ? (
            <div className="text-center py-16">
              <BookOpen className="w-12 h-12 text-fg-muted/30 mx-auto mb-4" />
              <p className="text-fg-muted">该分类暂无文章</p>
            </div>
          ) : (
            <div className="grid gap-6">
              {filtered.map((article) => (
                <Link
                  key={article.id}
                  href={`/articles/${article.slug}`}
                  className="group rounded-xl border border-border bg-bg-card p-6 hover:border-primary-200 hover:shadow-sm transition-all"
                >
                  <div className="flex flex-wrap gap-2 mb-3">
                    {article.tags.map((tag) => (
                      <span
                        key={tag}
                        className="text-xs px-2 py-0.5 rounded-full bg-primary-50 text-primary-600"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                  <h2 className="text-lg font-semibold text-fg group-hover:text-primary-600 transition-colors mb-2">
                    {article.title}
                  </h2>
                  <p className="text-sm text-fg-muted leading-relaxed mb-3 line-clamp-2">
                    {article.summary}
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-fg-muted">
                      {article.publishedAt}
                      {article.source && " · 有参考文献"}
                    </span>
                    <span className="text-sm font-medium text-primary-600 opacity-0 group-hover:opacity-100 flex items-center gap-1 transition-all">
                      阅读全文 <ArrowRight className="w-4 h-4" />
                    </span>
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
