---
icon: pen-to-square
date: 2026-1-21
category:
- 后端
tag:
- 二叉搜索树
- 中序遍历
- leetcode
---

# 230. 二叉搜索树中第K小的元素

---

## 题目
**描述：**
给定一个二叉搜索树的根节点 `root`，和一个整数 `k`，请你设计一个算法查找其中第 `k` 小的元素（k 从 1 开始计数）。

**示例：**
示例 1:
```
输入: root = [3,1,4,null,2], k = 1
输出: 1
```
示例 2:
```
输入: root = [5,3,6,2,4,null,null,1], k = 3
输出: 3
```

---

## 解题思路
### 核心方法
**中序遍历法**：二叉搜索树的中序遍历结果是升序序列，因此第 `k` 小的元素就是中序遍历的第 `k` 个元素。
- 递归中序遍历：通过计数器记录访问到的元素序号，当计数器等于 `k` 时，返回当前节点值。
- 迭代中序遍历：使用栈模拟递归过程，手动控制遍历顺序，找到第 `k` 个元素。

### 算法步骤（递归法）
1.  **初始化计数器和结果变量**：使用全局变量 `count` 记录当前访问的元素序号，`ans` 存储第 `k` 小的元素。
2.  **递归中序遍历**：
    - 先递归遍历左子树。
    - 计数器减1，若计数器为0，说明当前节点是第 `k` 小的元素，记录到 `ans`。
    - 递归遍历右子树。
3.  **返回结果**：遍历完成后，返回 `ans`。

---

## 代码实现

### 递归法（Java）
```java
class TreeNode {
    int val;
    TreeNode left;
    TreeNode right;
    TreeNode() {}
    TreeNode(int val) { this.val = val; }
    TreeNode(int val, TreeNode left, TreeNode right) {
        this.val = val;
        this.left = left;
        this.right = right;
    }
}

class Solution {
    int ans;
    int count;
    
    public int kthSmallest(TreeNode root, int k) {
        count = k;
        kthSmallest(root);
        return ans;
    }
    
    public void kthSmallest(TreeNode root) {
        if (root == null) return;
        kthSmallest(root.left);
        if (--count == 0) ans = root.val;
        kthSmallest(root.right);
    }
}
```

### 迭代法（Java）
```java
import java.util.*;

class Solution {
    public int kthSmallest(TreeNode root, int k) {
        Deque<TreeNode> stack = new LinkedList<>();
        TreeNode curr = root;
        
        while (curr != null || !stack.isEmpty()) {
            // 遍历到最左子节点
            while (curr != null) {
                stack.push(curr);
                curr = curr.left;
            }
            // 弹出栈顶节点
            curr = stack.pop();
            if (--k == 0) return curr.val;
            // 转向右子树
            curr = curr.right;
        }
        return -1;
    }
}
```

---

## 复杂度分析
### 递归法
- **时间复杂度**：`O(h + k)`，其中 `h` 是二叉树的高度，`k` 是目标序号。最坏情况下需要遍历到第 `k` 个元素。
- **空间复杂度**：`O(h)`，递归栈的深度取决于树的高度。

### 迭代法
- **时间复杂度**：`O(h + k)`，与递归法一致。
- **空间复杂度**：`O(h)`，栈的大小取决于树的高度。

---

## 总结
1.  中序遍历是解决二叉搜索树第 `k` 小元素问题的最优方法，利用了BST的升序特性。
2.  递归法实现简洁，但需要全局变量传递状态；迭代法通过栈模拟递归，避免了全局变量的使用。
3.  若需要频繁查询第 `k` 小元素，可以在每个节点维护子树节点数，将时间复杂度优化到 `O(h)`。

---

