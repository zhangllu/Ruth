import Link from "next/link"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { Button } from "@/components/ui/button"
import { MOCK_ARTICLES } from "@/data/mock/articles"
import { MessageSquare, BookOpen, Library, ArrowRight } from "lucide-react"

export default function HomePage() {
  const recentArticles = MOCK_ARTICLES.slice(0, 4)

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1">
        {/* Hero 区域 */}
        <section className="relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-primary-50/50 to-transparent dark:from-primary-900/20" />
          <div className="relative mx-auto max-w-6xl px-4 py-24 sm:py-32">
            <div className="flex flex-col items-center text-center">
              <span className="text-5xl mb-6">🧑‍🏫</span>
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-fg max-w-2xl leading-[1.15]">
                和凯利对话，
                <br />
                <span className="text-primary-600">看见自己建构的世界</span>
              </h1>
              <p className="mt-6 text-lg text-fg-muted max-w-xl leading-relaxed">
                与心理学家乔治·凯利（George Kelly）AI 直接对话，
                <br className="hidden sm:block" />
                在对话中探索你的构念系统，获得新的视角和可能。
              </p>
              <div className="mt-10 flex flex-col sm:flex-row gap-4">
                <Link href="/chat">
                  <Button size="lg" className="w-full sm:w-auto gap-2 text-base h-12 px-8">
                    <MessageSquare className="w-5 h-5" />
                    开始对话
                  </Button>
                </Link>
                <Link href="/articles">
                  <Button
                    variant="outline"
                    size="lg"
                    className="w-full sm:w-auto gap-2 text-base h-12 px-8"
                  >
                    <BookOpen className="w-5 h-5" />
                    浏览文章
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* 凯利是谁 */}
        <section className="border-t border-border bg-bg-card">
          <div className="mx-auto max-w-6xl px-4 py-20">
            <h2 className="text-2xl font-bold text-center text-fg mb-12">
              凯利是谁？
            </h2>
            <div className="grid gap-6 sm:grid-cols-3">
              <div className="rounded-xl border border-border bg-bg p-6 hover:border-primary-200 transition-colors">
                <div className="w-10 h-10 rounded-lg bg-primary-50 flex items-center justify-center mb-4">
                  <span className="text-lg">📖</span>
                </div>
                <h3 className="font-semibold text-fg mb-2">生平</h3>
                <p className="text-sm text-fg-muted leading-relaxed">
                  乔治·亚历山大·凯利（1905-1967），美国心理学家，
                  个人建构心理学创始人。从物理学转向心理学，
                  开创了独树一帜的理论体系。
                </p>
              </div>
              <div className="rounded-xl border border-border bg-bg p-6 hover:border-primary-200 transition-colors">
                <div className="w-10 h-10 rounded-lg bg-primary-50 flex items-center justify-center mb-4">
                  <span className="text-lg">💡</span>
                </div>
                <h3 className="font-semibold text-fg mb-2">核心理论</h3>
                <p className="text-sm text-fg-muted leading-relaxed">
                  每个人都是"科学家"——通过构念系统来预测和理解世界。
                  建构替代论告诉我们：对任何事件，我们永远有重新建构的可能。
                </p>
              </div>
              <div className="rounded-xl border border-border bg-bg p-6 hover:border-primary-200 transition-colors">
                <div className="w-10 h-10 rounded-lg bg-primary-50 flex items-center justify-center mb-4">
                  <span className="text-lg">🌱</span>
                </div>
                <h3 className="font-semibold text-fg mb-2">独特价值</h3>
                <p className="text-sm text-fg-muted leading-relaxed">
                  凯利的理论不是"解释人"的理论，而是"让人获得解放"的理论——它给你工具去理解自己，
                  并赋予你改变的可能。
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* 核心功能入口 */}
        <section className="border-t border-border">
          <div className="mx-auto max-w-6xl px-4 py-20">
            <h2 className="text-2xl font-bold text-center text-fg mb-12">
              从这里开始
            </h2>
            <div className="grid gap-6 sm:grid-cols-3">
              <Link
                href="/chat"
                className="group rounded-xl border-2 border-border bg-bg-card p-8 hover:border-primary-300 hover:shadow-md transition-all"
              >
                <div className="w-12 h-12 rounded-xl bg-primary-50 flex items-center justify-center mb-5 group-hover:bg-primary-100 transition-colors">
                  <MessageSquare className="w-6 h-6 text-primary-600" />
                </div>
                <h3 className="text-lg font-semibold text-fg mb-2">对话凯利</h3>
                <p className="text-sm text-fg-muted leading-relaxed mb-4">
                  向凯利提出你的问题，获得基于个人建构心理学的回应。
                  无需登录，直接开始。
                </p>
                <span className="text-sm font-medium text-primary-600 flex items-center gap-1 group-hover:gap-2 transition-all">
                  开始对话 <ArrowRight className="w-4 h-4" />
                </span>
              </Link>
              <Link
                href="/articles"
                className="group rounded-xl border-2 border-border bg-bg-card p-8 hover:border-primary-300 hover:shadow-md transition-all"
              >
                <div className="w-12 h-12 rounded-xl bg-primary-50 flex items-center justify-center mb-5 group-hover:bg-primary-100 transition-colors">
                  <BookOpen className="w-6 h-6 text-primary-600" />
                </div>
                <h3 className="text-lg font-semibold text-fg mb-2">阅读文章</h3>
                <p className="text-sm text-fg-muted leading-relaxed mb-4">
                  系统化了解凯利的个人建构心理学——从核心理论到日常应用，
                  从人物生平到方法论。
                </p>
                <span className="text-sm font-medium text-primary-600 flex items-center gap-1 group-hover:gap-2 transition-all">
                  浏览文章 <ArrowRight className="w-4 h-4" />
                </span>
              </Link>
              <Link
                href="/knowledge"
                className="group rounded-xl border-2 border-border bg-bg-card p-8 hover:border-primary-300 hover:shadow-md transition-all"
              >
                <div className="w-12 h-12 rounded-xl bg-primary-50 flex items-center justify-center mb-5 group-hover:bg-primary-100 transition-colors">
                  <Library className="w-6 h-6 text-primary-600" />
                </div>
                <h3 className="text-lg font-semibold text-fg mb-2">探索知识库</h3>
                <p className="text-sm text-fg-muted leading-relaxed mb-4">
                  浏览系统化的凯利知识体系——核心概念、理论框架、
                  原著文献，按主题检索。
                </p>
                <span className="text-sm font-medium text-primary-600 flex items-center gap-1 group-hover:gap-2 transition-all">
                  探索知识库 <ArrowRight className="w-4 h-4" />
                </span>
              </Link>
            </div>
          </div>
        </section>

        {/* 最新文章 */}
        <section className="border-t border-border bg-bg-card">
          <div className="mx-auto max-w-6xl px-4 py-20">
            <div className="flex items-center justify-between mb-10">
              <h2 className="text-2xl font-bold text-fg">最新文章</h2>
              <Link
                href="/articles"
                className="text-sm font-medium text-primary-600 hover:text-primary-700 flex items-center gap-1"
              >
                查看全部 <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
            <div className="grid gap-6 sm:grid-cols-2">
              {recentArticles.map((article) => (
                <Link
                  key={article.id}
                  href={`/articles/${article.slug}`}
                  className="group rounded-xl border border-border bg-bg p-6 hover:border-primary-200 hover:shadow-sm transition-all"
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
                  <h3 className="font-semibold text-fg group-hover:text-primary-600 transition-colors line-clamp-2 mb-2">
                    {article.title}
                  </h3>
                  <p className="text-sm text-fg-muted leading-relaxed line-clamp-2 mb-3">
                    {article.summary}
                  </p>
                  <span className="text-xs text-fg-muted">
                    {article.publishedAt}
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}
