# Ruth 路思

让智慧不再遥远，持续滋养你。

## 简介

Ruth 是一个让智者触手可及的对话应用。第一位深度建设的智者是乔治·凯利（George Kelly）——一位被严重低估的心理学家，个人建构心理学的创始人。

## 功能

- ✅ 与乔治·凯利真实对话
- ✅ 基于个人建构心理学的智能回应
- ✅ 对话历史记录
- ✅ 响应式设计，适配移动端

## 技术栈

- **前端**: 纯 HTML + CSS + JavaScript
- **后端**: Vercel Edge Functions (TypeScript)
- **AI**: 智谱 AI BigModel (GLM-5.1)
- **部署**: Vercel

## 项目结构

```
Ruth 路思/
├── api/              # API 接口
│   └── chat.ts       # 对话接口（智谱 AI）
├── ruth_v1.html      # 原型版本
├── ruth_v2.html      # 对话版本（当前生产）
├── docs/             # 项目文档
├── archive/          # 历史资料和参考文档
├── package.json      # 项目配置
├── vercel.json       # Vercel 部署配置
└── README.md         # 本文件
```

## 本地开发

```bash
# 安装依赖
bun install

# 启动开发服务器
bun run dev

# 访问 http://localhost:3000
```

## 环境变量

智谱 API Key 已配置在 `api/chat.ts` 中（生产环境）。

如需更换，编辑 `api/chat.ts` 中的 `ZHIPU_API_KEY`。

## 部署

```bash
# 部署到 Vercel
bun run deploy
```

## 在线访问

**生产环境**: https://ruth-delta.vercel.app

## 版本

- **v 2.0** - 实现真实对话功能（智谱 AI）
- **v 1.01** - 凯利原型上线

## 开发说明

### 核心 AI 配置

- **模型**: GLM-5.1（更强的推理能力和思考模式）
- **API**: 智谱 AI BigModel
- **System Prompt**: 完整的凯利人格和理论框架

### 更新对话人格

编辑 `api/chat.ts` 中的 `KELLY_SYSTEM_PROMPT` 常量。

## 反馈与建议

欢迎通过 GitHub Issues 提供建议。
