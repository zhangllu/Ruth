---
name: ask-kelly-ui-spec
description: 问凯利 UI 设计规格文档 — 基于 Next.js 15+ / Tailwind CSS v4 / shadcn/ui / Zustand
depends:
  required:
    - .42cog/meta/meta.md
    - .42cog/real/real.md
    - .42cog/cog/cog.md
  optional:
    - spec/pm/pr.spec.md
    - spec/pm/userstory.spec.md
    - spec/dev/sys.spec.md
---

# 问凯利（Ask Kelly）UI 设计规格

<ui-meta>
  <document-id>ask-kelly-ui-spec</document-id>
  <version>1.0.0</version>
  <project>问凯利 (Ask Kelly)</project>
  <type>UI 设计规格</type>
  <created>2026-04-27</created>
  <tech-stack>Next.js 15+, React 19+, Tailwind CSS v4, shadcn/ui, Zustand</tech-stack>
</ui-meta>

---

## 1. 智能分析结论

### 1.1 应用类型

**结论：混合型（SPA + MPA）**

| 维度 | 分析 | 结论 |
|------|------|------|
| 核心交互 | AI 对话需实时流式响应，频繁状态变化 | 对话区为 SPA 模式 |
| 内容浏览 | 文章和知识库为独立阅读模块，页面间跳转 | 内容区为 MPA 模式 |
| 管理后台 | 独立的 CRUD 操作页面集 | 独立 MPA 模块 |
| 整体架构 | Next.js App Router 支持在同一应用中混合两种模式 | 混合型 |

**布局策略：**
- 对话页（`/chat`、`/chat/[id]`）：客户端组件为主，保持对话状态的连续性
- 公开页（首页、文章列表/详情、知识库）：服务端组件优先，SEO 友好
- 管理后台（`/admin/*`）：客户端组件为主，交互密集

### 1.2 导航结构

**结论：混合导航（顶部导航 + 沉浸式对话布局）**

```
┌─────────────────────────────────────────────────────┐
│  [Logo] 问凯利    对话  文章  知识库    [状态]      │  ← 顶部导航
├─────────────────────────────────────────────────────┤
│                                                     │
│              页面主要内容区域                          │
│                                                     │
├─────────────────────────────────────────────────────┤
│  © 2026 问凯利 · 和凯利对话，看见自己建构的世界        │  ← 页脚（首页/文章页）
└─────────────────────────────────────────────────────┘
```

**导航项：**

| 优先级 | 导航项 | 路径 | 图标 | 说明 |
|--------|--------|------|------|------|
| P0 | 首页 | `/` | House | 项目介绍 + 标语 + 入口卡片 |
| P0 | 对话 | `/chat` | MessageSquare | 与凯利 AI 对话 |
| P0 | 文章 | `/articles` | BookOpen | 凯利相关文章列表 |
| P1 | 知识库 | `/knowledge` | Library | 系统化知识库浏览 |

**移动端适配：** 顶部导航 → 底部 Tab 栏（4 项）+ 汉堡菜单（更多入口）

### 1.3 配色方案

**主色相：250°（紫蓝色）—— 理性、深度、可信**
**强调色：30°（暖橙色）—— 温暖、人文、启发**

**OKLCH 配置：**

```css
@theme inline {
  /* 主色调 — 紫蓝（心理学深度 + AI 智能感） */
  --color-primary-50:  oklch(0.95 0.03 250);
  --color-primary-100: oklch(0.90 0.05 250);
  --color-primary-200: oklch(0.80 0.08 250);
  --color-primary-300: oklch(0.70 0.12 250);
  --color-primary-400: oklch(0.60 0.15 250);
  --color-primary-500: oklch(0.50 0.16 250);
  --color-primary-600: oklch(0.40 0.14 250);
  --color-primary-700: oklch(0.32 0.12 250);
  --color-primary-800: oklch(0.25 0.09 250);
  --color-primary-900: oklch(0.18 0.06 250);

  /* 强调色 — 暖橙（人文温度） */
  --color-accent-50:  oklch(0.95 0.04 30);
  --color-accent-500: oklch(0.65 0.14 30);
  --color-accent-700: oklch(0.45 0.12 30);

  /* 语义色 */
  --color-success: oklch(0.60 0.15 150);
  --color-warning: oklch(0.70 0.16 80);
  --color-error:   oklch(0.55 0.18 25);
  --color-info:    oklch(0.60 0.12 250);

  /* 中性色 */
  --color-bg:       oklch(0.98 0.005 250);
  --color-bg-card:  oklch(1 0 0);
  --color-fg:       oklch(0.15 0.02 250);
  --color-muted:    oklch(0.60 0.02 250);
  --color-border:   oklch(0.88 0.01 250);
}
```

**暗色模式（随系统切换）：**

```css
@media (prefers-color-scheme: dark) {
  :root {
    --color-bg:       oklch(0.12 0.02 250);
    --color-bg-card:  oklch(0.18 0.02 250);
    --color-fg:       oklch(0.92 0.01 250);
    --color-muted:    oklch(0.60 0.02 250);
    --color-border:   oklch(0.25 0.02 250);
  }
}
```

---

## 2. 设计系统

### 2.1 设计令牌

```css
@theme inline {
  /* 间距 */
  --spacing-1: 0.25rem;
  --spacing-2: 0.5rem;
  --spacing-3: 0.75rem;
  --spacing-4: 1rem;
  --spacing-6: 1.5rem;
  --spacing-8: 2rem;
  --spacing-12: 3rem;
  --spacing-16: 4rem;

  /* 圆角 */
  --radius-sm: 0.25rem;
  --radius-md: 0.5rem;
  --radius-lg: 0.75rem;
  --radius-xl: 1rem;
  --radius-full: 9999px;

  /* 阴影 */
  --shadow-sm: 0 1px 2px oklch(0 0 0 / 0.05);
  --shadow-md: 0 4px 6px oklch(0 0 0 / 0.1);
  --shadow-lg: 0 10px 15px oklch(0 0 0 / 0.1);
  --shadow-xl: 0 20px 25px oklch(0 0 0 / 0.15);

  /* 动画 */
  --animate-spin: spin 1s linear infinite;
  --animate-pulse: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
  --animate-fade-in: fade-in 0.3s ease-out;
  --animate-slide-up: slide-up 0.3s ease-out;

  @keyframes fade-in {
    from { opacity: 0; }
    to { opacity: 1; }
  }
  @keyframes slide-up {
    from { opacity: 0; transform: translateY(10px); }
    to { opacity: 1; transform: translateY(0); }
  }
}
```

### 2.2 字体配置

**系统字体栈（不依赖 Google Fonts）：**

