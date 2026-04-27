export interface Message {
  id: string
  role: "user" | "assistant" | "system"
  content: string
  createdAt: string
}

export interface Conversation {
  id: string
  title: string
  messages: Message[]
  createdAt: string
  updatedAt: string
}

export const MOCK_CONVERSATIONS: Conversation[] = [
  {
    id: "conv-1",
    title: "什么是个人建构心理学？",
    createdAt: "2026-04-26T10:00:00Z",
    updatedAt: "2026-04-26T10:05:00Z",
    messages: [
      {
        id: "msg-1",
        role: "user",
        content: "请问凯利，什么是个人建构心理学？",
        createdAt: "2026-04-26T10:00:00Z",
      },
      {
        id: "msg-2",
        role: "assistant",
        content:
          `很高兴你对这个问题感兴趣。个人建构心理学的核心思想是：**每个人都是科学家**。\n\n正如科学家通过理论来预测实验一样，我们每个人都通过自己的"构念系统"来预测事件。让我用一个例子来说明：\n\n当你遇到一个新朋友时，你不会真的"知道"他是什么样的人，但你会根据过去的经验形成一些预期——比如用"友善—冷漠"这个构念来理解他。\n\n这个过程的关键在于，**你的构念不是被动接收的，而是你主动建立的**。这意味着你有能力改变它们。`,
        createdAt: "2026-04-26T10:05:00Z",
      },
    ],
  },
  {
    id: "conv-2",
    title: "如何应对焦虑？",
    createdAt: "2026-04-25T14:30:00Z",
    updatedAt: "2026-04-25T14:35:00Z",
    messages: [
      {
        id: "msg-3",
        role: "user",
        content: "凯利，我最近感到很焦虑，不知道如何应对。",
        createdAt: "2026-04-25T14:30:00Z",
      },
      {
        id: "msg-4",
        role: "assistant",
        content:
          `你能具体说说，当你感到焦虑时，你发现自己处于什么样的情境中吗？\n\n在我的理论中，**焦虑并不意味着"出了问题"**——它只是意味着你遇到的事件超出了你当前构念系统的可预测范围。\n\n换句话说，焦虑是你正在面对一个你的"理论"还无法充分解释的情境的信号。从这个角度看，焦虑不是敌人，而是成长的邀请。`,
        createdAt: "2026-04-25T14:35:00Z",
      },
    ],
  },
  {
    id: "conv-3",
    title: "CPC 循环是什么？",
    createdAt: "2026-04-24T09:00:00Z",
    updatedAt: "2026-04-24T09:08:00Z",
    messages: [
      {
        id: "msg-5",
        role: "user",
        content: "请解释一下 CPC 循环",
        createdAt: "2026-04-24T09:00:00Z",
      },
      {
        id: "msg-6",
        role: "assistant",
        content:
          `CPC 循环是我理论中描述人们如何做出决策的过程。它包含三个阶段：

**C — Circumspection（审虑）**：从多个角度审视情境，考虑多种可能的建构方式。

**P — Preemption（预断）**：选择最相关的构念，暂时搁置其他可能性。

**C — Control（控制）**：基于选择的构念做出决策并行动。

让我用一个日常例子来说明：假设你要买一辆车。

审虑阶段，你可能会考虑"实用—美观"、"经济—昂贵"等多个构念。预断阶段，你决定"安全性"是最重要的构念。控制阶段，你基于这个构念做出购买决定。`,
        createdAt: "2026-04-24T09:08:00Z",
      },
    ],
  },
  {
    id: "conv-4",
    title: "构念与价值观的区别",
    createdAt: "2026-04-23T16:00:00Z",
    updatedAt: "2026-04-23T16:03:00Z",
    messages: [
      {
        id: "msg-7",
        role: "user",
        content: "构念和价值观有什么不同？",
        createdAt: "2026-04-23T16:00:00Z",
      },
    ],
  },
  {
    id: "conv-5",
    title: "凯利眼中的弗洛伊德",
    createdAt: "2026-04-20T11:00:00Z",
    updatedAt: "2026-04-20T11:02:00Z",
    messages: [],
  },
  {
    id: "conv-6",
    title: "建构替代论的实际应用",
    createdAt: "2026-04-18T08:00:00Z",
    updatedAt: "2026-04-18T08:10:00Z",
    messages: [],
  },
  {
    id: "conv-7",
    title: "关于人际关系中的构念冲突",
    createdAt: "2026-04-15T19:00:00Z",
    updatedAt: "2026-04-15T19:04:00Z",
    messages: [],
  },
  {
    id: "conv-8",
    title: "凯利的 11 个推论概述",
    createdAt: "2026-04-10T13:00:00Z",
    updatedAt: "2026-04-10T13:12:00Z",
    messages: [],
  },
  {
    id: "conv-9",
    title:
      "如何在日常工作和生活中运用个人建构心理学来改善沟通效果和人际关系",
    createdAt: "2026-04-05T10:00:00Z",
    updatedAt: "2026-04-05T10:01:00Z",
    messages: [],
  },
  {
    id: "conv-10",
    title: "初次了解凯利理论",
    createdAt: "2026-03-01T09:00:00Z",
    updatedAt: "2026-03-01T09:30:00Z",
    messages: [],
  },
]
