---
icon: pen-to-square
date: 2026-01-21
category:
  - 后端
tag:
  - 二叉树
  - 前缀和
  - 深度优先搜索
  - leetcode
---

# 437. 路径总和 III

---

## 题目
**描述：**
给定一个二叉树的根节点 `root`，和一个整数 `targetSum`，求该二叉树里节点值之和等于 `targetSum` 的路径的数目。
路径不需要从根节点开始，也不需要在叶子节点结束，但是路径方向必须是向下的（只能从父节点到子节点）。

**示例：**
示例 1:
```
输入: root = [10,5,-3,3,2,null,11,3,-2,null,1], targetSum = 8
输出: 3
解释: 和等于 8 的路径有 3 条，如图所示。
```
示例 2:
```
输入: root = [5,4,8,11,null,13,4,7,2,null,null,5,1], targetSum = 22
输出: 3
```

---

## 解题思路
### 核心方法
**前缀和 + 深度优先搜索（DFS）**：
1.  **前缀和定义**：从根节点到当前节点的路径上所有节点值的和。
2.  **路径和与前缀和的关系**：若当前前缀和为 `currSum`，则路径和为 `targetSum` 的路径数目等于前缀和为 `currSum - targetSum` 的节点数目。
3.  **哈希表记录前缀和**：使用哈希表 `map` 记录前缀和出现的次数，初始时前缀和 `0` 出现 1 次（处理从根节点开始的路径）。
4.  **回溯处理**：在递归返回时，需要将当前前缀和的计数减 1，以避免影响其他路径的计算。

### 算法步骤
1.  **初始化哈希表**：`map.put(0L, 1)`，表示前缀和为 0 的路径有 1 条（空路径）。
2.  **深度优先搜索**：
    - 计算当前节点的前缀和 `currSum`。
    - 检查哈希表中是否存在 `currSum - targetSum`，若存在则将对应的次数加入结果 `ans`。
    - 将当前前缀和 `currSum` 加入哈希表（计数加 1）。
    - 递归遍历左子树和右子树。
    - 回溯：将当前前缀和 `currSum` 的计数减 1（避免影响其他路径）。
3.  **返回结果**：遍历完成后，返回 `ans`。

---

## 代码实现

### 前缀和 + DFS（Java）
```java
import java.util.*;

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
    Map<Long, Integer> map = new HashMap<>();
    int target;
    int ans = 0;
    
    public int pathSum(TreeNode root, int targetSum) {
        target = targetSum;
        map.put(0L, 1);
        dfs(root, 0L);
        return ans;
    }
    
    public void dfs(TreeNode root, Long currSum) {
        if (root == null) return;
        currSum += root.val;
        // 统计符合条件的路径数
        ans += map.getOrDefault(currSum - target, 0);
        // 更新前缀和计数
        map.put(currSum, map.getOrDefault(currSum, 0) + 1);
        // 递归遍历左右子树
        dfs(root.left, currSum);
        dfs(root.right, currSum);
        // 回溯：恢复前缀和计数
        map.put(currSum, map.get(currSum) - 1);
    }
}
```

---

## 复杂度分析
- **时间复杂度**：`O(n)`，其中 `n` 是二叉树的节点数。每个节点会被访问一次，哈希表的操作时间为 `O(1)`。
- **空间复杂度**：`O(h)`，`h` 是二叉树的高度。递归栈的深度取决于树的高度，哈希表存储的前缀和数目最多为 `h`（链状树时为 `O(n)`）。

---

## 总结
1.  该方法通过前缀和与哈希表的结合，将路径和问题转化为前缀和的差值问题，时间效率从暴力法的 `O(n²)` 提升到 `O(n)`。
2.  回溯操作是关键，确保递归返回时哈希表的状态正确，避免不同路径之间的干扰。
3.  适用于路径方向向下、路径起点和终点任意的路径和计数问题。

---