```css
:root {
  --font-sans: ui-sans-serif, system-ui, -apple-system, "PingFang SC",
    "Microsoft YaHei", "Noto Sans SC", sans-serif;
  --font-serif: "Noto Serif SC", Georgia, "Songti SC", serif;
  --font-mono: "SF Mono", "Fira Code", "JetBrains Mono", monospace;
}
```

| 用途 | 字体栈 | 字重 |
|------|--------|------|
| 正文 | sans | 400 / 500 |
| 标题 | sans | 600 / 700 |
| 引用/引文 | serif | 400 / 500 (斜体) |
| 代码 | mono | 400 |

### 2.3 图标

使用 **Lucide React** 图标库，统一 20px 尺寸。

---

## 3. 页面布局

### 3.1 响应式断点

| 断点 | 宽度 | 布局模式 | 导航 |
|------|------|----------|------|
| Mobile | < 640px | 单列，全宽 | 底部 Tab 栏 |
| Tablet | 640 - 1024px | 双列，可折叠侧边栏 | 顶部导航 + 汉堡菜单 |
| Desktop | > 1024px | 多列布局 | 顶部导航全展示 |

### 3.2 页面结构

#### 首页（`/`）

```
┌────────────────────────────────────────────┐
│  [Logo] 问凯利    对话  文章  知识库        │  ← 顶部导航
├────────────────────────────────────────────┤
│                                            │
│  ┌──────────────────────────────────────┐  │
│  │                                      │  │
│  │  和凯利对话，                         │  │  ← Hero 区域
│  │  看见自己建构的世界                    │  │
│  │                                      │  │
│  │  [开始对话]  [浏览文章]               │  │
│  │                                      │  │
│  └──────────────────────────────────────┘  │
│                                            │
│  凯利是谁                                  │  ← 介绍区
│  ┌──────┐ ┌──────┐ ┌──────┐              │
│  │ 生平  │ │ 理论  │ │ 影响  │              │
│  └──────┘ └──────┘ └──────┘              │
│                                            │
│  最新文章                                   │  ← 精选文章区
│  ┌───────────────────┐ ┌─────────────────┐│
│  │ 文章卡片 1         │ │ 文章卡片 2       ││
│  └───────────────────┘ └─────────────────┘│
│                                            │
│  ────────────────────────────────────────  │
│  © 2026 问凯利 · 和凯利对话...             │  ← 页脚
└────────────────────────────────────────────┘
```

#### 对话页（`/chat`、`/chat/[id]`）

```
┌────────────────────────────────────────────┐
│  [←] 问凯利              [新建对话] [⚙]    │  ← 简化顶部栏
├──────────────────┬─────────────────────────┤
│                   │                         │
│  对话历史侧边栏    │   对话主区域              │
│  ┌─────────────┐  │   ┌─────────────────┐  │
│  │ 今日          │  │   │ 凯利的消息       │  │
│  │  ├ 构念是什么  │  │   │ (Markdown 渲染)  │  │
│  │  ├ 如何看待焦虑 │  │   │                 │  │
│  │  ├ 日常反思    │  │   │ 用户的消息       │  │
│  │ 上周          │  │   │ ─────────────── │  │
│  │  ├ 成功与失败  │  │   │ [输入框......]   │  │  ← 固定底部
│  │  └ ...        │  │   └─────────────────┘  │
│  └─────────────┘  │                         │
│                   │                         │
└──────────────────┴─────────────────────────┘

Mobile（< 640px）：
┌────────────────────────────┐
│  [←] 问凯利     [⋮]      │
├────────────────────────────┤
│                            │
│  凯利的消息                 │
│  (Markdown 渲染)            │
│                            │
│  用户的消息                 │
│                            │
│ ─────────────────────────  │
│ [输入框................]   │
│ [发送]                     │
└────────────────────────────┘
```

#### 文章列表页（`/articles`）

```
┌────────────────────────────────────────────┐
│  [Logo] 问凯利    对话  文章  知识库        │
├────────────────────────────────────────────┤
│  文章 · 凯利个人建构心理学                    │  ← 页面标题
│                                            │
│  [分类标签： 全部 理论 应用 读书笔记 感悟]    │  ← 标签筛选
│                                            │
│  ┌──────────────────────────────────────┐  │
│  │ 📄 标题：个人建构理论的核心假设          │  │  ← 文章卡片
│  │    摘要：凯利的11个推论...             │  │
│  │    日期：2026-03-15  ·  3 分钟阅读    │  │
│  └──────────────────────────────────────┘  │
│  ┌──────────────────────────────────────┐  │
│  │ 📄 标题：CPC循环：决策中的建构过程      │  │
│  │    摘要：CPC循环是凯利描述...          │  │
│  │    日期：2026-03-10  ·  5 分钟阅读    │  │
│  └──────────────────────────────────────┘  │
│  ...                                       │
│                                            │
│  页脚                                       │
└────────────────────────────────────────────┘
```

#### 知识库页（`/knowledge`）

```
┌────────────────────────────────────────────┐
│  [Logo] 问凯利    对话  文章  知识库        │
├────────────────────────────────────────────┤
│  知识库 · 个人建构心理学体系                 │
│                                            │
│  [🔍 搜索知识库......]                     │  ← 搜索框
│                                            │
│  ┌─────────┐ ┌─────────┐ ┌─────────┐      │
│  │ 核心理论  │ │ 基本概念  │ │ 应用方法  │      │  ← 分类卡片
│  │ 12条目   │ │ 8概念   │ │ 6方法    │      │
│  └─────────┘ └─────────┘ └─────────┘      │
│  ┌─────────┐ ┌─────────┐ ┌─────────┐      │
│  │ 相关理论  │ │ 原著文献  │ │ 术语表   │      │
│  │ 5条目   │ │ 15篇    │ │ 30+词条  │      │
│  └─────────┘ └─────────┘ └─────────┘      │
│                                            │
│  页脚                                       │
└────────────────────────────────────────────┘
```

---

## 4. 组件规格

### 4.1 shadcn/ui 组件清单

| 组件 | 用途 | 页面 |
|------|------|------|
| Button | 操作按钮、CTA | 全局 |
| Input | 文本输入、搜索框 | 全局 |
| Textarea | 对话输入框 | Chat |
| Card | 文章卡片、介绍卡片 | Home, Articles, Knowledge |
| Badge | 标签、状态标识 | Articles, Knowledge |
| Avatar | 凯利头像、用户头像 | Chat |
| ScrollArea | 对话列表滚动 | Chat |
| Separator | 内容分隔 | 全局 |
| Skeleton | 加载骨架屏 | 全局 |
| Sonner | 操作反馈 Toast | 全局 |
| Dialog | 确认弹窗 | Chat, Admin |
| Sheet | 移动端侧边栏 | Chat (Mobile) |
| DropdownMenu | 更多操作菜单 | Chat, Admin |
| Tabs | 分类切换 | Articles, Knowledge |
| Tooltip | 提示说明 | 全局 |
| Select | 选项选择 | Articles |
| Switch | 开关（如 Mock 模式） | Chat (Dev) |
| Checkbox | 多选 | Admin |

