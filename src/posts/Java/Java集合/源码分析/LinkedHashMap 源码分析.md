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
# LinkedHashMap


`LinkedHashMap` 是 Java 中的一种 HashMap 的子类，继承了 `HashMap` 的所有特性，并且保留了元素的插入顺序或访问顺序。它实现了 `Map` 接口，并且提供了基于链表的有序遍历，主要有两个重要的特性：

- **插入顺序**：保持元素插入时的顺序。
- **访问顺序**：按照元素被访问的顺序进行遍历。

### 1. LinkedHashMap 简介

`LinkedHashMap` 是一种特殊的 `HashMap`，它不仅具有 `HashMap` 的快速查找、插入和删除性能，还保持了插入顺序或访问顺序。它的底层实现是双向链表与哈希表结合的结构。

`LinkedHashMap` 主要有以下特点：

- **插入顺序遍历**：插入顺序指的是元素插入 `LinkedHashMap` 时的顺序，可以通过迭代器来遍历。
- **访问顺序遍历**：访问顺序指的是元素按照访问顺序进行遍历，即每次访问一个元素时，它会被移到链表的末尾。
- **LRU 缓存**：由于 `LinkedHashMap` 维护了插入顺序和访问顺序，因此可以用它来实现简单的 LRU（Least Recently Used）缓存机制。

### 2. LinkedHashMap 使用示例

#### 2.1 插入顺序遍历

```java
import java.util.LinkedHashMap;
import java.util.Map;

public class LinkedHashMapExample {
    public static void main(String[] args) {
        Map<Integer, String> map = new LinkedHashMap<>();
        map.put(1, "One");
        map.put(2, "Two");
        map.put(3, "Three");
        
        for (Map.Entry<Integer, String> entry : map.entrySet()) {
            System.out.println(entry.getKey() + ": " + entry.getValue());
        }
    }
}
```

输出：
```
1: One
2: Two
3: Three
```
- 该例子展示了按照插入顺序遍历 `LinkedHashMap`。

#### 2.2 访问顺序遍历

通过在 `LinkedHashMap` 的构造函数中传入 `accessOrder` 参数为 `true`，可以使得 `LinkedHashMap` 按照访问顺序遍历：

```java
import java.util.LinkedHashMap;
import java.util.Map;

public class LinkedHashMapAccessOrderExample {
    public static void main(String[] args) {
        Map<Integer, String> map = new LinkedHashMap<>(16, 0.75f, true);
        map.put(1, "One");
        map.put(2, "Two");
        map.put(3, "Three");
        
        map.get(1);  // 访问元素 1
        map.get(3);  // 访问元素 3
        
        for (Map.Entry<Integer, String> entry : map.entrySet()) {
            System.out.println(entry.getKey() + ": " + entry.getValue());
        }
    }
}
```

输出：
```
1: One
3: Three
2: Two
```

- 该示例中，元素被按访问顺序遍历，访问元素后，`LinkedHashMap` 会将它们移到末尾。

#### 2.3 LRU 缓存

`LinkedHashMap` 可以用来实现 LRU（Least Recently Used）缓存。通过构造函数中的 `accessOrder` 参数和 `removeEldestEntry` 方法，可以轻松实现 LRU 缓存。

```java
import java.util.LinkedHashMap;
import java.util.Map;

public class LRUCacheExample {
    public static void main(String[] args) {
        Map<Integer, String> lruCache = new LinkedHashMap<>(16, 0.75f, true) {
            @Override
            protected boolean removeEldestEntry(Map.Entry<Integer, String> eldest) {
                return size() > 3;  // 设置缓存最大容量为 3
            }
        };
        
        lruCache.put(1, "One");
        lruCache.put(2, "Two");
        lruCache.put(3, "Three");
        lruCache.put(4, "Four");  // 插入第四个元素，最旧的元素（1）将被移除

        System.out.println(lruCache);  // 输出：{2=Two, 3=Three, 4=Four}
    }
}
```

### 3. LinkedHashMap 源码解析

#### 3.1 Node 的设计

`LinkedHashMap` 继承自 `HashMap`，其中定义了一个内部类 `Node`，该类扩展了 `Map.Entry` 接口，包含了键、值和指向前后节点的指针。通过双向链表连接每个元素节点。

```java
static class Node<K,V> extends HashMap.Entry<K,V> {
    Node<K,V> before, after;
    
    Node(int hash, K key, V value, Node<K,V> next) {
        super(hash, key, value, next);
    }
}
```

- **`before`**：指向上一个节点。
- **`after`**：指向下一个节点。

#### 3.2 构造方法

`LinkedHashMap` 的构造方法包含以下内容：

```java
public LinkedHashMap(int initialCapacity, float loadFactor, boolean accessOrder) {
    super(initialCapacity, loadFactor);
    this.accessOrder = accessOrder;
}
```

- **`initialCapacity`**：初始容量，默认值是 16。
- **`loadFactor`**：负载因子，默认值是 0.75。
- **`accessOrder`**：指定是否按访问顺序遍历元素，`true` 为按访问顺序，`false` 为按插入顺序。

#### 3.3 `get` 方法

`get` 方法在查找元素时，如果启用了访问顺序，会将当前访问的节点移动到链表的尾部。

```java
public V get(Object key) {
    Node<K,V> e = getNode(hash(key), key);
    if (e == null)
        return null;
    if (accessOrder)
        afterNodeAccess(e);
    return e.value;
}
```

- **`afterNodeAccess(Node<K,V> e)`**：当访问某个节点时，调用 `afterNodeAccess` 方法将该节点移到链表的末尾。

#### 3.4 `remove` 方法后置操作——`afterNodeRemoval`

`afterNodeRemoval` 用于节点移除后的清理操作。

```java
void afterNodeRemoval(Node<K,V> e) {
    // 清理操作
}
```

#### 3.5 `put` 方法后置操作——`afterNodeInsertion`

`afterNodeInsertion` 方法在插入节点后执行，用于调整节点位置，尤其是在开启访问顺序时。

```java
void afterNodeInsertion(boolean evict) {
    // 更新链表，调整节点顺序
}
```

### 4. LinkedHashMap 和 HashMap 遍历性能比较

- **HashMap**：在遍历时没有任何顺序保证，因此遍历的顺序是随机的。
- **LinkedHashMap**：通过双向链表来维护顺序，因此在遍历时可以保证按照插入顺序或访问顺序遍历元素。由于额外的链表开销，遍历的性能较 `HashMap` 略差。

### 5. LinkedHashMap 常见面试题

1. **什么是 LinkedHashMap？**
    - `LinkedHashMap` 是 `HashMap` 的子类，除了提供哈希表的特性外，还能够保持元素的插入顺序或访问顺序。

2. **LinkedHashMap 如何按照插入顺序迭代元素？**
    - 默认情况下，`LinkedHashMap` 按照元素的插入顺序进行迭代。

3. **LinkedHashMap 如何按照访问顺序迭代元素？**
    - 通过在构造函数中设置 `accessOrder = true`，可以使得元素按照访问顺序进行迭代。

4. **LinkedHashMap 如何实现 LRU 缓存？**
    - 通过设置 `accessOrder` 为 `true` 并重写 `removeEldestEntry` 方法，可以实现 LRU 缓存。当缓存容量超过设定值时，移除最久未访问的元素。

5. **LinkedHashMap 和 HashMap 有什么区别？**
    - `LinkedHashMap` 保持元素的插入顺序或访问顺序，而 `HashMap` 是无序的。

---

