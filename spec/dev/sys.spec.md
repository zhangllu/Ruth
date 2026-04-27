---
name: ask-kelly-sys-arch
description: 问凯利系统架构设计文档
depends:
  - real.md
  - cog.md
  - pr.spec.md
  - userstory.spec.md
---

# 问凯利（Ask Kelly）— 系统架构设计

<arch-meta>
  <document-id>ask-kelly-sys-arch</document-id>
  <version>1.0.0</version>
  <product>问凯利 (Ask Kelly)</product>
  <type>系统架构设计</type>
  <created>2026-04-27</created>
  <depends>
    <dependency id="real.md">现实约束文档</dependency>
    <dependency id="cog.md">认知模型文档</dependency>
    <dependency id="pr.spec.md">产品需求规格书</dependency>
    <dependency id="userstory.spec.md">用户故事文档</dependency>
  </depends>
</arch-meta>

---

## 1. 架构概览

### 1.1 架构模式

```
分层架构 + 模块化设计 (Layered Architecture + Modular Design)
┌─────────────────────────────────────────────────────────┐
│                   Presentation Layer                     │
│         (Next.js App Router + React Components)          │
├─────────────────────────────────────────────────────────┤
│                 Application Layer                        │
│     (API Routes, Server Actions, Route Handlers)         │
├─────────────────────────────────────────────────────────┤
│                    Domain Layer                          │
│          (Business Logic, Domain Services)               │
├─────────────────────────────────────────────────────────┤
│                Infrastructure Layer                      │
│        (Drizzle ORM, PostgreSQL/Neon, Vercel AI SDK)     │
└─────────────────────────────────────────────────────────┘
```

### 1.2 技术栈

| 层次 | 技术选型 | 版本 | 说明 |
|------|---------|------|------|
| 全站框架 | Next.js | 15+ | App Router，支持 React Server Components |
| CSS 框架 | Tailwind CSS | 4+ | Utility-first CSS |
| UI 组件 | shadcn/ui | latest | 基于 Radix UI 的可定制组件 |
| 包管理 | bun | latest | 快速包安装和脚本运行 |
| 数据库 | PostgreSQL（本地）+ Neon（云端） | latest | 本地开发 + 云端生产 |
| ORM | Drizzle ORM | latest | 类型安全，轻量级 |
| 认证 | Better Auth | latest | 全栈认证框架 |
| AI 框架 | Vercel AI SDK | latest | 流式对话，模型路由 |
| 部署 | Vercel | — | 边缘函数 + 静态托管 |

### 1.3 部署架构

```
用户浏览器
    │
    ▼
Vercel Edge Network (CDN)
    │
    ├── 静态资源 (Next.js 静态生成)
    │   ├── 首页、文章页、知识库页
    │   └── 公共资源（图片、CSS、JS）
    │
    ├── Server-Side Rendering (SSR)
    │   ├── 对话页面（需要动态内容）
    │   └── 管理页面（需要认证）
    │
    ├── API Routes (Edge Functions / Serverless)
    │   ├── /api/auth/* → Better Auth
    │   ├── /api/chat/* → Vercel AI SDK → 智谱 AI
    │   ├── /api/articles/* → Drizzle → Neon (PostgreSQL)
    │   └── /api/knowledge/* → Drizzle → Neon (PostgreSQL)
    │
    └── Server Actions
        └── 表单处理、轻量数据变更
```

---

## 2. 子系统分解

### 2.1 子系统概览

| 子系统 | 职责 | 对应可供性 | 对应 CS |
|--------|------|-----------|---------|
| Auth | 用户认证与会话管理 | AFF-01（底层） | — |
| Chat | 对话管理、消息收发 | AFF-01, AFF-03, AFF-05 | CS-01, CS-03 |
| Content | 文章与知识库管理 | AFF-02, AFF-06 | CS-02, CS-04 |
| AI Gateway | LLM 调用、System Prompt 管理、流式响应 | AFF-01, AFF-03 | CS-01, CS-03 |
| Admin | 内容管理、系统配置 | — | CS-04 |

### 2.2 Auth 子系统

**职责：** 用户认证、会话管理、授权控制

**组件：**

| 组件 | 职责 |
|------|------|
| Better Auth Provider | Better Auth 认证提供者配置 |
| Auth Middleware | Next.js 中间件，保护需要登录的路由 |
| Session Manager | 会话创建、验证、刷新 |

**接口：**