### 4.2 自定义组件

#### components/chat/

| 组件 | 职责 | 状态覆盖 |
|------|------|----------|
| `chat-input.tsx` | 对话输入框 + 发送按钮 | 空状态（placeholder）、禁用（发送中）、正常 |
| `chat-message.tsx` | 单条消息展示（Markdown 渲染） | 用户消息、凯利消息、错误消息 |
| `chat-list.tsx` | 消息列表容器（自动滚动） | 加载中（Skeleton）、空（欢迎语）、正常 |
| `typing-indicator.tsx` | 凯利正在输入动画 | 三个跳动圆点 |
| `welcome-message.tsx` | 对话页初始欢迎语 | — |
| `error-message.tsx` | 错误消息展示 + 重试按钮 | — |
| `conversation-sidebar.tsx` | 对话历史侧边栏 | 空（无对话）、列表、加载中 |
| `conversation-item.tsx` | 单个对话历史项 | 活跃、普通、删除确认 |
| `mock-mode-badge.tsx` | Mock 模式指示器 | 显示/隐藏 |

#### components/articles/

| 组件 | 职责 | 状态覆盖 |
|------|------|----------|
| `article-card.tsx` | 文章卡片（标题+摘要+日期+标签） | 默认、已归档 |
| `article-content.tsx` | 文章内容渲染（Markdown） | 加载中、加载失败 |
| `related-articles.tsx` | 相关文章推荐（2-3 篇） | 空（无相关）、正常 |
| `article-tags.tsx` | 文章标签筛选栏 | 全部/分类筛选 |
| `article-skeleton.tsx` | 文章列表骨架屏 | — |

#### components/knowledge/

| 组件 | 职责 | 状态覆盖 |
|------|------|----------|
| `knowledge-card.tsx` | 分类卡片 | 默认 |
| `knowledge-tree.tsx` | 知识体系树形导航 | 加载中、正常 |
| `knowledge-search.tsx` | 知识库搜索框 | 空结果、搜索中、正常 |
| `knowledge-entry.tsx` | 知识条目详情 | 加载中、加载失败 |

#### components/layout/

| 组件 | 职责 | 状态覆盖 |
|------|------|----------|
| `header.tsx` | 顶部导航栏 | 桌面/移动端切换 |
| `footer.tsx` | 页脚 | — |
| `mobile-nav.tsx` | 移动端底部 Tab 导航 | 当前页高亮 |
| `sidebar.tsx` | 桌面端侧边栏（对话页） | 展开/收起 |
| `theme-toggle.tsx` | 暗色模式切换 | 亮/暗/系统 |

### 4.3 组件状态覆盖矩阵

| 组件 | 加载 | 空 | 正常 | 错误 | 边界 |
|------|------|-----|------|------|------|
| chat-list | Skeleton（3 条） | 欢迎语卡片 | 消息列表 | 错误提示 + 重试 | 50+ 条消息性能 |
| chat-input | 禁用态 | Placeholder | 可输入 | — | 超长文本（2000 字截断提示） |
| article-card | Skeleton | — | 标题+摘要 | — | 超长标题截断（2 行） |
| article-content | Skeleton | — | Markdown 渲染 | 错误页 + 返回按钮 | 超长内容分页 |
| knowledge-search | 搜索中 Spinner | "未找到结果" | 结果列表 | 搜索失败重试 | — |
| conversation-sidebar | Skeleton | "暂无对话" | 对话列表 | — | 30+ 对话虚拟滚动 |

---

## 5. 状态管理

### 5.1 Store 架构

```
Zustand Stores (persist → localStorage)
├── app-store          # 全局 UI 状态（侧边栏、主题）
├── chat-store         # 对话状态（消息、当前对话、Mock 模式）
├── article-store      # 文章数据（列表、当前文章）
├── knowledge-store    # 知识库数据（分类、条目、搜索）
└── ui-store           # 临时 UI 状态（Toast 队列、模态框）
```

### 5.2 Store 定义

#### app-store.ts

```typescript
interface AppState {
  sidebarOpen: boolean
  theme: 'light' | 'dark' | 'system'
  toggleSidebar: () => void
  setTheme: (theme: 'light' | 'dark' | 'system') => void
}

// 初始化值：sidebarOpen: true, theme: 'system'
// Storage key: 'ask-kelly-app'
```

#### chat-store.ts

```typescript
interface Message {
  id: string
  role: 'user' | 'assistant' | 'system'
  content: string
  createdAt: string
}

interface Conversation {
  id: string
  title: string
  messages: Message[]
  createdAt: string
  updatedAt: string
}

interface ChatState {
  // 数据
  conversations: Conversation[]
  currentConversationId: string | null
  useMockMode: boolean
  isStreaming: boolean

  // Actions
  createConversation: () => string
  deleteConversation: (id: string) => void
  sendMessage: (content: string) => Promise<void>
  setCurrentConversation: (id: string | null) => void
  setMockMode: (mock: boolean) => void
}

// 初始化值：conversations: MOCK_CONVERSATIONS, useMockMode: true
// Storage key: 'ask-kelly-chat'
```

#### article-store.ts

```typescript
interface Article {
  id: string
  slug: string
  title: string
  summary: string
  content: string
  tags: string[]
  source?: string
  publishedAt: string
  createdAt: string
}

interface ArticleState {
  articles: Article[]
  currentSlug: string | null
  activeTag: string | null

  setActiveTag: (tag: string | null) => void
  getFilteredArticles: () => Article[]
  getRelatedArticles: (slug: string) => Article[]
}

// 初始化值：articles: MOCK_ARTICLES (8-10 篇)
// Storage key: 'ask-kelly-articles'
// 注意：此为本地缓存，真实数据通过 API 获取
```

#### knowledge-store.ts

```typescript
interface KnowledgeEntry {
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

interface KnowledgeState {
  entries: KnowledgeEntry[]
  activeCategory: string | null
  searchQuery: string

  setActiveCategory: (category: string | null) => void
  setSearchQuery: (query: string) => void
  getFilteredEntries: () => KnowledgeEntry[]
}

// 初始化值：entries: MOCK_KNOWLEDGE_ENTRIES
// Storage key: 'ask-kelly-knowledge'
```

### 5.3 Store 关系图

