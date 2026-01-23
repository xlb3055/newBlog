---
icon: pen-to-square
date: 2026-01-23
category:
- 后端
tag:
- 回溯
- N皇后
- leetcode
---

# 51. N皇后

---

## 题目
**描述：**
按照国际象棋的规则，皇后可以攻击与之处在同一行或同一列或同一斜线上的棋子。

**n皇后问题** 研究的是如何将 `n` 个皇后放置在 `n×n` 的棋盘上，并且使皇后彼此之间不能相互攻击。

给你一个整数 `n`，返回所有不同的 **n 皇后问题** 的解决方案。

每一种解法包含一个不同的 n 皇后问题的棋子放置方案，该方案中 `'Q'` 和 `'.'` 分别代表了皇后和空位。

**示例：**
示例 1:
```
输入: n = 4
输出: [[".Q..","...Q","Q...","..Q."],["..Q.","Q...","...Q",".Q.."]]
解释: 如上图所示，4 皇后问题存在两个不同的解法。
```
示例 2:
```
输入: n = 1
输出: [["Q"]]
```

---

## 解题思路
### 核心方法
**回溯法 + 对角线与列的冲突检测**：
1.  **路径选择**：使用数组 `temp` 存储每一行皇后所在的列索引。
2.  **冲突检测**：
    - **列冲突**：使用布尔数组 `col` 标记某一列是否已放置皇后。
    - **左对角线冲突**：使用布尔数组 `left` 标记主对角线（行号-列号为常数）是否已放置皇后。
    - **右对角线冲突**：使用布尔数组 `right` 标记副对角线（行号+列号为常数）是否已放置皇后。
3.  **递归终止条件**：当当前行号 `depth` 等于 `n` 时，将当前棋盘状态加入结果列表。
4.  **回溯过程**：
    - 遍历当前行的每一列，若该列和对应的两条对角线均无冲突，则放置皇后。
    - 递归进入下一行，尝试放置下一个皇后。
    - 递归返回后，撤销当前行的皇后放置，继续尝试其他列。

---

## 代码实现

### 回溯法（Java）
```java
import java.util.*;

class Solution {
    List<List<String>> ans = new ArrayList<>();
    
    public List<List<String>> solveNQueens(int n) {
        boolean[] col = new boolean[n];
        boolean[] left = new boolean[2 * n - 1];
        boolean[] right = new boolean[2 * n - 1];
        int[] temp = new int[n];
        dfs(n, left, right, temp, col, 0);
        return ans;
    }
    
    private void dfs(int n, boolean[] left, boolean[] right, int[] temp, boolean[] col, int depth) {
        if (depth == n) {
            ans.add(build(temp));
            return;
        }
        for (int i = 0; i < n; i++) {
            if (left[depth + i] || right[depth - i + n - 1] || col[i]) {
                continue;
            }
            left[depth + i] = true;
            right[depth - i + n - 1] = true;
            col[i] = true;
            temp[depth] = i;
            dfs(n, left, right, temp, col, depth + 1);
            left[depth + i] = false;
            right[depth - i + n - 1] = false;
            col[i] = false;
        }
    }
    
    private List<String> build(int[] temp) {
        List<String> board = new ArrayList<>();
        int n = temp.length;
        for (int i = 0; i < n; i++) {
            char[] row = new char[n];
            Arrays.fill(row, '.');
            row[temp[i]] = 'Q';
            board.add(new String(row));
        }
        return board;
    }
}
```

---

## 复杂度分析
- **时间复杂度**：`O(n!)`，其中 `n` 是皇后的数量。第一行有 `n` 种选择，第二行最多有 `n-2` 种选择，以此类推，总时间复杂度为 `n!`。
- **空间复杂度**：`O(n)`，递归栈的深度为 `n`，冲突检测数组和临时存储数组的空间也为 `O(n)`。

---

## 总结
1.  回溯法通过冲突检测和状态回溯，能够高效生成所有合法的 N 皇后放置方案。
2.  对角线冲突的检测通过将行号与列号的和、差映射到数组索引实现，时间复杂度为 `O(1)`。
3.  该方法的核心在于避免了暴力枚举所有可能的放置方式，通过剪枝显著提升了效率。

---