| 接口 | 输入 | 输出 |
|------|------|------|
| 登录 | 邮箱 + 密码 / OAuth Provider | JWT Token + Session |
| 登出 | Session ID | 清除会话 |
| 获取当前用户 | Cookie / Token | User 对象或 null |
| 注册 | 邮箱 + 密码 + 名称 | User 对象 |

**依赖：**
- Depends on: 无（独立子系统）
- Used by: Chat, Admin

**约束：**
- C2：密码哈希存储，不使用明文

### 2.3 Chat 子系统

**职责：** 管理对话会话、消息收发、上下文维护

**组件：**

| 组件 | 职责 |
|------|------|
| Conversation Manager | 对话会话的创建、列表、删除 |
| Message Store | 消息的持久化存储与检索 |
| Context Manager | 对话上下文管理（窗口大小、摘要） |

**接口：**

| 接口 | 输入 | 输出 |
|------|------|------|
| 创建对话 | — | Conversation ID |
| 发送消息 | 消息内容 + Conversation ID | 流式消息回复 |
| 获取对话历史 | Conversation ID | 消息列表 |
| 删除对话 | Conversation ID | 成功/失败 |
| 获取对话列表 | 用户 ID | 对话列表 |

**依赖：**
- Depends on: Auth（需要用户身份）, AI Gateway（需要 LLM 调用）
- Used by: Presentation Layer

**约束：**
- C1：AI 回复基于凯利人格
- C4：对话数据隐私保护
- C6：上下文长度管理

### 2.4 Content 子系统

**职责：** 文章和知识库的 CRUD、分类、搜索

**组件：**

| 组件 | 职责 |
|------|------|
| Article Manager | 文章的创建、编辑、发布、列表 |
| Knowledge Base | 知识条目管理、分类、标签 |
| Search Engine | 全文搜索（pgvector 或 PostgreSQL FTS） |

**接口：**

| 接口 | 输入 | 输出 |
|------|------|------|
| 获取文章列表 | 分页/分类参数 | 文章列表（标题+摘要+日期） |
| 获取文章详情 | Article ID | 文章完整内容 |
| 创建/编辑文章 | 文章数据 | 文章对象 |
| 搜索知识库 | 关键词 | 知识条目列表 |
| 获取知识条目 | 条目 ID | 条目完整内容 |

**依赖：**
- Depends on: Auth（管理后台需要认证）
- Used by: Presentation Layer

**约束：**
- C3：内容基于真实文献，标注来源
- C5：品质把控

### 2.5 AI Gateway 子系统

**职责：** LLM 模型路由、System Prompt 管理、流式响应转发

**组件：**

| 组件 | 职责 |
|------|------|
| LLM Router | 模型调用路由（当前：智谱 AI，未来可扩展） |
| Prompt Manager | System Prompt 模板管理、知识库注入 |
| Stream Handler | 流式响应处理与 SSE 转发 |
| Context Window | 上下文窗口管理、摘要生成 |

**接口：**

| 接口 | 输入 | 输出 |
|------|------|------|
| 发送对话 | 消息历史 + 用户输入 | 流式 LLM 回复 |
| 获取 System Prompt | — | 当前 System Prompt 内容 |
| 健康检查 | — | LLM 服务状态 |

**依赖：**
- Depends on: Content（知识库内容注入 Prompt）
- Used by: Chat

**约束：**
- C1：System Prompt 确保凯利人格一致性
- C2：API 密钥仅存在服务端环境变量

### 2.6 Admin 子系统

**职责：** 内容管理后台、系统配置

**组件：**

| 组件 | 职责 |
|------|------|
| Article Editor | 文章编辑界面 |
| Knowledge Manager | 知识库条目管理 |
| Prompt Tester | System Prompt 测试工具 |

**依赖：**
- Depends on: Auth（仅作者可访问）, Content

---

## 3. API 设计

### 3.1 认证 API

| 方法 | 路径 | 说明 | 认证 | 对应 MS |
|------|------|------|------|---------|
| POST | /api/auth/register | 用户注册 | 否 | — |
| POST | /api/auth/login | 用户登录 | 否 | — |
| POST | /api/auth/logout | 登出 | 是 | — |
| GET | /api/auth/session | 获取当前会话 | 是 | — |

### 3.2 对话 API

