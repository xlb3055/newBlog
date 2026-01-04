---
icon: pen-to-square
date: 2025-1-04
category:
- 后端
tag:
- 链表
- leecode
---

# 146. LRU 缓存

## 📝 题目描述
设计实现满足 **LRU（最近最少使用）** 缓存约束的数据结构 `LRUCache`，支持以下操作：
- `LRUCache(int capacity)`：以正整数 `capacity` 初始化缓存容量；
- `int get(int key)`：若 `key` 存在则返回对应值，否则返回 `-1`；
- `void put(int key, int value)`：若 `key` 存在则更新值；若不存在则插入键值对，若容量超限则逐出**最久未使用**的键。
  要求 `get` 和 `put` 操作的平均时间复杂度为 \(O(1)\)。


## 📌 示例
输入：
```
["LRUCache", "put", "put", "get", "put", "get", "put", "get", "get", "get"]
[[2], [1, 1], [2, 2], [1], [3, 3], [2], [4, 4], [1], [3], [4]]
```
输出：
```
[null, null, null, 1, null, -1, null, -1, 3, 4]
```
解释：
- 初始化容量为 2 的缓存；
- 插入 `(1,1)`、`(2,2)`，缓存为 `{1:1, 2:2}`；
- 获取 `1`（使用过），返回 `1`；
- 插入 `(3,3)`，容量超限，逐出最久未用的 `2`，缓存为 `{1:1, 3:3}`；
- 获取 `2`，不存在返回 `-1`；
- 插入 `(4,4)`，容量超限，逐出最久未用的 `1`，缓存为 `{3:3, 4:4}`；
- 最终获取 `1`（不存在）、`3`（存在）、`4`（存在），返回对应结果。


## 🚀 最优解：哈希表+双向链表
### 🔍 思路解析
核心策略：用**哈希表**实现 \(O(1)\) 查找，用**双向链表**维护节点的使用顺序（最近使用的节点在链表头部，最久未用的在尾部）：
1. **双向链表**：节点存储 `key`、`value`，以及前驱/后继指针，支持 \(O(1)\) 插入/删除；
2. **哈希表**：键为缓存的 `key`，值为对应的链表节点，支持 \(O(1)\) 定位节点；
3. **操作逻辑**：
    - `get`：若 `key` 存在，将节点移到链表头部（标记为最近使用），返回值；
    - `put`：若 `key` 存在，更新值并移到头部；若不存在，新建节点插入头部，若容量超限则删除链表尾部节点（最久未用），并从哈希表中移除。


---

## ✅ 完整代码（Java）
```java
import java.util.HashMap;
import java.util.Map;
import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        if (!scanner.hasNextInt()) {
            scanner.close();
            return;
        }
        int capacity = scanner.nextInt();
        int n = scanner.nextInt();

        LRUCache cache = new LRUCache(capacity);
        StringBuilder output = new StringBuilder();

        for (int i = 0; i < n; i++) {
            String op = scanner.next();
            if ("put".equals(op)) {
                int key = scanner.nextInt();
                int value = scanner.nextInt();
                cache.put(key, value);
                output.append("null\n");
            } else if ("get".equals(op)) {
                int key = scanner.nextInt();
                output.append(cache.get(key)).append("\n");
            }
        }

        System.out.print(output.toString());
        scanner.close();
    }
}

class LRUCache {
    // 双向链表节点
    class Node {
        int key;
        int value;
        Node pre;
        Node next;
        Node(int key, int value) {
            this.key = key;
            this.value = value;
        }
    }

    private int capacity;
    private Map<Integer, Node> map;
    private Node dummy; // 虚拟头节点（简化边界处理）

    public LRUCache(int capacity) {
        this.capacity = capacity;
        this.map = new HashMap<>();
        this.dummy = new Node(-1, -1);
        dummy.pre = dummy; // 初始化双向链表为环形（头节点的pre指向尾节点）
        dummy.next = dummy;
    }

    public int get(int key) {
        if (!map.containsKey(key)) {
            return -1;
        }
        Node node = map.get(key);
        remove(node); // 移除当前节点
        putFirst(node); // 移到链表头部（标记为最近使用）
        return node.value;
    }

    public void put(int key, int value) {
        if (map.containsKey(key)) {
            Node node = map.get(key);
            node.value = value; // 更新值
            remove(node);
            putFirst(node);
            return;
        }
        // 新建节点
        Node newNode = new Node(key, value);
        map.put(key, newNode);
        putFirst(newNode);
        // 容量超限，删除尾部节点
        if (map.size() > capacity) {
            Node tail = dummy.pre; // 尾节点是dummy的pre
            remove(tail);
            map.remove(tail.key);
        }
    }

    // 从链表中移除节点
    private void remove(Node node) {
        node.next.pre = node.pre;
        node.pre.next = node.next;
    }

    // 将节点插入到链表头部（dummy的next位置）
    private void putFirst(Node node) {
        dummy.next.pre = node;
        node.next = dummy.next;
        dummy.next = node;
        node.pre = dummy;
    }
}
```


---

## 🧠 通俗易懂解释
可以把 LRU 缓存想象成“一个有序的柜子”：
- **双向链表**是柜子的“隔板”，最近用的物品放在最上层，最久不用的放在最下层；
- **哈希表**是物品的“标签”，能快速找到物品所在的隔板位置；
- 拿物品（`get`）时，找到后把它移到最上层；放新物品（`put`）时，放在最上层，柜子满了就把最下层的物品扔掉。

以示例中的 `put(3,3)` 操作为例：
1. 缓存已有 `1`（在最上层）和 `2`（在下层）；
2. 插入 `3` 后柜子满了，把最下层的 `2` 扔掉；
3. 把 `3` 放在最上层，此时柜子上层是 `3`，下层是 `1`。


---

## ⏱ 时间复杂度
- `get`/`put`：\(O(1)\)
  哈希表操作是 \(O(1)\)，双向链表的插入/删除也是 \(O(1)\)。


---

## 💾 空间复杂度
- \(O(capacity)\)
  哈希表和双向链表的存储容量不超过缓存的最大容量 `capacity`。
