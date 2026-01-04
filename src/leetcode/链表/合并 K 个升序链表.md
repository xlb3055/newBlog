---
icon: pen-to-square
date: 2025-1-04
category:
- 后端
tag:
- 链表
- leecode
---

# 23. 合并 K 个升序链表

## 📝 题目描述
给定一个链表数组，其中每个链表均为**升序排列**，要求将所有链表合并为一个新的升序链表并返回。


## 📌 示例
### 示例 1
输入：`lists = [[1,4,5],[1,3,4],[2,6]]`
输出：`[1,1,2,3,4,4,5,6]`
解释：三个升序链表合并后，得到整体升序的新链表。

### 示例 2
输入：`lists = []`
输出：`[]`

### 示例 3
输入：`lists = [[]]`
输出：`[]`


## 🚀 最优解：分治法（归并思想）
### 🔍 思路解析
核心策略：将“合并 K 个链表”拆解为**多次合并两个链表**，利用分治降低时间复杂度：
1. **分治拆分**：将 K 个链表不断拆分为左右两部分，直到每部分只剩 1 个或 0 个链表；
2. **归并合并**：将拆分后的链表两两合并（利用“合并两个升序链表”的逻辑），最终得到完整的升序链表；
3. **基础操作**：合并两个升序链表时，用虚拟头结点 + 双指针遍历，依次选择较小的结点接入新链表。


---

## ✅ 完整代码（Java）
```java
import java.util.Scanner;

public class Main {
    private static ListNode buildList(String line) {
        if (line == null) {
            return null;
        }
        line = line.trim();
        if (line.isEmpty()) {
            return null;
        }
        String[] values = line.split(" ");
        ListNode dummy = new ListNode(0);
        ListNode tail = dummy;
        for (String val : values) {
            if (val.isEmpty()) {
                continue;
            }
            tail.next = new ListNode(Integer.parseInt(val));
            tail = tail.next;
        }
        return dummy.next;
    }

    private static void printList(ListNode head) {
        StringBuilder sb = new StringBuilder();
        while (head != null) {
            sb.append(head.val);
            if (head.next != null) {
                sb.append(" ");
            }
            head = head.next;
        }
        System.out.println(sb.toString());
    }

    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        int k = 0;
        if (scanner.hasNextInt()) {
            k = scanner.nextInt();
            if (scanner.hasNextLine()) {
                scanner.nextLine();
            }
        }

        ListNode[] lists = new ListNode[k];
        for (int i = 0; i < k; i++) {
            String line = scanner.hasNextLine() ? scanner.nextLine() : "";
            lists[i] = buildList(line);
        }

        Solution solution = new Solution();
        ListNode result = solution.mergeKLists(lists);
        printList(result);
        scanner.close();
    }
}

class Solution {
    public ListNode mergeKLists(ListNode[] lists) {
        if (lists == null || lists.length == 0) {
            return null;
        }
        // 分治合并：从索引0到length-1
        return mergeTwoSortLists(lists, 0, lists.length - 1);
    }

    // 分治：将lists[l..r]的链表合并
    private ListNode mergeTwoSortLists(ListNode[] lists, int l, int r) {
        if (l == r) {
            // 区间内只有一个链表，直接返回
            return lists[l];
        }
        int mid = l + (r - l) / 2;
        // 递归合并左半部分
        ListNode left = mergeTwoSortLists(lists, l, mid);
        // 递归合并右半部分
        ListNode right = mergeTwoSortLists(lists, mid + 1, r);
        // 合并左右两部分的结果
        return mergeTwoList(left, right);
    }

    // 合并两个升序链表
    private ListNode mergeTwoList(ListNode left, ListNode right) {
        ListNode pre = new ListNode(0); // 虚拟头结点
        ListNode cur = pre;
        // 双指针遍历两个链表，选择较小值接入
        while (left != null && right != null) {
            if (left.val < right.val) {
                cur.next = left;
                left = left.next;
            } else {
                cur.next = right;
                right = right.next;
            }
            cur = cur.next;
        }
        // 接入剩余的结点
        cur.next = (left != null) ? left : right;
        return pre.next;
    }
}

class ListNode {
    int val;
    ListNode next;
    ListNode() {}
    ListNode(int val) { this.val = val; }
    ListNode(int val, ListNode next) { this.val = val; this.next = next; }
}
```


---

## 🧠 通俗易懂解释
可以把 K 个链表想象成“一堆文件”，分治法的过程类似**多次两两合并文件**：
- 先把 K 个文件分成左右两堆，再把每堆继续拆分，直到每堆只有 1 个文件；
- 然后把相邻的两个文件合并成一个有序文件，再将合并后的文件继续两两合并，最终得到一个完整的有序文件。

以示例1（`lists = [[1,4,5],[1,3,4],[2,6]]`）为例：
1. 拆分：将 3 个链表拆分为 `[1,4,5]` 和 `[1,3,4],[2,6]`；
2. 再拆分 `[1,3,4],[2,6]` 为 `[1,3,4]` 和 `[2,6]`；
3. 合并：先合并 `[1,3,4]` 和 `[2,6]` 得到 `[1,2,3,4,6]`；
4. 再合并 `[1,4,5]` 和 `[1,2,3,4,6]`，最终得到 `[1,1,2,3,4,4,5,6]`。


---

## ⏱ 时间复杂度
- 设每个链表的平均长度为 `n`，K 为链表数量：
  分治的层数为 \(O(\log K)\)，每层合并的总时间为 \(O(Kn)\)，因此整体时间复杂度为 \(O(Kn \log K)\)。


---

## 💾 空间复杂度
- \(O(\log K)\)：递归调用栈的深度为分治的层数 \(O(\log K)\)，额外空间主要用于递归栈。
