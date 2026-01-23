---
icon: pen-to-square
date: 2026-01-23
category:
  - 后端
tag:
  - 前缀树
  - Trie
  - leetcode
---

# 208. 实现 Trie (前缀树)

---

## 题目
**描述：**
Trie（发音类似 "try"）或者说前缀树是一种树形数据结构，用于高效地存储和检索字符串数据集中的键。这一数据结构有相当多的应用情景，例如自动补全和拼写检查。

请你实现 Trie 类：
- `Trie()` 初始化前缀树对象。
- `void insert(String word)` 向前缀树中插入字符串 `word`。
- `boolean search(String word)` 如果字符串 `word` 在前缀树中，返回 `true`（即，在检索之前已经插入）；否则，返回 `false`。
- `boolean startsWith(String prefix)` 如果之前已经插入的字符串 `word` 的前缀之一为 `prefix`，返回 `true`；否则，返回 `false`。

**示例：**
```
输入
["Trie", "insert", "search", "search", "startsWith", "insert", "search"]
[[], ["apple"], ["apple"], ["app"], ["app"], ["app"], ["app"]]
输出
[null, null, true, false, true, null, true]
```
解释：
```
Trie trie = new Trie();
trie.insert("apple");
trie.search("apple");   // 返回 True
trie.search("app");     // 返回 False
trie.startsWith("app"); // 返回 True
trie.insert("app");
trie.search("app");     // 返回 True
```

---

## 解题思路
### 核心方法
**前缀树节点设计**：
1.  **节点结构**：每个节点包含一个大小为 26 的数组（对应 26 个小写英文字母），存储子节点的引用；以及一个布尔值 `isEnd`，标记该节点是否为某个字符串的结尾。
2.  **插入操作**：从根节点开始，遍历字符串的每个字符，若当前字符对应的子节点不存在则创建新节点，然后移动到该子节点；遍历结束后，将最后一个节点的 `isEnd` 设为 `true`。
3.  **搜索操作**：从根节点开始，遍历字符串的每个字符，若当前字符对应的子节点不存在则返回 `false`；遍历结束后，检查最后一个节点的 `isEnd` 是否为 `true`。
4.  **前缀检查**：与搜索操作类似，但无需检查 `isEnd`，只要所有字符对应的子节点都存在即可返回 `true`。

---

## 代码实现

### Java 实现
```java
class Trie {
    class Node {
        Node[] son = new Node[26];
        boolean isEnd;
    }

    private Node root;

    public Trie() {
        root = new Node();
    }
    
    public void insert(String word) {
        Node curr = root;
        for (char c : word.toCharArray()) {
            int idx = c - 'a';
            if (curr.son[idx] == null) {
                curr.son[idx] = new Node();
            }
            curr = curr.son[idx];
        }
        curr.isEnd = true;
    }
    
    public boolean search(String word) {
        Node curr = root;
        for (char c : word.toCharArray()) {
            int idx = c - 'a';
            if (curr.son[idx] == null) {
                return false;
            }
            curr = curr.son[idx];
        }
        return curr.isEnd;
    }
    
    public boolean startsWith(String prefix) {
        Node curr = root;
        for (char c : prefix.toCharArray()) {
            int idx = c - 'a';
            if (curr.son[idx] == null) {
                return false;
            }
            curr = curr.son[idx];
        }
        return true;
    }
}
```

---

## 复杂度分析
- **插入操作**：时间复杂度 `O(L)`，其中 `L` 是字符串的长度。每个字符的处理时间为 `O(1)`。
- **搜索操作**：时间复杂度 `O(L)`，其中 `L` 是字符串的长度。
- **前缀检查**：时间复杂度 `O(L)`，其中 `L` 是前缀的长度。
- **空间复杂度**：`O(N * L)`，其中 `N` 是插入的字符串数量，`L` 是字符串的平均长度。每个字符对应一个节点，空间与所有字符串的字符总数成正比。

---

## 总结
1.  Trie 是一种专门用于字符串存储和检索的数据结构，在处理前缀相关问题时效率极高。
2.  节点的 `isEnd` 字段是区分完整字符串和前缀的关键。
3.  该实现仅支持小写英文字母，若需支持更多字符，可将子节点数组替换为哈希表以节省空间。

---

