---
icon: pen-to-square
date: 2025-1-06
category:
- 后端
tag:
- 大模型
---


---

# CLAUDE_CONFIG_DIR

## 在单台服务器上通过 `CLAUDE_CONFIG_DIR` 实现 Claude Code CLI 多 Agent 隔离（SDK 实战）

## 目标读者

* 使用 **Claude Code CLI**
* 使用 **Claude Agent SDK（Python）**
* 希望在 **同一台服务器** 上运行 **多个逻辑隔离的 Claude Agent**
* 每个 Agent 拥有 **独立的完整配置（skills / settings / CLAUDE.md / 行为边界）**

---

## 一、问题背景：为什么需要“多 Agent 隔离”

在实际工程中，我们经常希望：

* Excel Agent：只处理 Excel 相关能力
* Word Agent：只处理 Word 相关能力
* 每个 Agent：

    * 只暴露自己的配置目录（skills / CLAUDE.md / settings 等）
    * 不共享 system prompt / CLAUDE.md / skill 集
    * 不会“串技能”或误调用

但现实约束是：

* 不希望每个 Agent 都单独一台服务器
* 希望 **同一 FastAPI 服务 / 同一机器** 上完成隔离

---

## 二、Claude Code CLI 的关键能力：`CLAUDE_CONFIG_DIR`

Claude Code CLI 原生支持通过环境变量指定配置根目录：

```bash
CLAUDE_CONFIG_DIR=/path/to/.claude-config
```

该目录下通常包含：

```
.claude-config-xxx/
├─ CLAUDE.md
├─ settings.json
└─ skills/
   └─ <skill_name>/
      ├─ SKILL.md
      └─ settings.json
```

**核心事实：**

> Claude Code 在启动 Agent Runtime 时，只会从 `CLAUDE_CONFIG_DIR` 加载一次完整配置（含 CLAUDE.md / settings / skills）。

这为“Agent 隔离”提供了天然的切入点。

---

## 三、整体方案设计（一句话版）

> **通过 SDK 在创建 Claude Agent 时，传入不同的 `CLAUDE_CONFIG_DIR`，使 Claude Code CLI 在逻辑上变成不同的 Agent。**

关键点：

* 每个 Agent 对应一个 **独立的 `.claude-config-*` 目录**
* SDK 层通过 `env={"CLAUDE_CONFIG_DIR": ...}` 注入
* Claude Agent Runtime 只加载该目录下的完整配置
* 不会看到其他 Agent 的配置与 skill

---

## 四、目录结构设计（实战示例）

```
agent/
├─ .claude-config-excel
│  └─ skills
│     └─ excel
│        ├─ SKILL.md
│        └─ settings.json
├─ .claude-config-word
│  └─ skills
│     └─ word
│        ├─ SKILL.md
│        └─ settings.json
├─ .venv
└─ chat.py
```

### Excel Skill（示例）

```markdown
---
name: Excel Skill
description: Respond with a fixed marker to confirm the skill was invoked.
user-invocable: true
---

When invoked, respond with exactly:
SKILL_EXCEL_OK

Do not add any other text.
```

### Word Skill（示例）

```markdown
---
name: Word Skill
description: Respond with a fixed marker to confirm the skill was invoked.
user-invocable: true
---

When invoked, respond with exactly:
SKILL_WORD_OK

Do not add any other text.
```

---

## 五、FastAPI + Claude Agent SDK 实现方式

### 关键设计点

1. **每个请求可以传入自己的 `claude_config_dir`**
2. SDK 创建 `ClaudeAgentOptions` 时注入 env
3. Claude Agent 从该目录加载 skills

### 核心代码（关键片段）

```python
options_kwargs = {
    "system_prompt": "You are a concise assistant.",
    "setting_sources": ("user",),
    "cwd": payload.repo_root or str(Path(__file__).parent.resolve()),
    "allowed_tools": [],
}

if payload.claude_config_dir:
    options_kwargs["env"] = {
        "CLAUDE_CONFIG_DIR": payload.claude_config_dir
    }

options = ClaudeAgentOptions(**options_kwargs)
```

---

## 六、运行服务

```bash
uvicorn chat:app --host 0.0.0.0 --port 8000 --reload
```

---

## 七、验证隔离效果（关键实验）

### 1️⃣ Excel Agent

```bash
curl -N -X POST http://127.0.0.1:8000/chat-stream \
  -H "Content-Type: application/json" \
  -d '{
    "question": "/excel",
    "claude_config_dir": "/Users/xiaoxu/Desktop/agent/.claude-config-excel",
    "debug": true
  }'
```

**结果：**

```
SKILL_EXCEL_OK
```

---

### 2️⃣ Word Agent

```bash
curl -N -X POST http://127.0.0.1:8000/chat-stream \
  -H "Content-Type: application/json" \
  -d '{
    "question": "/word",
    "claude_config_dir": "/Users/xiaoxu/Desktop/agent/.claude-config-word",
    "debug": true
  }'
```

**结果：**

```
SKILL_WORD_OK
```

---

### 3️⃣ 隔离验证（关键）

* Excel Agent 调 `/word` → **无输出 / 0 token**
* Word Agent 调 `/excel` → **无输出 / 0 token**

说明：

> Claude Agent **只加载了本次传入配置目录下的完整配置（含 CLAUDE.md / skills / settings）**，不存在技能串扰。

---

## 八、为什么这个方案“真的实现了隔离”

### 隔离发生在三个层级：

#### 1️⃣ 配置层

* `CLAUDE_CONFIG_DIR` 不同
* CLAUDE.md / settings / system 行为不同

#### 2️⃣ Skill 发现层

* Claude Code 只扫描该目录
* 其他 skill **根本不存在于 runtime**

#### 3️⃣ 调用层

* `/excel`、`/word` 只能在各自 Agent 生效
* 非法 command 被直接 short-circuit

---

## 九、一个必须知道的重要限制（非常重要）

### ⚠️ Claude Agent Runtime 是 **进程级缓存的**

这意味着：

* **`CLAUDE_CONFIG_DIR` 只在 Agent Runtime 首次初始化时生效**
* 在同一个 Python 进程中：

    * **不能可靠地 per-request 切换 Agent**

### 因此，本方案的正确使用姿势是：

#### ✅ 推荐方式

* **一个进程 = 一个 Agent**
* 或：

    * Excel Agent 服务
    * Word Agent 服务
* 共享机器，不共享 runtime

#### ❌ 不推荐方式

* 同一进程内高频切换 config 目录
* 依赖 runtime reload（SDK 当前不支持）

---

## 十、适用场景总结

### 适合：

* 单机多 Agent 部署
* Agent 行为必须强隔离
* 企业内部工具 / 私有部署

### 不适合：

* 单进程高并发动态 Agent 切换
* SaaS 级“用户自定义 Agent”

---

## 十一、总结一句话

> **通过 `CLAUDE_CONFIG_DIR` + Claude Agent SDK，可以在单台服务器上构建多个逻辑完全隔离的 Claude Code Agent，每个 Agent 拥有独立的 skills、配置与能力边界。**

---


