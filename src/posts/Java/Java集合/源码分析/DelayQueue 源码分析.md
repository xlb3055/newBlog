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
# DelayQueue

#### 1. DelayQueue 简介

`DelayQueue` 是 Java 中一个基于 **优先级队列（PriorityQueue）** 的无界阻塞队列，它能够存储实现了 `Delayed` 接口的元素，并且只有在元素的延迟时间到期后才能从队列中取出。

**特点**：
- 元素实现了 `Delayed` 接口，必须定义自身的延迟时间。
- 元素按照延迟时间排序，延迟时间最短的元素在队头。
- 支持阻塞式的获取操作，只有延迟时间到期的元素才能被取出。
- 线程安全，通过 `ReentrantLock` 和条件变量实现。

---

#### 2. DelayQueue 发展史

- **JDK 1.5 引入**：`DelayQueue` 是 `java.util.concurrent` 包的一部分，由 Doug Lea 编写。
- 基于 `PriorityQueue` 的实现，为延迟任务调度和定时功能提供支持。

---

#### 3. DelayQueue 常见使用场景示例

1. **定时任务调度**：如消息的定时投递、订单的超时检测等。
2. **限流器**：控制请求的流量，每次处理固定的数量，超过的请求延迟处理。
3. **缓存过期**：实现缓存中元素的自动过期和清理。

**示例：任务调度器**
```java
import java.util.concurrent.DelayQueue;
import java.util.concurrent.Delayed;
import java.util.concurrent.TimeUnit;

class Task implements Delayed {
    private final String name;
    private final long endTime;

    public Task(String name, long delayInMillis) {
        this.name = name;
        this.endTime = System.currentTimeMillis() + delayInMillis;
    }

    @Override
    public long getDelay(TimeUnit unit) {
        return unit.convert(endTime - System.currentTimeMillis(), TimeUnit.MILLISECONDS);
    }

    @Override
    public int compareTo(Delayed o) {
        return Long.compare(this.getDelay(TimeUnit.MILLISECONDS), o.getDelay(TimeUnit.MILLISECONDS));
    }

    @Override
    public String toString() {
        return name + " (end time: " + endTime + ")";
    }
}

public class DelayQueueExample {
    public static void main(String[] args) throws InterruptedException {
        DelayQueue<Task> queue = new DelayQueue<>();
        
        // 添加任务
        queue.put(new Task("Task1", 3000));  // 延迟 3 秒
        queue.put(new Task("Task2", 1000));  // 延迟 1 秒
        queue.put(new Task("Task3", 2000));  // 延迟 2 秒
        
        while (!queue.isEmpty()) {
            Task task = queue.take();  // 阻塞式获取
            System.out.println("Executed: " + task);
        }
    }
}
```

---

#### 4. DelayQueue 源码解析

#### 4.1 核心成员变量

```java
public class DelayQueue<E extends Delayed> extends AbstractQueue<E> implements BlockingQueue<E> {
    private final transient ReentrantLock lock = new ReentrantLock();   // 锁
    private final PriorityQueue<E> q = new PriorityQueue<>();          // 优先级队列
    private final Condition available = lock.newCondition();           // 条件变量
    private Thread leader = null;  // 防止多个线程竞争浪费资源
}
```

- **`lock`**：用于控制对队列的并发访问。
- **`q`**：底层存储的优先级队列，按照延迟时间排序。
- **`available`**：条件变量，用于阻塞和唤醒线程。
- **`leader`**：负责等待延迟时间到期的线程，减少其他线程的争夺。

---

#### 4.2 构造方法

`DelayQueue` 默认使用一个空的 `PriorityQueue` 作为底层存储。

```java
public DelayQueue() {
}
```

---

#### 4.3 添加元素

`offer` 方法将元素插入到队列，并按照优先级排序。如果插入的元素是队头元素，会通知等待线程。

```java
public boolean offer(E e) {
    if (e == null) throw new NullPointerException();
    final ReentrantLock lock = this.lock;
    lock.lock();
    try {
        q.offer(e);  // 插入元素到优先级队列
        if (q.peek() == e) {
            leader = null;  // 如果插入的是新的队头元素
            available.signal();  // 唤醒等待线程
        }
        return true;
    } finally {
        lock.unlock();
    }
}
```

---

#### 4.4 获取元素

- **阻塞获取（`take` 方法）**：如果没有到期的元素，线程会进入等待状态，直到有元素到期。

```java
public E take() throws InterruptedException {
    final ReentrantLock lock = this.lock;
    lock.lockInterruptibly();
    try {
        for (;;) {
            E first = q.peek();  // 队头元素
            if (first == null)
                available.await();  // 队列为空，等待
            else {
                long delay = first.getDelay(TimeUnit.NANOSECONDS);
                if (delay <= 0)  // 如果延迟时间到期，取出元素
                    return q.poll();
                if (leader != null)
                    available.await();  // 其他线程在等待，当前线程也等待
                else {
                    Thread thisThread = Thread.currentThread();
                    leader = thisThread;  // 设置当前线程为 leader
                    try {
                        available.awaitNanos(delay);  // 等待指定延迟时间
                    } finally {
                        if (leader == thisThread)
                            leader = null;
                    }
                }
            }
        }
    } finally {
        if (leader == null && q.peek() != null)
            available.signal();  // 唤醒其他等待线程
        lock.unlock();
    }
}
```

**关键点**：
1. 取出队头元素，检查是否延迟到期。
2. 如果队列为空或元素未到期，线程会进入等待状态。
3. 一个线程被选为 `leader`，等待延迟到期；其余线程继续阻塞。

- **非阻塞获取（`poll` 方法）**：直接返回队头元素。

```java
public E poll() {
    final ReentrantLock lock = this.lock;
    lock.lock();
    try {
        E first = q.peek();
        if (first == null || first.getDelay(TimeUnit.NANOSECONDS) > 0)
            return null;  // 如果队列为空或元素未到期
        else
            return q.poll();  // 延迟到期，移除队头元素
    } finally {
        lock.unlock();
    }
}
```

---

#### 4.5 查看元素

- **`peek` 方法**：返回队头元素但不移除，如果队列为空则返回 `null`。

```java
public E peek() {
    final ReentrantLock lock = this.lock;
    lock.lock();
    try {
        return q.peek();
    } finally {
        lock.unlock();
    }
}
```

---

#### 5. DelayQueue 常见面试题

1. **DelayQueue 的实现原理是什么？**
    - 基于 `PriorityQueue` 实现，存储实现了 `Delayed` 接口的元素。通过优先级排序，延迟时间最短的元素排在队头。

2. **DelayQueue 的实现是否线程安全？**
    - 是线程安全的，通过 `ReentrantLock` 和条件变量实现对线程的阻塞与唤醒。

3. **DelayQueue 的使用场景有哪些？**
    - 延迟任务调度，如订单超时处理、延迟消息投递、缓存自动过期。

4. **DelayQueue 中 Delayed 接口的作用是什么？**
    - `Delayed` 接口定义了元素的延迟时间，`DelayQueue` 根据 `getDelay` 方法的值进行排序。

5. **DelayQueue 和 Timer/TimerTask 的区别是什么？**
    - `DelayQueue` 更灵活，支持多线程并发；`Timer` 是单线程的，容易因为任务执行异常而导致整个调度崩溃。

---

