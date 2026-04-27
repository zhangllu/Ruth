---
name: ask-kelly-real
description: 问凯利项目现实约束文档
---

# 问凯利 - 现实约束文档

> 现实约束是项目必须遵守的硬性限制，来自法律、安全、业务等方面。

<meta>
  <document-id>ask-kelly-real</document-id>
  <version>1.0.0</version>
  <project>问凯利 (Ask Kelly)</project>
  <type>现实约束</type>
  <created>2026-04-27</created>
</meta>

## 文档说明

本文档定义问凯利项目在开发、部署和运营中必须遵守的硬性约束，重点包括 AI 对话人格一致性、用户隐私保护、知识库准确性以及部署安全。

<constraints>

## 必选约束

<constraint required="true" id="C1">
<title>AI人格一致性</title>
<description>凯利 AI 的回复必须严格基于乔治·凯利的个人建构心理学框架，不能偏离凯利的理论立场编造观点。身份固定为乔治·凯利本人（已故心理学家），避免角色漂移。</description>
<rationale>用户信赖的是凯利本人的思想体系，不一致的人格会破坏信任，偏离项目核心价值。</rationale>
<violation-consequence>用户流失，项目失去与普通聊天机器人的差异化竞争力。</violation-consequence>
</constraint>

<constraint required="true" id="C2">
<title>智谱 AI API 密钥安全</title>
<description>API 密钥必须存储在服务端环境变量中，不得硬编码在前端代码或提交到 Git 仓库。</description>
<rationale>密钥泄露会导致滥用和资损，且修复成本高。</rationale>
<violation-consequence>API 被第三方盗用产生额外费用，密钥泄露后需紧急轮换。</violation-consequence>
</constraint>

<constraint required="true" id="C3">
<title>知识库内容准确性</title>
<description>所有关于凯利及其理论的内容必须基于真实学术文献，不得虚构凯利的生平、理论概念或著作。明确标注"作者理解"与"凯利原意"的区分。</description>
<rationale>这是心理学知识类项目的基本底线，虚构内容会误导读者并损害项目信誉。</rationale>
<violation-consequence>传播错误知识，学术声誉受损，失去专业读者的信任。</violation-consequence>
</constraint>

<constraint required="true" id="C4">
<title>用户对话数据隐私</title>
<description>用户与凯利的对话记录不得明文存储或泄露。如果存储，必须加密且用户有权删除自己的对话历史。</description>
<rationale>对话内容可能涉及用户的心理状态和个人困惑，属于敏感信息。</rationale>
<violation-consequence>违反个人信息保护相关法规，用户隐私泄露风险。</violation-consequence>
</constraint>

## 可选约束

<constraint required="false" id="C5">
<title>文章品质把控</title>
<description>发布的凯利相关文章应经过一定审核或自我检查，避免明显的理论误读。鼓励注明引用来源。</description>
<rationale>虽然不是学术期刊，但作为公开的心理学内容，质量会影响口碑。</rationale>
</constraint>

<constraint required="false" id="C6">
<title>对话上下文长度管理</title>
<description>AI 对话需妥善管理上下文长度，避免超出模型 token 限制导致回复断裂或遗忘早期对话内容。</description>
<rationale>长对话中凯利人格一致性更易受上下文窗口限制影响。</rationale>
</constraint>

<constraint required="false" id="C7">
<title>代码托管安全</title>
<description>Git 仓库避免提交 .env 文件、API 密钥、密码等敏感信息。已通过 .gitignore 保护。</description>
<rationale>防止敏感信息意外流入公开仓库。</rationale>
</constraint>

</constraints>

## 技术环境

<environment>
<stack>
- 前端：HTML + CSS + JavaScript（纯静态，后续可升级 Next.js）
- 后端 API：Vercel Edge Functions
- AI 模型：智谱 AI GLM-5.1
- 部署平台：Vercel
- 代码托管：GitHub / cnb.cool
- 包管理：bun
- Python 环境：uv（用于数据处理脚本）
</stack>
</environment>

## 约束检查清单

- [ ] C1 - AI 回回复内容定期抽查，确保不偏离凯利人格
- [ ] C2 - API 密钥仅存在于 Vercel 环境变量，不在代码中
- [ ] C3 - 知识库内容标注来源，区分"凯利原话"与"作者阐释"
- [ ] C4 - 对话数据加密存储，提供删除入口
- [ ] C5 - 文章经自我检查后发布
- [ ] C6 - 对话上下文长度监控和预警
- [ ] C7 - 定期检查 .gitignore 覆盖是否完整
