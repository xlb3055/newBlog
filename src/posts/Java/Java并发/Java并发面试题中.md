---
icon: pen-to-square
date: 2024-12-06
category:
- 后端
tag:
- Java
- 并发
- 后端开发技巧
---
# Java并发面试题中


---

### 1. **JMM (Java 内存模型)**

#### 1.1 JMM 的作用

JMM 是 Java 虚拟机定义的一套内存模型规范，用于屏蔽不同硬件和操作系统的内存访问差异，保证 Java 并发程序的可见性、原子性和有序性。

#### 1.2 关键概念
- **主内存**：所有线程共享的内存，所有变量都存储在主内存中。
- **工作内存**：每个线程有独立的工作内存，用于存储主内存中变量的副本。

#### 1.3 JMM 的三个核心特性
- **原子性**：操作不可被中断，如 `volatile` 修饰的读取操作和 `synchronized` 块的操作具有原子性。
- **可见性**：一个线程修改了共享变量，其他线程可以立即看到，`volatile`、`synchronized` 和 `final` 关键字可以保证可见性。
- **有序性**：Java 提供了“程序顺序规则”，即单线程中代码的执行顺序看起来是顺序的，`volatile` 和 `synchronized` 可以防止指令重排序。

---

### 2. **volatile 关键字**

#### 2.1 volatile 的作用
- **可见性**：一个线程对 `volatile` 变量的修改，其他线程立即可见。
- **禁止指令重排序**：使用 `volatile` 会在底层加入内存屏障，避免指令重排序。

#### 2.2 volatile 的局限
- **不保证原子性**：`volatile` 无法保证复合操作（如 `x++`）的原子性，需要使用 `synchronized` 或原子类。

#### 示例代码：
```java
volatile boolean flag = true;

public void updateFlag() {
    flag = false;  // 修改后其他线程立即可见
}

public void checkFlag() {
    while (flag) {
        // busy-waiting
    }
}
```

---

### 3. **乐观锁和悲观锁**

#### 3.1 悲观锁
假设操作会产生冲突，采取加锁的方式防止冲突。典型实现是 `synchronized` 和 `ReentrantLock`。

#### 3.2 乐观锁
假设冲突较少，通过 CAS（Compare-And-Swap）机制检测冲突，仅在冲突时重试。

#### 3.3 乐观锁的实现
Java 中 `Atomic` 类通过 CAS 实现乐观锁，底层依赖于硬件支持的原子指令。

#### CAS 存在的问题
1. ABA 问题：值变更后又变回原值会被误判为未修改。
    - 解决：使用 `AtomicStampedReference`。
2. 自旋开销：CAS 操作在竞争激烈时可能导致较高的 CPU 开销。
3. 无法保证代码块的原子性。

---

### 4. **synchronized 关键字**

#### 4.1 synchronized 的作用
1. **保证原子性**：对代码块加锁，确保同一时刻只有一个线程执行。
2. **保证可见性**：线程释放锁前，修改的变量会被刷新到主内存。
3. **保证有序性**：禁止指令重排序。

#### 4.2 使用方法
- 修饰代码块：
  ```java
  synchronized (this) {
      // 临界区
  }
  ```
- 修饰方法：
  ```java
  public synchronized void method() {
      // 临界区
  }
  ```
- 修饰静态方法：
  ```java
  public static synchronized void staticMethod() {
      // 临界区
  }
  ```

#### 4.3 构造方法是否可用 synchronized 修饰？
构造方法不能直接使用 `synchronized` 修饰，但可以通过同步代码块实现。

#### 4.4 synchronized 底层原理
- 使用对象头中的 **Mark Word** 实现锁状态标记。
- 锁的状态：
    1. **无锁**：默认状态。
    2. **偏向锁**：无竞争时，线程持有偏向锁。
    3. **轻量级锁**：竞争开始时，线程尝试 CAS 获取锁。
    4. **重量级锁**：竞争激烈时，升级为重量级锁（操作系统层面的互斥锁）。

