---
name: ask-kelly-cog
description: 问凯利项目认知模型文档
---

# 问凯利 - 认知模型文档

> 认知模型基于人心系统模型，核心框架是：**智能体 + 信息 + 上下文**

<meta>
  <document-id>ask-kelly-cog</document-id>
  <version>1.0.0</version>
  <project>问凯利 (Ask Kelly)</project>
  <type>认知模型</type>
  <created>2026-04-27</created>
  <depends>real.md</depends>
</meta>

## 文档说明

本文档描述问凯利项目的认知模型，包括参与协作的智能体、系统核心信息实体及其关系、以及项目所处的上下文环境。

---

## 一、智能体（Agents）

<agents>

### 1.1 人类智能体

<agent type="human" id="A1">
<name>作者 / 内容创作者</name>
<identifier>cnb.cool / GitHub 账号 zhangllu</identifier>
<classification>
  <by-role>内容创作者 | 开发者 | 项目维护者</by-role>
</classification>
<capabilities>撰写凯利相关文章、开发网站功能、维护知识库、配置部署</capabilities>
<goals>让凯利的个人建构心理学被更多人了解和运用</goals>
</agent>

<agent type="human" id="A2">
<name>访问者 / 读者</name>
<identifier>无固定标识（IP 或自愿注册）</identifier>
<classification>
  <by-interest>心理学爱好者 | 教育工作者 | 个人成长实践者 | 学术研究者</by-interest>
</classification>
<capabilities>阅读文章、与凯利 AI 对话、浏览知识库</capabilities>
<goals>了解凯利理论、获取思维框架、解决个人困惑</goals>
</agent>

### 1.2 人工智能体

<agent type="ai" id="A3">
<name>凯利 AI</name>
<identifier>智谱 AI GLM-5.1 + 凯利 System Prompt</identifier>
<classification>
  <by-role>对话者 | 理论阐释者 | 构念启发者</by-role>
</classification>
<interaction-pattern>用户提问 → 凯利以个人建构心理学框架回应 → 引导用户反思自身构念系统</interaction-pattern>
</agent>

</agents>

---

## 二、信息（Information）

<information>

### 2.1 核心实体

<entity id="E1">
<name>凯利知识库</name>
<unique-code>archieve/凯利/ + 文件名（日期或主题命名）</unique-code>
<classification>
  <by-type>理论原著 | 研究文献 | 学习笔记 | 知识卡片</by-type>
</classification>
<attributes>作者、日期、来源、理论关键词、中文/英文</attributes>
<relations>E1 → E2（知识库支撑 AI 对话人格）；E1 → E3（文章引用知识库内容）</relations>
</entity>

<entity id="E2">
<name>AI 对话记录</name>
<unique-code>用户标识 + 时间戳</unique-code>
<classification>
  <by-privacy>公开（示例对话）| 私密（用户个人对话）</by-privacy>
</classification>
<attributes>用户输入、凯利回复、时间、对话轮次、上下文摘要</attributes>
<relations>E2 → E3（对话可转化为文章素材）；E2 → A2（用户的对话历史）</relations>
</entity>

<entity id="E3">
<name>文章作品</name>
<unique-code>archieve/ + 文章标题（如"世界读书日，我献给世界的礼物"）</unique-code>
<classification>
  <by-type>理论解读 | 个人感悟 | 应用实践 | 读书笔记</by-type>
</classification>
<attributes>标题、作者、日期、标签关键词、文中引用</attributes>
<relations>E3 → E1（文章引用知识库）；E3 → A1（由作者创作）</relations>
</entity>

<entity id="E4">
<name>用户画像（轻量）</name>
<unique-code>设备或会话 ID（匿名）</unique-code>
<classification>
  <by-engagement>首次访问 | 偶尔访问 | 频繁使用者</by-engagement>
</classification>
<attributes>访问时间、对话次数、感兴趣话题标签（可选）</attributes>
<relations>E4 → E2（用户画像关联对话记录）</relations>
</entity>

### 2.2 信息流动

<information-flow>
<flow id="F1" name="对话流程">
  访问者 → 发起提问 → 凯利 AI（加载知识库+System Prompt）→ 生成回复 → 访问者
</flow>
<flow id="F2" name="内容创作流程">
  作者 → 研究凯利知识库 → 撰写文章 → 归档到 archieve → 发布到网站
</flow>
<flow id="F3" name="知识库更新流程">
  作者 → 阅读文献 → 整理知识卡片 → 更新凯利知识库 → 提升 AI 回答质量
</flow>
</information-flow>

</information>

---

## 三、上下文（Context）

<context>

### 3.1 应用上下文

Web 应用类项目，以内容展示和 AI 对话为核心交互方式。当前为静态页面 + API 架构，前端部署在 Vercel。

- 首页：项目介绍 + 标语"和凯利对话，看见自己建构的世界"
- 对话页：与凯利 AI 对话的界面
- 文章页：凯利相关文章列表与详情
- 知识库页：个人建构心理学的系统化知识展示

### 3.2 技术上下文

- **架构**：纯静态前端 + Vercel Edge Functions API
- **AI 接口**：智谱 AI BigModel GLM-5.1，通过 Vercel 环境变量保护 API 密钥
- **部署**：Vercel 自动部署（生产分支）
- **代码管理**：Git（cnb.cool / GitHub），main 分支为生产分支
- **前端技术**：HTML + CSS + JavaScript，响应式设计
- **无数据库**：当前无持久化数据存储，对话记录仅在会话内存中

### 3.3 用户体验上下文

- **情感目标**：让访问者感到被理解、被启发，而不是被说教
- **交互风格**：温和、苏格拉底式引导，凯利以"科学家"的视角帮助用户探索自己的构念
- **语言**：中文为主，凯利知识库涉及中英文文献
- **品牌调性**：深度、真诚、不浮躁，与"让智慧触手可及"一致

</context>

---

## 四、权重矩阵

<weights>

| 实体/交互 | 重要性 | 说明 |
|-----------|--------|------|
| 凯利知识库 E1 | ⭐⭐⭐⭐⭐ | 项目根基，质量决定一切 |
| AI 对话记录 E2 | ⭐⭐⭐⭐ | 用户体验核心，需注意隐私 |
| 文章作品 E3 | ⭐⭐⭐⭐ | 内容沉淀和传播载体 |
| 用户画像 E4 | ⭐⭐ | 当前为轻量需求 |
| F1 对话流程 | ⭐⭐⭐⭐⭐ | 核心功能 |
| F2 内容创作 | ⭐⭐⭐⭐ | 长期价值 |
| F3 知识库更新 | ⭐⭐⭐⭐⭐ | 持续积累，复利效应 |

</weights>

---

## 五、验收检查

- [ ] 所有实体（E1-E4）已定义唯一编码和分类方式
- [ ] 智能体（A1-A3）已明确角色和交互模式
- [ ] 信息流动（F1-F3）覆盖了核心业务流程
- [ ] 上下文描述与实际项目状态一致
- [ ] 实体遵守 real.md 中的约束（特别是 C1 人格一致性、C3 内容准确性、C4 隐私保护）
