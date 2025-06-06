---
icon: pen-to-square
date: 2024-12-04
category:
- 后端
tag:
- Java
- 源码分析
- 后端开发技巧
---
# ConcurrentHashMap


`ConcurrentHashMap` 是 Java 中一个线程安全的哈希表实现，主要用于高并发场景下存储键值对。它的设计目标是通过分段锁的方式来实现并发访问控制，从而提高性能和吞吐量。

`ConcurrentHashMap` 在 Java 1.7 和 1.8 中有较大的差异，尤其是在其存储结构、并发控制和扩容策略上。下面将分别从 Java 1.7 和 Java 1.8 两个版本进行详细的源码分析。

---

## 1. ConcurrentHashMap 1.7

### 1.1 存储结构

`ConcurrentHashMap` 1.7 使用了**分段锁（Segment）**的设计来实现高效的并发。它将整个哈希表分为多个“段”，每个段内部都维护一个哈希表，并且每个段有独立的锁。这种设计允许多个线程并发地操作不同段中的数据，从而避免锁的竞争。

- 每个段（`Segment`）内部使用的底层数据结构是 `HashMap`。
- `ConcurrentHashMap` 将整个哈希表划分为多个段，每个段都有独立的锁。
- 每个段有独立的哈希表，当一个线程访问一个段时，不会影响其他段的访问。

### 1.2 初始化

`ConcurrentHashMap` 通过初始化 `Segment` 数组来实现并发控制。它有一个初始容量（`initialCapacity`）和一个负载因子（`loadFactor`）。根据这些参数，`ConcurrentHashMap` 会创建多个段，每个段会有自己的哈希表。

```java
public ConcurrentHashMap(int initialCapacity, float loadFactor, int concurrencyLevel) {
    if (concurrencyLevel <= 0)
        throw new IllegalArgumentException();
    if (concurrencyLevel > MAX_CONCURRENCY)
        concurrencyLevel = MAX_CONCURRENCY;
    
    int segmentShift = 0;
    int segmentMask = 0;
    while (concurrencyLevel > (1 << segmentShift)) {
        ++segmentShift;
    }
    segmentMask = (1 << segmentShift) - 1;
    
    int capacity = (initialCapacity + concurrencyLevel - 1) / concurrencyLevel;
    segmentArray = new Segment[concurrencyLevel];
    
    for (int i = 0; i < concurrencyLevel; i++) {
        segmentArray[i] = new Segment<>(capacity, loadFactor);
    }
}
```

- **`concurrencyLevel`**：定义了并发级别，即分段的数量。每个段可以并发处理操作，默认值为 16。
- **`segmentArray`**：存储所有段的数组。

### 1.3 put

`put` 方法用于插入元素，并且它会根据哈希值计算该元素所在的段（segment），然后将元素插入到该段的哈希表中。

```java
public V put(K key, V value) {
    int hash = hash(key);
    Segment<K, V> segment = segmentFor(hash);
    return segment.put(key, value, hash);
}

final Segment<K, V> segmentFor(int hash) {
    return segmentArray[(hash >>> segmentShift) & segmentMask];
}
```

- `hash(key)`：计算元素的哈希值。
- `segmentFor(hash)`：计算该哈希值对应的段。
- `segment.put(key, value, hash)`：将元素插入到对应的段中。

### 1.4 扩容 rehash

扩容和 `HashMap` 相似，`ConcurrentHashMap` 会对每个段单独进行扩容。扩容时，哈希表的容量会增长，并且会将原来的元素重新哈希到新的哈希表中。

```java
final void rehash() {
    if (count >= threshold) {
        threshold = (int)(capacity * loadFactor);
        Segment<K,V> newSegment = new Segment<>(newCapacity, loadFactor);
        transfer(newSegment);
    }
}
```

- 当段内元素超过阈值时，`rehash` 会创建一个新的更大的哈希表，并将元素迁移到新表中。

### 1.5 get

`get` 方法用于获取某个键的值，它首先计算出该键所在的段，并通过该段的哈希表进行查找。

```java
public V get(Object key) {
    int hash = hash(key);
    Segment<K, V> segment = segmentFor(hash);
    return segment.get(key, hash);
}
```

