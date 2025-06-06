---
icon: pen-to-square
date: 2024-12-05
category:
- 后端
tag:
- Java
- 源码分析
- 后端开发技巧
---
# ArrayBlockingQueue

#### 1. 阻塞队列简介

**阻塞队列（BlockingQueue）** 是 Java 中用于多线程环境的一种线程安全队列，它在添加或获取元素时可以阻塞线程，直到队列状态满足操作条件。

- 如果队列为空，获取元素的操作会阻塞线程，直到有新元素可用。
- 如果队列已满，添加元素的操作会阻塞线程，直到队列有空余空间。

阻塞队列广泛用于生产者-消费者模型，常见实现有：
- **ArrayBlockingQueue**：基于数组的有界阻塞队列。
- **LinkedBlockingQueue**：基于链表的有界阻塞队列。
- **PriorityBlockingQueue**：带优先级的阻塞队列。
- **DelayQueue**：延迟队列，支持定时任务。

#### 2. ArrayBlockingQueue 是什么？

`ArrayBlockingQueue` 是基于数组实现的有界阻塞队列，支持以下特点：
- **有界**：队列的容量固定，在初始化时确定。
- **线程安全**：通过重入锁（`ReentrantLock`）和条件变量（`Condition`）实现。
- **FIFO 顺序**：遵循先进先出规则。

---

#### 3. ArrayBlockingQueue 常见方法及测试

#### 3.1 常见方法

`ArrayBlockingQueue` 提供了多种方法，分为阻塞式、非阻塞式和带超时的操作：

- **插入元素**：
    - `add(E e)`：非阻塞，队列满时抛异常。
    - `offer(E e)`：非阻塞，队列满时返回 `false`。
    - `offer(E e, long timeout, TimeUnit unit)`：在指定时间内等待空余空间。
    - `put(E e)`：阻塞，队列满时等待。

- **获取元素**：
    - `poll()`：非阻塞，队列空时返回 `null`。
    - `poll(long timeout, TimeUnit unit)`：在指定时间内等待可用元素。
    - `take()`：阻塞，队列空时等待。
    - `peek()`：非阻塞，返回队列头元素但不移除，队列空时返回 `null`。

- **其他方法**：
    - `size()`：返回当前队列中元素的个数。
    - `contains(Object o)`：判断队列中是否包含指定元素。
    - `remainingCapacity()`：返回队列中剩余的空余空间。

#### 3.2 测试示例

```java
import java.util.concurrent.ArrayBlockingQueue;
import java.util.concurrent.TimeUnit;

public class ArrayBlockingQueueTest {
    public static void main(String[] args) throws InterruptedException {
        ArrayBlockingQueue<Integer> queue = new ArrayBlockingQueue<>(3);

        // 插入元素
        queue.put(1);  // 阻塞方式
        queue.add(2);  // 非阻塞方式
        System.out.println(queue.offer(3));  // 返回 true

        System.out.println("队列中的元素：" + queue);

        // 获取元素
        System.out.println("取出元素：" + queue.take());  // 阻塞方式
        System.out.println("取出元素：" + queue.poll());  // 非阻塞方式

        // 带超时的插入
        boolean success = queue.offer(4, 2, TimeUnit.SECONDS);
        System.out.println("插入结果：" + success);

        System.out.println("最终队列：" + queue);
    }
}
```

---

#### 4. ArrayBlockingQueue 源码分析

#### 4.1 整体设计

`ArrayBlockingQueue` 的底层是一个数组，维护了两个索引 `takeIndex` 和 `putIndex`：
- **`takeIndex`**：指向队列头部，用于读取元素。
- **`putIndex`**：指向队列尾部，用于插入元素。

通过重入锁（`ReentrantLock`）保证线程安全，并使用两个条件变量（`notEmpty` 和 `notFull`）管理线程阻塞和唤醒。

```java
public class ArrayBlockingQueue<E> extends AbstractQueue<E> implements BlockingQueue<E>, java.io.Serializable {
    final Object[] items;           // 用于存储队列元素的数组
    int takeIndex;                  // 队列头部索引
    int putIndex;                   // 队列尾部索引
    int count;                      // 队列中元素个数
    final ReentrantLock lock;       // 重入锁
    private final Condition notEmpty;  // 条件变量：队列非空
    private final Condition notFull;   // 条件变量：队列非满
}
```

---

#### 4.2 初始化

构造方法中初始化数组、锁和条件变量，并设置队列的容量：

```java
public ArrayBlockingQueue(int capacity, boolean fair) {
    if (capacity <= 0)
        throw new IllegalArgumentException();
    this.items = new Object[capacity];
    this.lock = new ReentrantLock(fair);
    this.notEmpty = lock.newCondition();
    this.notFull = lock.newCondition();
}
```

