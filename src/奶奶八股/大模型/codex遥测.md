---
icon: pen-to-square
date: 2025-12-30
category:
- 后端
tag:
- codex
- 大模型
---

# Codex Telemetry

> 目标：
> **照抄 → 能跑 → 有文件 → 能查 → 能看图**

---

## 一句话先讲清楚这是啥

> **Codex 遥测 = 给 Codex 装一个“全程录像 + 账本 + 监控屏幕”**

* **文件**：所有事情都落盘（审计兜底）
* **otel-view**：人能直接看的“翻账本工具”
* **Grafana**：图形化监控
* **Collector**：中转站（唯一大脑）

---

# 第 0 步：确认家里工具齐全

```bash
docker --version
python3 --version
codex --version
```

不报错即可，看不懂输出没关系。

---

# 第 1 步：创建目录（先放好抽屉）

```bash
mkdir -p /tmp/otel-data
mkdir -p ~/.codex/otel
mkdir -p ~/otel-stack
```

| 目录               | 干嘛的            |
| ---------------- | -------------- |
| `/tmp/otel-data` | 所有日志账本      |
| `~/.codex/otel`  | 配置与工具        |
| `~/otel-stack`   | Grafana 全家桶    |

---

# 第 2 步：写 Collector 配置（照抄）

保存为
`~/.codex/otel/collector-config.yaml`

```yaml
receivers:
  otlp:
    protocols:
      grpc:
        endpoint: 0.0.0.0:4317
      http:
        endpoint: 0.0.0.0:4318

processors:
  batch:

exporters:
  file/logs:
    path: /tmp/otel-data/otel-logs.jsonl
  file/traces:
    path: /tmp/otel-data/otel-traces.jsonl
  file/metrics:
    path: /tmp/otel-data/otel-metrics.jsonl

connectors:
  spanmetrics: {}

service:
  pipelines:
    logs:
      receivers: [otlp]
      processors: [batch]
      exporters: [file/logs]

    traces:
      receivers: [otlp]
      processors: [batch]
      exporters: [file/traces, spanmetrics]

    metrics:
      receivers: [spanmetrics]
      processors: [batch]
      exporters: [file/metrics]
```

不用看懂，只要保存成功。

---

# 第 3 步：配置 Codex（告诉它日志往哪丢）

打开：

```bash
~/.codex/config.toml
```

加入 / 替换成下面这段：

```toml
[otel]
environment = "production"
log_user_prompt = true

[otel.exporter."otlp-http"]
endpoint = "http://localhost:4318/v1/logs"
protocol = "binary"

[otel.trace_exporter."otlp-http"]
endpoint = "http://localhost:4318/v1/traces"
protocol = "binary"

disable_response_storage = false
```

人话翻译：

> Codex：
> “我以后所有日志、过程，全丢给本机 4318 端口”

---

# 第 4 步：启动 Collector（核心中转站）

```bash
docker run -d --name otelcol --restart unless-stopped \
  -p 4317:4317 -p 4318:4318 \
  -v ~/.codex/otel/collector-config.yaml:/etc/otelcol-config.yaml:ro \
  -v /tmp/otel-data:/tmp/otel-data \
  otel/opentelemetry-collector-contrib:latest \
  --config /etc/otelcol-config.yaml
```

检查：

```bash
docker ps
```

看到 `otelcol` 在跑 → **成功**

---

# 第 5 步：安装「人能看的账本工具」otel-view

---

## 5.1 保存 otel-view.py（全量，不省略）

保存为
`~/.codex/otel/otel-view.py`

