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
# HashMap

`HashMap` 是 Java 中常用的基于哈希表实现的映射集合，它用于存储键值对（key-value）形式的元素，并支持高效的查找、插入、删除操作。通过哈希表的方式，它能够在大多数情况下实现常数时间复杂度 \( O(1) \) 的查找、插入和删除操作。

#### HashMap 简介

`HashMap` 实现了 `Map` 接口，它存储键值对映射，并且允许键和值为 `null`。`HashMap` 并不是线程安全的，如果需要线程安全的映射结构，可以使用 `ConcurrentHashMap` 或通过 `Collections.synchronizedMap()` 方法来包装 `HashMap`。

#### 底层数据结构分析

`HashMap` 的底层数据结构是一个数组 + 链表（或红黑树）组合的哈希表。

- **数组**：用于存储数据的桶（bucket）。每个桶位置存储一个链表或红黑树的头节点。
- **链表**：当哈希冲突（不同的键经过哈希函数计算后得到相同的索引）发生时，使用链表存储冲突的元素。
- **红黑树**：在链表的长度超过一定阈值时，链表会被转换为红黑树，以提高查找效率（时间复杂度降到 \( O(\log n) \)）。

#### JDK1.8 之前

在 JDK1.8 之前，`HashMap` 使用的是一个纯粹的数组加链表的结构。当多个元素的哈希值相同并且冲突时，这些元素就会被链接成一个链表。查找元素时需要遍历该链表。

#### JDK1.8 之后

从 JDK1.8 开始，当链表的长度超过一定阈值（默认为 8），`HashMap` 会把链表转换为红黑树，提升查找效率。这个阈值是一个动态调整的过程。红黑树是一种自平衡的二叉查找树，能够保证最坏情况下的查找、插入和删除时间复杂度为 \( O(\log n) \)。

### HashMap 源码分析

#### 构造方法

`HashMap` 的构造方法有多个重载版本，常见的是以下两种：

```java
public HashMap(int initialCapacity, float loadFactor) {
    if (initialCapacity < 0)
        throw new IllegalArgumentException("Illegal Capacity: " +
                                           initialCapacity);
    if (initialCapacity > MAX_ARRAY_SIZE)
        initialCapacity = MAX_ARRAY_SIZE;
    if (loadFactor <= 0 || Float.isNaN(loadFactor))
        throw new IllegalArgumentException("Illegal Load: " +
                                           loadFactor);
    this.threshold = tableSizeFor(initialCapacity);
    this.loadFactor = loadFactor;
}

public HashMap() {
    this(16, 0.75f);
}
```

- `initialCapacity`：指定 `HashMap` 初始容量。它决定了 `HashMap` 底层数组的大小。
- `loadFactor`：负载因子，决定了何时需要扩容。负载因子是一个介于 0 到 1 之间的浮动系数，当当前元素数量达到负载因子与容量的乘积时，`HashMap` 会扩容。

#### put 方法

`put` 方法用于插入键值对，并处理哈希冲突。其源码如下：

```java
public V put(K key, V value) {
    return putVal(hash(key), key, value, false, true);
}

final V putVal(int hash, K key, V value, boolean onlyIfAbsent, boolean evict) {
    Node<K,V>[] tab; Node<K,V> p; int n, i;

    if ((tab = table) == null || (n = tab.length) == 0)
        n = (tab = resize()).length;
    if ((p = tab[i = (n - 1) & hash]) == null)
        tab[i] = newNode(hash, key, value, null);
    else {
        Node<K,V> e; K k;
        if (p.hash == hash && ((k = p.key) == key || (key != null && key.equals(k))))
            e = p;
        else if (p instanceof TreeNode)
            e = ((TreeNode<K,V>)p).putTreeVal(this, tab, hash, key, value);
        else {
            for (int binCount = 0; ; ++binCount) {
                if ((e = p.next) == null) {
                    p.next = newNode(hash, key, value, null);
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

1. **哈希值计算**：`hash(key)` 用来计算 key 的哈希值。
2. **哈希冲突处理**：如果桶的位置已经有元素（即发生了哈希冲突），则通过链表或红黑树进行处理。
3. **扩容**：如果插入后元素数量超过负载因子与容量的乘积，`resize` 方法会被调用进行扩容。

#### get 方法

`get` 方法用于根据键查找值，其源码如下：

```java
public V get(Object key) {
    Node<K,V> e;
    return (e = getNode(hash(key), key)) == null ? null : e.value;
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

- 通过哈希值定位桶，然后依次比较桶中的元素，直到找到匹配的键。
- 如果桶中的元素链表较长，可能会发生遍历，甚至链表会转变为红黑树以提高查找效率。

#### resize 方法

当 `HashMap` 中的元素超过负载因子与容量的乘积时，需要进行扩容。`resize` 方法负责扩容：

```java
final Node<K,V>[] resize() {
    Node<K,V>[] oldTab = table;
    int oldCapacity = (oldTab == null) ? 0 : oldTab.length;
    int newCapacity = oldCapacity << 1;
    if (newCapacity > MAX_ARRAY_SIZE)
        return oldTab;
    Node<K,V>[] newTab = (Node<K,V>[])new Node[newCapacity];
    transfer(newTab);
    table = newTab;
    threshold = (int)(newCapacity * loadFactor);
    return newTab;
}
```

- **扩容**：每次扩容时，容量翻倍，新的数组大小是原来的两倍。
- **转移**：将原数组中的元素迁移到新的数组中。

#### HashMap 常用方法测试

```java
public class HashMapTest {
    public static void main(String[] args) {
        HashMap<String, Integer> map = new HashMap<>();

        // 添加元素
        map.put("one", 1);
        map.put("two", 2);
        map.put("three", 3);

        // 获取元素
        System.out.println("Value for key 'one': " + map.get("one"));  // 输出: 1

        // 删除元素
        map.remove("two");

        // 遍历 HashMap
        for (Map.Entry<String, Integer> entry : map.entrySet()) {
            System.out.println(entry.getKey() + " => " + entry.getValue());
        }
    }
}
```

### 总结

- **HashMap** 是基于哈希表实现的，支持高效的键值对存储与查找。
- **扩容机制**：当元素数量达到负载因子与当前容量的乘积时，`HashMap` 会自动扩容并重新哈希所有元素。
- **哈希冲突**：通过链表和红黑树的方式处理哈希冲突，提升了查找效率。
- **线程安全**：`HashMap` 不是线程安全的，在多线程环境下需要使用 `ConcurrentHashMap` 或外部同步机制。