```
app-store (全局 UI 状态)
  └── 被所有页面读取

chat-store (对话数据)
  ├── 读取: chat 页面组件
  ├── 写入: chat-input, typing-indicator
  └── 依赖: 无

article-store (文章数据)
  ├── 读取: articles 页面
  ├── 写入: admin 页面
  └── 依赖: 无

knowledge-store (知识库数据)
  ├── 读取: knowledge 页面
  ├── 写入: admin 页面
  └── 依赖: 无
```

---

## 6. 功能独立原则

### 6.1 三条规则

**规则 1：无阻塞依赖**

| 功能 | ❌ 错误做法 | ✅ 正确做法 |
|------|-----------|-----------|
| AI 对话 | 必须配置智谱 API 密钥才能聊天 | 默认使用 Mock AI 响应，无需任何配置 |
| 文章列表 | 必须连接数据库才能看到文章 | 使用本地 Mock 数据展示文章 |
| 知识库 | 必须从 API 获取数据 | 使用本地 Mock 数据展示知识条目 |

**规则 2：默认 Mock，就绪后切换真实**

```typescript
// chat-store.ts
useMockMode: true  // 默认 Mock 模式

// 组件中使用
if (useMockMode) {
  await generateMockResponse(message)  // 本地模拟
} else {
  await callRealAI(message)            // 调用智谱 API
}
```

**规则 3：Mock 模式的视觉反馈**

```typescript
// Mock 模式指示器组件
<Badge variant="outline" className="text-amber-600 border-amber-300">
  🎭 演示模式
</Badge>
```

### 6.2 各功能独立验证

| 功能 | Mock 数据 | 无需 API | 无需数据库 | 立即可用 |
|------|-----------|----------|-----------|---------|
| 首页展示 | ✅ | ✅ | ✅ | ✅ |
| AI 对话 | ✅ Mock AI | ✅ | ✅ | ✅ |
| 文章浏览 | ✅ Mock 文章 | ✅ | ✅ | ✅ |
| 知识库浏览 | ✅ Mock 条目 | ✅ | ✅ | ✅ |
| 文章管理(Admin) | ✅ Mock 数据 | ✅ | ✅ | ✅ |

---

## 7. Mock 数据

### 7.1 Mock 对话数据

```typescript
// data/mock/conversations.ts

export const MOCK_CONVERSATIONS: Conversation[] = [
  {
    id: 'conv-1',
    title: '什么是个人建构心理学？',
    createdAt: '2026-04-26T10:00:00Z',
    updatedAt: '2026-04-26T10:05:00Z',
    messages: [
      {
        id: 'msg-1',
        role: 'user',
        content: '请问凯利，什么是个人建构心理学？',
        createdAt: '2026-04-26T10:00:00Z',
      },
      {
        id: 'msg-2',
        role: 'assistant',
        content: '很高兴你对这个问题感兴趣。个人建构心理学的核心思想是：**每个人都是科学家**。\n\n正如科学家通过理论来预测实验一样，我们每个人都通过自己的"构念系统"来预测事件。让我用一个例子来说明…',
        createdAt: '2026-04-26T10:05:00Z',
      },
    ],
  },
  {
    id: 'conv-2',
    title: '如何应对焦虑？',
    createdAt: '2026-04-25T14:30:00Z',
    updatedAt: '2026-04-25T14:35:00Z',
    messages: [
      {
        id: 'msg-3',
        role: 'user',
        content: '凯利，我最近感到很焦虑，不知道如何应对。',
        createdAt: '2026-04-25T14:30:00Z',
      },
      {
        id: 'msg-4',
        role: 'assistant',
        content: '你能具体说说，当你感到焦虑时，你发现自己处于什么样的情境中吗？在我的理论中，焦虑并不意味着"出了问题"——它只是意味着你遇到的事件超出了你当前构念系统的可预测范围…',
        createdAt: '2026-04-25T14:35:00Z',
      },
    ],
  },
  {
    id: 'conv-3',
    title: 'CPC 循环是什么？',
    createdAt: '2026-04-24T09:00:00Z',
    updatedAt: '2026-04-24T09:08:00Z',
    messages: [
      {
        id: 'msg-5',
        role: 'user',
        content: '请解释一下 CPC 循环',
        createdAt: '2026-04-24T09:00:00Z',
      },
      {
        id: 'msg-6',
        role: 'assistant',
        content: 'CPC 循环是我理论中描述人们如何做出决策的过程。它包含三个阶段：\n\n**C — Circumspection（审虑）**：从多个角度审视情境\n**P — Preemption（预断）**：选择最相关的构念\n**C — Control（控制）**：做出选择并行动\n\n让我用一个日常例子来说明…',
        createdAt: '2026-04-24T09:08:00Z',
      },
    ],
  },
  {
    id: 'conv-4',
    title: '构念与价值观的区别',
    createdAt: '2026-04-23T16:00:00Z',
    updatedAt: '2026-04-23T16:03:00Z',
    messages: [
      {
        id: 'msg-7',
        role: 'user',
        content: '构念和价值观有什么不同？',
        createdAt: '2026-04-23T16:00:00Z',
      },
    ],
  },
  {
    id: 'conv-5',
    title: '凯利眼中的弗洛伊德',
    createdAt: '2026-04-20T11:00:00Z',
    updatedAt: '2026-04-20T11:02:00Z',
    messages: [],
  },
  {
    id: 'conv-6',
    title: '建构替代论的实际应用',
    createdAt: '2026-04-18T08:00:00Z',
    updatedAt: '2026-04-18T08:10:00Z',
    messages: [],
  },
  {
    id: 'conv-7',
    title: '关于人际关系中的构念冲突',
    createdAt: '2026-04-15T19:00:00Z',
    updatedAt: '2026-04-15T19:04:00Z',
    messages: [],
  },
  {
    id: 'conv-8',
    title: '凯利的11个推论概述',
    createdAt: '2026-04-10T13:00:00Z',
    updatedAt: '2026-04-10T13:12:00Z',
    messages: [],
  },
  // 边界情况：长标题
  {
    id: 'conv-9',
    title: '如何在日常工作和生活中运用个人建构心理学来改善沟通效果和人际关系',
    createdAt: '2026-04-05T10:00:00Z',
    updatedAt: '2026-04-05T10:01:00Z',
    messages: [],
  },
  // 边界情况：旧对话
  {
    id: 'conv-10',
    title: '初次了解凯利理论',
    createdAt: '2026-03-01T09:00:00Z',
    updatedAt: '2026-03-01T09:30:00Z',
    messages: [],
  },
]
```

### 7.2 Mock AI 响应生成器

