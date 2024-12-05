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
# CopyOnWriteArrayList

`CopyOnWriteArrayList` 是 Java 提供的一个线程安全的 `List` 实现类，它主要用于高并发场景下对集合的读取操作频繁，但修改操作较少的情况。该类基于 **Copy-On-Write**（COW）模式，即在进行修改操作时，实际上会复制一份原有的数组进行修改，这样能有效保证并发读写时的线程安全。

### 1. CopyOnWriteArrayList 简介

`CopyOnWriteArrayList` 是 `java.util.concurrent` 包中的一个类，继承自 `AbstractList`，并实现了 `List` 接口。它的内部数据结构是基于一个 **数组** 来存储元素，而不是像 `ArrayList` 一样直接操作数组。

#### 主要特点：
- **线程安全**：`CopyOnWriteArrayList` 实现了线程安全，读操作不需要加锁，写操作会创建一个新的副本，并将修改后的副本替换掉原数组。
- **适用于读取频繁、写入少的场景**：由于每次修改都会复制整个数组，写操作的性能较差，但读取操作非常快。

### 2. CopyOnWriteArrayList 到底有什么厉害之处？

`CopyOnWriteArrayList` 的核心优势在于其 **写时复制**（Copy-On-Write）机制。具体来说，每次写入操作（例如 `add`、`remove` 等）时，会将底层数组进行复制，并在副本上修改，然后将副本替换掉原数组。这样，在进行修改操作时，其他线程读取该列表时，不会受到影响，因为他们会继续读取原来的数组副本。

### 3. Copy-On-Write 的思想是什么？

**Copy-On-Write（COW）** 模式是一种优化策略，通常用于需要频繁读取但不经常修改的场景。基本思想是：

- 读取操作非常高效，不需要加锁。
- 写入操作会复制底层数据结构，然后在新副本上修改。
- 这种模式非常适用于写入频率较低，读取频率较高的场景。

### 4. CopyOnWriteArrayList 源码分析

#### 4.1 初始化

`CopyOnWriteArrayList` 内部维护着一个 `volatile` 数组，名为 `array`。该数组用于存储所有的元素。

```java
private transient volatile Object[] array;
```

- `volatile` 确保每个线程都能看到最新的数组副本。

#### 4.2 插入元素

插入元素的操作会通过复制现有数组来实现。具体来说，`add` 操作会创建一个新数组，并将原数组中的所有元素复制到新数组中，然后将新元素插入到新数组中。

```java
public boolean add(E e) {
    final Object[] snapshot = array;
    final int len = snapshot.length;
    final Object[] newArray = Arrays.copyOf(snapshot, len + 1);
    newArray[len] = e;
    array = newArray;
    return true;
}
```

- 这里调用了 `Arrays.copyOf()` 来创建一个新的数组副本。
- 最后，`array` 引用被更新为新的数组。

#### 4.3 读取元素

读取元素非常高效，因为它直接从底层数组中获取数据，读取操作不加锁，且不会影响其他线程。

```java
public E get(int index) {
    return (E) array[index];
}
```

- `get()` 方法直接返回底层数组中的元素，因此读取操作非常快。

#### 4.4 获取列表中元素的个数

获取元素个数的操作直接返回底层数组的长度：

```java
public int size() {
    return array.length;
}
```

- 由于 `size()` 只读取数组的长度，因此它的时间复杂度是 O(1)。

#### 4.5 删除元素

删除元素的操作也遵循 **Copy-On-Write** 模式。`remove` 方法会复制原数组并删除指定元素。

```java
public boolean remove(Object o) {
    final Object[] snapshot = array;
    final int len = snapshot.length;
    int newLength = len;
    Object[] newArray = Arrays.copyOf(snapshot, len);
    for (int i = 0; i < len; i++) {
        if (o.equals(snapshot[i])) {
            newLength--;
            System.arraycopy(snapshot, i + 1, newArray, i, len - i - 1);
            break;
        }
    }
    if (newLength == len) {
        return false;
    }
    array = Arrays.copyOf(newArray, newLength);
    return true;
}
```

- 删除时，首先复制整个数组，然后将剩余元素复制到新的数组中。

#### 4.6 判断元素是否存在

`contains()` 方法用来判断某个元素是否存在，它也遵循读时不加锁的原则，直接读取数组来检查。

```java
public boolean contains(Object o) {
    for (Object e : array) {
        if (e.equals(o)) {
            return true;
        }
    }
    return false;
}
```

### 5. CopyOnWriteArrayList 常用方法测试

#### 5.1 测试 `add` 方法

```java
CopyOnWriteArrayList<String> list = new CopyOnWriteArrayList<>();
list.add("A");
list.add("B");
list.add("C");

for (String item : list) {
    System.out.println(item);
}
```

输出：
```
A
B
C
```

#### 5.2 测试 `get` 方法

```java
String item = list.get(1);
System.out.println(item);  // 输出 "B"
```

#### 5.3 测试 `remove` 方法

```java
list.remove("B");
for (String item : list) {
    System.out.println(item);  // 输出 "A", "C"
}
```

#### 5.4 测试 `contains` 方法

```java
boolean contains = list.contains("A");
System.out.println(contains);  // 输出 true
```

### 6. CopyOnWriteArrayList 的优缺点

#### 优点：
- 线程安全：读操作不需要加锁，可以在高并发环境中保证安全。
- 适用于读多写少的场景：由于写操作会复制数组，避免了锁的竞争，适合高频读取但写入较少的场景。

#### 缺点：
- 写性能较差：每次写操作都会复制整个数组，因此写操作的性能比普通的 `ArrayList` 差。
- 内存消耗较大：由于每次修改都会创建新数组，会消耗较多的内存。

### 7. 适用场景

- **读多写少的应用场景**：如果应用中有大量读取操作而写操作较少，`CopyOnWriteArrayList` 是非常合适的选择。
- **高并发场景**：特别适合需要高并发读取且不频繁更新数据的应用。

---

### 总结

`CopyOnWriteArrayList` 是一种基于 **Copy-On-Write**（写时复制）策略的线程安全集合类，它适用于读多写少的场景。通过在写操作时复制整个数组来保证线程安全，避免了加锁的复杂性。它的优点是高效的读操作，但缺点是写操作的性能较差，且会消耗更多的内存。