- **`fair`**：是否使用公平锁。公平锁会按照线程的请求顺序分配锁。
- **`notEmpty`**：用于管理取元素线程的条件。
- **`notFull`**：用于管理放元素线程的条件。

---

#### 4.3 阻塞式获取和新增元素

- **插入元素（`put` 方法）**：

  `put` 方法在队列满时阻塞，直到有空间可用。

  ```java
  public void put(E e) throws InterruptedException {
      if (e == null) throw new NullPointerException();
      final ReentrantLock lock = this.lock;
      lock.lockInterruptibly();
      try {
          while (count == items.length)
              notFull.await();  // 阻塞等待队列非满
          enqueue(e);
      } finally {
          lock.unlock();
      }
  }
  
  private void enqueue(E e) {
      items[putIndex] = e;
      putIndex = (putIndex + 1) % items.length;  // 环形数组
      count++;
      notEmpty.signal();  // 唤醒等待取元素的线程
  }
  ```

- **获取元素（`take` 方法）**：

  `take` 方法在队列为空时阻塞，直到有元素可用。

  ```java
  public E take() throws InterruptedException {
      final ReentrantLock lock = this.lock;
      lock.lockInterruptibly();
      try {
          while (count == 0)
              notEmpty.await();  // 阻塞等待队列非空
          return dequeue();
      } finally {
          lock.unlock();
      }
  }

  private E dequeue() {
      @SuppressWarnings("unchecked")
      E e = (E) items[takeIndex];
      items[takeIndex] = null;  // 清空队列头部元素
      takeIndex = (takeIndex + 1) % items.length;  // 环形数组
      count--;
      notFull.signal();  // 唤醒等待放元素的线程
      return e;
  }
  ```

---

#### 4.4 非阻塞式获取和新增元素

- **`offer` 方法**：非阻塞插入，如果队列已满，立即返回 `false`。

  ```java
  public boolean offer(E e) {
      if (e == null) throw new NullPointerException();
      final ReentrantLock lock = this.lock;
      lock.lock();
      try {
          if (count == items.length)
              return false;
          enqueue(e);
          return true;
      } finally {
          lock.unlock();
      }
  }
  ```

- **`poll` 方法**：非阻塞获取，如果队列为空，立即返回 `null`。

  ```java
  public E poll() {
      final ReentrantLock lock = this.lock;
      lock.lock();
      try {
          return (count == 0) ? null : dequeue();
      } finally {
          lock.unlock();
      }
  }
  ```

---

#### 4.5 指定超时时间内阻塞式获取和新增元素

- **带超时插入（`offer` 方法）**：

  ```java
  public boolean offer(E e, long timeout, TimeUnit unit) throws InterruptedException {
      if (e == null) throw new NullPointerException();
      long nanos = unit.toNanos(timeout);
      final ReentrantLock lock = this.lock;
      lock.lockInterruptibly();
      try {
          while (count == items.length) {
              if (nanos <= 0)
                  return false;
              nanos = notFull.awaitNanos(nanos);  // 超时等待
          }
          enqueue(e);
          return true;
      } finally {
          lock.unlock();
      }
  }
  ```

- **带超时获取（`poll` 方法）**：

  ```java
  public E poll(long timeout, TimeUnit unit) throws InterruptedException {
      long nanos = unit.toNanos(timeout);
      final ReentrantLock lock = this.lock;
      lock.lockInterruptibly();
      try {
          while (count == 0) {
              if (nanos <= 0)
                  return null;
              nanos = notEmpty.awaitNanos(nanos);  // 超时等待
          }
          return dequeue();
      } finally {
          lock.unlock();
      }
  }
  ```

---

### 5. ArrayBlockingQueue 的优缺点

#### 优点：
- 简单高效，适用于固定容量的生产者-消费者模型。
- 使用重入锁和条件变量实现线程安全。

#### 缺点：
- 固定容量，无法动态扩展。
- 写入操作可能导致频繁的阻塞等待。

---

### 6. 常见面试题

1. **ArrayBlockingQueue 是什么？它的特点是什么？**
    - 基于数组的线程安全有界阻塞队列，支持 FIFO 顺序和阻塞式操作。

2. **ArrayBlockingQueue 和 LinkedBlockingQueue 有什么区别？**
    - `ArrayBlockingQueue` 基于数组实现，有固定容量；`LinkedBlockingQueue` 基于链表实现，容量可以不固定。

3. **ArrayBlockingQueue 和 ConcurrentLinkedQueue 有什么区别？**
    - `ArrayBlockingQueue` 是阻塞队列，支持阻塞操作；`ConcurrentLinkedQueue` 是非阻塞队列，基于 CAS 实现。

4. **ArrayBlockingQueue 的实现原理是什么？**
    - 基于数组实现，通过锁和条件变量实现线程安全的阻塞操作。