| 方法 | 路径 | 说明 | 认证 | 对应 MS |
|------|------|------|------|---------|
| POST | /api/chat | 发送消息并获取流式回复 | 否 | MS-L-01, MS-L-02 |
| GET | /api/chat/conversations | 获取对话列表 | 可选 | MS-G-01 |
| GET | /api/chat/conversations/[id] | 获取对话历史 | 可选 | MS-G-01, MS-G-03 |
| DELETE | /api/chat/conversations/[id] | 删除对话 | 可选 | MS-G-03 |

**对话 API 详细设计：**

```typescript
// POST /api/chat
// 发送消息并获取流式回复

Request:
{
  message: string;           // 用户消息
  conversationId?: string;   // 对话 ID（新对话不传）
  context?: Message[];       // 之前的对话历史（可选）
}

Response: SSE (text/event-stream)
event: message
data: {
  id: string;
  role: "assistant";
  content: string;  // 增量内容
}

event: done
data: {
  id: string;
  conversationId: string;
}

event: error
data: {
  code: string;
  message: string;
}
```

### 3.3 内容 API

| 方法 | 路径 | 说明 | 认证 | 对应 MS |
|------|------|------|------|---------|
| GET | /api/articles | 获取文章列表 | 否 | MS-L-03 |
| GET | /api/articles/[slug] | 获取文章详情 | 否 | MS-L-04 |
| GET | /api/articles/[slug]/related | 获取相关文章 | 否 | MS-G-02 |
| POST | /api/admin/articles | 创建文章 | 是（Admin） | MS-L-07 |
| PUT | /api/admin/articles/[slug] | 编辑文章 | 是（Admin） | MS-L-07 |
| DELETE | /api/admin/articles/[slug] | 删除文章 | 是（Admin） | MS-L-07 |
| GET | /api/knowledge | 获取知识库列表 | 否 | MS-L-06 |
| GET | /api/knowledge/[id] | 获取知识条目 | 否 | MS-L-06 |
| GET | /api/knowledge/search | 搜索知识库 | 否 | MS-L-06 |

---

## 4. 目录结构

