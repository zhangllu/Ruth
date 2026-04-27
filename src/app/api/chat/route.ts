import { KELLY_SYSTEM_PROMPT } from "@/lib/ai/kelly-prompt"
import { auth } from "@/lib/auth"
import { db } from "@/db"
import { user } from "@/db/schema"
import { eq, sql } from "drizzle-orm"

interface ChatMessage {
  role: "system" | "user" | "assistant"
  content: string
}

const FREE_TOTAL_TOKENS = 100000

export async function POST(req: Request) {
  try {
    const session = await auth.api.getSession({ headers: req.headers })
    if (!session) {
      return Response.json({ error: "未登录" }, { status: 401 })
    }

    // 检查 token 配额
    const [userRecord] = await db
      .select({ usedTokens: user.usedTokens, totalTokens: user.totalTokens })
      .from(user)
      .where(eq(user.id, session.user.id))

    if (!userRecord) {
      return Response.json({ error: "用户不存在" }, { status: 404 })
    }

    const totalTokens = userRecord.totalTokens ?? FREE_TOTAL_TOKENS
    const usedTokens = userRecord.usedTokens ?? 0
    const remaining = totalTokens - usedTokens

    if (remaining <= 0) {
      return Response.json(
        { error: "对话配额已用完，请联系管理员" },
        { status: 403 }
      )
    }

    const { message, conversationHistory = [] } = await req.json()

    const apiKey = process.env.ZHIPU_API_KEY
    const apiUrl = process.env.ZHIPU_API_URL || "https://open.bigmodel.cn/api/paas/v4/chat/completions"
    const model = process.env.ZHIPU_MODEL || "glm-5.1"

    if (!apiKey) {
      return Response.json(
        { error: "ZHIPU_API_KEY 未配置" },
        { status: 500 }
      )
    }

    const response = await fetch(apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model,
        messages: [
          { role: "system", content: KELLY_SYSTEM_PROMPT },
          ...conversationHistory,
          { role: "user", content: message },
        ] satisfies ChatMessage[],
        max_tokens: Math.min(2000, remaining),
        stream: true,
        thinking: { type: "disabled" },
      }),
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error("智谱 API 错误:", errorText)
      return Response.json(
        { error: `API 调用失败: ${response.status}` },
        { status: 500 }
      )
    }

    // 将智谱的 SSE 流转换为前端可读的流，同时捕获 usage
    const stream = new ReadableStream({
      async start(controller) {
        const reader = response.body!.getReader()
        const decoder = new TextDecoder()
        let totalTokensThisTurn = 0

        try {
          while (true) {
            const { done, value } = await reader.read()
            if (done) break

            const chunk = decoder.decode(value, { stream: true })
            const lines = chunk.split("\n")

            for (const line of lines) {
              if (!line.startsWith("data: ")) continue
              const data = line.slice(6)
              if (data === "[DONE]") continue

              try {
                const parsed = JSON.parse(data)
                const delta = parsed.choices?.[0]?.delta

                // 捕获 usage 信息（通常在最后一个 chunk 中）
                if (parsed.usage?.total_tokens) {
                  totalTokensThisTurn = parsed.usage.total_tokens
                }

                if (delta?.content) {
                  controller.enqueue(
                    new TextEncoder().encode(
                      JSON.stringify({ text: delta.content }) + "\n"
                    )
                  )
                }
              } catch {
                // 跳过解析失败的行
              }
            }
          }
        } catch (err) {
          console.error("流读取错误:", err)
        } finally {
          controller.close()

          // 更新用户的 token 使用量
          if (totalTokensThisTurn > 0) {
            try {
              await db
                .update(user)
                .set({ usedTokens: sql`${user.usedTokens} + ${totalTokensThisTurn}` })
                .where(eq(user.id, session.user.id))
            } catch (err) {
              console.error("更新 token 用量失败:", err)
            }
          }
        }
      },
    })

    return new Response(stream, {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
      },
    })
  } catch (error) {
    console.error("对话 API 错误:", error)
    return Response.json(
      { error: error instanceof Error ? error.message : "未知错误" },
      { status: 500 }
    )
  }
}
