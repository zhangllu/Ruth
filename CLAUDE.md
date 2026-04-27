# Claude Code 项目配置文件

## 项目信息

- **项目名称**: Ask Kelly
- **项目类型**: 教学设计辅助工具
- **项目描述**: 基于凯利（Kelly）个人建构心理学的教学设计与对话辅助系统
- **主要语言**: 中文

## 个人环境信息

- **设备**: 搭载 Apple 芯片的 Mac 电脑
- **Node.js 管理**: 通过 bun 进行安装管理
- **Python 环境**: 通过 uv 配置
- **Git 代码托管平台**: cnb.cool

## 技术栈

### 前端技术
- **框架**: Next.js (React)
- **语言**: TypeScript / JavaScript
- **样式**: Tailwind CSS
- **包管理器**: bun

### 后端 / 脚本技术
- **Python 环境**: uv（现代 Python 包管理器）
- **脚本**: 用于数据处理和自动化任务

## 开发规范

### Git 工作流

1. **分支管理**
   - `main` 分支: 主分支，保护分支
   - `feature/*` 分支: 新功能开发
   - `fix/*` 分支: Bug 修复
   - `docs/*` 分支: 文档更新

2. **Commit 规范**
   - 使用清晰、简洁的提交信息
   - 格式: `类型: 描述`
   - 类型包括: `feat`、`fix`、`docs`、`style`、`refactor`、`test`、`chore`

3. **代码托管平台**: cnb.cool
   - 所有代码推送至 cnb.cool 远程仓库
   - 使用 Pull Request 进行代码审查

### 代码规范

#### JavaScript / TypeScript
- 使用函数式编程和 React Hooks
- 组件命名使用 PascalCase
- 变量和函数使用 camelCase

#### Python
- 遵循 PEP 8 编码规范
- 使用类型提示 (Type Hints)
- 函数和变量使用 snake_case
- 类名使用 PascalCase

## 开发命令

```bash
# 安装依赖
bun install

# 启动开发服务器
bun run dev

# 构建项目
bun run build

# 运行 Python 脚本
uv run python scripts/脚本名.py
```

## 项目说明

本项目源于"路思（Ruth）产品诞生记"，围绕凯利个人建构心理学，构建教学设计与对话辅助系统。核心模块包括：

- 凯利知识库：心理学理论体系
- 对话交互：基于建构主义的对话辅助
- 教学设计：教学目标与内容设计工具

## Claude Code 使用规范

1. **语言要求**: 所有沟通和代码注释使用中文
2. **代码审查**: 重要更改需要代码审查
3. **文档更新**: 功能开发完成后更新相关文档
4. **测试**: 交付前确保代码通过基本测试
5. **Markdown 格式规范**: 段落和章节之间不使用 `---` 横线分隔符，章节层次通过标题来区分

## 注意事项

- 本项目为教育用途，专注于教学设计领域
- 所有文档和代码注释使用中文
- 保持代码简洁，遵循 KISS 原则
- 定期提交代码，避免大量未提交的更改
- 保护敏感信息，不要将 API 密钥、密码等提交到版本控制
