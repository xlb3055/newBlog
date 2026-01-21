#  Neo4j 完整教程：从入门到精通

## 目录

1. [Neo4j 基础概念](#1-neo4j-基础概念)
2. [Cypher 查询语言详解](#2-cypher-查询语言详解)
3. [Python 整合开发](#3-python-整合开发)
4. [实战项目案例](#4-实战项目案例)
5. [性能优化与最佳实践](#5-性能优化与最佳实践)

---

## 1. Neo4j 基础概念

### 1.1 什么是图数据库？

图数据库是一种专门用于存储、管理和查询图结构数据的 NoSQL 数据库。

#### 核心概念对比

| 传统关系型数据库 | Neo4j 图数据库 |
|----------------|----------------|
| 表 (Table) | 标签 (Label) |
| 行 (Row) | 节点 (Node) |
| 列 (Column) | 属性 (Property) |
| 外键 (Foreign Key) | 关系 (Relationship) |
| JOIN 操作 | 遍历 (Traversal) |

#### Neo4j 数据模型

```python
# Neo4j 的核心组件
"""
节点 (Node):
  - 代表实体（如：用户、产品、文章）
  - 包含属性（键值对）
  - 可以有一个或多个标签

关系 (Relationship):
  - 连接两个节点
  - 有方向（可以有双向关系）
  - 必须有类型
  - 也可以有属性

属性 (Property):
  - 键值对存储
  - 支持各种数据类型
  - 可以存在于节点和关系上

标签 (Label):
  - 节点的分类
  - 类似表名
  - 一个节点可以有多个标签

路径 (Path):
  - 节点和关系的序列
  - 表示两个节点间的连接
"""
```

### 1.2 Neo4j 架构

```
Neo4j 架构组件
├── 驱动程序 (Driver)
│   ├── 同步驱动 (neo4j)
│   ├── 异步驱动 (neo4j[async])
│   └── 响应式驱动 (neo4j[reactive])
├── 会话 (Session)
│   ├── 自动事务管理
│   ├── 读取会话
│   └── 写入会话
├── 事务 (Transaction)
│   ├── ACID 特性
│   ├── 显式事务
│   └── 自动提交事务
└── 连接池
    ├── 连接复用
    ├── 负载均衡
    └── 故障转移
```

---

## 2. Cypher 查询语言详解

Cypher 是 Neo4j 的声明式查询语言，类似于 SQL，但专门为图数据设计。

### 2.1 基础语法结构

#### 2.1.1 读取查询 (READ)

```cypher
-- 1. 创建节点 (CREATE)
CREATE (p:Person {name: '张三', age: 30, city: '北京'})

-- 2. 查询节点 (MATCH)
MATCH (p:Person {name: '张三'})
RETURN p.name, p.age, p.city

-- 3. 多标签节点
MATCH (p:Person:Developer:PythonDeveloper)
RETURN p

-- 4. 条件查询
MATCH (p:Person)
WHERE p.age > 25 AND p.city IN ['北京', '上海']
RETURN p.name, p.age, p.city

-- 5. 正则表达式查询
MATCH (p:Person)
WHERE p.name =~ '张.*'
RETURN p.name

-- 6. 字符串函数
MATCH (p:Person)
RETURN p.name,
       size(p.name) AS name_length,
       toUpper(p.city) AS city_upper,
       substring(p.name, 0, 2) AS first_two_chars
```

#### 2.1.2 关系查询

```cypher
-- 1. 创建关系
MATCH (a:Person {name: '张三'}), (b:Person {name: '李四'})
CREATE (a)-[r:KNOWS {since: 2020, relationship: '同事'}]->(b)

-- 2. 查询关系
MATCH (a:Person)-[r:KNOWS]->(b:Person)
RETURN a.name, type(r), properties(r), b.name

-- 3. 可变长度路径查询
MATCH (a:Person {name: '张三'})-[:KNOWS*1..3]-(b:Person)
RETURN a.name, b.name

-- 4. 最短路径
MATCH (a:Person {name: '张三'}), (b:Person {name: '王五'})
MATCH path = shortestPath((a)-[*]-(b))
RETURN path

-- 5. 所有路径
MATCH (a:Person {name: '张三'}), (b:Person {name: '王五'})
MATCH path = allShortestPaths((a)-[*]-(b))
RETURN path

-- 6. 关系类型查询
MATCH (a:Person)-[r]->(b:Person)
WHERE type(r) STARTS WITH 'KNOW'
RETURN a.name, type(r), b.name

-- 7. 双向关系查询
MATCH (a:Person)-[r:KNOWS]-(b:Person)
RETURN a.name, r.since, b.name
```

#### 2.1.3 聚合函数

```cypher
-- 1. 基础聚合
MATCH (p:Person)
RETURN count(p) AS total_persons,
       avg(p.age) AS avg_age,
       min(p.age) AS min_age,
       max(p.age) AS max_age,
       sum(p.age) AS total_age

-- 2. 分组聚合
MATCH (p:Person)
RETURN p.city,
       count(p) AS person_count,
       avg(p.age) AS avg_age
ORDER BY person_count DESC

-- 3. 去重计数
MATCH (p:Person)
RETURN count(DISTINCT p.city) AS unique_cities

-- 4. 收集聚合
MATCH (p:Person)
RETURN p.city,
       collect(p.name) AS names,
       collect(DISTINCT p.name) AS unique_names

-- 5. 百分位计算
MATCH (p:Person)
RETURN percentileCont(p.age, 0.5) AS median_age,
       percentileDisc(p.age, 0.95) AS percentile_95

-- 6. 标准差和方差
MATCH (p:Person)
RETURN stdev(p.age) AS std_deviation,
       stdevp(p.age) AS population_std_dev
```

### 2.2 高级查询技巧

#### 2.2.1 WITH 子句

```cypher
-- 1. 链式查询
MATCH (p:Person)
WHERE p.age > 25
WITH p
ORDER BY p.age DESC
LIMIT 3
MATCH (p)-[:KNOWS]-(friend)
RETURN p.name AS person, collect(friend.name) AS friends

-- 2. 变量传递
MATCH (p:Person)
WITH p.name AS name, toUpper(p.name) AS upper_name
RETURN name, upper_name

-- 3. 聚合后继续查询
MATCH (p:Person)
WITH p.city AS city, count(p) AS count
WHERE count > 2
MATCH (people:Person {city: city})
RETURN city, count, collect(people.name) AS names
```

#### 2.2.2 条件表达式

```cypher
-- 1. CASE 表达式
MATCH (p:Person)
RETURN p.name,
       CASE
           WHEN p.age < 20 THEN '年轻'
           WHEN p.age < 35 THEN '中年'
           ELSE '成熟'
       END AS age_group

-- 2. COALESCE 函数
MATCH (p:Person)
RETURN p.name,
       coalesce(p.nickname, p.name) AS display_name

-- 3. 三元操作符
MATCH (p:Person)
RETURN p.name,
       (p.age > 30 ? '资深' : '初级') AS experience_level
```

#### 2.2.3 列表操作

```cypher
-- 1. 创建列表
RETURN [1, 2, 3] AS numbers

-- 2. 列表函数
MATCH (p:Person {name: '张三'})
RETURN size(p.skills) AS skill_count,
       p.skills[0] AS first_skill,
       p.skills[-1] AS last_skill,
       reverse(p.skills) AS reversed_skills

-- 3. 列表推导
MATCH (p:Person)
RETURN [x IN p.skills WHERE size(x) > 4] AS long_skills

-- 4. 列表过滤
MATCH (p:Person)
RETURN filter(x IN p.skills WHERE x CONTAINS 'Python') AS python_skills

-- 5. 列表转换
MATCH (p:Person)
RETURN [x IN p.skills | toUpper(x)] AS upper_skills

-- 6. 列表聚合
MATCH (p:Person)
RETURN reduce(total = 0, n IN [1, 2, 3, 4, 5] | total + n) AS sum
```

#### 2.2.4 字符串操作

```cypher
-- 1. 字符串函数
RETURN 'Neo4j' AS db,
       size('Neo4j') AS length,
       toUpper('neo4j') AS upper,
       toLower('NEO4J') AS lower,
       reverse('Neo4j') AS reversed

-- 2. 字符串替换
WITH 'Hello World' AS text
RETURN replace(text, 'World', 'Neo4j') AS replaced

-- 3. 字符串分割和连接
WITH 'Python,Java,JavaScript' AS languages
RETURN split(languages, ',') AS lang_list,
       join(['Python', 'Neo4j'], ' + ') AS combined

-- 4. 子字符串
WITH 'Neo4j Graph Database' AS text
RETURN substring(text, 0, 6) AS neo4j,
       left(text, 6) AS left_part,
       right(text, 8) AS right_part
```

### 2.3 数据修改操作

#### 2.3.1 创建和更新

```cypher
-- 1. MERGE - 创建或更新
MERGE (p:Person {name: '张三'})
ON CREATE SET p.age = 30, p.created = timestamp()
ON MATCH SET p.last_seen = timestamp()
RETURN p

-- 2. SET - 更新属性
MATCH (p:Person {name: '张三'})
SET p.age = 31,
    p.email = 'zhangsan@example.com',
    p.tags = ['developer', 'python']

-- 3. SET - 动态属性更新
MATCH (p:Person {name: '张三'})
SET p += {city: '北京', status: 'active'}

-- 4. SET - 列表操作
MATCH (p:Person {name: '张三'})
SET p.skills = p.skills + ['Neo4j'],  -- 添加到列表
    p.hobbies = p.hobbies - ['游戏']   -- 从列表移除

-- 5. INCREMENT - 数值递增
MATCH (p:Person {name: '张三'})
SET p.login_count = coalesce(p.login_count, 0) + 1
```

#### 2.3.2 删除操作

```cypher
-- 1. 删除属性
MATCH (p:Person {name: '张三'})
REMOVE p.email, p.status

-- 2. 删除标签
MATCH (p:Person {name: '张三'})
REMOVE p:Developer

-- 3. 删除关系
MATCH (p:Person {name: '张三'})-[r:KNOWS]-()
DELETE r

-- 4. 删除节点（需要先删除所有关系）
MATCH (p:Person {name: '张三'})
DETACH DELETE p

-- 5. 批量删除
MATCH (p:Person)
WHERE p.last_seen < timestamp() - duration({days: 365})
DETACH DELETE p
```

### 2.4 事务管理

```cypher
-- 1. 自动事务（每个查询自动提交）
MATCH (p:Person {name: '张三'})
SET p.last_login = timestamp()

-- 2. 显式事务（在客户端代码中）
-- BEGIN
MATCH (p:Person {name: '张三'}) SET p.balance = p.balance - 100
MATCH (p:Person {name: '李四'}) SET p.balance = p.balance + 100
-- COMMIT

-- 3. 事务函数（在 Python 中）
WITH transaction(tx) AS tx.begin_transaction()
tx.run("MATCH (p:Person {name: $name}) SET p.balance = $balance",
       name="张三", balance=1000)
tx.commit()
```

---

## 3. Python 整合开发

### 3.1 安装和配置

```python
# 安装 Neo4j Python 驱动
pip install neo4j

# 安装可选依赖
pip install pandas          # 数据分析
pip install numpy           # 数值计算
pip install matplotlib       # 数据可视化
pip install networkx         # 图分析
pip install py2neo          # 另一个 Neo4j 驱动
```

### 3.2 基础连接和查询

```python
from neo4j import GraphDatabase
import pandas as pd
from typing import List, Dict, Optional, Any

# 连接配置
URI = "bolt://localhost:7687"
AUTH = ("neo4j", "password123")

class Neo4jConnection:
    """Neo4j 连接管理类"""

    def __init__(self, uri: str, auth: tuple):
        self.driver = GraphDatabase.driver(uri, auth=auth)

    def close(self):
        """关闭连接"""
        if self.driver:
            self.driver.close()

    def __enter__(self):
        return self

    def __exit__(self, exc_type, exc_val, exc_tb):
        self.close()

    def execute_query(self, query: str, **params) -> pd.DataFrame:
        """执行查询并返回 DataFrame"""
        with self.driver.session() as session:
            result = session.run(query, **params)
            return pd.DataFrame([dict(record) for record in result])

# 使用示例
with Neo4jConnection(URI, AUTH) as conn:
    # 简单查询
    df = conn.execute_query("MATCH (p:Person) RETURN p.name, p.age LIMIT 5")
    print(df)

    # 参数化查询
    df = conn.execute_query(
        "MATCH (p:Person) WHERE p.age > $age RETURN p.name",
        age=30
    )
    print(df)
```

### 3.3 会话管理

```python
from neo4j import GraphDatabase, Session, READ, WRITE

class Neo4jSessionManager:
    """Neo4j 会话管理"""

    def __init__(self, uri: str, auth: tuple):
        self.driver = GraphDatabase.driver(uri, auth=auth)

    def read_session(self, database: str = "neo4j") -> Session:
        """创建读取会话"""
        return self.driver.session(database=database, default_access_mode=READ)

    def write_session(self, database: str = "neo4j") -> Session:
        """创建写入会话"""
        return self.driver.session(database=database, default_access_mode=WRITE)

    def execute_read(self, query: str, **params) -> List[Dict]:
        """执行读取操作"""
        with self.read_session() as session:
            result = session.run(query, **params)
            return [dict(record) for record in result]

    def execute_write(self, query: str, **params) -> List[Dict]:
        """执行写入操作"""
        with self.write_session() as session:
            result = session.run(query, **params)
            return [dict(record) for record in result]
```

### 3.4 事务处理

```python
from neo4j import GraphDatabase, Transaction

class Neo4jTransactionManager:
    """Neo4j 事务管理"""

    def __init__(self, driver):
        self.driver = driver

    def transactional_example(self):
        """事务示例：转账操作"""
        def transfer_funds(tx: Transaction, from_account: str, to_account: str, amount: float):
            """转账函数"""
            # 检查余额
            result = tx.run(
                "MATCH (a:Account {id: $id}) RETURN a.balance",
                id=from_account
            )
            balance = result.single()["a.balance"]

            if balance < amount:
                raise ValueError("余额不足")

            # 执行转账
            tx.run(
                "MATCH (a:Account {id: $id}) SET a.balance = a.balance - $amount",
                id=from_account, amount=amount
            )
            tx.run(
                "MATCH (a:Account {id: $id}) SET a.balance = a.balance + $amount",
                id=to_account, amount=amount
            )

        # 执行事务
        with self.driver.session() as session:
            try:
                session.write_transaction(
                    transfer_funds,
                    from_account="acc1",
                    to_account="acc2",
                    amount=100.0
                )
                print("转账成功")
            except Exception as e:
                print(f"转账失败: {e}")

    def batch_operations(self):
        """批量操作"""
        def create_multiple_nodes(tx: Transaction, nodes_data: List[Dict]):
            """批量创建节点"""
            query = """
            UNWIND $nodes AS node_data
            CREATE (n:Node {properties: node_data})
            """
            tx.run(query, nodes=nodes_data)

        # 准备数据
        nodes = [
            {"name": f"Node{i}", "value": i * 10}
            for i in range(1000)
        ]

        # 执行批量操作
        with self.driver.session() as session:
            session.write_transaction(create_multiple_nodes, nodes)
            print(f"批量创建了 {len(nodes)} 个节点")
```

### 3.5 异步编程

```python
import asyncio
from neo4j import AsyncGraphDatabase, AsyncSession
from typing import AsyncGenerator

class AsyncNeo4jClient:
    """异步 Neo4j 客户端"""

    def __init__(self, uri: str, auth: tuple):
        self.driver = AsyncGraphDatabase.driver(uri, auth=auth)

    async def close(self):
        """关闭异步连接"""
        await self.driver.close()

    async def execute_query(self, query: str, **params) -> List[Dict]:
        """异步执行查询"""
        async with self.driver.session() as session:
            result = await session.run(query, **params)
            return [dict(record) async for record in result]

    async def stream_results(self, query: str, **params) -> AsyncGenerator[Dict, None]:
        """异步流式处理结果"""
        async with self.driver.session() as session:
            result = await session.run(query, **params)
            async for record in result:
                yield dict(record)

# 异步使用示例
async def async_example():
    client = AsyncNeo4jClient(URI, AUTH)
    try:
        # 执行查询
        results = await client.execute_query(
            "MATCH (p:Person) RETURN p.name, p.age LIMIT 10"
        )
        print("异步查询结果:", results)

        # 流式处理
        async for record in client.stream_results(
            "MATCH (p:Person) RETURN p.name"
        ):
            print("流式记录:", record)
    finally:
        await client.close()

# 运行异步示例
# asyncio.run(async_example())
```

### 3.6 高级功能

```python
import time
from neo4j import GraphDatabase, ExponentialBackoff, Retryable

class AdvancedNeo4jOperations:
    """高级 Neo4j 操作"""

    def __init__(self, driver):
        self.driver = driver
        self.retry_policy = ExponentialBackoff(
            initial_retry_delay=0.1,
            multiplier=2.0,
            jitter_factor=0.1
        )

    def execute_with_retry(self, query: str, max_retries: int = 3, **params):
        """带重试机制的查询执行"""
        last_exception = None
        for attempt in range(max_retries):
            try:
                with self.driver.session() as session:
                    result = session.run(query, **params)
                    return [dict(record) for record in result]
            except Exception as e:
                if isinstance(e, Retryable) and attempt < max_retries - 1:
                    last_exception = e
                    delay = self.retry_policy.next_delay(attempt)
                    time.sleep(delay)
                    continue
                else:
                    raise e
        raise last_exception

    def explain_query(self, query: str, **params) -> List[Dict]:
        """查询执行计划分析"""
        explain_query = f"EXPLAIN {query}"
        with self.driver.session() as session:
            result = session.run(explain_query, **params)
            return [dict(record) for record in result]

    def profile_query(self, query: str, **params) -> List[Dict]:
        """查询性能分析"""
        profile_query = f"PROFILE {query}"
        with self.driver.session() as session:
            result = session.run(profile_query, **params)
            return [dict(record) for record in result]

    def bulk_import_with_apoc(self, file_path: str, label: str):
        """使用 APOC 插件批量导入"""
        query = f"""
        CALL apoc.import.csv('{file_path}', {{header: true}})
        YIELD map
        CREATE (n:{label} $map)
        RETURN count(n) as imported_count
        """
        with self.driver.session() as session:
            result = session.run(query)
            return result.single()["imported_count"]

    def graph_algorithms(self):
        """图算法示例"""
        with self.driver.session() as session:
            # PageRank 算法
            pagerank_query = """
            CALL gds.pageRank.stream('myGraph')
            YIELD nodeId, score
            RETURN gds.util.asNode(nodeId).name AS name, score
            ORDER BY score DESC
            LIMIT 10
            """
            pagerank_results = session.run(pagerank_query)

            # 社区检测
            community_query = """
            CALL gds.louvain.stream('myGraph')
            YIELD nodeId, communityId
            RETURN communityId, collect(gds.util.asNode(nodeId).name) AS members
            ORDER BY communityId
            """
            community_results = session.run(community_query)

            # 最短路径
            shortest_path_query = """
            CALL gds.shortestPath.dijkstra.stream('myGraph', {
                sourceNode: gds.util.asNode('Person', '张三'),
                targetNode: gds.util.asNode('Person', '李四'),
                relationshipWeightProperty: 'weight'
            })
            YIELD nodeIds, totalCost
            RETURN [gds.util.asNode(id).name for id in nodeIds] AS path, totalCost
            """
            path_results = session.run(shortest_path_query)

            return {
                'pagerank': [dict(r) for r in pagerank_results],
                'communities': [dict(r) for r in community_results],
                'shortest_path': [dict(r) for r in path_results]
            }
```

### 3.7 ORM 风格封装

```python
from dataclasses import dataclass
from typing import ClassVar, TypeVar, Generic, Type
from neo4j import GraphDatabase, Driver

T = TypeVar('T', bound='Neo4jModel')

@dataclass
class Neo4jModel:
    """Neo4j 模型基类"""
    _labels: ClassVar[tuple] = ()
    _driver: ClassVar[Driver] = None

    @classmethod
    def set_driver(cls, driver: Driver):
        """设置数据库驱动"""
        cls._driver = driver

    @classmethod
    def get_label_string(cls) -> str:
        """获取标签字符串"""
        return ':'.join(cls._labels)

    def to_dict(self) -> Dict:
        """转换为字典"""
        return {
            k: v for k, v in self.__dict__.items()
            if not k.startswith('_')
        }

    def create(self) -> Dict:
        """创建节点"""
        labels = self.get_label_string()
        props = ', '.join([f'{k}: ${k}' for k in self.to_dict().keys()])
        query = f"CREATE (n:{labels} {{{props}}) RETURN n"

        with self._driver.session() as session:
            result = session.run(query, **self.to_dict())
            return dict(result.single())

    def save(self) -> Dict:
        """保存节点（MERGE）"""
        labels = self.get_label_string()
        props = self.to_dict()

        # 假设有一个唯一标识符
        id_field = getattr(self, '_id_field', 'id')
        if hasattr(self, id_field):
            query = f"""
            MERGE (n:{labels} {{{id_field}: ${id_field}}})
            SET n += $props
            RETURN n
            """
            with self._driver.session() as session:
                result = session.run(query, id_field=getattr(self, id_field), **props)
                return dict(result.single())

    @classmethod
    def find_by_id(cls: Type[T], value: Any) -> Optional[T]:
        """根据 ID 查找"""
        id_field = getattr(cls, '_id_field', 'id')
        labels = cls.get_label_string()
        query = f"MATCH (n:{labels} {{{id_field}: $value}}) RETURN n"

        with cls._driver.session() as session:
            result = session.run(query, value=value)
            record = result.single()
            if record:
                return cls.from_record(record['n'])
        return None

    @classmethod
    def from_record(cls: Type[T], record) -> T:
        """从 Neo4j 记录创建实例"""
        return cls(**dict(record))

# 使用示例
@dataclass
class Person(Neo4jModel):
    """用户模型"""
    name: str
    age: int
    email: str
    city: str
    _labels: ClassVar[tuple] = ('Person', 'User')
    _id_field: ClassVar[str] = 'email'

# 初始化
driver = GraphDatabase.driver(URI, AUTH=AUTH)
Person.set_driver(driver)

# 创建用户
person = Person(name="张三", age=30, email="zhangsan@example.com", city="北京")
person.create()

# 查找用户
found = Person.find_by_id("zhangsan@example.com")
if found:
    print(f"找到用户: {found.name}")
```

---

## 4. 实战项目案例

### 4.1 社交网络分析系统

```python
from neo4j import GraphDatabase
import networkx as nx
import matplotlib.pyplot as plt
from typing import List, Dict, Tuple

class SocialNetworkAnalyzer:
    """社交网络分析系统"""

    def __init__(self, uri: str, auth: tuple):
        self.driver = GraphDatabase.driver(uri, auth=auth)
        self.graph = None

    def build_network_graph(self, max_nodes: int = 100):
        """构建 NetworkX 图"""
        query = """
        MATCH (p:Person)-[r:FRIENDS_WITH]-(friend:Person)
        RETURN p.name AS source, friend.name AS target, r.strength AS weight
        LIMIT $limit
        """

        with self.driver.session() as session:
            result = session.run(query, limit=max_nodes)
            edges = [
                (record['source'], record['target'], record['weight'])
                for record in result
            ]

        # 创建 NetworkX 图
        self.graph = nx.DiGraph()
        for source, target, weight in edges:
            self.graph.add_edge(source, target, weight=weight)

        return self.graph

    def analyze_network_metrics(self):
        """分析网络指标"""
        if not self.graph:
            self.build_network_graph()

        metrics = {
            'node_count': self.graph.number_of_nodes(),
            'edge_count': self.graph.number_of_edges(),
            'density': nx.density(self.graph),
            'avg_clustering': nx.average_clustering(self.graph.to_undirected()),
            'diameter': nx.diameter(self.graph) if nx.is_connected(self.graph) else None
        }

        # 计算中心性指标
        degree_centrality = nx.degree_centrality(self.graph)
        betweenness_centrality = nx.betweenness_centrality(self.graph)
        closeness_centrality = nx.closeness_centrality(self.graph)

        metrics['top_degree'] = sorted(
            degree_centrality.items(), key=lambda x: x[1], reverse=True
        )[:5]
        metrics['top_betweenness'] = sorted(
            betweenness_centrality.items(), key=lambda x: x[1], reverse=True
        )[:5]

        return metrics

    def detect_communities(self):
        """社区检测"""
        if not self.graph:
            self.build_network_graph()

        # 使用 Louvain 算法检测社区
        import community as community_louvain

        # 转换为无向图
        undirected = self.graph.to_undirected()
        partition = community_louvain.best_partition(undirected)

        # 按社区分组
        communities = {}
        for node, comm_id in partition.items():
            if comm_id not in communities:
                communities[comm_id] = []
            communities[comm_id].append(node)

        return communities

    def visualize_network(self, layout='spring', figsize=(12, 8)):
        """可视化网络图"""
        if not self.graph:
            self.build_network_graph()

        plt.figure(figsize=figsize)

        # 选择布局
        if layout == 'spring':
            pos = nx.spring_layout(self.graph, k=0.5, iterations=50)
        elif layout == 'circular':
            pos = nx.circular_layout(self.graph)
        elif layout == 'random':
            pos = nx.random_layout(self.graph)
        else:
            pos = nx.spring_layout(self.graph)

        # 绘制节点
        node_degree = dict(self.graph.degree())
        node_sizes = [v * 50 for v in node_degree.values()]

        nx.draw_networkx_nodes(
            self.graph, pos,
            node_size=node_sizes,
            node_color='lightblue',
            alpha=0.7
        )

        # 绘制边
        edges = self.graph.edges()
        edge_weights = [self.graph[u][v]['weight'] for u, v in edges]

        nx.draw_networkx_edges(
            self.graph, pos,
            width=[w * 0.5 for w in edge_weights],
            alpha=0.5,
            edge_color='gray'
        )

        # 绘制标签
        nx.draw_networkx_labels(
            self.graph, pos,
            font_size=8,
            font_family='SimHei'
        )

        plt.title("社交网络图", fontsize=14, fontfamily='SimHei')
        plt.axis('off')
        plt.tight_layout()
        plt.show()

    def recommend_friends(self, user_name: str, method: str = 'common_friends'):
        """推荐好友"""
        if method == 'common_friends':
            query = """
            MATCH (u:Person {name: $user})-[:FRIENDS_WITH]-(friend)-[:FRIENDS_WITH]-(potential:Person)
            WHERE NOT (u)-[:FRIENDS_WITH]-(potential) AND u <> potential
            WITH potential, count(DISTINCT friend) AS common_friends_count,
                 collect(DISTINCT friend.name) AS common_friends
            RETURN potential.name AS recommended,
                   common_friends_count,
                   common_friends
            ORDER BY common_friends_count DESC
            LIMIT 5
            """
        elif method == 'preferential_attachment':
            query = """
            MATCH (u:Person {name: $user})
            MATCH (potential:Person)
            WHERE NOT (u)-[:FRIENDS_WITH]-(potential) AND u <> potential
            WITH u, potential,
                 (size((u)-[:FRIENDS_WITH]-())) * (size((potential)-[:FRIENDS_WITH]-())) AS score
            RETURN potential.name AS recommended, score
            ORDER BY score DESC
            LIMIT 5
            """

        with self.driver.session() as session:
            result = session.run(query, user=user_name)
            return [dict(record) for record in result]

# 使用示例
# analyzer = SocialNetworkAnalyzer(URI, AUTH)
# analyzer.build_network_graph()
# metrics = analyzer.analyze_network_metrics()
# print("网络指标:", metrics)
# analyzer.visualize_network()
# recommendations = analyzer.recommend_friends("张三")
# print("推荐好友:", recommendations)
```

### 4.2 知识图谱构建

```python
from neo4j import GraphDatabase
import json
from typing import List, Dict, Any

class KnowledgeGraphBuilder:
    """知识图谱构建器"""

    def __init__(self, uri: str, auth: tuple):
        self.driver = GraphDatabase.driver(uri, auth=auth)

    def create_schema(self):
        """创建知识图谱模式"""
        constraints = [
            # 实体约束
            "CREATE CONSTRAINT entity_id_unique IF NOT EXISTS FOR (e:Entity) REQUIRE e.id IS UNIQUE",
            "CREATE constraint concept_name_unique IF NOT EXISTS FOR (c:Concept) REQUIRE c.name IS UNIQUE",

            # 关系约束
            "CREATE CONSTRAINT relation_id_unique IF NOT EXISTS FOR ()-[r:RELATION]-() REQUIRE r.id IS UNIQUE"
        ]

        indexes = [
            # 实体索引
            "CREATE INDEX entity_type_index IF NOT EXISTS FOR (e:Entity) ON (e.type)",
            "CREATE INDEX entity_name_index IF NOT EXISTS FOR (e:Entity) ON (e.name)",

            # 概念索引
            "CREATE INDEX concept_category_index IF NOT EXISTS FOR (c:Concept) ON (e.category)",

            # 关系索引
            "CREATE INDEX relation_type_index IF NOT EXISTS FOR ()-[r:RELATION]-() ON (r.type)"
        ]

        with self.driver.session() as session:
            for constraint in constraints:
                try:
                    session.run(constraint)
                    print(f"约束创建成功: {constraint}")
                except Exception as e:
                    print(f"约束可能已存在: {e}")

            for index in indexes:
                try:
                    session.run(index)
                    print(f"索引创建成功: {index}")
                except Exception as e:
                    print(f"索引可能已存在: {e}")

    def import_from_json(self, json_file: str):
        """从 JSON 文件导入知识图谱"""
        with open(json_file, 'r', encoding='utf-8') as f:
            data = json.load(f)

        with self.driver.session() as session:
            with session.begin_transaction() as tx:
                try:
                    # 创建实体
                    if 'entities' in data:
                        for entity in data['entities']:
                            tx.run(
                                """
                                MERGE (e:Entity {id: $id})
                                SET e.name = $name,
                                    e.type = $type,
                                    e.properties = $properties
                                """,
                                **entity
                            )

                    # 创建概念
                    if 'concepts' in data:
                        for concept in data['concepts']:
                            tx.run(
                                """
                                MERGE (c:Concept {name: $name})
                                SET c.category = $category,
                                    c.description = $description
                                """,
                                **concept
                            )

                    # 创建关系
                    if 'relations' in data:
                        for relation in data['relations']:
                            # 根据关系类型处理不同的关系
                            if relation.get('type') == 'instanceOf':
                                tx.run(
                                    """
                                    MATCH (e:Entity {id: $source}), (c:Concept {name: $target})
                                    MERGE (e)-[r:INSTANCE_OF]->(c)
                                    SET r.confidence = $confidence
                                    """,
                                    source=relation['source'],
                                    target=relation['target'],
                                    confidence=relation.get('confidence', 1.0)
                                )
                            elif relation.get('type') == 'relatedTo':
                                tx.run(
                                    """
                                    MATCH (e1:Entity {id: $source}), (e2:Entity {id: $target})
                                    MERGE (e1)-[r:RELATED_TO]->(e2)
                                    SET r.relation_type = $relation_type,
                                        r.confidence = $confidence
                                    """,
                                    source=relation['source'],
                                    target=relation['target'],
                                    relation_type=relation.get('relation_type', 'general'),
                                    confidence=relation.get('confidence', 1.0)
                                )

                    tx.commit()
                    print(f"成功从 {json_file} 导入知识图谱数据")
                except Exception as e:
                    tx.rollback()
                    print(f"导入失败: {e}")

    def extract_entities_from_text(self, text: str):
        """从文本中提取实体"""
        # 这里可以集成 NLP 库，如 spaCy
        # 简化示例：基于规则提取
        entities = []

        # 提取人名（简化）
        import re
        person_pattern = r'([A-Z][a-z]+ [A-Z][a-z]+)'
        persons = re.findall(person_pattern, text)
        for person in persons:
            entities.append({
                'id': f"person_{hash(person)}",
                'name': person,
                'type': 'Person',
                'properties': {'source': 'text_extraction'}
            })

        # 提取地点（简化）
        location_pattern = r'\b(Beijing|Shanghai|Guangzhou|Shenzhen)\b'
        locations = re.findall(location_pattern, text)
        for location in locations:
            entities.append({
                'id': f"location_{hash(location)}",
                'name': location,
                'type': 'Location',
                'properties': {'source': 'text_extraction'}
            })

        return entities

    def build_knowledge_from_text(self, texts: List[str]):
        """从文本列表构建知识图谱"""
        with self.driver.session() as session:
            for text in texts:
                # 提取实体
                entities = self.extract_entities_from_text(text)

                # 创建实体
                for entity in entities:
                    session.run(
                        """
                        MERGE (e:Entity {id: $id})
                        SET e.name = $name,
                            e.type = $type,
                            e.properties = $properties
                        """,
                        **entity
                    )

                # 提取实体关系（简化示例）
                words = text.split()
                for i in range(len(words) - 1):
                    word1, word2 = words[i], words[i + 1]
                    if word1.istitle() and word2.istitle():
                        # 可能是两个实体
                        session.run(
                            """
                            MATCH (e1:Entity), (e2:Entity)
                            WHERE e1.name = $name1 AND e2.name = $name2
                            MERGE (e1)-[r:MENTIONED_WITH]->(e2)
                            SET r.context = $context
                            """,
                            name1=word1, name2=word2, context=text
                        )

    def query_knowledge_graph(self, query: str, **params):
        """查询知识图谱"""
        with self.driver.session() as session:
            result = session.run(query, **params)
            return [dict(record) for record in result]

    def get_entity_neighbors(self, entity_id: str, depth: int = 1):
        """获取实体的邻居"""
        query = """
        MATCH (e:Entity {id: $id})-[r*1..$depth]-(neighbor:Entity)
        WHERE e <> neighbor
        RETURN DISTINCT neighbor.name, neighbor.type, labels(neighbor) AS labels
        """
        with self.driver.session() as session:
            result = session.run(query, id=entity_id, depth=depth)
            return [dict(record) for record in result]

    def find_entity_path(self, start_id: str, end_id: str, max_depth: int = 5):
        """查找实体间的路径"""
        query = """
        MATCH path = shortestPath(
            (start:Entity {id: $start})-[*1..$max_depth]-(end:Entity {id: $end})
        )
        RETURN [node in nodes(path) | node.name] AS path_names,
               length(path) AS path_length
        """
        with self.driver.session() as session:
            result = session.run(query, start=start_id, end=end_id, max_depth=max_depth)
            return [dict(record) for record in result]

# 使用示例
# kg_builder = KnowledgeGraphBuilder(URI, AUTH)
# kg_builder.create_schema()
# kg_builder.import_from_json('knowledge_graph_data.json')
#
# texts = [
#     "Alice works in Beijing and knows Bob.",
#     "Bob lives in Shanghai and is friends with Carol.",
#     "Carol is a researcher specializing in AI."
# ]
# kg_builder.build_knowledge_from_text(texts)
#
# neighbors = kg_builder.get_entity_neighbors('person_123')
# print("实体邻居:", neighbors)
```

### 4.3 推荐系统实现

```python
from neo4j import GraphDatabase
import numpy as np
from typing import List, Dict, Tuple
from collections import defaultdict

class RecommendationEngine:
    """基于 Neo4j 的推荐引擎"""

    def __init__(self, uri: str, auth: tuple):
        self.driver = GraphDatabase.driver(uri, auth=auth)

    def collaborative_filtering(self, user_id: str, top_n: int = 10):
        """协同过滤推荐"""
        query = """
        // 找到相似用户
        MATCH (u:User {id: $user_id})-[r:RATED]->(i:Item)<-[r2:RATED]-(u2:User)
        WHERE u <> u2
        WITH u2, sum(r.rating * r2.rating) as dot_product,
             sqrt(sum(r.rating^2)) * sqrt(sum(r2.rating^2)) as norm
        WITH u2, dot_product / norm as similarity
        ORDER BY similarity DESC
        LIMIT 50

        // 基于相似用户的评分推荐
        MATCH (u2)-[r2:RATED]->(i:Item)
        WHERE NOT (u)-[:RATED]->(i)
        WITH i, sum(r2.rating * similarity) as weighted_sum,
             sum(similarity) as similarity_sum
        RETURN i.id AS item_id, i.name AS item_name,
               weighted_sum / similarity_sum AS predicted_rating
        ORDER BY predicted_rating DESC
        LIMIT $top_n
        """

        with self.driver.session() as session:
            result = session.run(query, user_id=user_id, top_n=top_n)
            return [dict(record) for record in result]

    def content_based_filtering(self, user_id: str, top_n: int = 10):
        """基于内容的推荐"""
        query = """
        // 获取用户偏好特征
        MATCH (u:User {id: $user_id})-[r:RATED]->(i:Item)
        WHERE r.rating >= 4  // 只考虑高评分项目
        WITH collect(i.features) AS user_features

        // 基于特征相似性推荐
        MATCH (i:Item)
        WHERE NOT (u)-[:RATED]->(i)
        WITH i, user_features,
             [f IN user_features WHERE f IN i.features] AS common_features
        WHERE size(common_features) > 0
        WITH i, size(common_features) AS similarity_score,
             common_features
        RETURN i.id AS item_id, i.name AS item_name,
               similarity_score, common_features
        ORDER BY similarity_score DESC, i.popularity DESC
        LIMIT $top_n
        """

        with self.driver.session() as session:
            result = session.run(query, user_id=user_id, top_n=top_n)
            return [dict(record) for record in result]

    def hybrid_recommendation(self, user_id: str, top_n: int = 10, cf_weight: float = 0.6):
        """混合推荐算法"""
        # 获取协同过滤推荐
        cf_recs = self.collaborative_filtering(user_id, top_n * 2)

        # 获取基于内容的推荐
        cb_recs = self.content_based_filtering(user_id, top_n * 2)

        # 合并推荐结果
        combined_scores = defaultdict(float)

        # 协同过滤评分加权
        for rec in cf_recs:
            combined_scores[rec['item_id']] += cf_weight * rec['predicted_rating']

        # 基于内容评分加权
        for rec in cb_recs:
            combined_scores[rec['item_id']] += (1 - cf_weight) * (rec['similarity_score'] / 10)

        # 获取最终推荐
        item_ids = sorted(combined_scores.keys(), key=lambda x: combined_scores[x], reverse=True)[:top_n]

        query = """
        UNWIND $item_ids AS item_id
        MATCH (i:Item {id: item_id})
        RETURN i.id, i.name, i.description, i.category
        """

        with self.driver.session() as session:
            result = session.run(query, item_ids=item_ids)
            return [dict(record) for record in result]

    def cold_start_recommendation(self, user_info: Dict, top_n: int = 10):
        """冷启动推荐（针对新用户）"""
        # 基于用户属性推荐热门项目
        query = """
        // 基于用户 demographic 推荐相应类别热门项目
        MATCH (i:Item)
        WHERE i.category IN $categories
        WITH i, i.popularity * 0.7 + i.avg_rating * 0.3 AS score
        RETURN i.id, i.name, i.category, score
        ORDER BY score DESC
        LIMIT $top_n
        """

        with self.driver.session() as session:
            result = session.run(
                query,
                categories=user_info.get('categories', []),
                top_n=top_n
            )
            return [dict(record) for record in result]

    def user_based_recommendation(self, user_id: str, top_n: int = 10):
        """基于用户的推荐"""
        query = """
        // 找到最相似的用户
        MATCH (u:User {id: $user_id})-[r:RATED]->(i:Item)<-[r2:RATED]-(sim_user:User)
        WHERE u <> sim_user
        WITH sim_user,
             gds.similarity.cosine(collect(r.rating), collect(r2.rating)) AS similarity
        ORDER BY similarity DESC
        LIMIT 20

        // 获取相似用户喜欢但目标用户未评分的项目
        MATCH (sim_user)-[r:RATED]->(rec:Item)
        WHERE NOT (u)-[:RATED]->(rec)
        WITH rec, avg(r.rating) * similarity AS weighted_score
        RETURN rec.id AS item_id, rec.name AS item_name, rec.category,
               weighted_score
        ORDER BY weighted_score DESC
        LIMIT $top_n
        """

        with self.driver.session() as session:
            result = session.run(query, user_id=user_id, top_n=top_n)
            return [dict(record) for record in result]

    def item_based_recommendation(self, user_id: str, top_n: int = 10):
        """基于物品的推荐"""
        query = """
        // 获取用户喜欢的项目
        MATCH (u:User {id: $user_id})-[r:RATED]->(liked:Item)
        WHERE r.rating >= 4
        COLLECT liked AS liked_items

        // 找到与喜欢的项目相似的项目
        UNWIND liked_items AS liked_item
        MATCH (liked_item)<-[r:SIMILAR_TO]-(similar_item:Item)
        WHERE NOT (u)-[:RATED]->(similar_item)
        WITH similar_item, sum(r.similarity) as total_similarity,
               avg(similar_item.avg_rating) as avg_rating
        RETURN similar_item.id AS item_id, similar_item.name AS item_name,
               total_similarity, avg_rating
        ORDER BY total_similarity DESC, avg_rating DESC
        LIMIT $top_n
        """

        with self.driver.session() as session:
            result = session.run(query, user_id=user_id, top_n=top_n)
            return [dict(record) for record in result]

    def explain_recommendation(self, user_id: str, item_id: str):
        """解释推荐原因"""
        query = """
        // 找出推荐原因
        MATCH (u:User {id: $user_id})-[r:RATED]->(pref:Item)
        MATCH (pref)-[s:SIMILAR_TO]->(rec:Item {id: $item_id})
        WHERE r.rating >= 4
        RETURN '你喜欢的' + pref.name + '与' + rec.name + '相似' AS reason,
               s.similarity AS confidence

        UNION

        // 找出共同喜欢的用户
        MATCH (u:User {id: $user_id})-[r1:RATED]->(i:Item)<-[r2:RATED]-(similar:User)
        MATCH (similar)-[r3:RATED]->(rec:Item {id: $item_id})
        WHERE r1.rating >= 4 AND r3.rating >= 4
        RETURN '和你喜好相似的用户也喜欢这个' AS reason,
               0.8 AS confidence

        UNION

        // 基于内容特征
        MATCH (u:User {id: $user_id})-[r:RATED]->(pref:Item)
        WHERE r.rating >= 4
        MATCH (rec:Item {id: $item_id})
        WHERE pref.category = rec.category
        RETURN '你喜欢' + pref.category + '类别的项目' AS reason,
               0.6 AS confidence
        """

        with self.driver.session() as session:
            result = session.run(query, user_id=user_id, item_id=item_id)
            return [dict(record) for record in result]

    def evaluate_recommendations(self, user_id: str, test_size: int = 20):
        """评估推荐系统性能"""
        # 获取测试数据
        query = """
        MATCH (u:User {id: $user_id})-[r:RATED]->(i:Item)
        RETURN i.id, r.rating
        ORDER BY r.timestamp DESC
        SKIP $skip LIMIT $limit
        """

        with self.driver.session() as session:
            # 获取测试集
            test_result = session.run(query, user_id=user_id, skip=0, limit=test_size)
            test_data = [(record['i.id'], record['r.rating']) for record in test_result]

            # 获取训练集
            train_result = session.run(query, user_id=user_id, skip=test_size, limit=100)
            train_data = [(record['i.id'], record['r.rating']) for record in train_result]

            # 获取推荐
            recommendations = self.collaborative_filtering(user_id, test_size)
            recommended_items = [rec['item_id'] for rec in recommendations]

            # 计算指标
            test_items = [item_id for item_id, rating in test_data if rating >= 4]

            # Precision@K
            precision = len(set(test_items) & set(recommended_items)) / len(recommended_items)

            # Recall@K
            recall = len(set(test_items) & set(recommended_items)) / len(test_items)

            # F1 Score
            f1 = 2 * (precision * recall) / (precision + recall)

            return {
                'precision': precision,
                'recall': recall,
                'f1_score': f1,
                'recommended_count': len(recommended_items),
                'relevant_count': len(test_items)
            }

# 使用示例
# recommender = RecommendationEngine(URI, AUTH)
#
# # 协同过滤推荐
# cf_recs = recommender.collaborative_filtering('user1')
# print("协同过滤推荐:", cf_recs)
#
# # 混合推荐
# hybrid_recs = recommender.hybrid_recommendation('user1')
# print("混合推荐:", hybrid_recs)
#
# # 推荐解释
# explanation = recommender.explain_recommendation('user1', 'item123')
# print("推荐原因:", explanation)
#
# # 评估性能
# metrics = recommender.evaluate_recommendations('user1')
# print("评估指标:", metrics)
```

---

## 5. 性能优化与最佳实践

### 5.1 索引优化

```python
class IndexManager:
    """索引管理器"""

    def __init__(self, driver):
        self.driver = driver

    def create_optimal_indexes(self):
        """创建最优索引"""
        indexes = [
            # 单属性索引
            "CREATE INDEX user_email_index IF NOT EXISTS FOR (u:User) ON (u.email)",
            "CREATE INDEX product_category_index IF NOT EXISTS FOR (p:Product) ON (p.category)",
            "CREATE INDEX post_timestamp_index IF NOT EXISTS FOR (p:Post) ON (p.timestamp)",

            # 复合索引
            "CREATE INDEX user_city_age_index IF NOT EXISTS FOR (u:User) ON (u.city, u.age)",
            "CREATE INDEX product_category_price_index IF NOT EXISTS FOR (p:Product) ON (p.category, p.price)",

            # 文本索引（Neo4j 5.x+）
            "CREATE FULLTEXT INDEX product_name_index IF NOT EXISTS FOR (p:Product) ON EACH [p.name, p.description]",
            "CREATE FULLTEXT INDEX post_content_index IF NOT EXISTS FOR (p:Post) ON EACH [p.title, p.content]",
        ]

        with self.driver.session() as session:
            for idx_query in indexes:
                try:
                    result = session.run(idx_query)
                    print(f"索引创建成功: {result.consume().query}")
                except Exception as e:
                    print(f"索引创建失败: {e}")

    def analyze_index_usage(self):
        """分析索引使用情况"""
        query = """
        CALL db.indexes()
        YIELD name, state, type, entityType, properties
        RETURN name, state, type, entityType, properties
        """

        with self.driver.session() as session:
            result = session.run(query)
            print("当前索引:")
            for record in result:
                print(f"  {record['name']}")
                print(f"    状态: {record['state']}")
                print(f"    类型: {record['type']}")
                print(f"    标签: {record['entityType']}")
                print(f"    属性: {record['properties']}")

    def suggest_missing_indexes(self):
        """建议缺失的索引"""
        # 查询分析器会建议创建索引的查询
        query = """
        CALL db.queryPlan.explain(
            'MATCH (p:Person) WHERE p.name = $name RETURN p'
        )
        YIELD plan
        RETURN plan
        """

        with self.driver.session() as session:
            result = session.run(query)
            for record in result:
                print("查询计划:", record)
```

### 5.2 查询优化技巧

```python
class QueryOptimizer:
    """查询优化器"""

    def __init__(self, driver):
        self.driver = driver

    def optimize_query_examples(self):
        """查询优化示例"""

        # 1. 避免笛卡尔积
        bad_query = """
        MATCH (a:Person), (b:Person)
        WHERE a.city = b.city AND a <> b
        """

        good_query = """
        MATCH (a:Person)
        MATCH (b:Person)
        WHERE a.city = b.city AND a <> b
        """

        # 2. 使用 EXISTS 代替 OPTIONAL MATCH
        bad_query = """
        MATCH (p:Person)
        OPTIONAL MATCH (p)-[:HAS_EMAIL]->()
        WHERE p.email IS NOT NULL
        """

        good_query = """
        MATCH (p:Person)
        WHERE EXISTS((p)-[:HAS_EMAIL]->())
        """

        # 3. 使用 LIMIT 限制结果
        optimized_query = """
        MATCH (p:Person)
        WHERE p.age > $age
        RETURN p.name, p.age
        LIMIT $limit
        """

        with self.driver.session() as session:
            result = session.run(optimized_query, age=25, limit=100)
            print("优化查询结果:", len(list(result)))

    def batch_operation_strategies(self):
        """批量操作策略"""

        # 1. 使用 UNWIND 进行批量插入
        batch_insert = """
        UNWIND $batch AS data
        CREATE (n:Node {
            id: data.id,
            name: data.name,
            properties: data.properties
        })
        """

        # 2. 使用 PERIODIC COMMIT 处理大量数据
        periodic_commit = """
        USING PERIODIC COMMIT 1000
        LOAD CSV WITH HEADERS FROM 'file:///large_data.csv' AS row
        CREATE (n:Node {id: row.id, name: row.name})
        """

        # 3. 使用 apoc.periodic.iterate 批量更新
        batch_update = """
        CALL apoc.periodic.iterate(
          'MATCH (n:Node) WHERE n.status = "pending" RETURN n',
          'SET n.processed = true, n.timestamp = timestamp()',
          {batchSize:1000, parallel:true}
        )
        """

        return batch_insert, periodic_commit, batch_update

    def memory_efficient_processing(self):
        """内存高效处理"""

        # 1. 流式处理大数据集
        def process_large_dataset():
            with self.driver.session() as session:
                result = session.run("MATCH (n:LargeNode) RETURN n.id")

                batch_size = 1000
                batch = []

                for record in result:
                    batch.append(record['n.id'])
                    if len(batch) >= batch_size:
                        # 处理批次
                        self.process_batch(batch)
                        batch = []

                # 处理最后一批
                if batch:
                    self.process_batch(batch)

        # 2. 使用 SKIP 和 LIMIT 实现分页
        def paginated_query(page: int, page_size: int):
            query = """
            MATCH (n:Node)
            RETURN n
            ORDER BY n.id
            SKIP $skip LIMIT $limit
            """
            with self.driver.session() as session:
                return session.run(
                    query,
                    skip=page * page_size,
                    limit=page_size
                )

        return process_large_dataset, paginated_query
```

### 5.3 监控和诊断

```python
import time
from contextlib import contextmanager
from neo4j import GraphDatabase, Query, Result

class PerformanceMonitor:
    """性能监控器"""

    def __init__(self, driver):
        self.driver = driver
        self.query_times = []

    @contextmanager
    def monitor_query(self, query: str):
        """监控查询执行时间"""
        start_time = time.time()
        try:
            with self.driver.session() as session:
                result = session.run(query)
                yield result
        finally:
            end_time = time.time()
            execution_time = end_time - start_time
            self.query_times.append({
                'query': query[:100] + '...' if len(query) > 100 else query,
                'time': execution_time,
                'timestamp': time.time()
            })

    def get_slow_queries(self, threshold: float = 1.0):
        """获取慢查询"""
        return [q for q in self.query_times if q['time'] > threshold]

    def analyze_query_performance(self):
        """分析查询性能"""
        if not self.query_times:
            return None

        times = [q['time'] for q in self.query_times]
        return {
            'total_queries': len(times),
            'avg_time': sum(times) / len(times),
            'min_time': min(times),
            'max_time': max(times),
            'total_time': sum(times)
        }

    def profile_query(self, query: str, **params):
        """分析查询性能"""
        with self.driver.session() as session:
            # 使用 PROFILE 获取详细性能信息
            profile_result = session.run(f"PROFILE {query}", **params)

            # 使用 EXPLAIN 获取执行计划
            explain_result = session.run(f"EXPLAIN {query}", **params)

            return {
                'profile': [dict(r) for r in profile_result],
                'explain': [dict(r) for r in explain_result]
            }

class Neo4jHealthChecker:
    """Neo4j 健康检查器"""

    def __init__(self, driver):
        self.driver = driver

    def check_connection(self):
        """检查连接"""
        try:
            with self.driver.session() as session:
                result = session.run("RETURN 1")
                return result.single()[0] == 1
        except:
            return False

    def get_database_info(self):
        """获取数据库信息"""
        with self.driver.session() as session:
            # 数据库版本
            version = session.run("CALL dbms.components() YIELD versions RETURN versions[0] as version")

            # 节点统计
            nodes = session.run("MATCH (n) RETURN count(n) as count")

            # 关系统计
            relationships = session.run("MATCH ()-[r]-() RETURN count(r) as count")

            return {
                'version': version.single()['version'],
                'node_count': nodes.single()['count'],
                'relationship_count': relationships.single()['count']
            }

    def check_indexes_health(self):
        """检查索引健康状态"""
        with self.driver.session() as session:
            result = session.run("SHOW INDEXES YIELD name, state, type RETURN name, state, type")
            return [dict(r) for r in result]

    def check_memory_usage(self):
        """检查内存使用"""
        with self.driver.session() as session:
            # 获取 JVM 内存信息（需要管理员权限）
            try:
                result = session.run("CALL dbms.queryJmx('java.lang:type=Memory') RETURN HeapMemoryUsage")
                return [dict(r) for r in result]
            except:
                return {"error": "需要管理员权限"}

    def full_health_check(self):
        """完整健康检查"""
        health_status = {
            'connection': self.check_connection(),
            'database_info': self.get_database_info(),
            'indexes': self.check_indexes_health(),
            'memory': self.check_memory_usage()
        }

        health_status['overall_status'] = (
            'healthy' if health_status['connection'] and
            health_status['database_info']['node_count'] > 0 else 'unhealthy'
        )

        return health_status

# 使用示例
# monitor = PerformanceMonitor(driver)
#
# with monitor.monitor_query("MATCH (n:Person) RETURN count(n)") as result:
#     print(result.single())
#
# slow_queries = monitor.get_slow_queries(threshold=0.5)
# print("慢查询:", slow_queries)
#
# performance_stats = monitor.analyze_query_performance()
# print("性能统计:", performance_stats)
#
# health_checker = Neo4jHealthChecker(driver)
# health = health_checker.full_health_check()
# print("健康检查:", health)
```

### 5.4 缓存策略

```python
from functools import lru_cache
import hashlib
import json

class Neo4jCache:
    """Neo4j 查询缓存"""

    def __init__(self, driver, cache_size=128):
        self.driver = driver
        self.cache = {}
        self.cache_size = cache_size

    def _cache_key(self, query: str, params: Dict) -> str:
        """生成缓存键"""
        key_data = {
            'query': query,
            'params': sorted(params.items())
        }
        return hashlib.md5(json.dumps(key_data, sort_keys=True).encode()).hexdigest()

    def execute_cached_query(self, query: str, params: Dict = None, ttl: int = 3600):
        """执行缓存查询"""
        cache_key = self._cache_key(query, params or {})

        # 检查缓存
        if cache_key in self.cache:
            cached_data = self.cache[cache_key]
            if time.time() - cached_data['timestamp'] < cached_data['ttl']:
                return cached_data['result']

        # 执行查询
        with self.driver.session() as session:
            result = session.run(query, **(params or {}))
            data = [dict(record) for record in result]

        # 存储到缓存
        if len(self.cache) >= self.cache_size:
            # 移除最旧的缓存项
            oldest_key = min(self.cache.keys(), key=lambda k: self.cache[k]['timestamp'])
            del self.cache[oldest_key]

        self.cache[cache_key] = {
            'result': data,
            'timestamp': time.time(),
            'ttl': ttl
        }

        return data

    def clear_cache(self):
        """清除缓存"""
        self.cache.clear()

    def get_cache_stats(self):
        """获取缓存统计"""
        total_items = len(self.cache)
        expired_items = sum(
            1 for item in self.cache.values()
            if time.time() - item['timestamp'] > item['ttl']
        )

        return {
            'total_items': total_items,
            'expired_items': expired_items,
            'hit_rate': getattr(self, '_hits', 0) / (getattr(self, '_hits', 0) + getattr(self, '_misses', 0))
        }

# 使用缓存装饰器
def cached_neo4j_query(ttl: int = 3600):
    """Neo4j 查询缓存装饰器"""
    def decorator(func):
        @lru_cache(maxsize=128)
        def wrapper(*args, **kwargs):
            # 这里应该包含实际的查询逻辑
            result = func(*args, **kwargs)
            return result
        return wrapper
    return decorator

# Redis 缓存集成示例
class RedisNeo4jCache:
    """Redis 缓存的 Neo4j 查询"""

    def __init__(self, driver, redis_client):
        self.driver = driver
        self.redis = redis_client

    def execute_with_redis_cache(self, query: str, params: Dict = None, ttl: int = 3600):
        """使用 Redis 缓存的查询"""
        cache_key = self._generate_cache_key(query, params or {})

        # 尝试从 Redis 获取
        cached_result = self.redis.get(cache_key)
        if cached_result:
            return json.loads(cached_result)

        # 执行查询
        with self.driver.session() as session:
            result = session.run(query, **(params or {}))
            data = [dict(record) for record in result]

        # 存储到 Redis
        self.redis.setex(cache_key, ttl, json.dumps(data))

        return data
```

### 5.5 最佳实践总结

```python
# Neo4j 最佳实践总结
BEST_PRACTICES = {
    "数据建模": [
        "为频繁查询的属性创建索引",
        "使用合适的标签组织数据",
        "避免过深的节点嵌套",
        "合理使用关系类型"
    ],

    "查询优化": [
        "使用参数化查询防止注入",
        "避免笛卡尔积",
        "使用 LIMIT 限制结果集",
        "合理使用 OPTIONAL MATCH 和 EXISTS",
        "批量操作使用 UNWIND"
    ],

    "性能优化": [
        "监控慢查询",
        "使用连接池",
        "合理设置事务边界",
        "使用批量操作",
        "定期清理不需要的数据"
    ],

    "开发实践": [
        "使用连接管理器",
        "实现重试机制",
        "添加适当的错误处理",
        "记录查询日志",
        "使用单元测试验证查询"
    ],

    "运维管理": [
        "定期备份数据",
        "监控数据库健康状态",
        "及时更新到稳定版本",
        "配置适当的内存设置",
        "启用查询日志"
    ]
}

# 错误处理最佳实践
class Neo4jErrorHandler:
    """Neo4j 错误处理"""

    def __init__(self, driver):
        self.driver = driver

    def safe_execute_query(self, query: str, params: Dict = None, max_retries: int = 3):
        """安全执行查询（带重试）"""
        from neo4j.exceptions import ServiceUnavailable, TransientError

        for attempt in range(max_retries):
            try:
                with self.driver.session() as session:
                    result = session.run(query, **(params or {}))
                    return [dict(record) for record in result]
            except (ServiceUnavailable, TransientError) as e:
                if attempt == max_retries - 1:
                    raise
                time.sleep(2 ** attempt)  # 指数退避
            except Exception as e:
                # 记录错误
                self.log_error(query, params, e)
                raise

    def log_error(self, query: str, params: Dict, error: Exception):
        """记录错误日志"""
        error_log = {
            'timestamp': time.time(),
            'query': query,
            'params': params,
            'error': str(error),
            'error_type': type(error).__name__
        }

        # 这里可以集成日志系统
        print(f"Neo4j Error: {error_log}")

        # 或者写入日志文件
        import logging
        logging.error("Neo4j query failed", exc_info=True, extra=error_log)
```

---

## 总结

本教程涵盖了 Neo4j 和 Python 整合的方方面面：

1. **基础概念**：理解图数据库的核心概念和数据模型
2. **Cypher 语言**：掌握从基础到高级的所有查询语法
3. **Python 整合**：学习各种连接方式、会话管理和事务处理
4. **实战案例**：通过社交网络、知识图谱和推荐系统等案例深入理解
5. **性能优化**：掌握索引优化、查询优化、缓存策略等最佳实践

### 学习建议

1. **循序渐进**：从基础概念开始，逐步深入到高级功能
2. **实践为主**：多动手写代码，尝试不同的查询和操作
3. **性能意识**：始终考虑查询性能和数据模型设计
4. **持续学习**：关注 Neo4j 新版本特性和最佳实践更新

### 进阶方向

- 深入学习图算法（PageRank、社区检测、路径算法等）
- 掌握 Neo4j 的高级特性（APOC 插件、图数据科学库等）
- 学习分布式图数据库和大数据处理
- 探索 Neo4j 在特定领域的应用（金融、医疗、社交网络等）

希望这个教程能帮助你成为 Neo4j 专家！
