---
icon: pen-to-square
date: 2026-02-13
category:
- 后端
tag:
- 12因素智能体
- 大模型
- Factor-06
---

# 因素06：用简单API实现启动暂停恢复

> 来源：12-Factor Agents / Factor 6（Launch/Pause/Resume with simple APIs）

## 一句话先懂

智能体要像标准任务系统一样可管理：启动、查询、暂停、恢复都要有清晰 API。

## 奶奶版理解

炖汤不是必须一直守着火。你可以：

- 先开火
- 中途关火
- 晚上继续炖

智能体也应支持这样“可中断、可续跑”的节奏。

## 原文关注点

- 不要把 agent 绑定在一次长请求里。
- 遇到长耗时或人工等待，应能优雅暂停。
- 外部 webhook 到来后，应能按 thread 恢复执行。

## 推荐最小 API 设计

- `POST /agent-runs`：创建并启动任务
- `GET /agent-runs/{id}`：查询状态与最近事件
- `POST /agent-runs/{id}/pause`：主动暂停
- `POST /agent-runs/{id}/resume`：附带新事件恢复

## 状态机建议

`queued -> running -> waiting_external -> resumed -> completed/failed`

每次迁移都记录事件，保证可追踪。

## 典型流程

1. 用户触发发布任务
2. 模型请求人工审批
3. 系统落库并进入 `waiting_external`
4. 审批 webhook 到达
5. 追加 `human_response` 事件并 resume

## 常见误区

- 回调接口无幂等，重复触发重复执行。
- 只支持“整体暂停”，不支持关键步骤前暂停。
- 查询接口只返回文本，不返回结构化状态和事件。

## 我的思考

这条对“从 Demo 到生产”特别关键。  
因为生产系统不可能永远在线、永远顺利、永远无等待。

有 pause/resume 之后，agent 才能真正接进现有业务链路（审批、工单、消息系统）。

## 小结

- Agent 不是一次性对话，而是长期任务。
- 生命周期 API 简单清晰，比花哨功能更重要。
- 可恢复能力是生产级智能体底座。