```
ask-kelly/
├── .claude/                        # Claude Code 项目配置
├── .42cog/                         # 认知敏捷法文档
├── spec/                           # 规格文档
│   ├── pm/                         # 产品管理
│   │   ├── pr.spec.md
│   │   └── userstory.spec.md
│   └── dev/                        # 开发
│       └── sys.spec.md
├── src/
│   ├── app/                        # Next.js App Router
│   │   ├── (public)/               # 公开路由组
│   │   │   ├── page.tsx            # 首页
│   │   │   ├── chat/
│   │   │   │   ├── page.tsx        # 对话页
│   │   │   │   └── [id]/page.tsx   # 特定对话
│   │   │   ├── articles/
│   │   │   │   ├── page.tsx        # 文章列表
│   │   │   │   └── [slug]/page.tsx # 文章详情
│   │   │   └── knowledge/
│   │   │       ├── page.tsx        # 知识库首页
│   │   │       └── [id]/page.tsx   # 知识条目详情
│   │   ├── (auth)/                 # 认证路由组
│   │   │   ├── login/page.tsx
│   │   │   └── register/page.tsx
│   │   ├── admin/                  # 管理后台
│   │   │   ├── page.tsx            # 管理首页
│   │   │   ├── articles/
│   │   │   │   ├── page.tsx        # 文章管理
│   │   │   │   └── [slug]/edit/page.tsx
│   │   │   └── knowledge/
│   │   │       └── page.tsx        # 知识库管理
│   │   ├── api/                    # API Routes
│   │   │   ├── auth/
│   │   │   │   ├── [...all]/route.ts  # Better Auth catch-all
│   │   │   ├── chat/
│   │   │   │   ├── route.ts           # POST: 发送消息
│   │   │   │   └── conversations/
│   │   │   │       ├── route.ts       # GET: 列表
│   │   │   │       └── [id]/
│   │   │   │           ├── route.ts   # GET/DELETE
│   │   │   ├── articles/
│   │   │   │   ├── route.ts           # GET: 列表
│   │   │   │   └── [slug]/
│   │   │   │       └── route.ts       # GET: 详情
│   │   │   └── knowledge/
│   │   │       ├── route.ts           # GET: 列表
│   │   │       ├── search/route.ts    # GET: 搜索
│   │   │       └── [id]/route.ts      # GET: 详情
│   │   ├── layout.tsx             # 根布局
│   │   └── globals.css            # 全局样式（Tailwind）
│   ├── components/                # React 组件
│   │   ├── ui/                    # shadcn/ui 组件
│   │   │   ├── button.tsx
│   │   │   ├── card.tsx
│   │   │   ├── input.tsx
│   │   │   └── ...
│   │   ├── chat/                  # 对话组件
│   │   │   ├── chat-input.tsx
│   │   │   ├── chat-message.tsx
│   │   │   ├── chat-list.tsx
│   │   │   └── typing-indicator.tsx
│   │   ├── articles/              # 文章组件
│   │   │   ├── article-card.tsx
│   │   │   ├── article-content.tsx
│   │   │   └── related-articles.tsx
│   │   ├── knowledge/             # 知识库组件
│   │   │   ├── knowledge-card.tsx
│   │   │   └── knowledge-tree.tsx
│   │   ├── layout/                # 布局组件
│   │   │   ├── header.tsx
│   │   │   ├── footer.tsx
│   │   │   ├── nav.tsx
│   │   │   └── sidebar.tsx
│   │   └── auth/                  # 认证组件
│   │       ├── login-form.tsx
│   │       └── register-form.tsx
│   ├── lib/                       # 工具函数与配置
│   │   ├── db/
│   │   │   ├── index.ts           # 数据库连接
│   │   │   └── schema.ts          # Drizzle Schema
│   │   ├── auth/
│   │   │   └── index.ts           # Better Auth 配置
│   │   ├── ai/
│   │   │   ├── client.ts          # Vercel AI SDK 配置
│   │   │   ├── prompts.ts         # System Prompt 模板
│   │   │   └── context.ts         # 上下文管理
│   │   ├── utils.ts               # 通用工具函数
│   │   └── constants.ts           # 常量
│   ├── services/                  # 业务逻辑层
│   │   ├── chat.service.ts        # 对话业务逻辑
│   │   ├── article.service.ts     # 文章业务逻辑
│   │   ├── knowledge.service.ts   # 知识库业务逻辑
│   │   └── ai-gateway.service.ts  # AI 网关业务逻辑
│   ├── hooks/                     # React Hooks
│   │   ├── use-chat.ts
│   │   ├── use-articles.ts
│   │   └── use-knowledge.ts
│   └── types/                     # TypeScript 类型定义
│       ├── chat.ts
│       ├── article.ts
│       ├── knowledge.ts
│       └── user.ts
├── drizzle/                       # Drizzle Kit 配置
│   ├── config.ts
│   └── migrations/
├── .env.local                     # 本地环境变量（不提交）
├── .env.example                   # 环境变量模板
├── next.config.ts                 # Next.js 配置
├── tailwind.config.ts             # Tailwind CSS 配置
├── components.json                # shadcn/ui 配置
├── bun.lockb                      # bun 锁定文件
├── package.json
├── tsconfig.json
├── CLAUDE.md                      # Claude Code 配置
├── metadata.json                  # 项目元数据
└── .gitignore
```

---

## 5. 安全架构

### 5.1 安全层级

```
┌──────────────────────────────────────────────────┐
│               传输层安全                          │
│        HTTPS (TLS 1.3) + HSTS                     │
│    Vercel Edge Network 自动处理                   │
├──────────────────────────────────────────────────┤
│               认证层                              │
│        Better Auth (Session/JWT)                  │
│        密码：bcrypt 哈希                           │
│        OAuth 可选扩展                              │
├──────────────────────────────────────────────────┤
│               授权层                              │
│       角色：用户 / 管理员（作者）                   │
│       资源所有权验证                               │
├──────────────────────────────────────────────────┤
│               数据保护层                          │
│       API 密钥：Vercel 环境变量（加密存储）          │
│       对话数据：可选加密持久化                      │
│       输入验证：Zod Schema                         │
│       SQL 注入防护：Drizzle ORM 参数化查询          │
│       XSS 防护：React 自动转义                     │
└──────────────────────────────────────────────────┘
```

### 5.2 安全需求矩阵

| 层级 | 需求 | 实现方式 | 对应约束 |
|------|------|---------|---------|
| 传输 | 加密通信 | Vercel 自动 HTTPS | — |
| 认证 | 密码保护 | Better Auth + bcrypt | — |
| 认证 | 会话管理 | Better Auth Session | — |
| 授权 | 管理权限 | 管理员角色 + 中间件 | — |
| 数据 | API 密钥保护 | Vercel Environment Variables | C2 |
| 数据 | 对话隐私 | 加密存储（如需） | C4 |
| 数据 | 输入验证 | Zod Schema 服务端验证 | — |
| 数据 | SQL 注入防护 | Drizzle ORM | — |
| 数据 | XSS 防护 | React Server Components | — |
| 代码 | 环境变量安全 | .gitignore 排除 .env.local | C7 |