```typescript
// lib/mock/ai-responses.ts

/**
 * 凯利人格 Mock 响应生成器
 * 模拟凯利的苏格拉底式引导风格
 */
const KELLY_RESPONSES = [
  '这是一个很有意思的问题。让我从个人建构心理学的角度来谈谈我的理解…\n\n在我看来，每个人都是一个"科学家"，不断构建理论来预测和理解世界。你提到的这个情况，实际上涉及到你内心的构念系统如何运作。\n\n我想邀请你思考一下：当你面对这个情境时，你首先想到的是哪一对构念？比如"好—坏"、"公平—不公平"或者"可控—不可控"？',
  '你提出的问题触及了个人建构心理学的核心。\n\n让我用一个具体的例子来说明：想象你遇到了一个陌生人。你不会真的"了解"这个人，但你会有一些预期——你根据过去的经验形成了一个构念，然后用它来理解眼前的人。\n\n这个过程的关键在于：你的构念不是被动接收的，而是你主动建立的。这意味着你有能力改变它们。',
  '感谢你的坦诚分享。从你的描述中，我注意到你似乎在用"成功—失败"这一对构念来看待这个经历。\n\n我想邀请你考虑另一种可能性：如果不用"成功—失败"来衡量，你会如何描述这段经历？也许"学习—尚未学习"或者"探索—确认"会是更有用的构念？',
  '这让我想起了个人建构心理学中的一个重要概念——**焦虑**。在我的理论中，焦虑并不是一种"病"，而是当你意识到自己正面临超出构念系统范围的事件时的一种自然反应。\n\n换句话说，焦虑意味着你遇到了一个你的"理论"还无法充分解释的情境。这不是坏事——它恰恰是成长和学习的信号。',
  '你的反思很有深度。你提到的这个情况，实际上涉及到了**构念的渗透性**——也就是说，你的构念是否足够开放来接纳新的经验。\n\n有些构念是非常渗透的，比如"好—坏"几乎可以应用于任何事物。但有些构念则非常具体。真正灵活的思维，在于知道什么时候用什么构念，以及什么时候需要建立新的构念。',
]

export async function generateMockResponse(message: string): Promise<string> {
  // 模拟网络延迟
  await new Promise(resolve => setTimeout(resolve, 800 + Math.random() * 1200))

  // 关键词匹配，返回相关回复
  if (message.includes('焦虑') || message.includes('恐惧') || message.includes('担心')) {
    return KELLY_RESPONSES[3]
  }
  if (message.includes('成功') || message.includes('失败') || message.includes('成就')) {
    return KELLY_RESPONSES[2]
  }
  if (message.includes('构念') || message.includes('建构')) {
    return KELLY_RESPONSES[4]
  }
  if (message.includes('你好') || message.includes('嗨') || message.includes('hello')) {
    return '你好！我是乔治·凯利。很高兴你来找我对话。有什么关于个人建构心理学的问题，或者生活中的困惑，你愿意和我探讨吗？'
  }

  // 随机回复
  return KELLY_RESPONSES[Math.floor(Math.random() * KELLY_RESPONSES.length)]
}

/**
 * 流式 Mock 响应生成器
 * 模拟打字机效果
 */
export async function* streamMockResponse(message: string): AsyncGenerator<string> {
  const response = await generateMockResponse(message)
  // 按句子流式输出
  const sentences = response.split(/(?<=[。！？\n])/)
  for (const sentence of sentences) {
    if (sentence.trim()) {
      // 句子内逐字输出
      for (const char of sentence) {
        yield char
        await new Promise(resolve => setTimeout(resolve, 20 + Math.random() * 40))
      }
      // 句子间停顿稍长
      await new Promise(resolve => setTimeout(resolve, 100))
    }
  }
}
```

### 7.3 Mock 文章数据

```typescript
// data/mock/articles.ts

export const MOCK_ARTICLES: Article[] = [
  {
    id: 'art-1',
    slug: 'personal-construct-theory-core',
    title: '个人建构理论的核心假设',
    summary: '凯利的11个推论如何构成个人建构心理学的理论基石？本文系统梳理基本假设与推论体系。',
    content: '# 个人建构理论的核心假设\n\n乔治·凯利的个人建构心理学建立在一个基本假设和11个推论之上…',
    tags: ['理论', '核心概念'],
    source: 'Kelly, G. (1955). The Psychology of Personal Constructs.',
    publishedAt: '2026-03-15',
    createdAt: '2026-03-10',
  },
  {
    id: 'art-2',
    slug: 'cpc-cycle-decision-making',
    title: 'CPC循环：决策中的建构过程',
    summary: '凯利提出的CPC循环（Circumspection-Preemption-Control）如何描述人的决策过程。',
    content: '# CPC循环：决策中的建构过程\n\nCPC循环是凯利个人建构心理学中描述决策过程的核心模型…',
    tags: ['理论', '应用'],
    publishedAt: '2026-03-10',
    createdAt: '2026-03-08',
  },
  {
    id: 'art-3',
    slug: 'constructive-alternativism',
    title: '建构替代论：我们永远有另一种选择',
    summary: '建构替代论是凯利理论中最具解放性的思想——我们看待世界的方式永远不是唯一的。',
    content: '# 建构替代论\n\n"没有任何事物是无可救药的。"这是凯利建构替代论的核心精神…',
    tags: ['理论', '核心概念'],
    source: 'Kelly, G. (1955). The Psychology of Personal Constructs.',
    publishedAt: '2026-02-28',
    createdAt: '2026-02-25',
  },
  {
    id: 'art-4',
    slug: 'kelly-vs-freud',
    title: '凯利与弗洛伊德：两种人性观的对话',
    summary: '如果凯利和弗洛伊德坐在同一间屋子里对话，他们会争论什么？又会同意什么？',
    content: '# 凯利与弗洛伊德\n\n作为一位在精神分析盛行的时代提出全新理论的心理学家…',
    tags: ['理论', '对比'],
    publishedAt: '2026-02-20',
    createdAt: '2026-02-18',
  },
  {
    id: 'art-5',
    slug: 'anxiety-as-opportunity',
    title: '焦虑是成长的信号：凯利视角下的情绪',
    summary: '在凯利看来，焦虑不是需要消除的症状，而是构念系统遇到挑战的信号。',
    content: '# 焦虑是成长的信号\n\n人们常常问我："凯利博士，如何克服焦虑？"我的回答可能出乎意料…',
    tags: ['应用', '情绪'],
    publishedAt: '2026-02-15',
    createdAt: '2026-02-12',
  },
  {
    id: 'art-6',
    slug: 'reading-notes-kelly-bio',
    title: '读书笔记：乔治·凯利的生平与学术之路',
    summary: '凯利如何从一名物理学学生转变为临床心理学家，最终创立个人建构心理学。',
    content: '# 乔治·凯利的生平\n\n乔治·亚历山大·凯利于1905年出生在美国堪萨斯州的一个农场…',
    tags: ['读书笔记', '人物'],
    publishedAt: '2026-02-10',
    createdAt: '2026-02-08',
  },
  {
    id: 'art-7',
    slug: 'constructs-in-daily-life',
    title: '日常生活中的构念：如何觉察你的思维模式',
    summary: '我们每天都在使用构念——但大多数时候我们意识不到。本文教你如何觉察和反思。',
    content: '# 日常生活中的构念\n\n你早上起床，看到窗外阴天，心里想："今天不适合出门。"——这背后就是一个构念…',
    tags: ['应用', '自我成长'],
    publishedAt: '2026-02-05',
    createdAt: '2026-02-03',
  },
  {
    id: 'art-8',
    slug: 'repertory-grid-intro',
    title: '凯利方格技术：一个探索个人构念的实用工具',
    summary: '方格技术是凯利最重要的方法论贡献，至今仍被广泛应用在心理学和管理学中。',
    content: '# 凯利方格技术\n\n角色构念方格测验（Repertory Grid Test）是凯利设计的一个独特的评估工具…',
    tags: ['理论', '方法论'],
    source: 'Kelly, G. (1955). The Psychology of Personal Constructs.',
    publishedAt: '2026-01-28',
    createdAt: '2026-01-25',
  },
  // 边界情况：超长标题
  {
    id: 'art-9',
    slug: 'long-title-example',
    title: '当我们在说"建构"的时候我们到底在说什么——一个关于个人建构心理学基本术语的深度辨析与思考',
    summary: '厘清"建构""构念""建构系统"等核心术语的含义与关系。',
    content: '# 建构术语辨析\n\n在学习和传播个人建构心理学的过程中，术语的准确理解至关重要…',
    tags: ['读书笔记', '术语'],
    publishedAt: '2026-01-20',
    createdAt: '2026-01-18',
  },
]
```

