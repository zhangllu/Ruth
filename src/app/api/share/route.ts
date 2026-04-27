import { NextRequest, NextResponse } from "next/server"
import { nanoid } from "nanoid"

// 内存存储（Vercel 实例级别，重启后丢失，但对分享场景足够）
const store = new Map<string, { messages: { role: string; content: string }[]; createdAt: number }>()

// 7 天后自动过期
const TTL = 7 * 24 * 60 * 60 * 1000

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { messages } = body

    if (!Array.isArray(messages) || messages.length === 0) {
      return NextResponse.json({ error: "无效的消息数据" }, { status: 400 })
    }

    // 清理过期记录
    const now = Date.now()
    for (const [key, val] of store) {
      if (now - val.createdAt > TTL) store.delete(key)
    }

    const id = nanoid(10) // 10 位短 ID
    store.set(id, { messages, createdAt: now })

    return NextResponse.json({ id })
  } catch {
    return NextResponse.json({ error: "服务器错误" }, { status: 500 })
  }
}

export async function GET(req: NextRequest) {
  const id = req.nextUrl.searchParams.get("id")
  if (!id) {
    return NextResponse.json({ error: "缺少 id 参数" }, { status: 400 })
  }

  const entry = store.get(id)
  if (!entry) {
    return NextResponse.json({ error: "分享内容不存在或已过期" }, { status: 404 })
  }

  // 检查是否过期
  if (Date.now() - entry.createdAt > TTL) {
    store.delete(id)
    return NextResponse.json({ error: "分享内容已过期" }, { status: 410 })
  }

  return NextResponse.json({ messages: entry.messages })
}
