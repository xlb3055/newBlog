# Neo4j 快速参考手册

---

## 核心概念速查

### 数据模型对比

| 关系型数据库 | Neo4j 图数据库 |
|-------------|----------------|
| 表 → 标签 (Label) | |
| 行 → 节点 (Node) | |
| 列 → 属性 (Property) | |
| 外键 → 关系 (Relationship) | |
| JOIN → 遍历 (Traversal) | |

---

## Python 快速开始

### 1. 安装驱动
```bash
pip install neo4j pandas numpy matplotlib networkx
```

### 2. 基础连接
```python
from neo4j import GraphDatabase

# 连接
driver = GraphDatabase.driver(
    "bolt://localhost:7687",
    auth=("neo4j", "password123")
)

# 使用会话
with driver.session() as session:
    result = session.run("MATCH (n) RETURN count(n) as count")
    print(f"Total nodes: {result.single()['count']}")

driver.close()
```

### 3. 上下文管理器
```python
class Neo4jConnection:
    def __init__(self, uri, auth):
        self.driver = GraphDatabase.driver(uri, auth=auth)

    def __enter__(self):
        return self

    def __exit__(self, exc_type, exc_val, exc_tb):
        self.driver.close()

# 使用
with Neo4jConnection(uri, auth) as conn:
    # 操作数据库
    pass
```

---

## Cypher 查询语法速查

### 创建操作
```cypher
-- 创建节点
CREATE (p:Person {name: '张三', age: 30})

-- 创建关系
MATCH (a:Person {name: '张三'}), (b:Person {name: '李四'})
CREATE (a)-[r:KNOWS {since: 2020}]->(b)

-- MERGE (创建或更新)
MERGE (p:Person {email: 'test@example.com'})
ON CREATE SET p.created = timestamp()
ON MATCH SET p.last_login = timestamp()
```

### 查询操作
```cypher
-- 基础查询
MATCH (p:Person)
WHERE p.age > 25
RETURN p.name, p.age

-- 关系查询
MATCH (a:Person)-[r:KNOWS*1..3]-(b:Person)
RETURN a.name, b.name

-- 聚合查询
MATCH (p:Person)
RETURN p.city, count(p) as count, avg(p.age) as avg_age
```

### 更新操作
```cypher
-- 更新属性
MATCH (p:Person {name: '张三'})
SET p.age = 31, p.email = 'zhangsan@example.com'

-- 批量更新
MATCH (p:Person)
WHERE p.city = '北京'
SET p.region = '华北'
```

### 删除操作
```cypher
-- 删除关系
MATCH (a:Person)-[r:KNOWS]->(b:Person)
DELETE r

-- 删除节点（需先删除关系）
MATCH (p:Person {name: '张三'})
DETACH DELETE p
```

---

## 常用查询模式

### 1. 路径查询
```cypher
-- 最短路径
MATCH path = shortestPath((a)-[*]-(b))
RETURN path

-- 所有路径
MATCH path = allShortestPaths((a)-[*]-(b))
RETURN path

-- 可变长度路径
MATCH (a:Person)-[r:KNOWS*1..3]-(b:Person)
RETURN a.name, b.name, length(path) as hops
```

### 2. 推荐查询
```cypher
-- 协同过滤
MATCH (u:User {id: 'user1'})-[:RATED]->(i:Item)<-[:RATED]-(similar:User)
WHERE NOT (u)-[:RATED]->(i)
RETURN i, count(similar) as score
ORDER BY score DESC

-- 基于内容
MATCH (u:User {id: 'user1'})-[:LIKES]->(i:Item)
WHERE i.category = 'Technology'
RETURN i
```

### 3. 社交网络查询
```cypher
-- 共同好友
MATCH (u1:User)-[:FRIENDS]-(mutual)-[:FRIENDS]-(u2:User)
WHERE u1.name = 'Alice' AND u2.name = 'Bob'
RETURN mutual.name

-- 好友推荐
MATCH (u:User)-[:FRIENDS*1..2]-(potential:User)
WHERE NOT (u)-[:FRIENDS]-(potential) AND u <> potential
RETURN potential.name, count(*) as connection_strength
```

---

## 性能优化技巧

### 1. 索引创建
```cypher
-- 单属性索引
CREATE INDEX user_email_index FOR (u:User) ON (u.email)

-- 复合索引
CREATE INDEX user_city_age_index FOR (u:User) ON (u.city, u.age)

-- 文本索引
CREATE FULLTEXT INDEX content_index FOR (p:Post) ON EACH [p.title, p.content]
```

### 2. 查询优化
```python
# 使用参数化查询
query = """
MATCH (p:Person)
WHERE p.age > $age AND p.city = $city
RETURN p.name
"""
session.run(query, age=25, city="北京")

# 批量操作
batch_data = [{"name": f"User{i}", "age": 20+i} for i in range(100)]
query = "UNWIND $batch AS data CREATE (p:Person {name: data.name, age: data.age})"
session.run(query, batch=batch_data)
```

### 3. 事务管理
```python
with driver.session() as session:
    with session.begin_transaction() as tx:
        try:
            tx.run("CREATE (p:Person {name: $name})", name="张三")
            tx.run("MATCH (p:Person {name: $name}) SET p.age = $age", name="张三", age=30)
            tx.commit()
        except:
            tx.rollback()
```

---

## 实用代码片段