### 7.4 Mock 知识库数据

```typescript
// data/mock/knowledge.ts

export const KNOWLEDGE_CATEGORIES = [
  { id: 'cat-1', name: '核心理论', count: 12, icon: 'Lightbulb' },
  { id: 'cat-2', name: '基本概念', count: 8, icon: 'BookText' },
  { id: 'cat-3', name: '应用方法', count: 6, icon: 'Wrench' },
  { id: 'cat-4', name: '相关理论', count: 5, icon: 'GitBranch' },
  { id: 'cat-5', name: '原著文献', count: 15, icon: 'FileText' },
  { id: 'cat-6', name: '术语表', count: 30, icon: 'Bookmark' },
]

export const MOCK_KNOWLEDGE_ENTRIES: KnowledgeEntry[] = [
  {
    id: 'know-1',
    slug: 'construct',
    title: '构念（Construct）',
    concept: '构念',
    definition: '个人用来解释和预测事件的心理框架，是一对对立属性的维度（如"友善-冷漠"）。',
    content: '## 构念的定义\n\n构念（Construct）是个人建构心理学的核心概念…',
    category: '核心理论',
    tags: ['构念', '核心概念'],
    source: 'Kelly, G. (1955). Vol.1, p.9',
    relatedIds: ['know-2', 'know-3'],
  },
  {
    id: 'know-2',
    slug: 'construct-system',
    title: '构念系统（Construct System）',
    concept: '构念系统',
    definition: '个人拥有的所有构念按照一定层次关系组织而成的整体系统。',
    content: '## 构念系统\n\n构念不是孤立存在的，而是组织成一个系统的…',
    category: '核心理论',
    tags: ['构念系统', '核心概念'],
    source: 'Kelly, G. (1955). Vol.1, p.56',
    relatedIds: ['know-1'],
  },
  {
    id: 'know-3',
    slug: 'cpc-cycle',
    title: 'CPC 循环',
    concept: 'CPC 循环',
    definition: 'Circumspection（审虑）-Preemption（预断）-Control（控制）三阶段决策模型。',
    content: '## CPC 循环\n\nCPC 循环是凯利理论中描述决策过程的核心模型…',
    category: '核心理论',
    tags: ['CPC循环', '决策'],
    source: 'Kelly, G. (1955). Vol.1, p.108',
    relatedIds: ['know-1'],
  },
  {
    id: 'know-4',
    slug: 'constructive-alternativism',
    title: '建构替代论（Constructive Alternativism）',
    concept: '建构替代论',
    definition: '凯利理论的基本哲学立场——我们对于任何事件总是可以有多种不同的建构方式。',
    content: '## 建构替代论\n\n"没有任何事物是无可救药的。"这是建构替代论的核心精神…',
    category: '核心理论',
    tags: ['建构替代论', '哲学'],
    source: 'Kelly, G. (1955). Vol.1, p.15',
    relatedIds: ['know-1', 'know-2'],
  },
  {
    id: 'know-5',
    slug: 'anxiety',
    title: '焦虑（Anxiety）',
    concept: '焦虑',
    definition: '当个人意识到自己面临的事件超出了其构念系统的可预测范围时产生的体验。',
    content: '## 焦虑的定义\n\n在我的理论中，焦虑不是一种病理性症状…',
    category: '基本概念',
    tags: ['焦虑', '情绪'],
    source: 'Kelly, G. (1955). Vol.1, p.109',
    relatedIds: ['know-1'],
  },
  {
    id: 'know-6',
    slug: 'hostility',
    title: '敌意（Hostility）',
    concept: '敌意',
    definition: '持续试图从他人那里获取证据来验证一个已被证明无效的构念。',
    content: '## 敌意的定义\n\n敌意是我理论中一个非常独特的定义…',
    category: '基本概念',
    tags: ['敌意', '情绪', '社会互动'],
    source: 'Kelly, G. (1955). Vol.1, p.112',
    relatedIds: ['know-5'],
  },
  {
    id: 'know-7',
    slug: 'repertory-grid',
    title: '角色构念方格测验（Repertory Grid）',
    concept: '方格技术',
    definition: '用于探索和评估个人构念系统的半结构化访谈和测量工具。',
    content: '## 角色构念方格测验\n\n方格技术是我设计的一个独特的评估工具…',
    category: '应用方法',
    tags: ['方格技术', '评估', '方法论'],
    source: 'Kelly, G. (1955). Vol.1, Chapter 5',
    relatedIds: ['know-1', 'know-2'],
  },
  {
    id: 'know-8',
    slug: 'fixed-role-therapy',
    title: '固定角色疗法（Fixed Role Therapy）',
    concept: '固定角色疗法',
    definition: '让来访者暂时扮演一个与自身构念系统不同的角色，以体验新的建构方式。',
    content: '## 固定角色疗法\n\n固定角色疗法是我设计的一种独特的治疗方法…',
    category: '应用方法',
    tags: ['治疗', '角色'],
    source: 'Kelly, G. (1955). Vol.2, p.371',
    relatedIds: ['know-1'],
  },
]
```