```python
#!/usr/bin/env python3
import json
import sys
from datetime import datetime, timezone, timedelta
from pathlib import Path

LOG_FILE = Path("/tmp/otel-data/otel-logs.jsonl")
BEIJING_TZ = timezone(timedelta(hours=8))

def format_time_beijing(time_ns, fallback=""):
    if time_ns is None:
        return fallback or ""
    try:
        ns = int(time_ns)
    except (TypeError, ValueError):
        return fallback or ""
    dt = datetime.fromtimestamp(ns / 1_000_000_000, tz=BEIJING_TZ)
    return dt.isoformat(timespec="milliseconds")

def load_logs():
    if not LOG_FILE.exists():
        print(f"log file not found: {LOG_FILE}")
        return []
    logs = []
    with open(LOG_FILE, "r", encoding="utf-8") as f:
        for line in f:
            if line.strip():
                logs.append(json.loads(line))
    return logs

def iter_records(logs):
    for item in logs:
        for rl in item.get("resourceLogs", []):
            for sl in rl.get("scopeLogs", []):
                for record in sl.get("logRecords", []):
                    yield record

def attrs(record):
    out = {}
    for a in record.get("attributes", []):
        k = a.get("key")
        v = a.get("value", {})
        if "stringValue" in v:
            out[k] = v["stringValue"]
        elif "intValue" in v:
            out[k] = v["intValue"]
        elif "boolValue" in v:
            out[k] = v["boolValue"]
    return out

def list_convs():
    logs = load_logs()
    seen = {}
    for r in iter_records(logs):
        a = attrs(r)
        if a.get("event.name") == "codex.conversation_starts":
            cid = a.get("conversation.id")
            seen[cid] = a
    for i, (cid, a) in enumerate(seen.items(), 1):
        print(f"{i:02d} id={cid} model={a.get('model','')}")

def show_conv(cid=None):
    logs = load_logs()
    for r in iter_records(logs):
        a = attrs(r)
        if not cid or a.get("conversation.id") == cid:
            print(json.dumps(a, ensure_ascii=False, indent=2))

def main():
    cmd = sys.argv[1] if len(sys.argv) > 1 else "list"
    arg = sys.argv[2] if len(sys.argv) > 2 else None
    if cmd == "list":
        list_convs()
    elif cmd == "show":
        show_conv(arg)
    else:
        print("otel-view list | show <id>")

if __name__ == "__main__":
    main()
```

---

## 5.2 让它变成命令

```bash
chmod +x ~/.codex/otel/otel-view.py
ln -sf ~/.codex/otel/otel-view.py ~/.local/bin/otel-view
```

检查：

```bash
command -v otel-view
```

---

# 第 6 步：跑一次 Codex（制造数据）

随便：

* 聊一句 Codex
* 或 `codex exec`

---

# 第 7 步：确认日志文件真的生成了

```bash
ls -l /tmp/otel-data/
```

看到这仨就是 **100% 成功**：

```
otel-logs.jsonl
otel-traces.jsonl
otel-metrics.jsonl
```

---

# 第 8 步：用 otel-view 查账

```bash
otel-view list
otel-view show
otel-view show <id>
```

到这一步：
**审计 / 合规 / 回溯已经完全成立**

---

# 第 9 步（进阶）：Grafana 全家桶（docker-compose）

---

## 9.1 保存 docker-compose.yaml（全量）

保存为
`~/otel-stack/docker-compose.yaml`

```yaml
version: "3.8"

services:
  otelcol:
    image: otel/opentelemetry-collector-contrib:latest
    command: ["--config=/etc/otelcol-config.yaml"]
    volumes:
      - ~/.codex/otel/collector-config.yaml:/etc/otelcol-config.yaml:ro
      - /tmp/otel-data:/tmp/otel-data
    ports:
      - "4317:4317"
      - "4318:4318"
      - "9464:9464"

  loki:
    image: grafana/loki:2.9.0
    ports:
      - "3100:3100"

  tempo:
    image: grafana/tempo:2.4.1
    ports:
      - "3200:3200"

  prometheus:
    image: prom/prometheus
    ports:
      - "9090:9090"

  grafana:
    image: grafana/grafana
    ports:
      - "3000:3000"
```

---

## 9.2 启动 Grafana 全套

```bash
cd ~/otel-stack
docker compose up -d
```

---

## 9.3 打开 Grafana

浏览器打开：

```
http://localhost:3000
```

账号密码：

```
admin / admin
```

数据源地址：

| 类型         | 地址                                               |
| ---------- | ------------------------------------------------ |
| Loki       | [http://loki:3100](http://loki:3100)             |
| Tempo      | [http://tempo:3200](http://tempo:3200)           |
| Prometheus | [http://prometheus:9090](http://prometheus:9090) |

---

# 最后一句人话总结

> 你现在已经：
>
> * 给 Codex 装了行车记录仪
> * 所有操作都有文件审计
> * 人能用命令行查
> * 运维能用 Grafana 看

