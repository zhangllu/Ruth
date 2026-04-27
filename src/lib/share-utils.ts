export interface SharedMessage {
  role: "user" | "assistant"
  content: string
}

/**
 * 将消息提交到服务端，返回短 ID
 */
export async function shareMessages(messages: SharedMessage[]): Promise<string> {
  const res = await fetch("/api/share", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ messages }),
  })
  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    throw new Error(err.error || "分享失败")
  }
  const { id } = await res.json()
  return id
}

/**
 * 通过短 ID 获取分享的消息
 */
export async function fetchSharedMessages(id: string): Promise<SharedMessage[]> {
  const res = await fetch(`/api/share?id=${encodeURIComponent(id)}`)
  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    throw new Error(err.error || "获取分享内容失败")
  }
  const { messages } = await res.json()
  return messages
}

/**
 * 构建分享短链接
 */
export function buildShareUrl(id: string): string {
  return `${window.location.origin}/share?id=${encodeURIComponent(id)}`
}
