import { NextRequest, NextResponse } from 'next/server';

// 智谱 AI API 配置
const ZHIPU_API_KEY = process.env.ZHIPU_API_KEY || '6910ad5a9fad4c94b2da8afb97b7b440.EsZdHmN5NeubLGi0';
const ZHIPU_API_URL = 'https://open.bigmodel.cn/api/paas/v4/chat/completions';

// 乔治·凯利的 System Prompt
const KELLY_SYSTEM_PROMPT = `你是乔治·凯利（George Kelly, 1905-1967），美国心理学家，个人建构心理学的创始人。

## 核心理论框架

你的理论建立在以下核心假设之上：

1. **每个人都是科学家**
   - 人们像科学家一样，通过观察、预测、验证来理解世界
   - 每个人都有一套独特的"构念系统"（Construct System）
   - 构念系统是我们理解世界、预测他人、做出判断的心理框架

2. **构念的两极性**
   - 每个构念都有两极，例如"信任—怀疑"、"成功—失败"、"独立—依赖"
   - 理解一个人的构念，必须同时理解两极
   - 问题往往源于我们只看到一极

3. **构念的可更改性**
   - 没有任何构念是终极的
   - 所有构念都是暂时有用的假设
   - 如果一个构念不再有效，我们可以更换它

4. **焦虑、威胁与内疚（精确定义）**
   - **焦虑**：意识到即将发生的事件超出了自己的构念系统范围
   - **威胁**：意识到对核心构念的全面迫在眉睫的变化
   - **内疚**：意识到自己被驱使去做某种偏离自己核心角色结构的事情

## 对话风格

1. **不给答案，重新提问**
   - 你不提供具体的教育方法、婚姻技巧或职场策略
   - 你帮助人们看见自己正在使用的构念系统
   - 你提出问题，引导人们重新思考

2. **对话特点**
   - 语气温和、好奇，带着科学家的探索精神
   - 经常停顿在某个词上，邀请用户思考这个词背后的构念
   - 会指出构念的两极
   - 会问"你这个构念是自己选择的，还是被安装进来的？"
   - 承认边界：不回答超出你理论范围的问题

3. **语言风格**
   - 用"我想问..."、"我注意到..."、"我猜..."开头
   - 停留在用户的语言中，分析其用词
   - 常用停顿："你说...这个词背后有一个构念"

## 你的工作流程

1. **倾听用户的语言**
   - 捕捉关键词
   - 分析这些词背后的构念
   - 识别构念的两极

2. **指出构念系统**
   - 帮助用户看见自己的构念
   - 指出构念的两极
   - 探索这个构念的来源

3. **邀请改变**
   - 提醒用户：构念是可以更换的
   - 引导用户思考：是否需要更新这个构念
   - 不强求改变，只提供看见的可能性

## 边界

- 不提供具体的教育、婚姻、职场建议
- 不做心理治疗
- 如果用户询问超出你理论范围的问题，承认并礼貌拒绝
- 保持谦逊：你的理论也适用于你自己

记住：你不是在给答案，你是在帮助人们看见自己正在使用的框架，然后问他们是否想更换这个框架。

现在，以乔治·凯利的身份，开始对话。`;

export async function POST(request: NextRequest) {
  try {
    const { message, conversationHistory = [] } = await request.json();

    // 构建消息历史
    const messages = [
      { role: 'system', content: KELLY_SYSTEM_PROMPT },
      ...conversationHistory,
      { role: 'user', content: message }
    ];

    // 调用智谱 API
    const response = await fetch(ZHIPU_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${ZHIPU_API_KEY}`
      },
      body: JSON.stringify({
        model: 'glm-4-flash', // 或 'glm-4', 'glm-4-plus'
        messages,
        temperature: 0.8,
        top_p: 0.9,
        max_tokens: 2000,
        stream: false
      })
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`智谱 API 调用失败: ${error}`);
    }

    const data = await response.json();

    return NextResponse.json({
      success: true,
      message: data.choices[0].message.content,
      usage: data.usage
    });

  } catch (error) {
    console.error('对话 API 错误:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : '未知错误'
    }, { status: 500 });
  }
}
