import { KELLY_SYSTEM_PROMPT } from "@/lib/ai/kelly-prompt"

interface ChatMessage {
  role: "system" | "user" | "assistant"
  content: string
}

export async function POST(req: Request) {
  try {
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
        max_tokens: 2000,
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

    // 将智谱的 SSE 流转换为前端可读的流
    const stream = new ReadableStream({
      async start(controller) {
        const reader = response.body!.getReader()
        const decoder = new TextDecoder()

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
