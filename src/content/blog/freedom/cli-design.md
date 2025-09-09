---
title: freedom cli 方案设计
author: caterpillar
pubDatetime: 2025-09-09T00:00:00
featured: false
draft: false
tags:
  - freedom
  - cli
description: freedom cli 方案设计 灵感源自 claude code cli
---

## 斜杠命令

在交互式会话中使用斜杠命令控制 freedom 的行为。

### 内置斜杠命令

| 命令       | 用途                        |
| ---------- | --------------------------- |
| `/login`   | 登录到 freedom 账户         |
| `/logout`  | 从 freedom 账户登出         |
| `/help`    | 获取使用帮助                |
| `/log`     | 查看系统日志                |
| `/doctor`  | 检查 freedom 安装的健康状况 |
| `/config`  | 查看/修改配置               |
| `/script`  | 执行脚本命令                |
| `/task`    | 管理任务                    |
| `/start`   | 启动服务                    |
| `/stop`    | 停止服务                    |
| `/restart` | 重启服务                    |