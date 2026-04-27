import Link from "next/link"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { MOCK_KNOWLEDGE_ENTRIES, KNOWLEDGE_CATEGORIES } from "@/data/mock/knowledge"
import { ArrowLeft, BookOpen } from "lucide-react"
import { notFound } from "next/navigation"

export default async function KnowledgeEntryPage(props: { params: Promise<{ id: string }> }) {
  const { id } = await props.params
  const entry = MOCK_KNOWLEDGE_ENTRIES.find((e) => e.slug === id)

  if (!entry) {
    notFound()
  }

  const relatedEntries = entry.relatedIds
    .map((rid) => MOCK_KNOWLEDGE_ENTRIES.find((e) => e.id === rid))
    .filter(Boolean)

  const categoryInfo = KNOWLEDGE_CATEGORIES.find((c) => c.name === entry.category)

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1">
        <article className="mx-auto max-w-3xl px-4 py-12">
          {/* 返回链接 */}
          <Link
            href="/knowledge"
            className="inline-flex items-center gap-1 text-sm text-fg-muted hover:text-primary-600 mb-8 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            返回知识库
          </Link>

          {/* 条目头部 */}
          <header className="mb-10">
            <div className="flex items-center gap-2 mb-4">
              <span className="text-xs px-2 py-0.5 rounded-full bg-primary-50 text-primary-600">
                {entry.category}
              </span>
              {entry.source && (
                <span className="text-xs px-2 py-0.5 rounded-full bg-bg-muted text-fg-muted flex items-center gap-1">
                  <BookOpen className="w-3 h-3" />
                  有来源
                </span>
              )}
            </div>
            <h1 className="text-3xl font-bold text-fg leading-tight mb-3">
              {entry.title}
            </h1>
            <p className="text-lg text-fg-muted leading-relaxed border-l-3 border-primary-300 pl-4 italic">
              {entry.definition}
            </p>
          </header>

          {/* 条目内容 */}
          <div className="prose-kelly text-fg border-t border-border pt-8">
            {entry.content.split("\n").map((line, i) => {
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
              if (line.startsWith("- **")) {
                const match = line.match(/- \*\*([^*]+)\*\*[：:]\s*(.*)/)
                if (match) {
                  return (
                    <p key={i} className="ml-4 mb-2">
                      <strong className="font-semibold">{match[1]}</strong>：{match[2]}
                    </p>
                  )
                }
              }
              if (line.startsWith("- ")) {
                return (
                  <li key={i} className="ml-6 text-fg list-disc mb-1">
                    {line.slice(2)}
                  </li>
                )
              }
              if (line.trim() === "---") {
                return <hr key={i} className="my-8 border-border" />
              }
              if (line.trim() === "") {
                return <div key={i} className="h-3" />
              }
              if (line.includes("|")) {
                return null // Skip table rendering in simple mode
              }
              // Bold rendering
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

          {/* 来源 */}
          {entry.source && (
            <div className="mt-10 p-4 rounded-lg bg-bg-muted border border-border">
              <p className="text-xs text-fg-muted">
                <strong>来源：</strong> {entry.source}
              </p>
            </div>
          )}

          {/* 标签 */}
          <div className="mt-6 flex flex-wrap gap-2">
            {entry.tags.map((tag) => (
              <span
                key={tag}
                className="text-xs px-2 py-0.5 rounded-full bg-bg-muted text-fg-muted"
              >
                #{tag}
              </span>
            ))}
          </div>
        </article>

        {/* 相关条目 */}
        {relatedEntries.length > 0 && (
          <section className="border-t border-border bg-bg-card">
            <div className="mx-auto max-w-3xl px-4 py-12">
              <h2 className="text-xl font-bold text-fg mb-6">相关条目</h2>
              <div className="grid gap-4 sm:grid-cols-3">
                {relatedEntries.map((r) =>
                  r ? (
                    <Link
                      key={r.id}
                      href={`/knowledge/${r.slug}`}
                      className="group rounded-lg border border-border bg-bg p-4 hover:border-primary-200 transition-all"
                    >
                      <h3 className="text-sm font-semibold text-fg group-hover:text-primary-600 transition-colors mb-1">
                        {r.title}
                      </h3>
                      <p className="text-xs text-fg-muted line-clamp-2">
                        {r.definition}
                      </p>
                    </Link>
                  ) : null
                )}
              </div>
            </div>
          </section>
        )}
      </main>
      <Footer />
    </div>
  )
}