---

## 8. 核心功能实现

### 8.1 P0 功能 — 立即可用

| 优先级 | 功能 | 对应 MS | 实现说明 |
|--------|------|---------|---------|
| P0 | 首页展示 | — | 服务端组件，静态内容 + 导航入口 |
| P0 | 发起对话（免登录） | MS-L-01 | 对话页直接显示输入框，无需登录 |
| P0 | 流式回复显示 | MS-L-02 | SSE 流式渲染，打字机效果 |
| P0 | 对话异常处理 | MS-D-01 | 错误 Toast + 重试按钮 |
| P0 | 文章列表浏览 | MS-L-03 | 卡片网格布局，按日期倒序 |
| P0 | 文章详情阅读 | MS-L-04 | Markdown 渲染 + 来源标注 |

### 8.2 P1 功能 — 渐进增强

| 优先级 | 功能 | 对应 MS | 实现说明 |
|--------|------|---------|---------|
| P1 | 持续对话探索 | MS-G-01 | 对话历史可滚动，自动滚动，上下文保持 |
| P1 | 文章内容异常处理 | MS-D-02 | 加载失败 → 错误页 + 返回列表 |
| P1 | 知识库浏览 | MS-L-06 | 分类卡片 + 搜索 |
| P1 | 发布新文章（Admin） | MS-L-07 | 管理后台 Markdown 发布 |

### 8.3 实现规范

**对话流实现规范：**

```typescript
// 前端 useChat hook 使用模式
'use client'

import { useChat } from '@ai-sdk/react'

function ChatPage() {
  const { messages, input, handleInputChange, handleSubmit, isLoading, error, reload } = useChat({
    api: '/api/chat',
    onError: (err) => {
      // 触发 MS-D-01 错误处理
      toast.error('凯利似乎在思考…请稍后再试')
    },
  })

  if (error) {
    return <ErrorMessage onRetry={reload} />
  }

  return (
    <div>
      {messages.length === 0 ? <WelcomeMessage /> : <ChatList messages={messages} />}
      <ChatInput
        input={input}
        onChange={handleInputChange}
        onSubmit={handleSubmit}
        disabled={isLoading}
      />
    </div>
  )
}
```

**Mock 模式切换：**

```typescript
// 开发工具面板（仅开发环境显示）
function DevTools() {
  const { useMockMode, setMockMode } = useChatStore()

  return (
    <div className="fixed bottom-4 right-4 flex items-center gap-2 rounded-lg border bg-card p-2 shadow-md">
      <Switch checked={useMockMode} onCheckedChange={setMockMode} />
      <span className="text-sm text-muted">Mock 模式</span>
    </div>
  )
}
```

---

## 9. 交互模式

### 9.1 加载状态

| 场景 | 加载态组件 | 说明 |
|------|-----------|------|
| 页面初次加载 | Skeleton（内容骨架屏） | 模仿真实内容布局的灰色占位 |
| 对话历史加载 | Skeleton（3 行消息占位） | 圆角矩形模拟消息气泡 |
| AI 回复等待 | TypingIndicator（跳动圆点） | 3 个圆点依次淡入淡出 |
| 文章内容加载 | Skeleton + Spinner | 标题 + 段落占位 |
| 搜索结果加载 | Spinner + "搜索中…" | 搜索框下方显示 |

### 9.2 错误反馈

| 场景 | 反馈方式 | 用户操作 |
|------|---------|---------|
| API 超时/网络中断 | Sonner Toast + 消息内错误提示 | 点击"重试"重新发送 |
| 文章加载失败 | 内联错误页 + 友好文案 | 返回列表 / 重试 |
| Mock 模式提示 | 页面顶部 Badge | 可关闭 |
| 输入验证（空消息） | Toast 提示 + 输入框抖动 | 输入内容后重试 |
| 对话删除 | Dialog 确认弹窗 | 确认/取消 |

**错误文案规范：**

| 场景 | 技术报错（不展示） | 用户友好文案 |
|------|------------------|-------------|
| API 超时 | `Error: Request timed out after 30000ms` | "凯利似乎在思考…请稍后再试" |
| 文章 404 | `404 Not Found` | "这篇内容好像走丢了…去看看其他文章吧" |
| 网络离线 | `TypeError: Failed to fetch` | "网络似乎断开了，检查一下连接吧" |

### 9.3 空状态

| 场景 | 空状态设计 |
|------|-----------|
| 对话页（首次） | 欢迎卡片 + 建议问题示例（3 个） |
| 对话历史为空 | "还没有对话，开始第一次对话吧" + CTA 按钮 |
| 文章搜索无结果 | "没有找到相关内容" + 搜索建议 |
| 知识库分类为空 | "该分类暂无内容" |

**对话页欢迎卡片内容：**

```
┌──────────────────────────────────────┐
│                                      │
│  🧑‍🏫 你好，我是乔治·凯利              │
│                                      │
│  欢迎来到问凯利。在这里，你可以向我    │
│  提出任何你感兴趣的问题——关于我的      │
│  理论，或者你生活中的困惑。            │
│                                      │
│  试试问：                             │
│  ┌────────────────────────────────┐  │
│  │ "什么是个人建构心理学？"         │  │
│  │ "如何应对焦虑？"                │  │
│  │ "CPC循环如何帮助决策？"         │  │
│  └────────────────────────────────┘  │
│                                      │
└──────────────────────────────────────┘
```

### 9.4 动画与过渡

| 元素 | 动画 | 持续时间 | 触发条件 |
|------|------|---------|---------|
| 消息出现 | fade-in + slide-up | 300ms | 新消息添加到列表 |
| AI 打字效果 | 逐字 / 逐句显示 | 可变 | 收到流式响应 |
| 页面切换 | 淡入 | 200ms | 路由变化 |
| 导航高亮 | 颜色过渡 | 150ms | 导航 hover/active |
| Toast 出现 | slide-up + fade-in | 300ms | 触发通知 |

---

## 10. 无障碍性

### 10.1 WCAG AA 检查清单

