import type { Metadata } from "next"
import { Toaster } from "@/components/ui/sonner"
import { TooltipProvider } from "@/components/ui/tooltip"
import "./globals.css"

export const metadata: Metadata = {
  title: {
    template: "%s | 问凯利",
    default: "问凯利 | 和凯利对话，看见自己建构的世界",
  },
  description:
    "和凯利对话，看见自己建构的世界。与心理学家乔治·凯利（George Kelly）AI 直接对话，阅读个人建构心理学深度文章，探索系统化知识库。",
  keywords: ["凯利", "个人建构心理学", "George Kelly", "AI对话", "心理学"],
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="zh" className="h-full antialiased">
      <head>
        <script
          async
          crossOrigin="anonymous"
          src="https://tweakcn.com/live-preview.min.js"
        />
      </head>
      <body className="min-h-full flex flex-col bg-bg text-fg font-sans">
        <TooltipProvider>{children}</TooltipProvider>
        <Toaster
          position="top-center"
          toastOptions={{
            className: "font-sans",
          }}
        />
      </body>
    </html>
  )
}
