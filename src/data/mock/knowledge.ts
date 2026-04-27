export interface KnowledgeEntry {
  id: string
  slug: string
  title: string
  concept: string
  definition: string
  content: string
  category: string
  tags: string[]
  source: string
  relatedIds: string[]
}

export const KNOWLEDGE_CATEGORIES = [
  { id: "cat-1", name: "核心理论", count: 4, icon: "Lightbulb" },
  { id: "cat-2", name: "基本概念", count: 2, icon: "BookText" },
  { id: "cat-3", name: "应用方法", count: 2, icon: "Wrench" },
  { id: "cat-4", name: "相关理论", count: 0, icon: "GitBranch" },
  { id: "cat-5", name: "原著文献", count: 0, icon: "FileText" },
  { id: "cat-6", name: "术语表", count: 0, icon: "Bookmark" },
]

export const MOCK_KNOWLEDGE_ENTRIES: KnowledgeEntry[] = [
  {
    id: "know-1",
    slug: "construct",
    title: `构念（Construct）`,
    concept: "构念",
    definition:
      `个人用来解释和预测事件的心理框架，是一对对立属性的维度（如"友善—冷漠"）。`,
    content: `## 构念的定义

**构念**（Construct）是个人建构心理学的核心概念。它指的是一个人用来解释和预测事件的心理框架。

### 关键特征

1. **二分性**：每个构念都是一对对立属性。"友善"只有在与"冷漠"对比时才有意义。
2. **个人性**：每个人的构念都是独特的——同一个词对不同的人可能意味着不同的东西。
3. **实用性**：构念是"工具"而不是"真理"——它们的作用是帮助我们预测，而不是反映客观现实。

### 构念 vs 概念

| 构念 | 概念 |
|------|------|
| 有对立两极（友善—冷漠） | 通常是单极的（友善） |
| 是个体建构的 | 是社会共享的 |
| 主要用于预测 | 主要用于分类 |

### 例子

- "成功—失败"（一个常用的构念）
- "可控—不可控"
- "有意义—无意义"`,
    category: "核心理论",
    tags: ["构念", "核心概念"],
    source: "Kelly, G. (1955). Vol.1, p.9",
    relatedIds: ["know-2", "know-3"],
  },
  {
    id: "know-2",
    slug: "construct-system",
    title: "构念系统（Construct System）",
    concept: "构念系统",
    definition:
      "个人拥有的所有构念按照一定层次关系组织而成的整体系统。",
    content: `## 构念系统的定义

构念不是孤立存在的，而是按照一定的层次关系组织成**系统**。

### 层次结构

构念系统有一个层次结构：
- **核心构念**：位于系统上层，适用范围广，改变它们会引发系统性变化
- **边缘构念**：位于系统下层，适用范围窄，改变它们影响较小

### 系统的特性

1. **整体性**：构念之间相互关联，改变一个构念可能影响整个系统
2. **层次性**：上层构念包含并组织下层构念
3. **渗透性**：构念系统接纳新经验的能力
4. **动态性**：构念系统随着新经验而演变`,
    category: "核心理论",
    tags: ["构念系统", "核心概念"],
    source: "Kelly, G. (1955). Vol.1, p.56",
    relatedIds: ["know-1"],
  },
  {
    id: "know-3",
    slug: "cpc-cycle",
    title: "CPC 循环",
    concept: "CPC 循环",
    definition:
      "Circumspection（审虑）-Preemption（预断）-Control（控制）三阶段决策模型。",
    content: `## CPC 循环

CPC 循环是凯利理论中描述决策过程的核心模型。

### 三阶段

1. **Circumspection（审虑）**：从多个角度审视情境，考虑多种构念
2. **Preemption（预断）**：选择最相关的构念作为决策依据
3. **Control（控制）**：基于选择的构念做出决策并行动

### 日常应用

CPC 循环告诉我们：好的决策需要审虑的"广度"和预断的"力度"之间的平衡。`,
    category: "核心理论",
    tags: ["CPC循环", "决策"],
    source: "Kelly, G. (1955). Vol.1, p.108",
    relatedIds: ["know-1"],
  },
  {
    id: "know-4",
    slug: "constructive-alternativism",
    title: "建构替代论（Constructive Alternativism）",
    concept: "建构替代论",
    definition:
      "凯利理论的基本哲学立场——我们对于任何事件总是可以有多种不同的建构方式。",
    content: `## 建构替代论

"没有任何事物是无可救药的。"这是建构替代论的核心精神。

### 核心主张

对于任何事件，我们总是可以有多种不同的建构方式。没有哪一种对现实的解读是"唯一正确"的——所有解读都只是我们建构出来的，也都可以被重新建构。

### 实践意义

- **灵活性**：我们不必被困在单一的解读方式中
- **开放性**：他人的解读方式可能同样有效
- **希望**：改变永远是可能的`,
    category: "核心理论",
    tags: ["建构替代论", "哲学"],
    source: "Kelly, G. (1955). Vol.1, p.15",
    relatedIds: ["know-1", "know-2"],
  },
  {
    id: "know-5",
    slug: "anxiety",
    title: "焦虑（Anxiety）",
    concept: "焦虑",
    definition:
      "当个人意识到自己面临的事件超出了其构念系统的可预测范围时产生的体验。",
    content: `## 焦虑的定义

在我的理论中，焦虑不是一种病理性症状，而是一个自然信号。

### 定义

> 焦虑是当一个人意识到自己正面临超出其构念系统范围的事件时产生的体验。

### 重要含义

1. 焦虑不是"出了什么问题"——它在告诉你遇到了新事物
2. 焦虑是成长的信号——你的构念系统正在被挑战
3. 应对焦虑不是消除它，而是扩展你的构念系统`,
    category: "基本概念",
    tags: ["焦虑", "情绪"],
    source: "Kelly, G. (1955). Vol.1, p.109",
    relatedIds: ["know-1"],
  },
  {
    id: "know-6",
    slug: "hostility",
    title: "敌意（Hostility）",
    concept: "敌意",
    definition:
      "持续试图从他人那里获取证据来验证一个已被证明无效的构念。",
    content: `## 敌意的定义

敌意是我理论中一个非常独特的定义——它不涉及愤怒，而涉及**固执**。

### 定义

> 敌意是持续试图从他人那里获取证据来验证一个已被证明无效的构念。

### 例子

一个人坚持认为"所有人都是不可信的"。即使遇到友善的人，他也会找各种理由证明这个人"其实不可信"——这就是敌意。

### 与日常用法的区别

日常语言中的"敌意"指攻击性，但在凯利的理论中，敌意指的是一种认知上的固执——**宁愿扭曲事实，也不愿改变构念**。`,
    category: "基本概念",
    tags: ["敌意", "情绪", "社会互动"],
    source: "Kelly, G. (1955). Vol.1, p.112",
    relatedIds: ["know-5"],
  },
  {
    id: "know-7",
    slug: "repertory-grid",
    title: "角色构念方格测验（Repertory Grid）",
    concept: "方格技术",
    definition:
      "用于探索和评估个人构念系统的半结构化访谈和测量工具。",
    content: `## 角色构念方格测验

方格技术是我设计的一个独特的评估工具，它不是"测试"而是访谈技术。

### 步骤

1. **选择元素**：选定要探索的领域（如重要他人、工作场景等）
2. **引出构念**：每次抽三个元素，找出其中两个的相似之处和与第三个的不同
3. **评估**：用引出的构念评估所有元素
4. **分析**：分析构念之间的关系和模式

### 应用领域

- 心理治疗
- 职业咨询
- 教育评估
- 组织行为学`,
    category: "应用方法",
    tags: ["方格技术", "评估", "方法论"],
    source: "Kelly, G. (1955). Vol.1, Chapter 5",
    relatedIds: ["know-1", "know-2"],
  },
  {
    id: "know-8",
    slug: "fixed-role-therapy",
    title: "固定角色疗法（Fixed Role Therapy）",
    concept: "固定角色疗法",
    definition:
      "让来访者暂时扮演一个与自身构念系统不同的角色，以体验新的建构方式。",
    content: `## 固定角色疗法

固定角色疗法是凯利设计的一种独特的治疗方法。

### 基本流程

1. **分析**：治疗师和来访者一起分析来访者的构念系统
2. **撰写角色**：基于分析，撰写一个"新角色"的素描——这个角色用不同的构念系统来看世界
3. **扮演**：来访者在接下来的一段时间里扮演这个角色
4. **体验**：通过扮演，来访者体验到新的构念系统是可以运作的

### 核心理念

**改变不一定要从"认识自己"开始——你可以先"尝试成为另一个人"，然后发现新的可能性。**

这完全符合建构替代论：如果你现有的构念系统不适用，那就尝试一个新的。`,
    category: "应用方法",
    tags: ["治疗", "角色"],
    source: "Kelly, G. (1955). Vol.2, p.371",
    relatedIds: ["know-1"],
  },
]