| 准则 | 要求 | 实现方式 |
|------|------|---------|
| 1.1.1 非文本内容 | 所有图标有 `aria-label` 或 `alt` 文本 | Lucide icons + sr-only 标签 |
| 1.4.3 对比度 | 文本/背景对比度 ≥ 4.5:1 | OKLCH 色彩设计已确保 |
| 1.4.12 文本间距 | 行高至少 1.5，段落间距至少 2 倍字号 | Tailwind prose 配置 |
| 2.1.1 键盘 | 所有操作可通过键盘完成 | shadcn/ui 原生支持 |
| 2.4.3 焦点顺序 | 焦点按逻辑顺序移动 | 语义化 HTML 结构 |
| 2.4.7 焦点可见 | 焦点元素有可见的 focus ring | `focus-visible:ring-2` |
| 3.3.2 标签 | 所有表单控件有 `<label>` | React Hook Form + Label 组件 |
| 4.1.2 名称/角色 | 自定义组件有正确的 ARIA 角色 | shadcn/ui Radix 原生支持 |

### 10.2 具体实现

| 组件 | ARIA 属性 |
|------|-----------|
| 对话输入框 | `aria-label="输入消息"` |
| 发送按钮 | `aria-label="发送消息"` |
| 导航菜单 | `<nav aria-label="主导航">` |
| 消息列表 | `role="log" aria-live="polite"` |
| 错误提示 | `role="alert"` |
| 加载状态 | `aria-busy="true"` |
| 搜索框 | `aria-label="搜索知识库"` |

---

## 11. 扩展点

### 11.1 数据库迁移路径

当前状态（Zustand + localStorage）→ 目标状态（PostgreSQL + Drizzle ORM）：

| 当前（本地） | 目标（数据库） | 迁移策略 |
|-------------|--------------|---------|
| `chat-store` → localStorage | `messages` 表 + `conversations` 表 | 添加 Drizzle schema 后，Store action 内同时写入 localStorage + API |
| `article-store` → localStorage | `articles` 表 | 文章数据改为从 API 读取，本地缓存作为回退 |
| `knowledge-store` → localStorage | `knowledge_entries` 表 | 知识库改为 API 读取，本地索引作为搜索缓存 |

```typescript
// 迁移路径示例：chat-store 从本地 → API
interface ChatState {
  // 过渡期：同时支持本地和远程
  persistence: 'local' | 'remote'

  sendMessage: async (content: string) => {
    if (persistence === 'remote' && !useMockMode) {
      // 真实 API 调用 + 数据库存储
      const response = await fetch('/api/chat', { method: 'POST', body: JSON.stringify({ content }) })
      // ...
    } else {
      // 本地 Mock
      await generateMockResponse(content)
    }
  }
}
```

### 11.2 API 实现路径

| Store Action | Mock 实现 | API 实现 |
|-------------|-----------|---------|
| `chat.createConversation` | 本地生成 UUID + 空对话 | `POST /api/chat/conversations` |
| `chat.sendMessage` | `generateMockResponse()` | `POST /api/chat`（SSE 流式） |
| `article.getArticles` | 返回 `MOCK_ARTICLES` | `GET /api/articles` |
| `article.getArticle` | 从 `MOCK_ARTICLES` 查找 | `GET /api/articles/[slug]` |
| `knowledge.search` | 本地 `filter()` + `includes()` | `GET /api/knowledge/search?q=keyword` |

### 11.3 认证集成路径

| 当前 | 目标 | 实现 |
|------|------|------|
| 无需登录，所有用户匿名 | Better Auth 可选登录 | 添加 `auth-store`，与 Better Auth 集成 |
| 对话在 localStorage | 对话关联用户账户 | 登录后自动同步本地对话到服务端 |
| 管理后台无权限控制 | 管理员角色授权 | Auth Middleware 保护 `/admin/*` 路由 |

### 11.4 Mock → 真实 API 切换模式

```typescript
// 每个 Store 支持渐进式切换
interface PersistenceStrategy {
  chat: 'mock' | 'local' | 'remote'
  articles: 'mock' | 'local' | 'remote'
  knowledge: 'mock' | 'local' | 'remote'
}

// 开发环境：mock → local → remote
// 生产环境：remote（回退 local → mock）
```

---

## 12. 验收检查清单

### 前置条件

- [ ] 三个必需文档已加载（meta.md, real.md, cog.md）
- [ ] 应用类型已判断为混合型（SPA + MPA），理由记录在 §1.1
- [ ] 导航结构确定为混合导航（顶部 + 底部 Tab），记录在 §1.2
- [ ] OKLCH 配色方案已定义（主色 250° 紫蓝 + 强调色 30° 暖橙），记录在 §1.3

### 功能独立（关键）

- [ ] 每个功能无需配置即可使用（Mock 数据 + Mock AI）
- [ ] 未配置智谱 API 密钥时，对话使用 Mock 模式运行
- [ ] Mock 模式指示器可见（`🎭 演示模式` Badge）

### 丰富 Mock 数据（关键）

- [ ] 对话 Store 用 10 条 Mock 对话初始化（含边界情况）
- [ ] 文章 Store 用 9 篇 Mock 文章初始化（含超长标题边界）
- [ ] 知识库 Store 用 8 条 Mock 条目 + 6 个分类初始化
- [ ] Mock AI 响应生成器覆盖 5+ 种回复模式（含关键词匹配）
- [ ] 流式 Mock 响应生成器支持打字机效果

### 实现

- [ ] Zustand Store 使用 `persist` 中间件，自动同步 localStorage
- [ ] P0 功能（对话、文章列表/详情）配合本地存储完全可用
- [ ] 错误处理已定义（API 超时、文章加载失败、网络离线）
- [ ] 空状态已覆盖（首次对话、无搜索结果、无对话历史）
- [ ] 符合 WCAG AA（见 §10 检查清单）

### 组件

- [ ] 19 个 shadcn/ui 组件已规划
- [ ] 19 个自定义组件已定义，每个组件有状态覆盖
- [ ] 组件状态覆盖矩阵完整（加载/空/正常/错误/边界）

### 交互

- [ ] 加载状态使用 Skeleton + TypingIndicator
- [ ] 错误使用友好文案（非技术报错）
- [ ] 空状态有引导提示和 CTA 按钮
- [ ] 动画定义（消息出现、打字机效果、页面过渡）

### 扩展点

- [ ] 数据库迁移路径已记录（Zustand → Drizzle ORM + PostgreSQL）
- [ ] API 实现路径已记录（Mock → 真实 API 端点）
- [ ] 认证集成路径已记录（匿名 → Better Auth）
- [ ] Mock → 真实 API 切换策略已定义

---

<document-footer>
  <generated-by>design-ui-design-v2</generated-by>
  <based-on>
    <source>.42cog/meta/meta.md</source>
    <source>.42cog/real/real.md</source>
    <source>.42cog/cog/cog.md</source>
    <source>spec/pm/pr.spec.md</source>
    <source>spec/pm/userstory.spec.md</source>
    <source>spec/dev/sys.spec.md</source>
  </based-on>
  <version>1.0.0</version>
  <date>2026-04-27</date>
</document-footer>
