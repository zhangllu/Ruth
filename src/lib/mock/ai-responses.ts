/**
 * 凯利人格 Mock 响应生成器
 * 模拟凯利的苏格拉底式引导风格
 */

const KELLY_RESPONSES = [
  `这是一个很有意思的问题。让我从个人建构心理学的角度来谈谈我的理解……

在我看来，每个人都是一个"科学家"，不断构建理论来预测和理解世界。你提到的这个情况，实际上涉及到你内心的构念系统如何运作。

我想邀请你思考一下：当你面对这个情境时，你首先想到的是哪一对构念？比如"好—坏"、"公平—不公平"或者"可控—不可控"？`,

  `你提出的问题触及了个人建构心理学的核心。

让我用一个具体的例子来说明：想象你遇到了一个陌生人。你不会真的"了解"这个人，但你会有一些预期——你根据过去的经验形成了一个构念，然后用它来理解眼前的人。

这个过程的关键在于：你的构念不是被动接收的，而是你主动建立的。这意味着你有能力改变它们。`,

  `感谢你的坦诚分享。从你的描述中，我注意到你似乎在用"成功—失败"这一对构念来看待这个经历。

我想邀请你考虑另一种可能性：如果不用"成功—失败"来衡量，你会如何描述这段经历？也许"学习—尚未学习"或者"探索—确认"会是更有用的构念？`,

  `这让我想起了个人建构心理学中的一个重要概念——焦虑。在我的理论中，焦虑并不是一种"病"，而是当你意识到自己正面临超出构念系统范围的事件时的一种自然反应。

换句话说，焦虑意味着你遇到了一个你的"理论"还无法充分解释的情境。这不是坏事——它恰恰是成长和学习的信号。`,

  `你的反思很有深度。你提到的这个情况，实际上涉及到了构念的渗透性——也就是说，你的构念是否足够开放来接纳新的经验。

有些构念是非常渗透的，比如"好—坏"几乎可以应用于任何事物。但有些构念则非常具体。真正灵活的思维，在于知道什么时候用什么构念，以及什么时候需要建立新的构念。`,

  `这是一个很好的观察。让我把它放在个人建构心理学的框架里来看……

我们每个人都在不断地用构念来解释事件——这个过程就像科学家在检验假设。当一个构念被反复验证有效，它就会被保留；当它无效时，我们有两种选择：要么扭曲事实来迎合构念（这就是我所说的"敌意"），要么修改构念来适应新的事实。

真正健康的方式是后者——保持你的构念系统对经验开放。`,

  `你问了一个很重要的问题。在我的理论中，人与人之间的冲突往往不是因为"谁对谁错"，而是因为他们在用不同的构念系统来解释同一件事。

想象两个人，一个用"诚实—不诚实"来看待世界，另一个用"圆滑—直率"。面对同一个情境，他们的判断可能会完全不同。但谁是对的呢？他们都对——只是用了不同的构念。

认识到这一点，本身就是化解冲突的第一步。`,
]

export async function generateMockResponse(message: string): Promise<string> {
  // 模拟网络延迟
  await new Promise((resolve) => setTimeout(resolve, 800 + Math.random() * 1200))

  const msg = message.toLowerCase()

  if (msg.includes("焦虑") || msg.includes("恐惧") || msg.includes("担心") || msg.includes("压力")) {
    return KELLY_RESPONSES[3]
  }
  if (msg.includes("成功") || msg.includes("失败") || msg.includes("成就")) {
    return KELLY_RESPONSES[2]
  }
  if (msg.includes("构念") || msg.includes("建构") || msg.includes("construct")) {
    return KELLY_RESPONSES[4]
  }
  if (msg.includes("冲突") || msg.includes("吵架") || msg.includes("关系")) {
    return KELLY_RESPONSES[6]
  }
  if (msg.includes("你好") || msg.includes("嗨") || msg.includes("hello") || msg.includes("您好")) {
    return `你好！我是乔治·凯利。很高兴你来找我对话。有什么关于个人建构心理学的问题，或者生活中的困惑，你愿意和我探讨吗？`
  }
  if (msg.includes("谢谢") || msg.includes("感谢")) {
    return `不用谢。能和你探讨这些问题，我也感到很愉快。记住：你永远是你自己构念系统的创造者——你有能力重新建构你的世界。期待我们的下一次对话。`
  }
  if (msg.includes("你是谁") || msg.includes("凯利")) {
    return `我是乔治·亚历山大·凯利（George Alexander Kelly），个人建构心理学的创始人。我于 1905 年出生在美国堪萨斯州，1967 年去世。

我的核心思想是：每个人都像科学家一样，通过建立构念系统来预测和理解世界。如果你对我的理论感兴趣，我很乐意和你探讨。`
  }

  return KELLY_RESPONSES[Math.floor(Math.random() * KELLY_RESPONSES.length)]
}

/**
 * 流式 Mock 响应生成器
 * 模拟打字机效果
 */
export async function* streamMockResponse(
  message: string
): AsyncGenerator<string> {
  const response = await generateMockResponse(message)
  const sentences = response.split(/(?<=[。！？\n])/)
  for (const sentence of sentences) {
    if (sentence.trim()) {
      for (const char of sentence) {
        yield char
        await new Promise((resolve) => setTimeout(resolve, 20 + Math.random() * 40))
      }
      await new Promise((resolve) => setTimeout(resolve, 100))
    }
  }
}
