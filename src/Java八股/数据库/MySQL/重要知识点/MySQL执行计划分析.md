---
icon: pen-to-square
date: 2024-11-23
category:
- 后端
tag:
- MySQL
- 数据库
---
# MySQL执行计划分析


---

## **1. 什么是执行计划？**

执行计划是 MySQL 对 SQL 查询生成的执行方案，展示了查询过程的每一步。通过分析执行计划，可以优化查询性能。

- **作用**：
    - 判断是否使用了索引。
    - 分析查询的扫描范围。
    - 评估查询效率。

---

## **2. 如何获取执行计划？**

在 MySQL 中，通过 `EXPLAIN` 查看执行计划。

- **使用方法**：
  ```sql
  EXPLAIN SELECT * FROM users WHERE id = 1;
  ```
- 返回的结果包括以下字段：`id`、`select_type`、`table`、`type`、`possible_keys`、`key`、`key_len`、`rows`、`Extra` 等。

---

## **3. 如何分析 EXPLAIN 结果？**

以下是 `EXPLAIN` 输出的各字段解析：

### **3.1 id**
- 表示查询的执行顺序。
- 数值越大优先级越高。
- **常见值**：
    - **1**：单个查询或主查询。
    - **>1**：子查询或联合查询中，子查询的 `id` 大于主查询。

**示例：**
```sql
EXPLAIN SELECT * FROM users WHERE id = 1;
```
| id | select_type | table | type | ... |
|----|-------------|-------|------|-----|
|  1 | SIMPLE      | users | ...  | ... |

---

### **3.2 select_type**
表示查询的类型。

- **常见类型**：
    1. **SIMPLE**：简单查询，没有子查询或 UNION。
    2. **PRIMARY**：主查询（若存在子查询）。
    3. **SUBQUERY**：子查询。
    4. **DERIVED**：派生表（子查询或临时表）。
    5. **UNION**：UNION 中的第二个或后续查询。

---

### **3.3 table**
表示查询涉及的表名或别名。

**示例：**
```sql
EXPLAIN SELECT * FROM users u JOIN orders o ON u.id = o.user_id;
```
| id | select_type | table  | type | ... |
|----|-------------|--------|------|-----|
|  1 | SIMPLE      | users  | ...  | ... |
|  1 | SIMPLE      | orders | ...  | ... |

---

### **3.4 type（重要）**
表示表的访问方式（查询效率）。

- **常见类型（从好到差）**：
    1. **system**：表仅有一行（系统表），效率最高。
    2. **const**：通过主键或唯一索引查询，返回最多一行。
    3. **eq_ref**：使用主键或唯一索引的关联查询。
    4. **ref**：普通索引的非唯一查询。
    5. **range**：索引范围扫描。
    6. **index**：全索引扫描（覆盖索引）。
    7. **ALL**：全表扫描，效率最低。

**示例：**
```sql
EXPLAIN SELECT * FROM users WHERE id = 1;
```
| id | select_type | table | type  | ... |
|----|-------------|-------|-------|-----|
|  1 | SIMPLE      | users | const | ... |

---

### **3.5 possible_keys**
表示查询时可能使用的索引。

- 如果为空，说明没有可用的索引。

**优化建议**：
- 创建合适的索引，提高查询效率。

---

### **3.6 key（重要）**
表示实际使用的索引。

- 如果为空，说明查询没有使用索引。

**示例**：
```sql
EXPLAIN SELECT * FROM users WHERE id = 1;
```
| id | select_type | table | type  | possible_keys | key    | ... |
|----|-------------|-------|-------|---------------|--------|-----|
|  1 | SIMPLE      | users | const | PRIMARY       | PRIMARY| ... |

---

### **3.7 key_len**
表示 MySQL 使用的索引长度（字节数）。

- **用途**：判断索引使用是否合理。
- **注意**：`key_len` 值越小，表示索引利用效率越高。

**示例**：
```sql
EXPLAIN SELECT * FROM users WHERE name = 'John' AND age = 25;
```
| id | select_type | table | type  | possible_keys | key      | key_len | ... |
|----|-------------|-------|-------|---------------|----------|---------|-----|
|  1 | SIMPLE      | users | ref   | idx_name_age  | idx_name | 20      | ... |

- 这里 `key_len = 20` 可能表示索引仅使用了 `name` 字段，而忽略了联合索引的 `age` 字段。

---

### **3.8 rows**
表示 MySQL 估算需要扫描的行数。

- **用途**：评估查询的代价。
- **优化建议**：降低 `rows` 值，通过索引减少扫描范围。

---

### **3.9 Extra（重要）**
描述查询的额外信息。

- **常见值**：
    1. **Using where**：
        - 查询使用了 `WHERE` 条件进行过滤。
    2. **Using index**：
        - 查询使用覆盖索引，无需回表。
    3. **Using temporary**：
        - 查询使用了临时表（如 `GROUP BY`、`ORDER BY`）。
    4. **Using filesort**：
        - 查询需要额外的排序操作。
    5. **Using join buffer**：
        - 关联查询时需要使用内存缓冲。

**示例**：
```sql
EXPLAIN SELECT * FROM users WHERE name = 'John' ORDER BY age;
```
| id | select_type | table | type | Extra               |
|----|-------------|-------|------|---------------------|
|  1 | SIMPLE      | users | ALL  | Using where; filesort |

- 优化建议：
    - 避免 **Using temporary** 和 **Using filesort**，可通过索引优化排序和分组操作。

---

## **4. 综合示例分析**

**示例 SQL：**
```sql
EXPLAIN SELECT * FROM orders o 
JOIN users u ON o.user_id = u.id 
WHERE u.name = 'John' AND o.amount > 1000;
```

**执行计划：**
| id | select_type | table  | type  | possible_keys | key      | key_len | rows | Extra                    |
|----|-------------|--------|-------|---------------|----------|---------|------|--------------------------|
|  1 | SIMPLE      | u      | ref   | idx_name      | idx_name | 20      | 10   | Using where              |
|  1 | SIMPLE      | o      | ref   | idx_user_id   | idx_user | 4       | 100  | Using where; Using index |

**分析：**
1. **users 表（u）**：
    - 使用了 `idx_name` 索引，扫描约 10 行。
    - 执行了 `WHERE` 条件过滤。

2. **orders 表（o）**：
    - 使用了 `idx_user` 索引，扫描约 100 行。
    - 查询完全利用了索引，无需回表。

**优化建议**：
- 该查询已合理使用索引，无需额外优化。

---

## **5. 总结**

1. **重点字段**：
    - **type**：衡量查询效率，`ALL`（全表扫描）需重点优化。
    - **key**：检查实际使用的索引。
    - **rows**：评估查询代价，行数越少越优。
    - **Extra**：避免 `Using temporary` 和 `Using filesort`。

2. **优化手段**：
    - 创建合适的索引，提高 `type` 等级。
    - 使用覆盖索引，减少回表操作。
    - 优化查询语句，避免不必要的排序和分组。

