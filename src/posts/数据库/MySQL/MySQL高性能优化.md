---
icon: pen-to-square
date: 2024-11-22
category:
- 后端
tag:
- MySQL
- 数据库
---
# MySQL高性能优化


---

## **1. 数据库命名规范**

### **1.1 基础命名规则**
1. **数据库名称**：清晰表达业务含义，禁止使用拼音或缩写。
    - 示例：`user_management`（用户管理数据库）

2. **表名称**：采用小写字母 + 下划线命名，必须能表达数据内容。
    - 示例：`user_info`（用户信息表），`order_details`（订单详情表）

3. **字段名称**：小写字母命名，避免缩写或拼音，需简洁且易懂。
    - 示例：`created_at`（创建时间字段），`order_id`（订单 ID）

4. **索引名称**：以 `idx_` 开头，后跟表名和字段名。
    - 示例：`idx_user_email`（表示 `user_info` 表上的 `email` 字段索引）

5. **约束名称**：使用前缀标明类型：
    - `pk_` 表示主键（Primary Key）
    - `fk_` 表示外键（Foreign Key）
    - 示例：`pk_user_id`，`fk_order_user_id`

**核心点：**命名清晰，方便维护，避免冲突。

---

## **2. 数据库基本设计规范**

### **2.1 存储引擎与字符集**
1. **存储引擎**：所有表必须使用 InnoDB。
    - **原因**：支持事务、行级锁、高并发，性能优越。
    - 示例：
      ```sql
      CREATE TABLE user_info (
          user_id INT PRIMARY KEY,
          username VARCHAR(50)
      ) ENGINE=InnoDB;
      ```

2. **字符集**：统一使用 UTF8 或 UTF8MB4。
    - **原因**：支持多语言字符，避免乱码问题。

---

### **2.2 表和字段设计规范**
1. **字段注释**：所有表和字段必须添加注释，方便维护和理解。
    - 示例：
      ```sql
      CREATE TABLE user_info (
          user_id INT COMMENT '用户ID',
          username VARCHAR(50) COMMENT '用户名'
      ) COMMENT='用户信息表';
      ```

2. **单表大小控制**：建议单表数据量不超过 500 万行，避免性能问题。
    - **解决方案**：数据量大时，可使用分表或分库。

3. **禁止存储大文件**：
    - **原因**：大文件（如图片、视频）会占用大量空间，降低性能。
    - **解决方案**：将文件存储在对象存储中（如 OSS），数据库仅存路径。

4. **范式与反范式**：
    - 遵循第三范式（避免冗余数据）。
    - 适当反范式化以提高查询性能，例如将经常查询的数据存储在同一张表中。

5. **禁止在线上直接压力测试**：
    - **原因**：可能导致服务宕机，应在测试环境进行。

---

## **3. 数据库字段设计规范**

### **3.1 数据类型的选择**
1. **选择最小数据类型**：
    - 用 `TINYINT` 替代 `INT`，节省存储空间。
    - 示例：性别字段可以用 `TINYINT`（0 表示男，1 表示女）。

2. **禁止使用 TEXT/BLOB**：
    - **原因**：存储性能差，查询效率低。
    - **替代方案**：用 `VARCHAR` 代替 `TEXT`。

3. **金额使用 DECIMAL 类型**：
    - **原因**：FLOAT/DOUBLE 有精度问题。
    - 示例：
      ```sql
      amount DECIMAL(10, 2) COMMENT '金额，精确到小数点后两位';
      ```

4. **字段默认值和 NULL**：
    - 避免字段为 NULL，需设置合理的默认值。
    - **原因**：NULL 会影响索引性能。

---

## **4. 索引设计规范**

### **4.1 索引数量**
1. 每张表索引数量建议不超过 5 个。
    - **原因**：索引过多会影响写入性能。

2. **每张表必须有主键**：
    - 使用自增字段作为主键，避免业务字段（如身份证号）作为主键。

3. **避免重复索引和冗余索引**：
    - 示例：
      ```sql
      -- 冗余索引，idx_username 包含 idx_user
      CREATE INDEX idx_user ON user_info (user);
      CREATE INDEX idx_username ON user_info (user, name);
      ```

4. **覆盖索引优先**：
    - 覆盖索引能避免回表查询，提高性能。
    - 示例：
      ```sql
      SELECT user_id, username FROM user_info
      WHERE username = 'john'; -- 索引字段即查询字段
      ```

---

## **5. 数据库 SQL 开发规范**

### **5.1 查询规范**
1. **禁止使用 SELECT ***：
    - 必须明确列出查询字段：
      ```sql
      SELECT user_id, username FROM user_info;
      ```

2. **禁止不列字段的 INSERT**：
    - 示例：
      ```sql
      INSERT INTO user_info (user_id, username) VALUES (1, 'john');
      ```

3. **避免隐式转换**：
    - 示例：
      ```sql
      WHERE phone_number = '12345678'; -- phone_number 应为字符串
      ```

4. **避免 ORDER BY RAND()**：
    - **原因**：会导致全表扫描。
    - **解决方案**：先查询再随机：
      ```sql
      SELECT * FROM user_info ORDER BY id LIMIT 10;
      ```

---

### **5.2 查询优化**
1. **优先使用 JOIN 替代子查询**：
    - **子查询**：
      ```sql
      SELECT username FROM user_info WHERE user_id IN (
          SELECT user_id FROM orders WHERE amount > 100
      );
      ```
    - **JOIN 优化**：
      ```sql
      SELECT u.username
      FROM user_info u
      JOIN orders o ON u.user_id = o.user_id
      WHERE o.amount > 100;
      ```

2. **减少 JOIN 的表数量**：
    - 表数量超过 3 时需考虑分解查询。

3. **WHERE 子句中避免函数转换**：
    - 错误示例：
      ```sql
      WHERE DATE(created_at) = '2023-01-01';
      ```
    - 优化示例：
      ```sql
      WHERE created_at >= '2023-01-01' AND created_at < '2023-01-02';
      ```

---

## **6. 数据库操作行为规范**

1. **批量操作分批进行**：
    - 每次处理不超过 10000 条：
      ```sql
      DELETE FROM orders WHERE created_at < '2023-01-01' LIMIT 10000;
      ```

2. **使用工具修改表结构**：
    - 对大表修改结构时，使用 `pt-online-schema-change` 工具避免锁表。

3. **权限最小化**：
    - 数据库账号分级管理，仅授予所需权限：
      ```sql
      GRANT SELECT, INSERT, UPDATE ON database_name.* TO 'username'@'host';
      ```

---

## **面试问答可能涉及的深入问题**

### **1. 为什么 VARCHAR 比 TEXT 更推荐？**
- VARCHAR 存储在表的行数据中，性能更高；
- TEXT 存储在独立空间，查询需要额外的 I/O 操作。

### **2. 如何避免深度分页的性能问题？**
- 使用索引字段限制：
  ```sql
  SELECT * FROM table WHERE id > 1000 LIMIT 10;
  ```

### **3. 数据库设计时，什么时候需要反范式？**
- 在高频查询场景下，适当增加冗余字段，减少表关联操作。

---

