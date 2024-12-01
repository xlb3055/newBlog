---
icon: pen-to-square
date: 2024-11-23
category:
- 后端
tag:
- MySQL
- 数据库
---
# InnoDB对MVCC的实现

---

## **1. 什么是 MVCC（多版本并发控制）？**

MVCC（Multi-Version Concurrency Control）是一种并发控制机制，旨在通过保存数据的多个版本，在不加锁的情况下实现高效的事务隔离，从而提升数据库的并发性能。

### **1.1 MVCC 的核心目标**
1. 提高并发性能，避免事务间的锁等待。
2. 实现一致性非锁定读，提升读操作效率。

---

## **2. 一致性非锁定读和锁定读**

### **2.1 一致性非锁定读**
- **定义**：事务读取数据时，通过 MVCC 提供的 **历史版本** 获取快照数据，而不阻塞其他事务。
- **特性**：
    - 读取的始终是事务开始时的数据版本（由 **ReadView** 确定）。
    - 避免了加锁，提高并发性能。
- **适用场景**：
    - 隔离级别为 `READ COMMITTED` 和 `REPEATABLE READ` 的普通 SELECT 查询。

**示例：**
```sql
SELECT * FROM orders WHERE id = 1;
```
- **行为**：读取符合当前事务可见性规则的数据版本，而不加锁。

---

### **2.2 锁定读**
- **定义**：事务读取数据时加锁，阻止其他事务对数据的修改或读取，确保操作的一致性。
- **触发方式**：显式使用 `FOR UPDATE` 或 `LOCK IN SHARE MODE`。
- **适用场景**：
    - 防止数据被其他事务修改。
    - 使用在更新前读取数据时。

**示例：**
```sql
SELECT * FROM orders WHERE id = 1 FOR UPDATE; -- 排它锁
SELECT * FROM orders WHERE id = 1 LOCK IN SHARE MODE; -- 共享锁
```
- **行为**：
    - `FOR UPDATE`：加排他锁，阻止其他事务读或写。
    - `LOCK IN SHARE MODE`：加共享锁，仅阻止写操作。

---

## **3. InnoDB 对 MVCC 的实现**

InnoDB 通过以下机制实现 MVCC：

### **3.1 隐藏字段**
InnoDB 在每行数据后隐式添加两个字段：
1. **trx_id**：标记最后一次修改该行的事务 ID。
2. **roll_pointer**：指向 `undo log`，用于回溯数据的历史版本。

**示例：**
| 数据行 | trx_id | roll_pointer |
|--------|--------|--------------|
| row1   | 100    | 指向上一版本 |

---

### **3.2 ReadView（快照读）**
- **定义**：在事务读取数据时，生成的当前事务可见版本的视图。
- **作用**：
    1. 确定哪些事务的修改对当前事务可见。
    2. 保证读取数据的一致性。

---

### **3.3 undo log**
- **定义**：记录数据的历史版本。
- **作用**：
    1. 用于事务回滚。
    2. 用于 MVCC 提供历史版本支持。
- **流程**：
    - 每次更新数据时，将旧数据存入 `undo log`。
    - 读取旧版本时，通过 `roll_pointer` 回溯到 `undo log`。

---

### **3.4 数据可见性算法**
事务读取数据时，判断数据版本是否可见的规则：
1. **当前数据版本的 `trx_id`**：
    - 如果小于当前事务的 `trx_id`，则可见（修改发生在当前事务之前）。
2. **事务状态**：
    - 如果版本是由已提交的事务生成，则可见。
    - 如果版本是由当前事务生成，则可见。
3. **不在 ReadView 的活跃事务列表中**：
    - 如果 `trx_id` 属于未提交的事务，则不可见。

---

## **4. RC 和 RR 隔离级别下的 MVCC 差异**

### **4.1 READ COMMITTED (RC) 下的 MVCC**
- 每次读取都会生成一个新的 **ReadView**。
- **行为**：可以看到其他事务已经提交的最新数据。

**示例：**
```sql
SET SESSION TRANSACTION ISOLATION LEVEL READ COMMITTED;
START TRANSACTION;
SELECT * FROM orders WHERE id = 1; -- 第一次读取数据版本
-- 其他事务修改并提交
SELECT * FROM orders WHERE id = 1; -- 第二次读取最新数据
```
- 结果：两次读取可能返回不同的结果。

---

### **4.2 REPEATABLE READ (RR) 下的 MVCC**
- 在事务开始时生成 **一次性 ReadView**。
- **行为**：事务期间读取的始终是事务开始时的快照数据。

**示例：**
```sql
SET SESSION TRANSACTION ISOLATION LEVEL REPEATABLE READ;
START TRANSACTION;
SELECT * FROM orders WHERE id = 1; -- 第一次读取快照数据
-- 其他事务修改并提交
SELECT * FROM orders WHERE id = 1; -- 仍然读取快照数据
```
- 结果：两次读取的结果一致，避免了不可重复读问题。

---

## **5. MVCC 解决不可重复读问题**

MVCC 的核心在于通过 **ReadView** 机制，确保同一事务内的多次读取始终使用相同的快照数据。这是 **REPEATABLE READ** 隔离级别的核心机制。

- 事务 A：
  ```sql
  START TRANSACTION;
  SELECT * FROM orders WHERE id = 1; -- 第一次读取快照数据
  SELECT * FROM orders WHERE id = 1; -- 第二次读取快照数据
  ```
- 事务 B：
  ```sql
  START TRANSACTION;
  UPDATE orders SET status = 'completed' WHERE id = 1;
  COMMIT;
  ```

在事务 A 中，事务 B 的修改是不可见的，因此解决了不可重复读问题。

---

## **6. MVCC + Next-Key Lock 防止幻读**

### **6.1 什么是 Next-Key Lock？**
- **定义**：行锁（Record Lock）与间隙锁（Gap Lock）的组合。
- **作用**：
    - 锁定查询范围内的行和间隙，防止插入新数据导致幻读。

**示例：**
```sql
SELECT * FROM orders WHERE id > 10 FOR UPDATE;
```
- 锁定的范围：
    - 已存在的行。
    - ID 大于 10 的间隙。

---

### **6.2 如何防止幻读？**
在 `REPEATABLE READ` 隔离级别下，InnoDB 使用 **MVCC + Next-Key Lock**：
1. **MVCC** 确保读取的快照一致性。
2. **Next-Key Lock** 防止在查询范围内插入新数据。

**示例：**
- 事务 A：
  ```sql
  START TRANSACTION;
  SELECT COUNT(*) FROM orders WHERE user_id = 1 FOR UPDATE;
  ```
- 事务 B：
  ```sql
  INSERT INTO orders (order_id, user_id) VALUES (101, 1); -- 阻塞，无法插入
  ```

通过 Next-Key Lock，事务 A 锁住了满足条件的范围，事务 B 无法插入新记录，从而避免幻读。

---

## **7. 总结**

1. **一致性非锁定读**：通过 MVCC 提供快照数据，避免加锁，提升并发性能。
2. **锁定读**：通过行锁或间隙锁，保证操作一致性。
3. **InnoDB 的 MVCC**：
    - 通过 `trx_id` 和 `undo log` 记录数据历史版本。
    - 使用 `ReadView` 确定事务的可见性。
4. **RC 和 RR 的区别**：
    - RC：每次读取生成新的 `ReadView`。
    - RR：整个事务共享同一个 `ReadView`。
5. **MVCC + Next-Key Lock 防止幻读**：结合快照一致性和间隙锁，保证查询范围内的一致性。

---