---

## 6. 数据模型

### 6.1 核心实体（来自 cog.md）

```
User (Better Auth)
  ├── id: UUID (PK)
  ├── email: string (unique)
  ├── name: string
  ├── role: "user" | "admin"
  └── 由 Better Auth 管理更多字段

Conversation
  ├── id: UUID (PK)
  ├── userId: UUID (FK → User, nullable)
  ├── title: string
  ├── createdAt: timestamp
  └── updatedAt: timestamp

Message
  ├── id: UUID (PK)
  ├── conversationId: UUID (FK → Conversation)
  ├── role: "user" | "assistant" | "system"
  ├── content: string
  ├── metadata: JSON (nullable)
  └── createdAt: timestamp

Article
  ├── id: UUID (PK)
  ├── slug: string (unique)
  ├── title: string
  ├── summary: string
  ├── content: string (Markdown)
  ├── tags: string[]
  ├── source: string (nullable，文献来源)
  ├── publishedAt: timestamp (nullable)
  ├── createdAt: timestamp
  └── updatedAt: timestamp

KnowledgeEntry
  ├── id: UUID (PK)
  ├── slug: string (unique)
  ├── title: string
  ├── concept: string (核心概念名称)
  ├── definition: string (核心定义)
  ├── content: string (详细内容)
  ├── category: string (分类)
  ├── tags: string[]
  ├── source: string (文献来源)
  ├── relatedIds: UUID[] (关联条目)
  └── createdAt: timestamp
```

### 6.2 实体关系

```
User ──1:N── Conversation ──1:N── Message

User ──1:N── Article (通过 Admin)

KnowledgeEntry ──N:M── KnowledgeEntry (通过 relatedIds)
```

---

## 7. 技术决策记录（ADR）

### ADR-001：全站框架选型

| 属性 | 值 |
|------|-----|
| **状态** | Accepted |
| **决策** | 采用 Next.js 15+ App Router |
| **理由** | 支持 SSR、SSG、API Routes、Server Actions 一体化，与 Vercel 深度集成，生态成熟 |
| **后果** | 简化部署，但需要适应 React Server Components 范式 |

### ADR-002：UI 样式方案

| 属性 | 值 |
|------|-----|
| **状态** | Accepted |
| **决策** | Tailwind CSS 4+ + shadcn/ui |
| **理由** | 原子化 CSS 开发效率高，shadcn/ui 提供可定制的无障碍组件，无需额外依赖 |
| **后果** | 样式与组件紧密耦合，适合小团队快速迭代 |

### ADR-003：包管理器

| 属性 | 值 |
|------|-----|
| **状态** | Accepted |
| **决策** | 采用 bun 作为包管理器和运行时 |
| **理由** | 安装速度远超 npm/yarn，兼容 Node.js API，内置 TypeScript 支持 |
| **后果** | 部分早期 Node.js 包可能不兼容，但生态日趋成熟 |

### ADR-004：数据库选型

| 属性 | 值 |
|------|-----|
| **状态** | Accepted |
| **决策** | PostgreSQL（本地开发）+ Neon Serverless（生产环境） |
| **理由** | PostgreSQL 功能完善、生态成熟；Neon 提供 Serverless PostgreSQL，按需付费，与 Vercel 搭配良好 |
| **后果** | 本地与生产数据库一致，无需适配不同的 SQL 方言 |

### ADR-005：ORM 选型

| 属性 | 值 |
|------|-----|
| **状态** | Accepted |
| **决策** | Drizzle ORM |
| **理由** | 类型安全、轻量级、零运行时依赖、SQL-like 查询语法，与 TypeScript 项目天然契合 |
| **后果** | 相比 Prisma 缺少一些高级特性（如关系查询），但性能和 Bundle Size 更优 |

### ADR-006：认证方案

| 属性 | 值 |
|------|-----|
| **状态** | Accepted |
| **决策** | Better Auth |
| **理由** | 专为 Next.js 设计，支持 Session/JWT，内置 bcrypt 密码哈希，支持 OAuth 扩展 |
| **后果** | 与 Next.js 深度集成，减少认证相关样板代码 |

### ADR-007：AI 对话框架

