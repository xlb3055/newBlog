---
icon: pen-to-square
date: 2024-11-23
category:
- 后端
tag:
- MySQL
- 数据库
---
# MySQL事务隔离级别


---

## **1. 什么是事务隔离级别？**

事务的隔离级别是数据库在处理多个并发事务时，定义的读写操作隔离程度。它决定了一个事务是否能读取其他事务的未提交数据或正在操作的数据。

SQL 标准定义了四种隔离级别，从低到高分别是：
1. **读未提交（Read Uncommitted）**
2. **读已提交（Read Committed）**
3. **可重复读（Repeatable Read）**
4. **串行化（Serializable）**

---

## **2. 四种隔离级别及问题**

### **2.1 脏读 (Dirty Read)**

- **现象**：事务 A 可以读取事务 B **未提交的数据**。如果事务 B 回滚，则事务 A 读取的内容是错误的。
- **隔离级别**：发生在 **读未提交**（Read Uncommitted）级别。

**示例**：
- 事务 B：
  ```sql
  START TRANSACTION;
  UPDATE accounts SET balance = balance - 100 WHERE user_id = 1; -- 未提交
  ```
- 事务 A（在 B 未提交时执行）：
  ```sql
  SELECT balance FROM accounts WHERE user_id = 1;
  ```
- 如果事务 B 回滚，事务 A 读取到的数据就是错误的。

**避免方式**：将隔离级别提升为 **读已提交**（Read Committed）。

---

### **2.2 不可重复读 (Non-Repeatable Read)**

- **现象**：事务 A 在一个事务内多次读取同一行数据，结果可能不一致，因为事务 B 在中间修改了数据并提交。
- **隔离级别**：发生在 **读已提交**（Read Committed）级别。

**示例**：
- 事务 A：
  ```sql
  START TRANSACTION;
  SELECT balance FROM accounts WHERE user_id = 1; -- 读取值为 100
  -- 此时事务 B 修改并提交
  SELECT balance FROM accounts WHERE user_id = 1; -- 读取值为 50
  ```
- 事务 B：
  ```sql
  START TRANSACTION;
  UPDATE accounts SET balance = 50 WHERE user_id = 1;
  COMMIT;
  ```

**避免方式**：将隔离级别提升为 **可重复读**（Repeatable Read）。

---

### **2.3 幻读 (Phantom Read)**

- **现象**：事务 A 在同一事务中多次查询满足条件的记录，发现结果集的行数不一致。原因是事务 B 插入了新数据或删除了数据。
- **隔离级别**：发生在 **可重复读**（Repeatable Read）级别。

**示例**：
- 事务 A：
  ```sql
  START TRANSACTION;
  SELECT COUNT(*) FROM orders WHERE user_id = 1; -- 结果为 10
  -- 此时事务 B 插入一条新记录
  SELECT COUNT(*) FROM orders WHERE user_id = 1; -- 结果为 11
  ```
- 事务 B：
  ```sql
  START TRANSACTION;
  INSERT INTO orders (order_id, user_id) VALUES (101, 1);
  COMMIT;
  ```

**避免方式**：将隔离级别提升为 **串行化**（Serializable）。

---

## **3. 四种隔离级别的特点总结**

| 隔离级别              | 脏读 | 不可重复读 | 幻读 | 性能 |
|-----------------------|------|------------|------|------|
| **读未提交**（最低）  | 可能 | 可能       | 可能 | 高   |
| **读已提交**          | 否   | 可能       | 可能 | 中   |
| **可重复读**（默认）  | 否   | 否         | 可能 | 中   |
| **串行化**（最高）    | 否   | 否         | 否   | 低   |

- **MySQL 默认隔离级别**：`可重复读`（Repeatable Read）。

---

## **4. MySQL 事务隔离级别设置**

### **查看当前隔离级别**
```sql
SELECT @@transaction_isolation;
```

### **设置隔离级别**
- 全局设置（影响所有会话）：
  ```sql
  SET GLOBAL transaction_isolation = 'READ-COMMITTED';
  ```
