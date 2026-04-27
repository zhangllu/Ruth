import Link from "next/link"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { MOCK_ARTICLES } from "@/data/mock/articles"
import { ArrowLeft, ArrowRight, BookOpen } from "lucide-react"
import { notFound } from "next/navigation"

export default async function ArticlePage(props: { params: Promise<{ slug: string }> }) {
  const { slug } = await props.params
  const article = MOCK_ARTICLES.find((a) => a.slug === slug)

  if (!article) {
    notFound()
  }

  const related = MOCK_ARTICLES.filter(
    (a) => a.slug !== slug && a.tags.some((t) => article.tags.includes(t))
  ).slice(0, 3)

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1">
        <article className="mx-auto max-w-3xl px-4 py-12">
          {/* 返回链接 */}
          <Link
            href="/articles"
            className="inline-flex items-center gap-1 text-sm text-fg-muted hover:text-primary-600 mb-8 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            返回文章列表
          </Link>

          {/* 文章头部 */}
          <header className="mb-10">
            <div className="flex flex-wrap gap-2 mb-4">
              {article.tags.map((tag) => (
                <span
                  key={tag}
                  className="text-xs px-2 py-0.5 rounded-full bg-primary-50 text-primary-600"
                >
                  {tag}
                </span>
              ))}
            </div>
            <h1 className="text-3xl font-bold text-fg leading-tight mb-4">
              {article.title}
            </h1>
            <div className="flex items-center gap-4 text-sm text-fg-muted">
              <span>{article.publishedAt}</span>
              {article.source && (
                <span className="flex items-center gap-1">
                  <BookOpen className="w-3.5 h-3.5" />
                  有参考文献
                </span>
              )}
            </div>
          </header>

          {/* 文章内容 */}
          <div className="prose-kelly text-fg border-t border-border pt-8">
            {article.content.split("\n").map((line, i) => {
              if (line.startsWith("# ")) {
                return (
                  <h1 key={i} className="text-2xl font-bold mt-8 mb-4">
                    {line.slice(2)}
                  </h1>
                )
              }
              if (line.startsWith("## ")) {
                return (
                  <h2 key={i} className="text-xl font-semibold mt-6 mb-3 text-primary-700">
                    {line.slice(3)}
                  </h2>
                )
              }
              if (line.startsWith("### ")) {
                return (
                  <h3 key={i} className="text-lg font-semibold mt-5 mb-2">
                    {line.slice(4)}
                  </h3>
                )
              }
              if (line.startsWith("> ")) {
                return (
                  <blockquote key={i} className="border-l-3 border-primary-300 pl-4 my-4 italic text-primary-700">
                    {line.slice(2)}
                  </blockquote>
                )
              }
              if (line.startsWith("- ")) {
                return (
                  <li key={i} className="ml-6 text-fg list-disc">
                    {line.slice(2)}
                  </li>
                )
              }
              if (line.startsWith("1. ") || line.startsWith("2. ") || line.startsWith("3. ")) {
                // Numbered list item in plain text
                return (
                  <p key={i} className="ml-6 text-fg mb-1">
                    {line}
                  </p>
                )
              }
              if (line.trim() === "---") {
                return <hr key={i} className="my-8 border-border" />
              }
              if (line.trim() === "") {
                return <div key={i} className="h-3" />
              }
              // Bold text: **text**
              const rendered = line
                .split(/(\*\*[^*]+\*\*)/g)
                .map((part, j) => {
                  if (part.startsWith("**") && part.endsWith("**")) {
                    return (
                      <strong key={j} className="font-semibold">
                        {part.slice(2, -2)}
                      </strong>
                    )
                  }
                  return part
                })
              return (
                <p key={i} className="text-fg leading-relaxed mb-3">
                  {rendered}
                </p>
              )
            })}
          </div>

          {/* 来源标注 */}
          {article.source && (
            <div className="mt-10 p-4 rounded-lg bg-bg-muted border border-border">
              <p className="text-xs text-fg-muted">
                <strong>参考文献：</strong> {article.source}
              </p>
            </div>
          )}
        </article>

        {/* 相关文章 */}
        {related.length > 0 && (
          <section className="border-t border-border bg-bg-card">
            <div className="mx-auto max-w-3xl px-4 py-12">
              <h2 className="text-xl font-bold text-fg mb-6">相关文章</h2>
              <div className="grid gap-4 sm:grid-cols-3">
                {related.map((r) => (
                  <Link
                    key={r.id}
                    href={`/articles/${r.slug}`}
                    className="group rounded-lg border border-border bg-bg p-4 hover:border-primary-200 transition-all"
                  >
                    <h3 className="text-sm font-semibold text-fg group-hover:text-primary-600 transition-colors line-clamp-2 mb-1">
                      {r.title}
                    </h3>
                    <p className="text-xs text-fg-muted line-clamp-2">
                      {r.summary}
                    </p>
                  </Link>
                ))}
              </div>
            </div>
          </section>
        )}
      </main>
      <Footer />
    </div>
  )
}