| 属性 | 值 |
|------|-----|
| **状态** | Accepted |
| **决策** | Vercel AI SDK |
| **理由** | 原生支持流式响应（SSE）、模型路由、React Hooks（useChat），与 Next.js/Vercel 无缝集成 |
| **后果** | 当前仅使用智谱 AI，但 AI SDK 抽象了模型层，未来切换或增加模型成本较低 |

### ADR-008：AI 人格管理

| 属性 | 值 |
|------|-----|
| **状态** | Accepted |
| **决策** | System Prompt 作为凯利人格载体，知识库作为上下文注入 |
| **理由** | 无需微调模型，通过精心设计的 System Prompt + 知识库内容注入即可实现凯利人格一致性（约束 C1） |
| **后果** | 依赖 Prompt Engineering 质量，需持续优化 System Prompt |

### ADR-009：对话流式输出

| 属性 | 值 |
|------|-----|
| **状态** | Accepted |
| **决策** | 基于 Server-Sent Events (SSE) 的流式响应 |
| **理由** | 用户体验好（打字机效果），Vercel AI SDK 原生支持，实现成本低 |
| **后果** | 需要前端处理流式数据，但 Vercel AI SDK 的 useChat hook 已封装 |

### ADR-010：内容管理策略

| 属性 | 值 |
|------|-----|
| **状态** | Proposed |
| **决策** | Markdown 文件管理 + 数据库索引。文章以 Markdown 存储在数据库中，知识库条目结构化存储 |
| **理由** | 作者习惯 Markdown 写作，内容更新频率低，无需复杂 CMS |
| **后果** | 管理后台需要提供 Markdown 编辑器或支持导入 |

---

## 8. 关键数据流

### 8.1 对话流程

```
用户浏览器                    Next.js (Server)              Vercel AI SDK + 智谱 AI
    │                              │                              │
    │  1. POST /api/chat           │                              │
    │  { message, context }        │                              │
    │ ─────────────────────────→   │                              │
    │                              │  2. 加载 System Prompt       │
    │                              │  3. 加载知识库上下文          │
    │                              │  4. 构建消息历史              │
    │                              │                              │
    │                              │  5. POST /v1/chat/completions │
    │                              │ ──────────────────────────→  │
    │                              │                              │
    │                              │  6. SSE 流式响应             │
    │  7. SSE 逐字转发             │ ←────────────────────────── │
    │  ←─────────────────────────  │                              │
    │                              │                              │
    │  8. 渲染打字机效果           │                              │
    │                              │                              │
    │  9. 保存消息到               │                              │
    │     PostgreSQL（可选）       │                              │
```

### 8.2 内容发布流程

```
作者                    Admin 后台              PostgreSQL          Vercel
  │                        │                       │                 │
  │  1. 登录               │                       │                 │
  │ ─────────────────→    │                       │                 │
  │                        │                       │                 │
  │  2. 撰写/编辑文章      │                       │                 │
  │ ─────────────────→    │                       │                 │
  │                        │  3. 保存文章          │                 │
  │                        │ ─────────────────→   │                 │
  │                        │                       │                 │
  │  4. 点击发布           │                       │                 │
  │ ─────────────────→    │                       │                 │
  │                        │  5. 更新 publishedAt │                 │
  │                        │ ─────────────────→   │                 │
  │                        │                       │                 │
  │                        │                       │  6. ISR 重新验证  │
  │                        │                       │ ←──────────── │
  │                        │                       │                 │
  │  7. 访问者看到新文章   │                       │                 │
```

---

## 9. 架构质量检查

- [x] **架构模式**：分层架构 + 模块化设计，适合中型 Next.js 应用
- [x] **子系统职责**：6 个子系统职责明确，边界清晰
- [x] **API 设计**：RESTful 规范，资源导向，覆盖所有核心 MS
- [x] **目录结构**：功能分组 + 技术分层，两个维度兼顾
- [x] **安全需求**：认证、授权、数据保护、传输安全均已覆盖
- [x] **技术决策**：10 个 ADR 记录关键选择及理由
- [x] **约束覆盖**：C1-C7 约束均在架构中有所体现（详见安全架构 §5、ADR-008/C1、数据流 §8）

---

<document-footer>
  <generated-by>dev-system-architecture</generated-by>
  <based-on>
    <source>real.md</source>
    <source>cog.md</source>
    <source>pr.spec.md</source>
    <source>userstory.spec.md</source>
  </based-on>
  <version>1.0.0</version>
  <date>2026-04-27</date>
</document-footer>