- 会话设置（仅影响当前会话）：
  ```sql
  SET SESSION transaction_isolation = 'READ-COMMITTED';
  ```

---

## **5. 实际演示**

### **5.1 脏读演示（读未提交）**
- 设置隔离级别为 **读未提交**：
  ```sql
  SET SESSION transaction_isolation = 'READ-UNCOMMITTED';
  ```
- 操作：
    - 事务 B：
      ```sql
      START TRANSACTION;
      UPDATE accounts SET balance = balance - 100 WHERE user_id = 1;
      -- 未提交
      ```
    - 事务 A：
      ```sql
      SELECT balance FROM accounts WHERE user_id = 1; -- 读取事务 B 未提交的数据
      ```

---

### **5.2 避免脏读（读已提交）**
- 设置隔离级别为 **读已提交**：
  ```sql
  SET SESSION transaction_isolation = 'READ-COMMITTED';
  ```
- 操作：
    - 事务 B：
      ```sql
      START TRANSACTION;
      UPDATE accounts SET balance = balance - 100 WHERE user_id = 1;
      -- 未提交
      ```
    - 事务 A：
      ```sql
      SELECT balance FROM accounts WHERE user_id = 1; -- 无法读取事务 B 未提交的数据
      ```

---

### **5.3 不可重复读演示（读已提交）**
- 设置隔离级别为 **读已提交**：
  ```sql
  SET SESSION transaction_isolation = 'READ-COMMITTED';
  ```
- 操作：
    - 事务 A：
      ```sql
      START TRANSACTION;
      SELECT balance FROM accounts WHERE user_id = 1; -- 第一次读取，结果为 100
      -- 此时事务 B 提交
      SELECT balance FROM accounts WHERE user_id = 1; -- 第二次读取，结果为 50
      ```
    - 事务 B：
      ```sql
      START TRANSACTION;
      UPDATE accounts SET balance = 50 WHERE user_id = 1;
      COMMIT;
      ```

---

### **5.4 避免不可重复读（可重复读）**
- 设置隔离级别为 **可重复读**：
  ```sql
  SET SESSION transaction_isolation = 'REPEATABLE-READ';
  ```
- 操作：
    - 事务 A：
      ```sql
      START TRANSACTION;
      SELECT balance FROM accounts WHERE user_id = 1; -- 第一次读取，结果为 100
      -- 此时事务 B 提交
      SELECT balance FROM accounts WHERE user_id = 1; -- 第二次读取，结果仍为 100
      ```

---

### **5.5 幻读演示（可重复读）**
- 设置隔离级别为 **可重复读**：
  ```sql
  SET SESSION transaction_isolation = 'REPEATABLE-READ';
  ```
- 操作：
    - 事务 A：
      ```sql
      START TRANSACTION;
      SELECT COUNT(*) FROM orders WHERE user_id = 1; -- 第一次读取，结果为 10
      -- 此时事务 B 插入新记录并提交
      SELECT COUNT(*) FROM orders WHERE user_id = 1; -- 第二次读取，结果为 11（出现幻读）
      ```
    - 事务 B：
      ```sql
      START TRANSACTION;
      INSERT INTO orders (order_id, user_id) VALUES (101, 1);
      COMMIT;
      ```

---

### **5.6 避免幻读（串行化）**
- 设置隔离级别为 **串行化**：
  ```sql
  SET SESSION transaction_isolation = 'SERIALIZABLE';
  ```
- 操作：
    - 事务 A 执行 `SELECT` 时会阻塞事务 B 的 `INSERT`，从而避免幻读。

---

## **6. 总结**

1. **读未提交（Read Uncommitted）**：
    - 最低隔离级别，可能出现脏读。

2. **读已提交（Read Committed）**：
    - 防止脏读，但仍可能发生不可重复读和幻读。

3. **可重复读（Repeatable Read）**：
    - 防止脏读和不可重复读，但可能出现幻读。

4. **串行化（Serializable）**：
    - 防止脏读、不可重复读和幻读，牺牲并发性能。

---


