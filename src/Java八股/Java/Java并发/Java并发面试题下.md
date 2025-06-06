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
# Java并发面试题下

---


#### 1.1 **ThreadLocal 有什么用？**
`ThreadLocal` 为每个线程提供独立的变量副本，可以避免不同线程之间的共享和竞争，使得每个线程访问的都是自己本地的变量。

#### 1.2 **如何使用 ThreadLocal？**
可以通过以下方式使用 `ThreadLocal`：
```java
// 创建 ThreadLocal 对象
ThreadLocal<Integer> threadLocal = new ThreadLocal<>();

// 设置值
threadLocal.set(10);

// 获取值
Integer value = threadLocal.get();

// 删除值
threadLocal.remove();
```

#### 1.3 **ThreadLocal 原理了解吗？**
`ThreadLocal` 使用的是线程本地存储。每个线程有一个独立的存储空间，数据存储在当前线程的 `ThreadLocalMap` 中，`ThreadLocal` 的 `get()` 方法根据当前线程返回其存储的值。

#### 1.4 **ThreadLocal 内存泄露问题是怎么导致的？**
内存泄漏通常发生在 `ThreadLocal` 的 `ThreadLocalMap` 中的条目，即使线程结束，也不会立即清理相关资源，因为 `ThreadLocalMap` 可能持有对 `ThreadLocal` 的强引用。

解决方案：
1. 使用 `ThreadLocal.remove()` 显式移除线程本地数据。
2. 在 `ThreadLocal` 不再使用时，及时清理引用。

---

### 2. **线程池**

#### 2.1 **什么是线程池？**
线程池是一个维护一定数量线程的池子，可以重复利用这些线程来执行多个任务，而无需为每个任务都创建新线程。

#### 2.2 **为什么要用线程池？**
1. 减少了频繁创建和销毁线程的开销。
2. 通过复用线程提高了资源利用率。
3. 通过设置最大线程数限制了资源的使用，避免系统崩溃。

#### 2.3 **如何创建线程池？**
可以通过 `Executors` 工厂类创建：
```java
ExecutorService executor = Executors.newFixedThreadPool(10);
```

#### 2.4 **为什么不推荐使用内置线程池？**
内置线程池如 `Executors.newFixedThreadPool()` 默认使用不安全的线程池配置，可能导致资源泄漏或任务执行失败。

#### 2.5 **线程池常见参数有哪些？如何解释？**
常见参数有：
- **corePoolSize**：核心线程数。
- **maximumPoolSize**：最大线程数。
- **keepAliveTime**：线程空闲时间超过该时间后，线程会被销毁。
- **BlockingQueue**：任务队列，存放待执行的任务。

#### 2.6 **线程池的核心线程会被回收吗？**
核心线程在空闲时不会被回收，除非线程池被关闭。

#### 2.7 **线程池的拒绝策略有哪些？**
1. **AbortPolicy**：直接抛出异常。
2. **CallerRunsPolicy**：调用者线程执行任务。
3. **DiscardPolicy**：丢弃任务。
4. **DiscardOldestPolicy**：丢弃队列中最旧的任务。

#### 2.8 **如果不允许丢弃任务，应该选择哪个拒绝策略？**
选择 `CallerRunsPolicy`，它会将任务交由调用者线程执行，避免任务丢失。

#### 2.9 **CallerRunsPolicy 拒绝策略有什么风险？如何解决？**
`CallerRunsPolicy` 会导致调用者线程负担过重，可能影响系统的整体性能。解决方案是合理设置线程池的大小或增加队列容量。

#### 2.10 **线程池常用的阻塞队列有哪些？**
1. **ArrayBlockingQueue**：有界阻塞队列。
2. **LinkedBlockingQueue**：有界或无界阻塞队列。
3. **SynchronousQueue**：每次只允许一个线程插入和取出。

#### 2.11 **线程池处理任务的流程了解吗？**
1. 任务被提交到线程池。
2. 线程池检查是否有空闲线程处理任务。
3. 如果没有空闲线程且队列已满，执行拒绝策略。
4. 任务完成后，线程返回线程池，继续处理下一个任务。