#### 4.5 JDK1.6 之后的优化
1. **偏向锁**：无竞争时，减少锁操作开销。
2. **轻量级锁**：通过自旋避免线程切换。
3. **锁消除**：JIT 编译器会优化掉不必要的锁。
4. **锁粗化**：合并多次连续的加锁操作。

---

### 5. **ReentrantLock**

#### 5.1 ReentrantLock 的作用
1. 提供更灵活的加锁机制（如公平锁、非公平锁）。
2. 支持可中断锁。

#### 5.2 公平锁和非公平锁
- **公平锁**：线程按照请求锁的顺序获取锁。
- **非公平锁**：线程可直接插队，可能导致优先获取锁。

#### 5.3 synchronized 和 ReentrantLock 的区别
- **功能**：
    - `synchronized` 是 JVM 提供的关键字，支持锁升级。
    - `ReentrantLock` 是 Java 类库中的实现，提供更多高级特性。
- **性能**：
    - 低竞争下，`synchronized` 更快。
    - 高竞争下，`ReentrantLock` 提供的功能更灵活。
- **功能特性**：
    - `ReentrantLock` 支持公平锁、非公平锁、可中断锁等特性。

---

### 6. **ReentrantReadWriteLock**

#### 6.1 ReentrantReadWriteLock 的作用
提供读写分离锁：
- **读锁（共享锁）**：多个线程可以同时持有读锁。
- **写锁（独占锁）**：同一时刻只有一个线程能持有写锁。

#### 6.2 场景
适用于读多写少的场景。

#### 6.3 线程持有读锁还能获取写锁吗？
不能。持有读锁时，写锁会被阻塞。

#### 6.4 为什么读锁不能升级为写锁？
如果允许升级，可能会导致死锁。例如，一个线程持有读锁，等待写锁时，其他线程也无法释放读锁。

---

### 7. **StampedLock**

#### 7.1 StampedLock 是什么？
`StampedLock` 是 Java 8 引入的一种锁实现，提供比 `ReentrantReadWriteLock` 更高的性能。

#### 7.2 性能优势
通过 **乐观读锁** 提升读取性能：
- 如果没有写操作，乐观读锁允许线程直接访问数据。
- 如果检测到写操作，升级为悲观读锁。

#### 示例代码：
```java
StampedLock lock = new StampedLock();
long stamp = lock.tryOptimisticRead();
if (lock.validate(stamp)) {
    // 乐观读成功
} else {
    stamp = lock.readLock();
    try {
        // 进行悲观读
    } finally {
        lock.unlockRead(stamp);
    }
}
```

---

### 8. **Atomic 原子类**

#### 8.1 Atomic 原子类的作用
提供了一组基于 CAS 实现的线程安全操作类，主要包括：
- `AtomicInteger`
- `AtomicLong`
- `AtomicReference`

#### 8.2 常见方法
```java
AtomicInteger atomicInteger = new AtomicInteger(0);
atomicInteger.incrementAndGet();  // 原子递增
atomicInteger.compareAndSet(0, 10);  // CAS 操作
```

#### 8.3 优缺点
- 优点：比锁更高效，适用于高并发场景。
- 缺点：适用于简单的操作，复杂逻辑需要结合其他工具。

---

### 常见面试题

#### 1. synchronized 和 volatile 的区别？
| 特性              | synchronized                  | volatile                |
|-------------------|-------------------------------|-------------------------|
| 线程安全          | 是                           | 否                      |
| 原子性            | 是                           | 否                      |
| 可见性            | 是                           | 是                      |
| 适用场景          | 复杂逻辑的临界区保护          | 标识位、状态更新        |

#### 2. CAS 的问题有哪些？
1. ABA 问题。
2. 高自旋开销。
3. 无法解决复杂的操作。

#### 3. ReentrantLock 和 synchronized 的区别？
- 灵活性：`ReentrantLock` 提供更多功能，如公平锁。
- 性能：在竞争不激烈的场景下，`synchronized` 性能更高。

#### 4. ReentrantReadWriteLock 适合什么场景？
- 读多写少的场景，例如缓存访问。

---

