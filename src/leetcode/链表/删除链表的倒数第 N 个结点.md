---
icon: pen-to-square
date: 2025-01-04
category:
- 后端
tag:
- 链表
- leecode
---

# 19. 删除链表的倒数第 N 个结点

## 📝 题目描述
给定一个链表，要求删除链表的倒数第 `n` 个结点，并返回链表的头结点。
- 链表结点定义：每个结点包含一个整数值 `val` 和指向下一结点的指针 `next`。
- 核心目标：在一次遍历（或高效遍历）中定位并删除目标结点。


## 📌 示例
### 示例 1
输入：`head = [1,2,3,4,5], n = 2`
输出：`[1,2,3,5]`
解释：链表倒数第 2 个结点是 4，删除后链表变为 `1→2→3→5`。

### 示例 2
输入：`head = [1], n = 1`
输出：`[]`
解释：链表只有一个结点，删除后为空。

### 示例 3
输入：`head = [1,2], n = 1`
输出：`[1]`
解释：链表倒数第 1 个结点是 2，删除后链表变为 `1`。


## 🚀 最优解：双指针法（快慢指针）
### 🔍 思路解析
核心策略：用**快慢指针**实现一次遍历定位目标结点，避免多次遍历计数：
1. 初始化**虚拟头结点 `pre`**：指向原链表头结点，避免处理“删除头结点”的边界情况；
2. 初始化**快慢指针 `fast`、`slow`**：均指向虚拟头结点 `pre`；
3. 先让 `fast` 指针**先走 `n` 步**：此时 `fast` 与 `slow` 的间距为 `n`；
4. 再让 `fast` 和 `slow` **同时向后移动**，直到 `fast` 指向链表尾结点（`fast.next == null`）；
5. 此时 `slow` 的下一个结点（`slow.next`）就是**倒数第 `n` 个结点**，直接将其跳过（`slow.next = slow.next.next`）。


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
        String line = scanner.hasNextLine() ? scanner.nextLine() : "";
        ListNode head = buildList(line);
        int n = scanner.hasNextInt() ? scanner.nextInt() : 0;

        if (n <= 0) {
            printList(head);
            scanner.close();
            return;
        }

        Solution solution = new Solution();
        ListNode result = solution.removeNthFromEnd(head, n);
        printList(result);
        scanner.close();
    }
}

class Solution {
    public ListNode removeNthFromEnd(ListNode head, int n) {
        // 虚拟头结点，避免删除头结点的边界问题
        ListNode pre = new ListNode(0);
        pre.next = head;
        
        ListNode fast = pre;
        ListNode slow = pre;
        
        // 让fast先移动n步
        while (n-- > 0) {
            fast = fast.next;
        }
        
        // 快慢指针同时移动，直到fast到达链表尾部
        while (fast.next != null) {
            fast = fast.next;
            slow = slow.next;
        }
        
        // 删除slow的下一个结点（倒数第n个结点）
        slow.next = slow.next.next;
        
        // 返回新的头结点（跳过虚拟结点）
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
可以把链表想象成“一条跑道”，快慢指针是两名运动员：
- 先让 `fast` 跑 `n` 米，和 `slow` 拉开 `n` 米的距离；
- 然后两人同时开跑，当 `fast` 跑到终点（链表尾部）时，`slow` 正好停在“倒数第 `n` 个结点”的前一个位置；
- 最后让 `slow` 直接跳过下一个结点，就完成了删除操作。

以示例1（`head=[1,2,3,4,5], n=2`）为例：
1. 虚拟头结点 `pre` 指向 `1`，`fast`、`slow` 都指向 `pre`；
2. `fast` 先走2步，到达结点 `2`；
3. 快慢指针同时移动，直到 `fast` 到达结点 `5`（`fast.next == null`）；
4. 此时 `slow` 位于结点 `3`，其下一个结点是 `4`（倒数第2个结点）；
5. 跳过 `4`，链表变为 `1→2→3→5`。


---

## ⏱ 时间复杂度
- \(O(L)\)（`L` 为链表长度）
  快慢指针最多遍历链表一次，无额外嵌套操作。


---

## 💾 空间复杂度
- \(O(1)\)
  仅使用了常数级别的额外空间（虚拟头结点、快慢指针），与链表长度无关。