#### 2.12 **线程池中线程异常后，销毁还是复用？**
默认情况下，如果线程池中的线程因异常终止，则线程会被销毁，不会复用。可以通过 `ThreadFactory` 进行自定义处理。

#### 2.13 **如何给线程池命名？**
通过自定义 `ThreadFactory` 来命名线程：
```java
ExecutorService executor = Executors.newFixedThreadPool(10, new ThreadFactory() {
    @Override
    public Thread newThread(Runnable r) {
        Thread t = new Thread(r);
        t.setName("custom-thread");
        return t;
    }
});
```

#### 2.14 **如何设定线程池的大小？**
线程池大小需要根据任务的特性进行调整，核心线程数和最大线程数的选择取决于负载的特点。

#### 2.15 **如何动态修改线程池的参数？**
可以通过 `ThreadPoolExecutor` 来动态调整线程池的大小：
```java
ThreadPoolExecutor executor = new ThreadPoolExecutor(5, 10, 60L, TimeUnit.SECONDS, new LinkedBlockingQueue<>());
executor.setCorePoolSize(20); // 动态调整核心线程数
executor.setMaximumPoolSize(50); // 动态调整最大线程数
```

#### 2.16 **如何设计一个能够根据任务的优先级来执行的线程池？**
可以使用 `PriorityBlockingQueue` 来实现优先级队列：
```java
PriorityBlockingQueue<Runnable> queue = new PriorityBlockingQueue<>();
ExecutorService executor = new ThreadPoolExecutor(10, 20, 60L, TimeUnit.SECONDS, queue);
```

---

### 3. **Future**

#### 3.1 **Future 类有什么用？**
`Future` 用于表示异步计算的结果，提供了获取计算结果、取消任务等功能。

#### 3.2 **Callable 和 Future 有什么关系？**
`Callable` 是一个可以返回结果的任务接口，而 `Future` 用于获取 `Callable` 执行结果。

#### 3.3 **CompletableFuture 类有什么用？**
`CompletableFuture` 是 `Future` 的扩展，支持异步回调和组合操作，提供更多灵活的异步编程模型。

---

### 4. **AQS (AbstractQueuedSynchronizer)**

#### 4.1 **AQS 是什么？**
AQS 是一种用于构建同步器的框架，许多同步工具（如 `ReentrantLock`、`CountDownLatch`）都是基于 AQS 实现的。

#### 4.2 **AQS 的原理是什么？**
AQS 使用一个 **FIFO 队列** 来管理线程，通过 **状态值** 来控制线程的获取和释放。

#### 4.3 **Semaphore 有什么用？**
`Semaphore` 是一种信号量，用于控制访问某些资源的线程数量。

#### 4.4 **Semaphore 的原理是什么？**
`Semaphore` 维护一个计数器，通过调用 `acquire()` 和 `release()` 控制资源的获取与释放。

#### 4.5 **CountDownLatch 有什么用？**
`CountDownLatch` 用于协调多个线程之间的同步，常用于等待一组线程完成某些操作后再执行下一步。

#### 4.6 **CountDownLatch 的原理是什么？**
`CountDownLatch` 通过一个计数器来控制，计数器的值为 0 时，等待的线程会继续执行。

#### 4.7 **用过 CountDownLatch 么？什么场景下用的？**
常用于并发测试、并发初始化等场景，需要等待多个线程执行完毕后再继续。

#### 4.8 **CyclicBarrier 有什么用？**
`CyclicBarrier` 使得一组线程在某个公共屏障点上同步，所有线程到达屏障点后才能继续执行。

#### 4.9 **CyclicBarrier 的原理是什么？**
`CyclicBarrier` 维护一个计数器，所有线程调用 `await()` 方法，直到计数器归零，线程才会继续执行。

---

### 5. **虚拟线程**

虚拟线程是 Java 19 引入的轻量级线程，基于 **项目 Loom** 实现，它使得线程的创建和切换变得更加高效。通过虚拟线程，可以轻松创建大量并发任务，极大地提高了应用的并发处理能力。

---


