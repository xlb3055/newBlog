---
icon: pen-to-square
date: 2024-12-01
category:
- 后端
tag:
- Redis
- 数据库
---
# Redis跳表实现有序集合


在 Redis 中，有序集合（Sorted Set，简称 Zset）是一个非常常用的数据结构，用于存储带有权重（分数）的元素，可以根据分数进行排序。Redis 选择使用 **跳表**（Skip List）来实现有序集合，这是一个相对高效且灵活的选择。下面将详细分析跳表的优势、与其他数据结构的比较，以及 Redis 为何采用它。

---

### 跳表在 Redis 中的运用

跳表在 Redis 中主要用于实现有序集合（Sorted Set）。在有序集合中，每个元素包含两个部分：成员（Member）和分数（Score）。Redis 通过跳表来管理这些成员，使得它可以在对元素进行插入、删除、范围查询等操作时，保持较好的时间复杂度。

#### 跳表的基本原理

跳表是一个用于实现有序数据集合的数据结构，它通过多级索引链表来优化查找效率。每一级链表都是上一层链表的子集，通过每层索引的跳跃，可以快速地定位到目标元素，从而减少查找的复杂度。

跳表的结构类似于多级链表，每一层索引链表跳跃的范围越来越大，最终达到一个非常高效的查找速度。跳表的优点在于它的结构较为简单，且能够保持良好的性能。

---

### 手写一个跳表

跳表的核心思想是通过多层链表来优化查找过程，下面简要实现一个跳表：

#### 1. 模板定义

```java
class SkipListNode {
    int value;
    SkipListNode[] forward; // 指向不同层次的节点
    SkipListNode(int value, int level) {
        this.value = value;
        this.forward = new SkipListNode[level];
    }
}

class SkipList {
    private static final int MAX_LEVEL = 16;  // 最大层数
    private SkipListNode header;
    private int level;

    public SkipList() {
        this.header = new SkipListNode(Integer.MIN_VALUE, MAX_LEVEL);
        this.level = 1;
    }

    public void insert(int value) {
        SkipListNode[] update = new SkipListNode[MAX_LEVEL];
        SkipListNode current = header;

        // 从高层到低层遍历寻找插入位置
        for (int i = level - 1; i >= 0; i--) {
            while (current.forward[i] != null && current.forward[i].value < value) {
                current = current.forward[i];
            }
            update[i] = current;
        }

        current = current.forward[0];
        if (current == null || current.value != value) {
            int newLevel = randomLevel();
            if (newLevel > level) {
                for (int i = level; i < newLevel; i++) {
                    update[i] = header;
                }
                level = newLevel;
            }

            SkipListNode newNode = new SkipListNode(value, newLevel);
            for (int i = 0; i < newLevel; i++) {
                newNode.forward[i] = update[i].forward[i];
                update[i].forward[i] = newNode;
            }
        }
    }

    public boolean search(int value) {
        SkipListNode current = header;
        for (int i = level - 1; i >= 0; i--) {
            while (current.forward[i] != null && current.forward[i].value < value) {
                current = current.forward[i];
            }
        }
        current = current.forward[0];
        return current != null && current.value == value;
    }

    private int randomLevel() {
        int level = 1;
        while (Math.random() < 0.5 && level < MAX_LEVEL) {
            level++;
        }
        return level;
    }
}
```

#### 2. 元素添加

- **插入操作**：从高层到低层遍历链表，找到待插入位置，然后随机生成层数，并更新节点。

#### 3. 元素查询

- **查找操作**：通过从上至下的方式遍历跳表，逐层判断直到找到目标元素或到达链表的尾部。

#### 4. 元素删除

- 跳表删除元素的操作与插入操作类似，也是逐层遍历链表并更新指针。

#### 5. 完整代码及测试

```java
public class SkipListTest {
    public static void main(String[] args) {
        SkipList skipList = new SkipList();
        skipList.insert(3);
        skipList.insert(6);
        skipList.insert(7);
        skipList.insert(9);
        skipList.insert(12);

        System.out.println("Search 6: " + skipList.search(6));  // true
        System.out.println("Search 10: " + skipList.search(10)); // false
    }
}
```

---

### 跳表与其他数据结构的比较

#### 1. 平衡树 vs 跳表

- **平衡树**（如 AVL、红黑树）通过旋转操作来保持平衡，保证查找、插入、删除操作的时间复杂度为 O(log N)。
- **跳表**的平均时间复杂度也为 O(log N)，但是跳表没有平衡树的旋转操作，而是通过多级索引优化查找过程。

**区别**：
- 跳表结构相对简单，不需要平衡操作，易于实现。
- 平衡树具有较好的最坏情况性能（每次插入或删除时进行旋转），但是实现较复杂。

#### 2. 红黑树 vs 跳表

- **红黑树**是一种自平衡的二叉查找树，具有 O(log N) 的查询、插入和删除复杂度。每次插入或删除元素时，红黑树通过旋转操作来保持树的平衡。
- **跳表**的查询和更新操作也是 O(log N)，但它通过分层链表来减少查找时间。

**区别**：
- 跳表的实现更简单，代码更清晰。
- 红黑树在最坏情况下的性能通常更稳定，但实现相对复杂。

#### 3. B+树 vs 跳表

- **B+树**是一种多路平衡查找树，广泛应用于数据库索引。它适用于磁盘存储，并且能更有效地利用磁盘存储器。
- **跳表**在内存中查询和更新操作更快，适合于内存存储。

**区别**：
- B+树适用于磁盘存储，跳表适用于内存存储。
- 跳表的实现更简单，适用于内存较小、查询和插入需求较高的场景。

---

### Redis 作者给出的理由

Redis 作者选择跳表作为有序集合的实现方案，主要是基于以下几个方面的考虑：

1. **简洁易实现**：
   跳表比平衡树和 B+ 树等数据结构更简单，避免了复杂的平衡操作。实现一个高效的跳表比实现一个平衡树容易得多，尤其是在涉及到内存和性能优化时，跳表的实现更加直接。

2. **高效的查询性能**：
   跳表具有 O(log N) 的查询复杂度，同时也支持范围查询。跳表的多级索引使得它在查询时能够非常高效，特别是对于需要大量范围查询的应用场景。

3. **高效的插入和删除性能**：
   跳表支持 O(log N) 的插入和删除操作，相比于红黑树等结构，跳表没有复杂的旋转操作，因此插入和删除操作更为简单。

4. **内存友好**：
   跳表的内存分配比树结构简单，减少了内存的碎片化问题，适合 Redis 的内存数据库架构。

---

### 小结

Redis 选择跳表作为有序集合的实现方式，主要是基于跳表结构简单、实现容易、高效的查找和更新性能以及内存使用友好等优势。与其他数据结构如平衡树、红黑树和 B+ 树相比，跳表不仅能提供 O(log N) 的查询性能，而且它的实现更为简洁，适用于内存操作的高效需求。

在实际应用中，跳表非常适合用来管理需要按顺序访问的元素，如有序集合、排行榜等场景。Redis 通过使用跳表来实现高效的有序集合，确保其性能和可维护性。

---