---

## 2. ConcurrentHashMap 1.8

### 2.1 存储结构

在 Java 1.8 中，`ConcurrentHashMap` 的实现进行了重构，不再使用分段锁（Segment）。取而代之的是使用 **桶**（bucket）数组和 **synchronized** 锁的机制。

- 采用一个大的桶数组，其中每个桶是一个链表或者红黑树。
- 当桶中的元素数量超过阈值时，链表会转化为红黑树，以提高查找效率。

### 2.2 初始化 initTable

`initTable` 方法负责初始化 `ConcurrentHashMap` 的桶数组。默认初始化桶数组的大小为 16，且容量大小随着负载因子的变化而增加。

```java
final void initTable() {
    table = new Node[INITIAL_CAPACITY];
    threshold = (int)(INITIAL_CAPACITY * loadFactor);
}
```

### 2.3 put

`put` 方法实现了插入逻辑，如果某个桶中已有元素，并且这个桶是链表或红黑树，它会按照链表/树结构插入元素。

```java
public V put(K key, V value) {
    int hash = hash(key);
    if ((table = getTable()) == null)
        initTable();
    Node<K,V> newNode = new Node<>(hash, key, value, null);
    return putVal(hash, key, value, false, true);
}

final V putVal(int hash, K key, V value, boolean onlyIfAbsent, boolean evict) {
    Node<K,V>[] tab; Node<K,V> p; int n, i;
    if ((tab = table) == null || (n = tab.length) == 0)
        tab = initTable();
    if ((p = tab[i = (n - 1) & hash]) == null)
        tab[i] = newNode;
    else {
        Node<K,V> e; K k;
        if (p.hash == hash && ((k = p.key) == key || (key != null && key.equals(k))))
            e = p;
        else if (p instanceof TreeNode)
            e = ((TreeNode<K,V>)p).putTreeVal(this, tab, hash, key, value);
        else {
            for (int binCount = 0; ; ++binCount) {
                if ((e = p.next) == null) {
                    p.next = newNode;
                    break;
                }
                if (e.hash == hash && ((k = e.key) == key || (key != null && key.equals(k))))
                    break;
                p = e;
            }
        }
        if (e != null) {
            V oldValue = e.value;
            if (!onlyIfAbsent || oldValue == null)
                e.value = value;
            afterNodeAccess(e);
            return oldValue;
        }
    }
    if (++modCount > threshold)
        resize();
    afterNodeInsertion(evict);
    return null;
}
```

### 2.4 get

`get` 方法首先计算元素的哈希值，然后定位到相应的桶，最后进行查找操作。

```java
public V get(Object key) {
    int hash = hash(key);
    Node<K,V> e;
    if ((e = getNode(hash, key)) == null)
        return null;
    return e.value;
}

final Node<K,V> getNode(int hash, Object key) {
    Node<K,V>[] tab; Node<K,V> first, e; int n; K k;
    if ((tab = table) != null && (n = tab.length) > 0 &&
        (first = tab[(n - 1) & hash]) != null) {
        if (first.hash == hash && ((k = first.key) == key || (key != null && key.equals(k))))
            return first;
        if ((e = first.next) != null) {
            do {
                if (e.hash == hash && ((k = e.key) == key || (key != null && key.equals(k))))
                    return e;
            } while ((e = e.next) != null);
        }
    }
    return null;
}
```

---

## 3. 总结

- **`ConcurrentHashMap` 1.7** 使用分段锁来确保线程安全，通过将整个哈希表划分为多个段，每个段有独立的锁来提高并发性。
- **`ConcurrentHashMap` 1.8** 改进了实现，使用桶数组和链表或红黑树来管理数据，不再使用分段锁。每个桶内部存储链表或红黑树结构。
- **线程安全性**：`ConcurrentHashMap` 保证了高并发情况下的线程安全，且操作时不需要对整个表进行加锁，而是通过

分段锁或桶级锁来减少锁的竞争。

通过这些优化，`ConcurrentHashMap` 可以在多线程环境下提供更高的吞吐量和更低的延迟。

