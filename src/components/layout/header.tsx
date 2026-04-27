"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { MessageSquare, BookOpen, Library, Menu, X } from "lucide-react"
import { useState } from "react"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"

const NAV_ITEMS = [
  { href: "/chat", label: "对话", icon: MessageSquare },
  { href: "/articles", label: "文章", icon: BookOpen },
  { href: "/knowledge", label: "知识库", icon: Library },
]

export function Header() {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-bg/80 backdrop-blur-md">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4">
        <Link
          href="/"
          className="flex items-center gap-2 text-lg font-semibold text-fg hover:text-primary-600 transition-colors"
        >
          <span className="text-primary-600 text-xl">🧑‍🏫</span>
          <span>问凯利</span>
        </Link>

        {/* 桌面端导航 */}
        <nav className="hidden md:flex items-center gap-1">
          <Link
            href="/"
            className={`px-3 py-2 text-sm rounded-md transition-colors ${
              pathname === "/"
                ? "text-primary-600 bg-primary-50 font-medium"
                : "text-fg-muted hover:text-fg hover:bg-bg-muted"
            }`}
          >
            首页
          </Link>
          {NAV_ITEMS.map((item) => {
            const isActive = pathname.startsWith(item.href)
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-1.5 px-3 py-2 text-sm rounded-md transition-colors ${
                  isActive
                    ? "text-primary-600 bg-primary-50 font-medium"
                    : "text-fg-muted hover:text-fg hover:bg-bg-muted"
                }`}
              >
                <item.icon className="w-4 h-4" />
                {item.label}
              </Link>
            )
          })}
        </nav>

        {/* 移动端菜单按钮 */}
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger className="md:hidden flex items-center justify-center h-9 w-9 rounded-md hover:bg-bg-muted transition-colors cursor-pointer">
            {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </SheetTrigger>
          <SheetContent side="right" className="w-64 p-4 pt-12">
            <nav className="flex flex-col gap-2">
              <Link
                href="/"
                onClick={() => setOpen(false)}
                className={`px-3 py-2.5 text-sm rounded-md transition-colors ${
                  pathname === "/"
                    ? "text-primary-600 bg-primary-50 font-medium"
                    : "text-fg-muted hover:text-fg hover:bg-bg-muted"
                }`}
              >
                首页
              </Link>
              {NAV_ITEMS.map((item) => {
                const isActive = pathname.startsWith(item.href)
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setOpen(false)}
                    className={`flex items-center gap-2 px-3 py-2.5 text-sm rounded-md transition-colors ${
                      isActive
                        ? "text-primary-600 bg-primary-50 font-medium"
                        : "text-fg-muted hover:text-fg hover:bg-bg-muted"
                    }`}
                  >
                    <item.icon className="w-4 h-4" />
                    {item.label}
                  </Link>
                )
              })}
            </nav>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  )
}
