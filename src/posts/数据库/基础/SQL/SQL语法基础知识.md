---
icon: pen-to-square
date: 2024-11-21
category:
- 后端
tag:
- 数据库
---
# SQL语法基础知识

---

## **1. 基本概念**

### **数据库术语**
1. **数据库（Database）**：存储有组织的数据集合。
2. **数据库管理系统（DBMS）**：用于创建、管理和操作数据库的软件系统（如 MySQL、PostgreSQL）。
3. **数据库系统（DBS）**：由数据库、DBMS、应用程序和数据库管理员（DBA）组成的整体系统。
4. **数据库管理员（DBA）**：负责数据库设计、实施、维护和安全的专业人员。

---

## **2. SQL 语法**

### **SQL 的分类**
SQL 语言分为以下几类：
1. **DDL（数据定义语言）**：定义数据库结构。
    - 创建表、视图、索引：`CREATE`
    - 修改表结构：`ALTER`
    - 删除表、视图等：`DROP`

2. **DML（数据操作语言）**：操作数据。
    - 插入：`INSERT`
    - 修改：`UPDATE`
    - 删除：`DELETE`

3. **DQL（数据查询语言）**：查询数据。
    - 查询：`SELECT`

4. **DCL（数据控制语言）**：权限控制。
    - 授权：`GRANT`
    - 撤销权限：`REVOKE`

---

### **增删改查操作**

#### **插入数据（INSERT）**
```sql
INSERT INTO 表名 (列1, 列2, ...) VALUES (值1, 值2, ...);
```

#### **更新数据（UPDATE）**
```sql
UPDATE 表名 SET 列1 = 值1, 列2 = 值2 WHERE 条件;
```

#### **删除数据（DELETE）**
```sql
DELETE FROM 表名 WHERE 条件;
```

#### **查询数据（SELECT）**
```sql
SELECT 列1, 列2 FROM 表名 WHERE 条件;
```

---

### **其他常用操作**

#### **排序（ORDER BY）**
```sql
SELECT 列1, 列2 FROM 表名 ORDER BY 列名 ASC|DESC;
```

#### **分组（GROUP BY）**
```sql
SELECT 列名, 聚合函数 FROM 表名 GROUP BY 列名;
```

#### **子查询**
```sql
SELECT 列名 FROM 表名 WHERE 列名 IN (SELECT 列名 FROM 表名2);
```

#### **连接（JOIN）**
```sql
SELECT * FROM 表1 INNER JOIN 表2 ON 表1.列名 = 表2.列名;
```

#### **组合（UNION）**
```sql
SELECT 列名 FROM 表1 UNION SELECT 列名 FROM 表2;
```

---

## **3. 数据定义与操作**

### **创建与管理数据库**
```sql
CREATE DATABASE 数据库名;
DROP DATABASE 数据库名;
```

### **创建与管理表**
```sql
CREATE TABLE 表名 (
  列1 数据类型,
  列2 数据类型,
  ...
);
```

### **视图**
- **创建视图**：
```sql
CREATE VIEW 视图名 AS SELECT 列名 FROM 表名 WHERE 条件;
```

### **索引**
- **创建索引**：
```sql
CREATE INDEX 索引名 ON 表名 (列名);
```

---

## **4. 事务处理**

### **事务的四大特性（ACID）**
1. **原子性**：事务的所有操作要么全部成功，要么全部失败。
2. **一致性**：事务完成后，数据库必须处于一致的状态。
3. **隔离性**：并发事务互不干扰。
4. **持久性**：事务完成后，其结果永久存储。

### **事务控制**
```sql
START TRANSACTION; -- 开始事务
COMMIT;            -- 提交事务
ROLLBACK;          -- 回滚事务
```

---

## **5. 权限管理**

### **用户与权限**
1. **创建账户**：
   ```sql
   CREATE USER '用户名'@'主机' IDENTIFIED BY '密码';
   ```
2. **删除账户**：
   ```sql
   DROP USER '用户名'@'主机';
   ```
3. **授予权限**：
   ```sql
   GRANT 权限 ON 数据库.* TO '用户名'@'主机';
   ```
4. **查看权限**：
   ```sql
   SHOW GRANTS FOR '用户名'@'主机';
   ```
5. **撤销权限**：
   ```sql
   REVOKE 权限 ON 数据库.* FROM '用户名'@'主机';
   ```

---

## **6. 存储过程**

### **创建存储过程**
```sql
CREATE PROCEDURE 存储过程名 (参数列表)
BEGIN
    -- SQL 语句
END;
```

### **调用存储过程**
```sql
CALL 存储过程名 (参数值);
```

---

## **7. 游标**

游标用于处理多行结果集。

### **定义游标**
```sql
DECLARE 游标名 CURSOR FOR 查询语句;
```

### **使用游标**
```sql
OPEN 游标名;
FETCH 游标名 INTO 变量;
CLOSE 游标名;
```

---

## **8. 触发器**

触发器是在特定表的插入、更新或删除操作时自动执行的 SQL 代码。

### **创建触发器**
```sql
CREATE TRIGGER 触发器名
{BEFORE|AFTER} {INSERT|UPDATE|DELETE}
ON 表名 FOR EACH ROW
BEGIN
    -- 触发器逻辑
END;
```

### **查看触发器**
```sql
SHOW TRIGGERS;
```

### **删除触发器**
```sql
DROP TRIGGER 触发器名;
```

---

## **重点面试问答**

### **1. SQL 中事务的作用？**
事务保证数据的完整性和一致性，尤其在并发场景下，隔离性和原子性是关键。

### **2. 什么是外键？优缺点是什么？**
- 外键用于建立表之间的关系，保证数据一致性。
- 优点：约束关系，防止错误数据。
- 缺点：影响性能，复杂场景中需谨慎使用。

### **3. 如何优化 SQL 查询性能？**
1. 使用索引。
2. 避免 `SELECT *`。
3. 优化查询条件，减少嵌套查询。

---