### 1. 查询结果转换为 DataFrame
```python
def query_to_dataframe(session, query, **params):
    result = session.run(query, **params)
    return pd.DataFrame([dict(record) for record in result])
```

### 2. 重试机制
```python
from neo4j.exceptions import ServiceUnavailable, TransientError
import time

def execute_with_retry(session, query, max_retries=3, **params):
    for attempt in range(max_retries):
        try:
            return session.run(query, **params)
        except (ServiceUnavailable, TransientError):
            if attempt < max_retries - 1:
                time.sleep(2 ** attempt)
                continue
            raise
```

### 3. 流式处理大结果
```python
def process_large_result(session, query, batch_size=1000):
    result = session.run(query)
    batch = []
    for record in result:
        batch.append(dict(record))
        if len(batch) >= batch_size:
            yield batch
            batch = []
    if batch:
        yield batch
```

---

## 常见问题解决

### 1. 内存不足
```python
# 使用 SKIP/LIMIT 分页
def paginated_query(session, page, size):
    query = """
    MATCH (n:Node)
    RETURN n
    ORDER BY n.id
    SKIP $skip LIMIT $limit
    """
    skip = page * size
    return session.run(query, skip=skip, limit=size)
```

### 2. 查询性能慢
```python
# 检查执行计划
def analyze_query(session, query):
    explain = f"EXPLAIN {query}"
    profile = f"PROFILE {query}"

    print("执行计划:")
    result = session.run(explain)
    for record in result:
        print(record)

    print("\n性能分析:")
    result = session.run(profile)
    for record in result:
        print(record)
```

### 3. 事务超时
```python
# 配置连接池
driver = GraphDatabase.driver(
    uri,
    auth=auth,
    max_connection_lifetime=30 * 60,
    max_connection_pool_size=50,
    connection_acquisition_timeout=60
)
```

---

## 开发最佳实践

### 1. 使用连接池
```python
class Neo4jPool:
    def __init__(self, uri, auth, max_connections=10):
        self.driver = GraphDatabase.driver(uri, auth=auth)
        self.semaphore = asyncio.Semaphore(max_connections)

    async def execute(self, query, **params):
        async with self.semaphore:
            with self.driver.session() as session:
                return session.run(query, **params)
```

### 2. 错误处理
```python
from neo4j.exceptions import Neo4jError

def safe_execute(session, query, **params):
    try:
        result = session.run(query, **params)
        return [dict(record) for record in result]
    except Neo4jError as e:
        logging.error(f"Neo4j Error: {e}")
        raise
    except Exception as e:
        logging.error(f"Unexpected Error: {e}")
        raise
```

### 3. 日志记录
```python
import logging

logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)

def logged_query(session, query, **params):
    logger.info(f"Executing query: {query}")
    logger.info(f"Parameters: {params}")

    try:
        result = session.run(query, **params)
        logger.info(f"Query succeeded")
        return result
    except Exception as e:
        logger.error(f"Query failed: {e}")
        raise
```

---

## 调试工具

### 1. 查询调试
```cypher
-- 查看所有节点
MATCH (n) RETURN labels(n) AS labels, count(n) AS count

-- 查看所有关系类型
MATCH ()-[r]-()
RETURN type(r) AS type, count(r) AS count

-- 检查数据完整性
MATCH (n:Person)
WHERE NOT exists((n)-[:HAS_PROFILE]-())
RETURN n.name
```

### 2. 性能监控
```python
def monitor_performance(driver):
    with driver.session() as session:
        # 数据库状态
        result = session.run("CALL dbms.queryJmx('org.neo4j:instance=kernel#0,name=Transactions')")
        for record in result:
            print(record)
```

### 3. 数据导出
```cypher
-- 导出为 JSON
MATCH (n)
OPTIONAL MATCH (n)-[r]->(m)
WITH collect(DISTINCT n) as nodes, collect(DISTINCT r) as relationships
RETURN nodes, relationships
```

---

## 可视化技巧

### 1. NetworkX 集成
```python
import networkx as nx
import matplotlib.pyplot as plt

def visualize_neo4j_graph(session, query):
    result = session.run(query)

    G = nx.DiGraph()
    for record in result:
        G.add_edge(record['source'], record['target'])

    nx.draw(G, with_labels=True)
    plt.show()
```

### 2. 图形化查询结果
```python
def plot_query_results(df, x_col, y_col, title="Query Results"):
    plt.figure(figsize=(10, 6))
    plt.bar(df[x_col], df[y_col])
    plt.xlabel(x_col)
    plt.ylabel(y_col)
    plt.title(title)
    plt.xticks(rotation=45)
    plt.tight_layout()
    plt.show()
```

---

## 更多资源

### 官方文档
- [Neo4j 文档](https://neo4j.com/docs/)
- [Cypher 参考](https://neo4j.com/docs/cypher-manual/current/)
- [Python 驱动](https://neo4j.com/docs/python-manual/current/)

### 社区资源
- [Neo4j 社区](https://community.neo4j.com/)
- [Neo4j 示例](https://github.com/neo4j-examples)
- [图算法库](https://neo4j.com/docs/graph-data-science/)

### 书籍推荐
- 《Learning Neo4j》
- 《Graph Databases》
- 《Neo4j in Action》

---

## 提示

- 使用 `EXPLAIN` 查看执行计划
- 使用 `PROFILE` 分析性能
- 定期清理不需要的数据
- 监控数据库健康状态
- 保持驱动版本更新

---

*最后更新：2025年12月*
